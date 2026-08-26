import React from 'react';
import { ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import { SiteSettings } from '../types';

interface PrivacyPolicyPageProps {
  settings: SiteSettings;
  onBack: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ settings, onBack }) => {
  return (
    <div id="privacy-policy-page" className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#C9A86C] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar</span>
      </button>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#C9A86C]/40 text-xs text-[#C9A86C]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>LGPD & Conformidade Legal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#F8F5F0]">
          Política de Privacidade e Proteção de Dados
        </h1>
        <p className="text-xs text-[#888]">Última atualização: Fevereiro de 2026</p>
      </div>

      <div className="bg-[#121212] border border-[#242424] rounded-3xl p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-[#B0B0B0] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#F8F5F0]">1. Compromisso com a Privacidade</h2>
          <p>
            A Consultoria Imobiliária de {settings.realtorName} ({settings.creci}) preza pela confidencialidade e segurança absoluta das informações fornecidas por clientes e investidores. Cumprimos integralmente as diretrizes da Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#F8F5F0]">2. Coleta de Informações</h2>
          <p>
            Coletamos apenas os dados necessários para o atendimento imobiliário consultivo, tais como: nome, telefone/WhatsApp, e-mail e preferências de imóvel (cidade, número de quartos, faixa orçamentária). Esses dados são informados voluntariamente pelo titular através dos formulários de contato ou Consultoria VIP.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#F8F5F0]">3. Finalidade do Tratamento</h2>
          <p>
            Os dados coletados destinam-se exclusivamente a:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[#999]">
            <li>Apresentação de plantas, memoriais descritivos e tabelas de valores;</li>
            <li>Agendamento de visitas a empreendimentos e imóveis decorados;</li>
            <li>Simulações de fluxo de pagamento direto com as construtoras parceiras;</li>
            <li>Comunicação direta via WhatsApp ou e-mail conforme solicitado pelo cliente.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#F8F5F0]">4. Não Compartilhamento com Terceiros</h2>
          <p>
            Sob nenhuma hipótese vendemos, alugamos ou comercializamos listas de contatos com terceiros. As informações só são repassadas às construtoras com a autorização expressa do cliente para formalização de propostas oficiais de compra.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-[#F8F5F0]">5. Direitos do Titular</h2>
          <p>
            Você pode solicitar a qualquer momento a confirmação da existência de tratamento, a alteração, correção ou exclusão definitiva dos seus dados de nossos registros pelo e-mail {settings.email || 'daniel.pacheco@creci.org.br'} ou pelo WhatsApp {settings.phone || '(48) 99800-1744'}.
          </p>
        </section>
      </div>
    </div>
  );
};
