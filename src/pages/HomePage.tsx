import React, { useState } from 'react';
import { 
  ArrowRight, 
  MessageCircle, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Compass, 
  Key, 
  TrendingUp, 
  Award,
  ChevronRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Property, SiteSettings, PropertyFilter } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { FilterBar } from '../components/FilterBar';
import { AboutRealtorSection } from '../components/AboutRealtorSection';
import { GoogleExcellenceCertificate } from '../components/GoogleExcellenceCertificate';
import { createWhatsAppUrl } from '../utils/formatters';

interface HomePageProps {
  properties: Property[];
  settings: SiteSettings;
  navigate: (route: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpenCuratedModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  properties,
  settings,
  navigate,
  onSelectProperty,
  onOpenCuratedModal,
}) => {
  const [homeFilters, setHomeFilters] = useState<PropertyFilter>({
    search: '',
    city: 'Todas',
    status: 'Todos',
    type: 'Todos',
    bedrooms: 'Todos',
    onlySignature: false,
  });

  const citiesList = Array.from(new Set(properties.map((p) => p.city))).filter(Boolean);

  // Filter properties
  const filteredProperties = properties.filter((p) => {
    if (homeFilters.search && homeFilters.search.trim() !== '') {
      const q = homeFilters.search.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCity = p.city.toLowerCase().includes(q);
      const matchNeigh = p.neighborhood.toLowerCase().includes(q);
      const matchCode = p.code.toLowerCase().includes(q);
      if (!matchTitle && !matchCity && !matchNeigh && !matchCode) return false;
    }
    if (homeFilters.city && homeFilters.city !== 'Todas') {
      if (p.city.toLowerCase() !== homeFilters.city.toLowerCase()) return false;
    }
    if (homeFilters.status && homeFilters.status !== 'Todos') {
      if (p.status !== homeFilters.status) return false;
    }
    if (homeFilters.type && homeFilters.type !== 'Todos') {
      if (p.type !== homeFilters.type) return false;
    }
    if (homeFilters.bedrooms && homeFilters.bedrooms !== 'Todos') {
      const reqBed = parseInt(homeFilters.bedrooms, 10);
      if ((p.bedrooms || 0) < reqBed) return false;
    }
    if (homeFilters.onlySignature && !p.featured) {
      return false;
    }
    return true;
  });

  const signatureProperties = properties.filter((p) => p.featured).slice(0, 6);

  const whatsappHeroUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel Pacheco! Gostaria de uma consultoria para encontrar o imóvel ideal no Sul de SC.'
  );

  return (
    <div id="home-page" className="min-vh-screen space-y-24 pb-20">
      {/* 1. HERO SECTION (Immersive UI: Bold text left + High-end interior with gradient and dot indicators right) */}
      <section 
        id="hero-section" 
        className="relative pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden border-b border-[#C9A86C]/10"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#C9A86C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline, Subtitle, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left z-10">
            {/* Top Indicator */}
            <div className="flex items-center gap-2.5">
              <img
                src={settings.logoUrl || "https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png"}
                alt="Daniel Pacheco Logo"
                className="h-6 w-auto max-w-[100px] object-contain shrink-0 filter drop-shadow-[0_1px_4px_rgba(201,168,108,0.3)]"
              />
              <span className="h-3 w-[1px] bg-[#C9A86C]/40" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A86C] font-semibold">
                Signature Curatorship • Sul Catarinense
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.08]">
              Encontre o lugar <br />
              <span className="italic text-[#C9A86C]">certo.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-400 max-w-lg leading-relaxed font-light">
              {settings.heroSubtitle ||
                'Empreendimentos oficiais e imóveis prontos, selecionados para diferentes momentos de compra no Sul de Santa Catarina.'}
            </p>

            {/* CTAs Row */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {/* Primary White Button */}
              <button
                id="hero-explore-btn"
                onClick={() => {
                  const el = document.getElementById('featured-contrast-section') || document.getElementById('portfolio-grid-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else navigate('portfolio');
                }}
                className="bg-white text-[#0A0A0A] px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#C9A86C] hover:text-[#0A0A0A] transition-all cursor-pointer shadow-lg flex items-center gap-2"
              >
                <span>Explorar Portfólio</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#0A0A0A]" />
              </button>

              {/* Gold Outline Button */}
              <button
                id="hero-consulting-btn"
                onClick={onOpenCuratedModal}
                className="border border-[#C9A86C] text-[#C9A86C] px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#C9A86C]/10 transition-all cursor-pointer"
              >
                Consultoria VIP
              </button>

              {/* Green WhatsApp Button */}
              <a
                id="hero-whatsapp-btn"
                href={whatsappHeroUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:brightness-110 shadow-lg shadow-[#25D366]/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Quick stats / Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#222222] max-w-lg">
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-serif text-[#F8F5F0] block">50+</span>
                <span className="text-[10px] text-[#888] uppercase tracking-widest font-medium">Imóveis Ativos</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-serif text-[#C9A86C] block">100%</span>
                <span className="text-[10px] text-[#888] uppercase tracking-widest font-medium">Oficiais & Seguros</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-serif text-emerald-400 block">Direto</span>
                <span className="text-[10px] text-[#888] uppercase tracking-widest font-medium">Com Construtora</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-end Interior with Gradient Overlay and Dot Indicators */}
          <div className="lg:col-span-5 relative z-10">
            <div className="relative rounded-2xl overflow-hidden border border-[#2B2B2B] shadow-2xl aspect-[4/3] lg:aspect-auto lg:h-[460px] group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent z-10 pointer-events-none" />
              <img
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1000"
                alt="Luxury Interior Sul Catarinense"
                className="w-full h-full object-cover scale-105 opacity-85 group-hover:scale-110 transition-transform duration-700"
              />

              {/* Floating Badge Top */}
              <div className="absolute top-5 left-5 z-20 bg-[#0D0D0D]/90 backdrop-blur-md border border-[#C9A86C]/40 px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-[#F8F5F0]">Criciúma & Balneário Rincão</span>
              </div>

              {/* Bottom Dot Indicators */}
              <div className="absolute bottom-6 right-6 z-20 flex gap-2 items-center bg-[#0A0A0A]/70 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                <div className="bg-[#C9A86C] w-2 h-2 rounded-full" />
                <div className="bg-white/30 w-2 h-2 rounded-full" />
                <div className="bg-white/30 w-2 h-2 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PORTFÓLIO EM DESTAQUE (High-Contrast Immersive Light Section) */}
      <section id="featured-contrast-section" className="bg-[#F8F5F0] text-[#0A0A0A] py-14 px-4 sm:px-8 lg:px-12 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A0A0A]">
                Portfólio em Destaque
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
                Criciúma, Içara e Balneário Rincão
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-tighter">
              <button
                onClick={() => {
                  setHomeFilters((prev) => ({ ...prev, status: 'Todos', city: 'Todas' }));
                  const el = document.getElementById('portfolio-grid-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-1.5 border border-black bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Todos
              </button>
              <button
                onClick={() => {
                  setHomeFilters((prev) => ({ ...prev, status: 'Pronto' }));
                  const el = document.getElementById('portfolio-grid-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-1.5 border border-black/20 hover:border-black text-[#0A0A0A] transition-colors cursor-pointer"
              >
                Prontos
              </button>
              <button
                onClick={() => {
                  setHomeFilters((prev) => ({ ...prev, status: 'Na planta' }));
                  const el = document.getElementById('portfolio-grid-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-1.5 border border-black/20 hover:border-black text-[#0A0A0A] transition-colors cursor-pointer"
              >
                Na Planta
              </button>
              <button
                onClick={() => navigate('cidades')}
                className="px-4 py-1.5 border border-black/20 hover:border-black text-[#0A0A0A] transition-colors cursor-pointer"
              >
                Cidades
              </button>
            </div>
          </div>

          {/* Quick 4 Columns Showcase from Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.slice(0, 4).map((prop) => (
              <div
                key={prop.id}
                onClick={() => onSelectProperty(prop)}
                className="bg-white shadow-sm hover:shadow-xl border border-black/5 group cursor-pointer overflow-hidden relative transition-all duration-300 flex flex-col justify-between"
              >
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-[#C9A86C] text-[#0A0A0A] text-[9px] font-extrabold px-2.5 py-0.5 uppercase tracking-tighter shadow-sm">
                    {prop.status}
                  </span>
                </div>
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={prop.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400'}
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xs font-bold leading-tight line-clamp-1 text-[#0A0A0A] group-hover:text-[#C9A86C] transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 mb-2 mt-0.5">
                    {prop.city} • {prop.bedrooms || 2} Quartos • {prop.neighborhood}
                  </p>
                  <p className="text-xs font-serif text-[#C9A86C] font-bold">
                    {prop.price ? `A partir de R$ ${prop.price.toLocaleString('pt-BR')}` : 'Consulte Valor'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CURADORIA SIGNATURE SECTION */}
      {signatureProperties.length > 0 && (
        <section id="signature-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A86C] uppercase tracking-wider mb-2">
                <Award className="w-4 h-4 text-[#C9A86C]" />
                <span>Seleção Exclusiva</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#F8F5F0]">
                Curadoria Signature
              </h2>
              <p className="text-xs sm:text-sm text-[#999999] max-w-xl mt-1">
                {settings.signatureSubtitle || 'Imóveis para morar e investir com os mais altos padrões de acabamento, localização e retorno.'}
              </p>
            </div>

            <button
              id="view-all-signature-btn"
              onClick={() => {
                setHomeFilters((prev) => ({ ...prev, onlySignature: true }));
                const el = document.getElementById('portfolio-grid-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-[#C9A86C] hover:text-white flex items-center gap-1.5 transition-colors self-start md:self-auto"
            >
              <span>Ver todas as oportunidades Signature</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Signature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signatureProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                settings={settings}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. PORTFÓLIO COMPLETO COM FILTROS DINÂMICOS */}
      <section id="portfolio-grid-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold text-[#C9A86C] uppercase tracking-widest">
            Portfólio Oficial
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#F8F5F0]">
            Explore Nosso Acervo de Imóveis
          </h2>
          <p className="text-xs sm:text-sm text-[#A0A0A0]">
            Filtre por status, tipo de imóvel, cidade ou características específicas.
          </p>
        </div>

        {/* Filter Bar Component */}
        <div className="mb-8">
          <FilterBar
            filters={homeFilters}
            setFilters={setHomeFilters}
            totalCount={filteredProperties.length}
            cities={citiesList}
          />
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.slice(0, 12).map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                settings={settings}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#121212] border border-[#222] rounded-3xl p-8 space-y-4">
            <Building2 className="w-12 h-12 text-[#555] mx-auto" />
            <h3 className="text-xl font-serif-luxury text-[#E0E0E0]">Nenhum imóvel corresponde aos filtros selecionados</h3>
            <p className="text-xs text-[#888] max-w-md mx-auto">
              Experimente ajustar os filtros de cidade ou tipo, ou solicite nossa curadoria VIP para encontrarmos imóveis fora do portfólio público.
            </p>
            <button
              onClick={() => setHomeFilters({ search: '', city: 'Todas', status: 'Todos', type: 'Todos', bedrooms: 'Todos', onlySignature: false })}
              className="px-4 py-2 bg-[#C9A86C] text-[#0A0A0A] rounded-xl text-xs font-bold"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {filteredProperties.length > 12 && (
          <div className="text-center pt-10">
            <button
              id="home-load-more-btn"
              onClick={() => navigate('portfolio')}
              className="px-8 py-3.5 rounded-xl bg-[#181818] border border-[#333] hover:border-[#C9A86C] text-xs font-bold text-[#F8F5F0] hover:text-[#C9A86C] transition-all"
            >
              Ver Todos os {filteredProperties.length} Imóveis Disponíveis
            </button>
          </div>
        )}
      </section>

      {/* 4. SEÇÃO "O PRÓXIMO PASSO, SEM ATALHOS" (3 Numbered Cards) */}
      <section id="next-step-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left max-w-3xl mb-12 space-y-2">
          <span className="text-xs font-semibold text-[#C9A86C] uppercase tracking-widest">
            Metodologia Consultiva
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#F8F5F0]">
            O próximo passo, sem atalhos.
          </h2>
          <p className="text-xs sm:text-sm text-[#A0A0A0]">
            Um processo claro e seguro para você tomar a melhor decisão patrimonial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 01: Comprar */}
          <div className="bg-[#121212] border border-[#222222] rounded-3xl p-8 space-y-5 hover:border-[#C9A86C]/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="font-serif-luxury text-4xl font-bold text-[#333] group-hover:text-[#C9A86C] transition-colors">
                01
              </span>
              <div className="p-3 rounded-2xl bg-[#1A1A1A] text-[#C9A86C]">
                <Key className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#F8F5F0]">Comprar para Morar</h3>
            <p className="text-xs text-[#999999] leading-relaxed">
              Diagnóstico detalhado da rotina da sua família: proximidade de escolas, vias de tráfego, incidência solar e infraestrutura de lazer nos bairros mais nobres de Criciúma e região.
            </p>
            <ul className="space-y-2 text-xs text-[#B0B0B0] pt-2 border-t border-[#1F1F1F]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A86C]" />
                <span>Avaliação minuciosa de plantas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A86C]" />
                <span>Vagas de garagem e depósitos privativos</span>
              </li>
            </ul>
          </div>

          {/* Card 02: Investir */}
          <div className="bg-[#121212] border border-[#222222] rounded-3xl p-8 space-y-5 hover:border-[#C9A86C]/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="font-serif-luxury text-4xl font-bold text-[#333] group-hover:text-[#C9A86C] transition-colors">
                02
              </span>
              <div className="p-3 rounded-2xl bg-[#1A1A1A] text-[#C9A86C]">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#F8F5F0]">Investir na Planta</h3>
            <p className="text-xs text-[#999999] leading-relaxed">
              Acesso a tabelas de lançamento exclusivas (preço zero de lançamento), parcelamento facilitado direto com a construtora e projeção matemática de valorização patrimonial até a entrega.
            </p>
            <ul className="space-y-2 text-xs text-[#B0B0B0] pt-2 border-t border-[#1F1F1F]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A86C]" />
                <span>Valorização estimada de 20% a 40% na obra</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A86C]" />
                <span>Financiamento direto sem burocracia</span>
              </li>
            </ul>
          </div>

          {/* Card 03: Imóvel Pronto */}
          <div className="bg-[#121212] border border-[#222222] rounded-3xl p-8 space-y-5 hover:border-[#C9A86C]/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="font-serif-luxury text-4xl font-bold text-[#333] group-hover:text-[#C9A86C] transition-colors">
                03
              </span>
              <div className="p-3 rounded-2xl bg-[#1A1A1A] text-[#C9A86C]">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#F8F5F0]">Imóvel Pronto & Seguro</h3>
            <p className="text-xs text-[#999999] leading-relaxed">
              Auditoria documental completa, análise de matrícula, certidões negativas e intermediação transparente para que a mudança ou locação ocorra de forma rápida e 100% legal.
            </p>
            <ul className="space-y-2 text-xs text-[#B0B0B0] pt-2 border-t border-[#1F1F1F]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A86C]" />
                <span>Chave na mão com agilidade</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A86C]" />
                <span>Assessoria jurídica e cartorária inclusa</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. SEÇÃO SOBRE O CORRETOR DANIEL PACHECO */}
      <AboutRealtorSection
        settings={settings}
        onOpenCuratedModal={onOpenCuratedModal}
      />

      {/* CERTIFICADO OFICIAL GOOGLE 5.0 ESTRELAS & LINKS */}
      <GoogleExcellenceCertificate settings={settings} />

      {/* 6. SEÇÃO DE CONTEÚDO "IMÓVEIS VISTOS DE PERTO" */}
      <section id="close-look-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#141414] via-[#111] to-[#0A0A0A] border border-[#262626] rounded-3xl p-8 sm:p-12 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-semibold text-[#C9A86C] uppercase tracking-widest">
                Consultoria Imersiva
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-[#F8F5F0]">
                Imóveis Vistos de Perto
              </h2>
              <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
                Cada empreendimento do nosso portfólio passa por uma vistoria criteriosa antes de ser apresentado. Analisamos o padrão das esquadrias, espessura das lajes para isolamento acústico, solidez da construtora e potencial de valorização do entorno.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-[#C9A86C]/10 text-[#C9A86C] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#F8F5F0]">Visitas Guiadas com Agendamento VIP</h4>
                    <p className="text-xs text-[#888]">Acompanhamento exclusivo nos plantões e apartamentos decorados.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-[#C9A86C]/10 text-[#C9A86C] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#F8F5F0]">Simulação de Fluxo Financeiro Real</h4>
                    <p className="text-xs text-[#888]">Planejamento de desembolso transparente sem surpresas com correções.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onOpenCuratedModal}
                  className="px-6 py-3.5 bg-[#C9A86C] text-[#0A0A0A] font-bold text-xs rounded-xl hover:bg-[#B89748] transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar Atendimento Consultivo</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[4/5] border border-[#2B2B2B]">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                    alt="Visão de perto do living"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-[#181818] border border-[#262626] text-xs">
                  <span className="text-[#C9A86C] font-semibold block">Acabamento Superior</span>
                  <p className="text-[#888] text-[11px] mt-0.5">Porcelanatos de grande formato e rebaixo em gesso.</p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="p-4 rounded-2xl bg-[#181818] border border-[#262626] text-xs">
                  <span className="text-emerald-400 font-semibold block">Varandas com Churrasqueira</span>
                  <p className="text-[#888] text-[11px] mt-0.5">Espaços gourmet com duto a carvão individual.</p>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/5] border border-[#2B2B2B]">
                  <img
                    src="https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=600&q=80"
                    alt="Varanda gourmet vista de perto"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA FINAL COM WHATSAPP */}
      <section id="final-cta-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111111] border border-[#282828] rounded-3xl p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#C9A86C_1px,transparent_1px)] opacity-10 [background-size:20px_20px] pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-semibold text-[#C9A86C] uppercase tracking-widest">
              Pronto para dar o próximo passo?
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-[#F8F5F0] leading-tight">
              Seu próximo imóvel começa com a pergunta certa.
            </h2>
            <p className="text-xs sm:text-base text-[#A8A8A8] font-light">
              Fale diretamente com o Corretor Daniel Pacheco no WhatsApp e receba orientações claras e sem rodeios para sua aquisição no Sul Catarinense.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a
              id="final-cta-whatsapp-btn"
              href={whatsappHeroUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0A0A0A] font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-[#25D366]/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current text-[#0A0A0A]" />
              <span>Chamar Daniel Pacheco no WhatsApp</span>
            </a>

            <button
              onClick={onOpenCuratedModal}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1C1C1C] hover:bg-[#262626] border border-[#3A3A3A] text-xs font-semibold text-[#F8F5F0] hover:text-[#C9A86C] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#C9A86C]" />
              <span>Preencher Curadoria Personalizada</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
