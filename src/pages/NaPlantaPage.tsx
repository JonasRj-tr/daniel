import React from 'react';
import { Sparkles, TrendingUp, ShieldCheck, Calculator, ArrowRight, Building2, Calendar } from 'lucide-react';
import { Property, SiteSettings } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { createWhatsAppUrl } from '../utils/formatters';

interface NaPlantaPageProps {
  properties: Property[];
  settings: SiteSettings;
  onSelectProperty: (property: Property) => void;
  onOpenCuratedModal: () => void;
}

export const NaPlantaPage: React.FC<NaPlantaPageProps> = ({
  properties,
  settings,
  onSelectProperty,
  onOpenCuratedModal,
}) => {
  const naPlantaProperties = properties.filter(
    (p) => p.status === 'Na planta' || p.status === 'Em obras' || p.directFinancing
  );

  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel! Gostaria de conhecer os lançamentos na planta com financiamento direto da construtora no Sul de SC.'
  );

  return (
    <div id="na-planta-page" className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-[#181818] via-[#121212] to-[#0A0A0A] border border-[#2B2B2B] rounded-3xl p-8 sm:p-14 overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lançamentos Oficiais & Obras em Andamento</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#F8F5F0]">
            Apartamentos na Planta no Sul de Santa Catarina
          </h1>

          <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed font-light">
            Adquira seu imóvel com preço de lançamento e parcelamento direto com a construtora sem as taxas e burocracia dos bancos tradicionais.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0A0A0A] font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <span>Receber Tabela de Lançamento no WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenCuratedModal}
              className="px-6 py-3.5 rounded-xl bg-[#222] hover:bg-[#2C2C2C] border border-[#3A3A3A] text-xs font-semibold text-[#F8F5F0] hover:text-[#C9A86C] transition-all"
            >
              Simular Entrada e Parcelamento
            </button>
          </div>
        </div>
      </div>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[#121212] border border-[#222] space-y-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#F8F5F0]">Valorização Média de 20% a 40%</h3>
          <p className="text-xs text-[#888] leading-relaxed">
            Comprar no início da obra assegura o menor preço por metro quadrado e garante rentabilidade expressiva na entrega das chaves.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#121212] border border-[#222] space-y-3">
          <div className="p-3 rounded-2xl bg-[#C9A86C]/10 text-[#C9A86C] w-fit">
            <Calculator className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#F8F5F0]">Financiamento Direto Facilitado</h3>
          <p className="text-xs text-[#888] leading-relaxed">
            Pague em até 60x direto com a construtora, ajustando o valor de parcelas mensais, balões anuais e chaves conforme seu fluxo de caixa.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#121212] border border-[#222] space-y-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 w-fit">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#F8F5F0]">Segurança Jurídica & R.I.</h3>
          <p className="text-xs text-[#888] leading-relaxed">
            Trabalhamos exclusivamente com construtoras consolidadas que possuem Registro de Incorporação (R.I.) averbado em cartório e patrimônio de afetação.
          </p>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#C9A86C] uppercase tracking-wider">
              Seleção Atual
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#F8F5F0]">
              Empreendimentos em Destaque
            </h2>
          </div>
          <span className="text-xs text-[#888]">{naPlantaProperties.length} opções disponíveis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {naPlantaProperties.map((prop) => (
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
