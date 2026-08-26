import React, { useState } from 'react';
import { MapPin, TrendingUp, Sparkles, CheckCircle2, ArrowRight, Building } from 'lucide-react';
import { Property, SiteSettings } from '../types';
import { CITIES_DATA, CityGuide } from '../data/initialSettings';
import { PropertyCard } from '../components/PropertyCard';

interface CidadesPageProps {
  properties: Property[];
  settings: SiteSettings;
  onSelectProperty: (property: Property) => void;
  onOpenCuratedModal: () => void;
}

export const CidadesPage: React.FC<CidadesPageProps> = ({
  properties,
  settings,
  onSelectProperty,
  onOpenCuratedModal,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('Criciúma');

  const activeCityData = CITIES_DATA.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase()) || CITIES_DATA[0];

  const cityProperties = properties.filter(
    (p) => p.city.toLowerCase() === selectedCity.toLowerCase()
  );

  return (
    <div id="cidades-page" className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818] border border-[#C9A86C]/40 text-xs text-[#C9A86C]">
          <MapPin className="w-3.5 h-3.5 text-[#C9A86C]" />
          <span>Polos Imobiliários do Sul Catarinense</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#F8F5F0]">
          Onde Viver & Investir no Sul de SC
        </h1>
        <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
          Conheça as particularidades, atrativos e potencial de valorização imobiliária de cada cidade atendida pela consultoria de Daniel Pacheco.
        </p>
      </div>

      {/* City Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-start sm:justify-center">
        {CITIES_DATA.map((city) => (
          <button
            key={city.id}
            onClick={() => setSelectedCity(city.name)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCity.toLowerCase() === city.name.toLowerCase()
                ? 'bg-[#C9A86C] text-[#0A0A0A] shadow-md scale-105'
                : 'bg-[#161616] text-[#A0A0A0] hover:text-[#F8F5F0] hover:bg-[#222]'
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Selected City Detail Card */}
      <div className="bg-[#121212] border border-[#262626] rounded-3xl p-8 sm:p-12 overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-[#C9A86C] font-semibold">
                Guia Regional
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Valorização {activeCityData.averageGrowth}</span>
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#F8F5F0]">
              {activeCityData.name}
            </h2>

            <p className="text-sm font-medium text-[#D0D0D0]">
              {activeCityData.tagline}
            </p>

            <p className="text-xs sm:text-sm text-[#999999] leading-relaxed font-light">
              {activeCityData.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {activeCityData.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#E0E0E0]">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A86C] shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={onOpenCuratedModal}
                className="px-5 py-3 rounded-xl bg-[#C9A86C] hover:bg-[#B89748] text-[#0A0A0A] font-bold text-xs transition-colors"
              >
                Solicitar Oportunidades em {activeCityData.name}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] border border-[#333] shadow-xl">
              <img
                src={activeCityData.image}
                alt={activeCityData.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Properties in this City */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#C9A86C] uppercase tracking-wider">
              Acervo Local
            </span>
            <h3 className="text-2xl font-bold font-serif-luxury text-[#F8F5F0]">
              Imóveis Disponíveis em {activeCityData.name}
            </h3>
          </div>
          <span className="text-xs text-[#888]">{cityProperties.length} imóveis encontrados</span>
        </div>

        {cityProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                settings={settings}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#121212] border border-[#222] rounded-2xl p-6 text-xs text-[#888]">
            Nenhum imóvel listado publicamente para {activeCityData.name} no momento. Fale com Daniel para opções off-market.
          </div>
        )}
      </div>
    </div>
  );
};
