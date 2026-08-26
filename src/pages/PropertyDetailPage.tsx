import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize, 
  Building, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  MessageCircle, 
  Share2, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Phone,
  Clock,
  Compass
} from 'lucide-react';
import { Property, SiteSettings } from '../types';
import { formatCurrency, getStatusBadgeColor, createWhatsAppUrl } from '../utils/formatters';
import { FloorPlanViewer3D } from '../components/FloorPlanViewer3D';
import { FinancingSimulator } from '../components/FinancingSimulator';
import { PropertyCard } from '../components/PropertyCard';

interface PropertyDetailPageProps {
  property: Property;
  allProperties: Property[];
  settings: SiteSettings;
  onBack: () => void;
  onSelectProperty: (property: Property) => void;
  onOpenCuratedModal: () => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  property,
  allProperties,
  settings,
  onBack,
  onSelectProperty,
  onOpenCuratedModal,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const badgeStyle = getStatusBadgeColor(property.status);

  const whatsappMessage = `Olá Daniel Pacheco! Gostaria de agendar uma visita e receber os detalhes completos do imóvel cód. ${property.code} - ${property.title} em ${property.neighborhood}, ${property.city}.`;
  const whatsappUrl = createWhatsAppUrl(settings.whatsapp || '5548998001744', whatsappMessage);

