import React from 'react';
import { 
  Bed, 
  Bath, 
  Car, 
  Maximize, 
  MapPin, 
  Building, 
  MessageCircle, 
  ArrowUpRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Property, SiteSettings } from '../types';
import { formatCurrency, getStatusBadgeColor, createWhatsAppUrl } from '../utils/formatters';

interface PropertyCardProps {
  property: Property;
  settings: SiteSettings;
  onSelect: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  settings,
  onSelect,
}) => {
  const badgeStyle = getStatusBadgeColor(property.status);
  
  const whatsappMessage = `Olá Daniel! Gostaria de mais informações sobre o imóvel cód. ${property.code} (${property.title} em ${property.city}).`;
  const whatsappUrl = createWhatsAppUrl(settings.whatsapp || '5548998001744', whatsappMessage);

  const mainImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      id={`property-card-${property.code}`}
      className="group relative bg-[#111111] rounded-2xl border border-[#222222] hover:border-[#C9A86C]/50 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#000000]/80"
    >
      {/* Image & Badges Container */}
      <div 
        className="relative aspect-[16/10] w-full overflow-hidden cursor-pointer bg-[#181818]"
        onClick={() => onSelect(property)}
      >
        <img
          src={mainImage}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2 z-10">
          {/* Status Badge */}
          <div className="bg-[#C9A86C] text-[#0A0A0A] text-[9px] font-extrabold px-2.5 py-0.5 uppercase tracking-tighter shadow-md">
            <span>{property.status}</span>
          </div>

          {/* Signature / Code Tag */}
          <div className="flex items-center gap-1.5">
            {property.featured && (
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#0A0A0A]/90 text-[#C9A86C] border border-[#C9A86C]/40 backdrop-blur-md flex items-center gap-1 shadow-md">
                <Sparkles className="w-2.5 h-2.5 fill-current" />
                <span>Signature</span>
              </span>
            )}
            <span className="px-2 py-0.5 text-[9px] font-mono bg-black/80 text-[#C0C0C0] backdrop-blur-md border border-white/10">
              Cód. {property.code}
            </span>
          </div>
        </div>

        {/* Construtora / Direct Financing Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 pointer-events-none flex-wrap">
          {property.developer && (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1A1A1A]/90 text-[#E0E0E0] border border-[#333] flex items-center gap-1 backdrop-blur-sm">
              <Building className="w-2.5 h-2.5 text-[#C9A86C]" />
              <span>{property.developer}</span>
            </span>
          )}
          {property.directFinancing && (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1F2937]/90 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 backdrop-blur-sm">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
              <span>Direto com Construtora</span>
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#A0A0A0] mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C9A86C] shrink-0" />
            <span className="font-medium text-[#D8D8D8] truncate">{property.neighborhood}</span>
            <span className="text-[#555]">•</span>
            <span className="text-[#A0A0A0]">{property.city}, {property.state}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(property)}
            className="text-base font-semibold text-[#F8F5F0] group-hover:text-[#C9A86C] transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {property.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#808080] mt-1.5 line-clamp-2 leading-relaxed">
            {property.shortDescription || property.description}
          </p>
        </div>

        {/* Specifications Matrix */}
        <div className="grid grid-cols-4 gap-2 py-3 border-y border-[#1E1E1E] text-[#B0B0B0] text-xs">
          {property.bedrooms !== undefined && (
            <div className="flex flex-col items-center justify-center text-center p-1 rounded bg-[#161616]" title={`${property.bedrooms} Dormitórios`}>
              <div className="flex items-center gap-1 text-[#C9A86C]">
                <Bed className="w-3.5 h-3.5" />
                <span className="font-semibold">{property.bedrooms}</span>
              </div>
              <span className="text-[10px] text-[#777] mt-0.5">Quartos</span>
            </div>
          )}

          {property.bathrooms !== undefined && (
            <div className="flex flex-col items-center justify-center text-center p-1 rounded bg-[#161616]" title={`${property.bathrooms} Banheiros`}>
              <div className="flex items-center gap-1 text-[#C9A86C]">
                <Bath className="w-3.5 h-3.5" />
                <span className="font-semibold">{property.bathrooms}</span>
              </div>
              <span className="text-[10px] text-[#777] mt-0.5">Banheiros</span>
            </div>
          )}

          {property.garageSpaces !== undefined && (
            <div className="flex flex-col items-center justify-center text-center p-1 rounded bg-[#161616]" title={`${property.garageSpaces} Vagas de Garagem`}>
              <div className="flex items-center gap-1 text-[#C9A86C]">
                <Car className="w-3.5 h-3.5" />
                <span className="font-semibold">{property.garageSpaces}</span>
              </div>
              <span className="text-[10px] text-[#777] mt-0.5">Vagas</span>
            </div>
          )}

          {property.areaM2 ? (
            <div className="flex flex-col items-center justify-center text-center p-1 rounded bg-[#161616]" title={`Área privativa: ${property.areaM2}m²`}>
              <div className="flex items-center gap-1 text-[#C9A86C]">
                <Maximize className="w-3.5 h-3.5" />
                <span className="font-semibold">{property.areaM2}</span>
              </div>
              <span className="text-[10px] text-[#777] mt-0.5">m² priv.</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-1 rounded bg-[#161616]">
              <span className="text-xs text-[#C9A86C] font-medium">{property.type}</span>
              <span className="text-[10px] text-[#777] mt-0.5">Tipo</span>
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div>
            <span className="text-[10px] text-[#777] uppercase tracking-wider block">Valor</span>
            <span className="text-sm sm:text-base font-bold text-[#F8F5F0]">
              {formatCurrency(property.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id={`card-view-btn-${property.code}`}
              onClick={() => onSelect(property)}
              className="p-2 rounded-lg bg-[#1D1D1D] hover:bg-[#2A2A2A] text-[#E0E0E0] hover:text-[#C9A86C] transition-all"
              title="Ver detalhes completos"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              id={`card-whatsapp-btn-${property.code}`}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-[#0A0A0A] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              title="Perguntar no WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
