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
          className="hidden sm:flex items-center gap-3 bg-[#FFFFFF] border border-[#E5E0D8] rounded-2xl p-3.5 shadow-xl max-w-xs text-xs text-[#111111] animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] flex items-center justify-center shrink-0">
            <span className="font-serif-luxury font-bold text-xs">DP</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[13px] text-[#111111]">Corretor Online</p>
            <p className="text-[11px] text-[#5A5A5A] leading-tight">
              Tire dúvidas sobre financiamento direto e lançamentos na planta.
            </p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-[#5A5A5A] hover:text-[#111111] p-1 cursor-pointer"
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
          className="hidden md:flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#0A0A0A] hover:bg-[#222222] border border-[#C9A227]/50 text-[#C9A227] text-xs font-semibold shadow-lg transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Consultoria Personalizada</span>
        </button>

        {/* WhatsApp Icon Button */}
        <a
          id="whatsapp-floating-main-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-14 h-14 rounded-full bg-[#1F8A4C] hover:bg-[#197A42] text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all group"
          title="Falar com Daniel Pacheco no WhatsApp"
        >
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-[#FFFFFF] rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-[#FFFFFF] rounded-full" />
          <MessageCircle className="w-7 h-7 fill-current" />
        </a>
      </div>
    </div>
  );
};
