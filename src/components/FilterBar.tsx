import React from 'react';
import { 
  Search, 
  MapPin, 
  Building2, 
  Sparkles, 
  RotateCcw, 
  SlidersHorizontal,
  Home,
  Check
} from 'lucide-react';
import { PropertyFilter, PropertyStatus, PropertyType } from '../types';

interface FilterBarProps {
  filters: PropertyFilter;
  setFilters: React.Dispatch<React.SetStateAction<PropertyFilter>>;
  totalCount: number;
  cities: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  totalCount,
  cities,
}) => {
  const statusOptions: (PropertyStatus | 'Todos')[] = [
    'Todos',
    'Na planta',
    'Pronto',
    'Em obras',
    'Loteamento',
  ];

  const typeOptions: (PropertyType | 'Todos')[] = [
    'Todos',
    'Apartamento',
    'Casa',
    'Lote/Terreno',
  ];

  const handleReset = () => {
    setFilters({
      search: '',
      city: 'Todas',
      status: 'Todos',
      type: 'Todos',
      bedrooms: 'Todos',
      onlySignature: false,
    });
  };

  const hasActiveFilters = 
    (filters.search && filters.search.trim() !== '') ||
    (filters.city && filters.city !== 'Todas') ||
    (filters.status && filters.status !== 'Todos') ||
    (filters.type && filters.type !== 'Todos') ||
    (filters.bedrooms && filters.bedrooms !== 'Todos') ||
    filters.onlySignature;

  return (
    <div id="property-filters-container" className="bg-[#121212] border border-[#242424] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
      {/* Top Search & Primary Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search input */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-[#777] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="filter-search-input"
            type="text"
            placeholder="Buscar por bairro, condomínio ou código..."
            value={filters.search || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full bg-[#181818] border border-[#2D2D2D] focus:border-[#C9A86C] text-sm text-[#F8F5F0] rounded-xl pl-10 pr-4 py-2.5 outline-none placeholder-[#666] transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#888] hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* City Select */}
        <div className="md:col-span-3 relative">
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#C9A86C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="filter-city-select"
              value={filters.city || 'Todas'}
              onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
              aria-label="Filtrar por cidade"
              className="w-full bg-[#181818] border border-[#2D2D2D] focus:border-[#C9A86C] text-sm text-[#F8F5F0] rounded-xl pl-10 pr-8 py-2.5 outline-none appearance-none cursor-pointer"
            >
              <option value="Todas">Todas as Cidades</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#777]">
              ▼
            </div>
          </div>
        </div>

        {/* Property Type Select */}
        <div className="md:col-span-3 relative">
          <div className="relative">
            <Home className="w-4 h-4 text-[#C9A86C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="filter-type-select"
              value={filters.type || 'Todos'}
              onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value as PropertyType | 'Todos' }))}
              aria-label="Filtrar por tipo de imóvel"
              className="w-full bg-[#181818] border border-[#2D2D2D] focus:border-[#C9A86C] text-sm text-[#F8F5F0] rounded-xl pl-10 pr-8 py-2.5 outline-none appearance-none cursor-pointer"
            >
              {typeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'Todos' ? 'Todos os Tipos' : opt}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#777]">
              ▼
            </div>
          </div>
        </div>

        {/* Bedrooms count */}
        <div className="md:col-span-2 relative">
          <select
            id="filter-bedrooms-select"
            value={filters.bedrooms || 'Todos'}
            onChange={(e) => setFilters((prev) => ({ ...prev, bedrooms: e.target.value }))}
            aria-label="Filtrar por número de quartos"
            className="w-full bg-[#181818] border border-[#2D2D2D] focus:border-[#C9A86C] text-sm text-[#F8F5F0] rounded-xl px-3 py-2.5 outline-none appearance-none cursor-pointer"
          >
            <option value="Todos">Quartos: Todos</option>
            <option value="1">1 Quarto ou mais</option>
            <option value="2">2 Quartos ou mais</option>
            <option value="3">3 Quartos ou mais</option>
            <option value="4">4+ Quartos</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#777]">
            ▼
          </div>
        </div>
      </div>

      {/* Secondary Row: Status Pills & Action Counts */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[#1F1F1F]">
        {/* Status quick tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs text-[#777] mr-1 hidden sm:inline">Status:</span>
          {statusOptions.map((status) => {
            const isActive = (filters.status || 'Todos') === status;
            return (
              <button
                key={status}
                id={`filter-status-btn-${status.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setFilters((prev) => ({ ...prev, status }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#C9A86C] text-[#0A0A0A] font-semibold shadow-sm'
                    : 'bg-[#181818] text-[#A0A0A0] hover:text-[#F8F5F0] hover:bg-[#222]'
                }`}
              >
                {status}
              </button>
            );
          })}

          {/* Signature Toggle */}
          <button
            id="filter-signature-toggle"
            onClick={() => setFilters((prev) => ({ ...prev, onlySignature: !prev.onlySignature }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all whitespace-nowrap ${
              filters.onlySignature
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                : 'bg-[#181818] text-[#888] hover:text-amber-300 border border-transparent'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#C9A86C]" />
            <span>Seleção Exclusiva</span>
          </button>
        </div>

        {/* Count and Clear */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-xs">
          <div className="text-[#A0A0A0]">
            <span className="font-semibold text-[#F8F5F0]">{totalCount}</span> {totalCount === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
          </div>

          {hasActiveFilters && (
            <button
              id="filter-clear-all-btn"
              onClick={handleReset}
              className="text-[#C9A86C] hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
