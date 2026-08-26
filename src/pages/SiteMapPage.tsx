import React from 'react';
import { Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import { Property, SiteSettings } from '../types';

interface SiteMapPageProps {
  properties: Property[];
  settings: SiteSettings;
  navigate: (route: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const SiteMapPage: React.FC<SiteMapPageProps> = ({
  properties,
  settings,
  navigate,
  onSelectProperty,
}) => {
  const cities = Array.from(new Set(properties.map((p) => p.city))).filter(Boolean);

  return (
    <div id="sitemap-page" className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in duration-200">
      <button
        onClick={() => navigate('home')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#C9A86C] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar ao Início</span>
      </button>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#C9A86C]/40 text-xs text-[#C9A86C]">
          <Compass className="w-3.5 h-3.5" />
          <span>Estrutura & Navegação Completa</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#F8F5F0]">
          Mapa do Site
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#121212] border border-[#242424] rounded-3xl p-6 sm:p-10">
        {/* Main Pages */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#C9A86C] uppercase tracking-wider">
            Páginas Principais
          </h2>
          <ul className="space-y-2.5 text-xs text-[#B0B0B0]">
            <li>
              <button onClick={() => navigate('home')} className="hover:text-white flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-[#C9A86C]" />
                <span>Início (Apresentação & Consultoria)</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('portfolio')} className="hover:text-white flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-[#C9A86C]" />
                <span>Portfólio Completo de Imóveis</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('na-planta')} className="hover:text-white flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-[#C9A86C]" />
                <span>Apartamentos na Planta</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('prontos')} className="hover:text-white flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-[#C9A86C]" />
                <span>Imóveis Prontos para Morar</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('cidades')} className="hover:text-white flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-[#C9A86C]" />
                <span>Cidades Atendidas no Sul de SC</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('como-escolher')} className="hover:text-white flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-[#C9A86C]" />
                <span>Como Escolher & Financiamento</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('sobre')} className="hover:text-white flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-[#C9A86C]" />
                <span>Sobre o Corretor Daniel Pacheco</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigate('contato')} className="hover:text-white flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-[#C9A86C]" />
                <span>Contato Oficial & Plantão</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Cities */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#C9A86C] uppercase tracking-wider">
            Regiões & Polos
          </h2>
          <ul className="space-y-2 text-xs text-[#B0B0B0]">
            {cities.map((city) => (
              <li key={city}>
                <button
                  onClick={() => navigate('cidades')}
                  className="hover:text-white flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 text-[#777]" />
                  <span>{city}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Featured Properties Direct Links */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#C9A86C] uppercase tracking-wider">
            Empreendimentos em Foco
          </h2>
          <ul className="space-y-2 text-xs text-[#B0B0B0]">
            {properties.filter((p) => p.featured).slice(0, 8).map((prop) => (
              <li key={prop.id}>
                <button
                  onClick={() => onSelectProperty(prop)}
                  className="hover:text-[#C9A86C] text-left line-clamp-1"
                >
                  • {prop.title} ({prop.city})
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