  const relatedProperties = allProperties
    .filter((p) => p.id !== property.id && (p.city === property.city || p.type === property.type))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Confira este imóvel em ${property.city}: ${property.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id={`property-detail-${property.code}`} className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-in fade-in duration-300">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between gap-4">
        <button
          id="detail-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181818] border border-[#2B2B2B] hover:border-[#C9A86C] text-xs font-semibold text-[#E0E0E0] hover:text-[#C9A86C] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Portfólio</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-[#181818] border border-[#2B2B2B] hover:border-[#C9A86C] text-[#C0C0C0] hover:text-[#F8F5F0] transition-colors"
            title="Compartilhar imóvel"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {copied && (
            <span className="text-[11px] text-emerald-400 font-medium">Link copiado!</span>
          )}
        </div>
      </div>

      {/* Main Title & Header Info */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border} flex items-center gap-1.5`}>
            <span className={`w-2 h-2 rounded-full ${badgeStyle.dot} animate-pulse`} />
            <span>{property.status}</span>
          </span>

          <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#181818] border border-[#333] text-[#A0A0A0]">
            Cód. {property.code}
          </span>

          {property.featured && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#C9A86C]/20 border border-[#C9A86C]/40 text-[#C9A86C] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seleção Exclusiva</span>
            </span>
          )}

          {property.developer && (
            <span className="px-3 py-1 rounded-full text-xs bg-[#1A1A1A] border border-[#333] text-[#D0D0D0] flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-[#C9A86C]" />
              <span>Construtora {property.developer}</span>
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-luxury text-[#F8F5F0]">
          {property.title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
          <MapPin className="w-4 h-4 text-[#C9A86C] shrink-0" />
          <span>{property.neighborhood}, {property.city} - {property.state}</span>
        </div>
      </div>

      {/* Gallery Showcase Section */}
      <div className="space-y-3">
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-3xl overflow-hidden bg-[#161616] border border-[#2B2B2B] shadow-2xl group">
          <img
            src={images[activeImageIdx]}
            alt={`${property.title} - Foto ${activeImageIdx + 1}`}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all"
                aria-label="Próxima foto"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Bottom Photo Counter */}
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs text-[#E0E0E0] border border-white/10">
            {activeImageIdx + 1} / {images.length} fotos
          </div>
        </div>

        {/* Thumbnails Row */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-24 sm:w-32 aspect-[16/10] rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  activeImageIdx === idx
                    ? 'border-[#C9A86C] scale-105 shadow-md'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Layout Grid (2 Columns: Specs & Details left + Booking Sticky Card right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Specs, Descriptions, Amenities, 3D Floor Plan */}
        <div className="lg:col-span-8 space-y-10">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#131313] p-5 rounded-2xl border border-[#222]">
            {property.bedrooms !== undefined && (
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#1A1A1A] text-[#C9A86C]">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-[#777] block">Dormitórios</span>
                  <span className="text-sm sm:text-base font-bold text-[#F8F5F0]">{property.bedrooms} Quartos</span>
                </div>
              </div>
            )}

            {property.bathrooms !== undefined && (
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#1A1A1A] text-[#C9A86C]">
                  <Bath className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-[#777] block">Banheiros</span>
                  <span className="text-sm sm:text-base font-bold text-[#F8F5F0]">{property.bathrooms} Banh.</span>
                </div>
              </div>
            )}

            {property.garageSpaces !== undefined && (
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#1A1A1A] text-[#C9A86C]">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-[#777] block">Garagem</span>
                  <span className="text-sm sm:text-base font-bold text-[#F8F5F0]">{property.garageSpaces} Vagas</span>
                </div>
              </div>
            )}

            {property.areaM2 && (
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#1A1A1A] text-[#C9A86C]">
                  <Maximize className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-[#777] block">Área Privativa</span>
                  <span className="text-sm sm:text-base font-bold text-[#F8F5F0]">{property.areaM2} m²</span>
                </div>
              </div>
            )}
          </div>

          {/* Full Description */}
          <div className="bg-[#121212] border border-[#242424] rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold font-serif-luxury text-[#F8F5F0]">
              Sobre o Imóvel
            </h3>
            <p className="text-sm sm:text-base text-[#B8B8B8] leading-relaxed whitespace-pre-line font-light">
              {property.description}
            </p>
          </div>

          {/* Features & Differentials */}
          {property.features && property.features.length > 0 && (
            <div className="bg-[#121212] border border-[#242424] rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-bold font-serif-luxury text-[#F8F5F0]">
                Diferenciais & Acabamentos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-[#181818] border border-[#262626] text-xs text-[#E0E0E0]">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A86C] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3D Floor Plan Perspective Component */}
          <FloorPlanViewer3D property={property} />

          {/* Financing Simulator */}
          {/* <FinancingSimulator property={property} settings={settings} /> */}
        </div>

        {/* Right Column: Sticky Booking & Direct Contact Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-[#131313] border border-[#2B2B2B] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
            {/* Price Box */}
            <div className="space-y-1 pb-5 border-b border-[#222]">
              <span className="text-xs uppercase tracking-wider text-[#888]">Valor de Venda</span>
              <div className="text-2xl sm:text-3xl font-bold text-[#F8F5F0]">
                {formatCurrency(property.price)}
              </div>
              {property.directFinancing && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Financiamento direto com a construtora</span>
                </div>
              )}
            </div>

            {/* Realtor Quick Profile */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#181818] border border-[#282828]">
              <div className="w-11 h-11 rounded-full bg-[#202020] border border-[#C9A86C]/40 text-[#C9A86C] flex items-center justify-center font-serif-luxury font-bold">
                DP
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-[#F8F5F0]">{settings.realtorName}</h4>
                <p className="text-[11px] text-[#C9A86C]">{settings.creci}</p>
                <p className="text-[10px] text-[#777]">Plantão de Vendas Oficial</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <a
                id="detail-whatsapp-main-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0A0A0A] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-current text-[#0A0A0A]" />
                <span>Agendar Visita com Daniel</span>
              </a>

              <button
                onClick={onOpenCuratedModal}
                className="w-full py-3 px-6 rounded-xl bg-[#1D1D1D] hover:bg-[#262626] border border-[#333] hover:border-[#C9A86C] text-xs font-semibold text-[#F8F5F0] hover:text-[#C9A86C] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#C9A86C]" />
                <span>Solicitar Consultoria Semelhante</span>
              </button>
            </div>

            {/* Guarantees */}
            <div className="space-y-2 pt-2 border-t border-[#222] text-[11px] text-[#888]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A86C]" />
                <span>Atendimento consultivo sem custo adicional</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A86C]" />
                <span>Intermediação 100% segura e oficial</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Properties */}
      {relatedProperties.length > 0 && (
        <div className="pt-12 border-t border-[#222] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#C9A86C] uppercase tracking-wider">
                Outras Oportunidades
              </span>
              <h3 className="text-2xl font-bold font-serif-luxury text-[#F8F5F0]">
                Imóveis Semelhantes na Região
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProperties.map((rel) => (
              <PropertyCard
                key={rel.id}
                property={rel}
                settings={settings}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
