import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Instagram,
  CheckCircle2
} from 'lucide-react';
import { SiteSettings } from '../types';
import { FAQ_LIST } from '../data/initialSettings';
import { createWhatsAppUrl } from '../utils/formatters';

interface ContatoPageProps {
  settings: SiteSettings;
}

export const ContatoPage: React.FC<ContatoPageProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: 'Apartamentos na Planta',
    message: '',
  });

  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `*NOVA MENSAGEM DO SITE DANIEL PACHECO*\n\n` +
      `👤 *Nome:* ${formData.name}\n` +
      `📱 *Telefone/WhatsApp:* ${formData.phone}\n` +
      `✉️ *E-mail:* ${formData.email || 'Não informado'}\n` +
      `🏢 *Interesse:* ${formData.interest}\n` +
      (formData.message ? `💬 *Mensagem:* ${formData.message}\n` : '') +
      `\nOlá Daniel, estou entrando em contato através da página de contato do seu site!`;

    const url = createWhatsAppUrl(settings.whatsapp || '5548998001744', text);
    window.open(url, '_blank');
  };

  const whatsappDirectUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel! Gostaria de conversar com você sobre imóveis no Sul de Santa Catarina.'
  );

  return (
    <div id="contato-page" className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#181818] border border-[#C9A86C]/40 text-xs text-[#C9A86C]">
          <img
            src={settings.logoUrl || "https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png"}
            alt="Logo"
            className="h-4 w-auto max-w-[80px] object-contain shrink-0"
          />
          <span className="h-3 w-[1px] bg-[#C9A86C]/30" />
          <span>Canais Oficiais de Atendimento</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#F8F5F0]">
          Fale com Daniel Pacheco
        </h1>
        <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
          Atendimento personalizado com agilidade, discrição e conhecimento aprofundado do mercado imobiliário regional.
        </p>
      </div>

      {/* Main Grid: Info Cards + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* WhatsApp Direct Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#122B1D] via-[#101F16] to-[#0A0A0A] border border-emerald-500/30 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-[#0A0A0A] flex items-center justify-center font-bold">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-emerald-400">Canal Principal</span>
                <h3 className="text-lg font-bold text-white">WhatsApp Direto</h3>
              </div>
            </div>
            <p className="text-xs text-[#A8A8A8] leading-relaxed">
              Tire dúvidas em tempo real, receba plantas em PDF, vídeos de decorados e agende visitas com rapidez.
            </p>
            <a
              id="contact-page-whatsapp-btn"
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0A0A0A] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Iniciar Conversa no WhatsApp</span>
            </a>
          </div>

          {/* Info Details List */}
          <div className="p-6 rounded-3xl bg-[#121212] border border-[#242424] space-y-4 text-xs">
            <div className="flex items-start gap-3 pb-3 border-b border-[#1F1F1F]">
              <MapPin className="w-4 h-4 text-[#C9A86C] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#777] block">Localização / Escritório</span>
                <span className="text-[#E0E0E0] font-medium">{settings.address || 'Rua Henrique Lage, Centro, Criciúma - SC'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-3 border-b border-[#1F1F1F]">
              <Phone className="w-4 h-4 text-[#C9A86C] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#777] block">Telefone / WhatsApp</span>
                <span className="text-[#E0E0E0] font-medium">{settings.phone || '(48) 99800-1744'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-3 border-b border-[#1F1F1F]">
              <Mail className="w-4 h-4 text-[#C9A86C] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#777] block">E-mail Corporativo</span>
                <span className="text-[#E0E0E0] font-medium">{settings.email || 'daniel.pacheco@creci.org.br'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#C9A86C] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#777] block">Horário de Plantão</span>
                <span className="text-[#E0E0E0] font-medium">{settings.businessHours || 'Seg a Sex: 8h30 às 19h | Sáb: 9h às 16h'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7 bg-[#121212] border border-[#242424] rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-semibold text-[#C9A86C] uppercase tracking-wider">
              Mensagem Direta
            </span>
            <h3 className="text-2xl font-bold font-serif-luxury text-[#F8F5F0]">
              Envie sua Mensagem
            </h3>
            <p className="text-xs text-[#888] mt-1">
              Preencha os campos abaixo para iniciar um atendimento personalizado.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#C0C0C0] mb-1.5 block">Seu Nome *</label>
                <input
                  type="text"
                  required
                  placeholder="Nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2D2D2D] focus:border-[#C9A86C] text-xs text-[#F8F5F0] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#C0C0C0] mb-1.5 block">WhatsApp com DDD *</label>
                <input
                  type="tel"
                  required
                  placeholder="(48) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2D2D2D] focus:border-[#C9A86C] text-xs text-[#F8F5F0] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#C0C0C0] mb-1.5 block">E-mail (Opcional)</label>
                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2D2D2D] focus:border-[#C9A86C] text-xs text-[#F8F5F0] rounded-xl px-3.5 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#C0C0C0] mb-1.5 block">Principal Interesse</label>
                <select
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2D2D2D] focus:border-[#C9A86C] text-xs text-[#F8F5F0] rounded-xl px-3.5 py-3 outline-none appearance-none cursor-pointer"
                >
                  <option value="Apartamentos na Planta">Apartamentos na Planta</option>
                  <option value="Imóveis Prontos para Morar">Imóveis Prontos para Morar</option>
                  <option value="Loteamentos / Terrenos">Loteamentos / Terrenos</option>
                  <option value="Casas em Condomínio">Casas em Condomínio</option>
                  <option value="Avaliação de Imóvel">Avaliação de Imóvel</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#C0C0C0] mb-1.5 block">Como podemos ajudar?</label>
              <textarea
                rows={3}
                placeholder="Descreva detalhes como bairro de preferência, número de quartos ou dúvidas sobre financiamento..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#181818] border border-[#2D2D2D] focus:border-[#C9A86C] text-xs text-[#F8F5F0] rounded-xl p-3 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#C9A86C] hover:bg-[#B89748] text-[#0A0A0A] font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar e Iniciar Conversa</span>
            </button>
          </form>
        </div>
      </div>

      {/* Interactive FAQ Section */}
      <div className="bg-[#121212] border border-[#242424] rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-[#C9A86C] uppercase tracking-wider">
            Perguntas Frequentes
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#F8F5F0]">
            Dúvidas Comuns de Compradores e Investidores
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_LIST.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#181818] border border-[#282828] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#F8F5F0] hover:text-[#C9A86C] transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#C9A86C] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#777] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs text-[#999999] leading-relaxed border-t border-[#222]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
