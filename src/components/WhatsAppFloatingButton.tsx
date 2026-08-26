import React, { useState } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { SiteSettings } from '../types';
import { createWhatsAppUrl } from '../utils/formatters';

interface WhatsAppFloatingButtonProps {
  settings: SiteSettings;
  onOpenCuratedModal: () => void;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  settings,
  onOpenCuratedModal,
}) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel Pacheco! Gostaria de conversar sobre as opções de imóveis disponíveis no Sul de Santa Catarina.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Interactive Tooltip Bubble */}
      {showTooltip && (
        <div 
          id="whatsapp-floating-bubble"
          className="hidden sm:flex items-center gap-3 bg-[#161616]/95 border border-[#333333] backdrop-blur-md rounded-2xl p-3.5 shadow-2xl max-w-xs text-xs text-[#F8F5F0] animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-[#C9A86C]/20 border border-[#C9A86C]/40 text-[#C9A86C] flex items-center justify-center shrink-0">
            <span className="font-serif-luxury font-bold text-xs">DP</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[13px] text-[#F8F5F0]">Corretor Online</p>
            <p className="text-[11px] text-[#A0A0A0] leading-tight">
              Tire dúvidas sobre financiamento direto e lançamentos na planta.
            </p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-[#666] hover:text-white p-1"
            aria-label="Fechar dica"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Buttons Group */}
      <div className="flex items-center gap-3">
        {/* Consultoria VIP Quick button */}
        <button
          id="floating-vip-curation-btn"
          onClick={onOpenCuratedModal}
          className="hidden md:flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#181818] border border-[#C9A86C]/40 text-[#C9A86C] hover:bg-[#C9A86C]/10 text-xs font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C9A86C]" />
          <span>Consultoria Personalizada</span>
        </button>

        {/* WhatsApp Icon Button */}
        <a
          id="whatsapp-floating-main-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-[#0A0A0A] flex items-center justify-center shadow-2xl hover:scale-105 transition-all group"
          title="Falar com Daniel Pacheco no WhatsApp"
        >
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-[#0A0A0A] rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-[#0A0A0A] rounded-full" />
          <MessageCircle className="w-7 h-7 fill-current" />
        </a>
      </div>
    </div>
  );
};
