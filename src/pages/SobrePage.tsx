import React from 'react';
import { SiteSettings } from '../types';
import { AboutRealtorSection } from '../components/AboutRealtorSection';
import { GoogleExcellenceCertificate } from '../components/GoogleExcellenceCertificate';
import { 
  Award, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  MapPin, 
  MessageCircle, 
  Sparkles, 
  Phone, 
  Mail, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { createWhatsAppUrl } from '../utils/formatters';

interface SobrePageProps {
  settings: SiteSettings;
  navigate: (route: string) => void;
  onOpenCuratedModal: () => void;
}

export const SobrePage: React.FC<SobrePageProps> = ({
  settings,
  navigate,
  onOpenCuratedModal,
}) => {
  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel Pacheco! Gostaria de agendar uma consultoria exclusiva com você.'
  );

  return (
    <div id="sobre-page" className="pt-28 pb-20 space-y-16">
      {/* Top Banner Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818] border border-[#C9A86C]/40 text-xs text-[#C9A86C]">
          <Award className="w-3.5 h-3.5 text-[#C9A86C]" />
          <span>Perfil & Compromisso Profissional</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#F8F5F0]">
          Quem é o Corretor Daniel Pacheco
        </h1>
        <p className="text-xs sm:text-sm text-[#A0A0A0] max-w-2xl mx-auto">
          Transparência, solidez de mercado e curadoria de alto padrão em Criciúma, Balneário Rincão, Içara e Sul Catarinense.
        </p>
      </div>

      {/* Main About Component */}
      <AboutRealtorSection
        settings={settings}
        onOpenCuratedModal={onOpenCuratedModal}
      />

      {/* Official Google 5.0 Certificate */}
      <GoogleExcellenceCertificate settings={settings} />

      {/* Extra Value Section: Princípios de Atendimento */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold text-[#C9A86C] uppercase tracking-widest">
            Pilares de Conduta
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#F8F5F0]">
            Como Funciona a Assessoria com Daniel Pacheco
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#121212] border border-[#242424] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A86C]/10 text-[#C9A86C] flex items-center justify-center font-serif font-bold text-lg">
              01
            </div>
            <h3 className="text-base font-bold text-[#F8F5F0]">Escuta Ativa & Perfil Real</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Antes de sugerir qualquer imóvel, compreendemos sua necessidade, composição familiar, projeção financeira e objetivos patrimoniais.
            </p>
          </div>

          <div className="bg-[#121212] border border-[#242424] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A86C]/10 text-[#C9A86C] flex items-center justify-center font-serif font-bold text-lg">
              02
            </div>
            <h3 className="text-base font-bold text-[#F8F5F0]">Auditoria Documental Rígida</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Trabalhamos exclusivamente com empreendimentos e imóveis regulares, com memorial de incorporação registrado e construtoras confiáveis.
            </p>
          </div>

          <div className="bg-[#121212] border border-[#242424] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A86C]/10 text-[#C9A86C] flex items-center justify-center font-serif font-bold text-lg">
              03
            </div>
            <h3 className="text-base font-bold text-[#F8F5F0]">Acompanhamento Pós-Venda</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Apoio completo desde a vistoria inicial e assinatura de contrato até a entrega das chaves e escritura definitiva em cartório.
            </p>
          </div>
        </div>

        {/* Quick Contact & Action Box */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-[#181818] via-[#141414] to-[#181818] border border-[#2C2C2C] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold font-serif text-[#F8F5F0]">
              Quer encontrar o imóvel ideal no Sul Catarinense?
            </h3>
            <p className="text-xs text-gray-400">
              Converse diretamente com Daniel Pacheco e receba uma lista personalizada.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-[#25D366] text-[#0A0A0A] font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-[#20bd5a] transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chamar no WhatsApp</span>
            </a>
            <button
              onClick={() => navigate('portfolio')}
              className="px-6 py-3.5 bg-white text-[#0A0A0A] font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-[#C9A86C] transition-all"
            >
              <span>Ver Imóveis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
