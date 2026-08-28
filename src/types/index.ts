export type PropertyStatus = 'Na planta' | 'Em obras' | 'Pronto' | 'Loteamento';

export type PropertyType = 'Apartamento' | 'Casa' | 'Lote/Terreno' | 'Cobertura' | 'Sala Comercial';

export interface Property {
  id: string;
  code: string;
  title: string;
  headline?: string;
  description: string;
  shortDescription: string;
  city: string;
  neighborhood: string;
  state: string;
  type: PropertyType;
  status: PropertyStatus;
  price?: number; // In BRL, if undefined = "Consulte"
  priceFormatted?: string;
  areaM2?: number;
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  garageSpaces?: number;
  developer?: string; // Construtora
  featured?: boolean; // Seleção Exclusiva
  images: string[];
  features: string[]; // Diferenciais (ex: Sacada com churrasqueira, Piscina, Vista mar)
  floorPlanUrl?: string;
  directFinancing?: boolean; // Financiamento direto com construtora
  deliveryYear?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface SiteSettings {
  realtorName: string;
  creci: string;
  cnai?: string;
  logoUrl?: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  address: string;
  businessHours: string;
  heroHeadline: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  signatureSubtitle: string;
}

export interface PropertyFilter {
  search?: string;
  city?: string;
  status?: PropertyStatus | 'Todos';
  type?: PropertyType | 'Todos';
  bedrooms?: string;
  minPrice?: number;
  maxPrice?: number;
  developer?: string;
  onlySignature?: boolean;
}

export interface CuratedInquiry {
  name: string;
  phone: string;
  cityPreference: string;
  objective: 'Morar' | 'Investir' | 'Segunda Residência';
  propertyType: string;
  budgetRange: string;
  timeframe: 'Imediato' | 'Até 6 meses' | 'Na planta (Longo prazo)';
  notes?: string;
}
