import React from 'react';
import { Key, Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Property, SiteSettings } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { createWhatsAppUrl } from '../utils/formatters';

interface ImoveisProntosPageProps {
  properties: Property[];
  settings: SiteSettings;
  onSelectProperty: (property: Property) => void;
  onOpenCuratedModal: () => void;
}

export const ImoveisProntosPage: React.FC<ImoveisProntosPageProps> = ({
  properties,
  settings,
  onSelectProperty,
  onOpenCuratedModal,
}) => {
  const readyProperties = properties.filter((p) => p.status === 'Pronto');

  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel Pacheco! Gostaria de agendar visitas para imóveis prontos para morar no Sul de SC.'
  );

  return (
    <div id="imoveis-prontos-page" className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-[#181818] via-[#121212] to-[#0A0A0A] border border-[#2B2B2B] rounded-3xl p-8 sm:p-14 overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-xs text-blue-300 font-semibold">
            <Key className="w-3.5 h-3.5" />
            <span>Chaves na Mão • Mudança Imediata</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#F8F5F0]">
            Imóveis Prontos para Morar no Sul de SC
          </h1>

          <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed font-light">
            Casas residenciais com quintal, apartamentos centrais com 2 ou mais vagas de garagem e opções mobiliadas em Criciúma, Balneário Rincão, Nova Veneza e região.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0A0A0A] font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <span>Agendar Visitas Imediatas com Daniel</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenCuratedModal}
              className="px-6 py-3.5 rounded-xl bg-[#222] hover:bg-[#2C2C2C] border border-[#3A3A3A] text-xs font-semibold text-[#F8F5F0] hover:text-[#C9A86C] transition-all"
            >
              Buscar por Bairro ou Faixa de Preço
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#C9A86C] uppercase tracking-wider">
              Disponibilidade Imediata
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#F8F5F0]">
              Apartamentos e Casas Prontas
            </h2>
          </div>
          <span className="text-xs text-[#888]">{readyProperties.length} imóveis prontos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readyProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              settings={settings}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
