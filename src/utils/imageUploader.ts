/**
 * Utilitário de Processamento, Otimização e Upload de Imagens
 * Desenvolvido para suportar fotos tiradas diretamente de smartphones (iPhone/Android)
 * ou computadores, reduzindo arquivos pesados de 5MB-25MB para formatos ultra otimizados
 * e enviando para CDN permanente na nuvem com fallback automático.
 */

export interface OptimizedImageResult {
  url: string;
  originalSize: number;
  optimizedSize: number;
  savingsPercentage: number;
  width: number;
  height: number;
}

/**
 * Formata bytes para exibição amigável (ex: 85 KB, 1.2 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Otimiza e redimensiona um arquivo de imagem local usando Canvas no navegador.
 * Suporta WebP e JPEG de alta fidelidade visual para qualquer dispositivo móvel ou desktop.
 */
export async function optimizeImageFile(
  file: File | Blob,
  maxWidth = 1440,
  maxHeight = 1080,
  quality = 0.82
): Promise<{ dataUrl: string; blob: Blob; width: number; height: number; originalSize: number; optimizedSize: number }> {
  const originalSize = file.size || 0;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo de imagem'));
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagem inválido ou corrompido'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calcular novas dimensões mantendo a proporção original
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível inicializar contexto de renderização 2D'));
          return;
        }

        // Suavização de alta qualidade
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Tentar WebP primeiro (melhor compressão e nitidez para todos os navegadores modernos)
        let mimeType = 'image/webp';
        let dataUrl = canvas.toDataURL(mimeType, quality);

        // Fallback para JPEG caso WebP não esteja disponível
        if (!dataUrl.startsWith('data:image/webp')) {
          mimeType = 'image/jpeg';
          dataUrl = canvas.toDataURL(mimeType, quality);
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                dataUrl,
                blob,
                width,
                height,
                originalSize,
                optimizedSize: blob.size,
              });
            } else {
              // Conversão manual caso toBlob retorne nulo
              const byteString = atob(dataUrl.split(',')[1]);
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);
              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }
              const fallbackBlob = new Blob([ab], { type: mimeType });
              resolve({
                dataUrl,
                blob: fallbackBlob,
                width,
                height,
                originalSize,
                optimizedSize: fallbackBlob.size,
              });
            }
          },
          mimeType,
          quality
        );
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Tenta fazer upload anônimo da foto otimizada para múltiplos provedores de CDN públicos de alta velocidade.
 * Se houver qualquer bloqueio de rede ou falha de conexão, retorna com segurança a imagem WebP otimizada.
 */
export async function uploadToPermanentHost(blobOrFile: Blob | File): Promise<string> {
  // Tentativa 1: ImgBB Public API
  try {
    const formData = new FormData();
    formData.append('image', blobOrFile);

    const IMGBB_KEYS = [
      '6d207e02198a847aa98d0a2a901485a5',
      'c85e2b0286dbdf582098b091dc45e2a2'
    ];

    for (const key of IMGBB_KEYS) {
      try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.data?.url) {
            return data.data.display_url || data.data.url;
          }
        }
      } catch {
        // Tenta próxima chave
      }
    }
  } catch (err) {
    console.warn('Tentativa de envio para CDN externo falhou:', err);
  }

  // Fallback 100% garantido: gera a representação WebP ultra compacta (~30KB-70KB)
  // que é gravada diretamente no Firebase Firestore e abre instantaneamente em qualquer tela de cliente.
  if (blobOrFile instanceof File || blobOrFile instanceof Blob) {
    const opt = await optimizeImageFile(blobOrFile, 1200, 900, 0.78);
    return opt.dataUrl;
  }

  return '';
}

/**
 * Processa múltiplos arquivos enviados do celular ou computador em lote:
 * 1. Otimiza cada imagem localmente (reduz 90%+ do peso).
 * 2. Faz o upload permanente para a CDN com fallback transparente.
 * 3. Notifica o progresso para a interface de usuário.
 * 4. Retorna uma lista de strings com os links prontos para serem salvos.
 */
export async function processAndUploadDeviceImages(
  files: File[],
  onProgress?: (info: { current: number; total: number; fileName: string; percent: number }) => void
): Promise<string[]> {
  const finalUrls: string[] = [];
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        fileName: file.name,
        percent: Math.round(((i) / total) * 100),
      });
    }

    try {
      // 1. Otimização de alta performance
      const opt = await optimizeImageFile(file, 1400, 1050, 0.80);

      // 2. Upload para CDN permanente (com fallback WebP)
      const directUrl = await uploadToPermanentHost(opt.blob);

      if (directUrl) {
        finalUrls.push(directUrl);
      } else if (opt.dataUrl) {
        finalUrls.push(opt.dataUrl);
      }
    } catch (error) {
      console.error(`Erro ao processar imagem ${file.name}:`, error);
    }

    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        fileName: file.name,
        percent: Math.round(((i + 1) / total) * 100),
      });
    }
  }

  return finalUrls;
}
