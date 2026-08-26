import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  MessageCircle, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  Users, 
  Star, 
  Compass, 
  Key, 
  ArrowRight 
} from 'lucide-react';
import { SiteSettings } from '../types';
import { createWhatsAppUrl } from '../utils/formatters';

interface AboutRealtorSectionProps {
  settings: SiteSettings;
  onOpenCuratedModal?: () => void;
}

export const REALTOR_PHOTO_URL = 'https://www.corretordanielpacheco.com.br/web/image/2098138-f50ee8ba/DANIEL-PACHECO-CORRETOR%20%282%29.webp';

export const AboutRealtorSection: React.FC<AboutRealtorSectionProps> = ({
  settings,
  onOpenCuratedModal,
}) => {
  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel Pacheco! Li sua trajetória e gostaria de conversar sobre imóveis no Sul de Santa Catarina.'
  );

  return (
    <section id="sobre" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#C9A86C]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 bg-gradient-to-br from-[#121212] via-[#0E0E0E] to-[#080808] border border-[#262626] rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl overflow-hidden">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#C9A86C_1px,transparent_1px)] opacity-[0.04] [background-size:24px_24px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Column 1: Realtor High-Quality Portrait with Signature Frame */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-full max-w-sm sm:max-w-md">
              {/* Outer Golden Glow Border */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-[#C9A86C] via-amber-200 to-[#8C6D32] opacity-75 blur-md group-hover:opacity-100 transition-all duration-700" />

              <div className="relative rounded-2xl overflow-hidden bg-[#0A0A0A] border border-[#C9A86C]/30 shadow-2xl aspect-[3/4] flex items-center justify-center">
                <img
                  src={REALTOR_PHOTO_URL}
                  alt="Corretor de Imóveis Daniel Pacheco"
                  className="w-full h-full object-cover object-top scale-100 group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    // Fallback if network issue
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800';
                  }}
                />

                {/* Bottom Shadow Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80 pointer-events-none" />

                {/* Floating Authority Badge on Photo */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#0F0F0F]/90 backdrop-blur-md border border-[#C9A86C]/40 p-3.5 rounded-xl shadow-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold font-serif text-[#F8F5F0]">Daniel Pacheco</h4>
                    <p className="text-[11px] text-[#C9A86C] font-semibold">
                      {settings.creci || 'CRECI: 38 813'} • {settings.cnai || 'CNAI: 34 653'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#C9A86C]/10 border border-[#C9A86C]/30 px-2.5 py-1 rounded-full text-[10px] font-bold text-[#C9A86C]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Oficial</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar Under Photo */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm sm:max-w-md mt-4">
              <div className="p-3 rounded-2xl bg-[#161616] border border-[#262626] text-center">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#C9A86C] block">8+ Anos</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">No Mercado</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#161616] border border-[#262626] text-center">
                <span className="text-xl sm:text-2xl font-bold font-serif text-[#F8F5F0] block">300+</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Negócios Realizados</span>
              </div>
            </div>
          </div>

          {/* Column 2: Biography Text & Personal Commitment */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1A1A] border border-[#C9A86C]/40 text-xs text-[#C9A86C]">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A86C]" />
              <span className="font-semibold uppercase tracking-wider">Trajetória & Autoridade</span>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-luxury text-[#F8F5F0] leading-tight">
                Sobre o Corretor <br />
                <span className="italic text-[#C9A86C]">Daniel Pacheco</span>
              </h2>
              <div className="h-[2px] w-20 bg-gradient-to-r from-[#C9A86C] to-transparent mt-3" />
            </div>

            {/* Authentic Bio Text Provided by User */}
            <div className="space-y-4 text-sm sm:text-base text-gray-300 font-light leading-relaxed">
              <p className="bg-[#161616]/60 border-l-2 border-[#C9A86C] pl-4 py-2 rounded-r-xl">
                Eu me chamo <strong className="text-white font-medium">Daniel Pacheco</strong>, sou corretor de imóveis há aproximadamente <span className="text-[#C9A86C] font-semibold">oito anos</span>, acompanhando de perto a realização de muitos sonhos. Iniciei minha trajetória como colaborador de uma construtora, onde conheci o mercado imobiliário e, desde então, me apaixonei por esse segmento.
              </p>

              <p>
                Atualmente, minha principal preocupação é atender cada cliente com <strong className="text-white font-medium">ética, profissionalismo e comprometimento</strong>. Já realizei <span className="text-[#C9A86C] font-semibold">mais de 300 negócios</span> e mantenho uma excelente média de avaliações no Google, resultado do cuidado em cada atendimento.
              </p>

              <p className="text-gray-200">
                Estou apto a auxiliar e realizar o sonho dos meus clientes com dedicação e responsabilidade.
              </p>
            </div>

            {/* Pillars / Distinctions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#141414] border border-[#242424]">
                <div className="p-2 rounded-lg bg-[#C9A86C]/10 text-[#C9A86C] shrink-0 mt-0.5">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F8F5F0]">Excelência no Google</h4>
                  <p className="text-[11px] text-gray-400 leading-tight mt-0.5">Alta taxa de satisfação e depoimentos positivos de compradores.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#141414] border border-[#242424]">
                <div className="p-2 rounded-lg bg-[#C9A86C]/10 text-[#C9A86C] shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F8F5F0]">Origem em Construtora</h4>
                  <p className="text-[11px] text-gray-400 leading-tight mt-0.5">Domínio técnico de obras, plantas, acabamentos e negociação direta.</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-4">
              <a
                id="about-realtor-whatsapp-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current text-[#0A0A0A]" />
                <span>Conversar com Daniel Pacheco</span>
              </a>

              {onOpenCuratedModal && (
                <button
                  id="about-realtor-curated-btn"
                  onClick={onOpenCuratedModal}
                  className="px-6 py-3.5 rounded-xl bg-[#1C1C1C] hover:bg-[#262626] border border-[#3A3A3A] text-xs font-semibold text-[#F8F5F0] hover:text-[#C9A86C] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#C9A86C]" />
                  <span>Solicitar Consultoria VIP</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
