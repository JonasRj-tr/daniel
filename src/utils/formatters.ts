export function formatCurrency(value?: number): string {
  return 'A Consultar';
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('pt-BR').format(val);
}

export function createWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export function getStatusBadgeColor(status: string): { bg: string; text: string; border: string; dot: string } {
  switch (status) {
    case 'Na planta':
      return {
        bg: 'bg-emerald-950/80',
        text: 'text-emerald-300',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-400',
      };
    case 'Em obras':
      return {
        bg: 'bg-amber-950/80',
        text: 'text-amber-300',
        border: 'border-amber-500/30',
        dot: 'bg-amber-400',
      };
    case 'Pronto':
      return {
        bg: 'bg-blue-950/80',
        text: 'text-blue-300',
        border: 'border-blue-500/30',
        dot: 'bg-blue-400',
      };
    case 'Loteamento':
      return {
        bg: 'bg-purple-950/80',
        text: 'text-purple-300',
        border: 'border-purple-500/30',
        dot: 'bg-purple-400',
      };
    default:
      return {
        bg: 'bg-neutral-800',
        text: 'text-neutral-300',
        border: 'border-neutral-700',
        dot: 'bg-neutral-400',
      };
  }
}
