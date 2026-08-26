import React, { useState } from 'react';
import { Layers, Eye, Compass, Maximize2, Sparkles, Check } from 'lucide-react';
import { Property } from '../types';

interface FloorPlanViewer3DProps {
  property: Property;
}

export const FloorPlanViewer3D: React.FC<FloorPlanViewer3DProps> = ({ property }) => {
  const [activeZone, setActiveZone] = useState<string>('all');
  const [perspectiveTilt, setPerspectiveTilt] = useState<{ x: number; y: number }>({ x: 12, y: -15 });
  const [isRotating, setIsRotating] = useState(false);

  const zones = [
    { id: 'all', label: 'Planta Completa', desc: 'Layout integrado com circulação fluida e ventilação cruzada' },
    { id: 'living', label: 'Living Integrado & Cozinha', desc: 'Conceito aberto com integração social e sacada gourmet' },
    { id: 'master', label: 'Suíte Principal & Dormitórios', desc: 'Área íntima silenciosa com espaço para closet e banheiro privativo' },
    { id: 'balcony', label: 'Varanda com Churrasqueira', desc: 'Churrasqueira a carvão e vista panorâmica' },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    const y = -((e.clientX - rect.left) / rect.width - 0.5) * 25;
    setPerspectiveTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setPerspectiveTilt({ x: 12, y: -15 });
  };

  return (
    <div id="floor-plan-3d-viewer" className="bg-[#121212] border border-[#262626] rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A86C] uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-[#C9A86C]" />
            <span>Perspectiva e Planta Arquitetônica</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#F8F5F0]">
            Visualização Espacial da Planta
          </h3>
        </div>

        {/* Zone Selector Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setActiveZone(zone.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeZone === zone.id
                  ? 'bg-[#C9A86C] text-[#0A0A0A] font-bold shadow-md'
                  : 'bg-[#1C1C1C] text-[#999] hover:text-[#F8F5F0] hover:bg-[#252525]'
              }`}
            >
              {zone.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Isometric View Stage */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-80 sm:h-96 w-full rounded-2xl bg-gradient-to-br from-[#161616] via-[#101010] to-[#0A0A0A] border border-[#2B2B2B] overflow-hidden flex items-center justify-center cursor-grab perspective-1000 group select-none"
      >
        {/* Isometric Grid Floor */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#C9A86C_1px,transparent_1px)] [background-size:24px_24px]"
        />

        {/* 3D Room Mockup Model Container */}
        <div
          style={{
            transform: `rotateX(${perspectiveTilt.x}deg) rotateY(${perspectiveTilt.y}deg) rotateZ(0deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.15s ease-out',
          }}
          className="relative w-64 sm:w-80 h-44 sm:h-56 bg-[#1A1A1A]/90 border-2 border-[#C9A86C]/50 rounded-xl shadow-2xl flex flex-col justify-between p-4 backface-hidden backdrop-blur-sm"
        >
          {/* Room Header with specs */}
          <div className="flex items-center justify-between border-b border-[#333] pb-2 text-[11px]">
            <span className="font-mono text-[#C9A86C] font-semibold uppercase tracking-wider">
              {property.type} • {property.neighborhood}
            </span>
            <span className="text-[#888] font-mono">{property.areaM2 ? `${property.areaM2} m²` : 'Sob Consulta'}</span>
          </div>

          {/* Isometric Sub-Zones Blocks */}
          <div className="grid grid-cols-2 gap-2 my-2 flex-1">
            {/* Living Zone */}
            <div className={`p-2 rounded-lg border transition-all ${
              activeZone === 'all' || activeZone === 'living'
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                : 'bg-black/40 border-white/5 opacity-40 text-gray-500'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Living + Cozinha
              </div>
              <p className="text-[9px] text-[#A0A0A0] mt-0.5">Estar, jantar integrados</p>
            </div>

            {/* Balcony Zone */}
            <div className={`p-2 rounded-lg border transition-all ${
              activeZone === 'all' || activeZone === 'balcony'
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200'
                : 'bg-black/40 border-white/5 opacity-40 text-gray-500'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Varanda Gourmet
              </div>
              <p className="text-[9px] text-[#A0A0A0] mt-0.5">Churrasqueira a carvão</p>
            </div>

            {/* Master Suite */}
            <div className={`p-2 rounded-lg border transition-all ${
              activeZone === 'all' || activeZone === 'master'
                ? 'bg-blue-500/15 border-blue-500/50 text-blue-200'
                : 'bg-black/40 border-white/5 opacity-40 text-gray-500'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Suíte Principal
              </div>
              <p className="text-[9px] text-[#A0A0A0] mt-0.5">Espaço closet e banho</p>
            </div>

            {/* Secondary Rooms */}
            <div className={`p-2 rounded-lg border transition-all ${
              activeZone === 'all' || activeZone === 'master'
                ? 'bg-purple-500/15 border-purple-500/50 text-purple-200'
                : 'bg-black/40 border-white/5 opacity-40 text-gray-500'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Dormitórios / Home
              </div>
              <p className="text-[9px] text-[#A0A0A0] mt-0.5">Conforto acústico</p>
            </div>
          </div>

          {/* Footer of 3D Card */}
          <div className="flex items-center justify-between text-[10px] text-[#777] border-t border-[#333] pt-1.5">
            <span>Interativo 3D: Mova o cursor</span>
            <span className="text-[#C9A86C]">Daniel Pacheco Curadoria</span>
          </div>
        </div>

        {/* Floating Controls Overlay */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-[#AAA] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C9A86C] animate-pulse" />
          <span>Arraste o cursor sobre o quadro para girar a perspectiva 3D</span>
        </div>
      </div>

      {/* Zone Description Card */}
      <div className="p-4 rounded-2xl bg-[#181818] border border-[#262626] flex items-start gap-3">
        <div className="p-2 rounded-xl bg-[#C9A86C]/10 text-[#C9A86C] shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#F8F5F0] uppercase tracking-wider">
            {zones.find((z) => z.id === activeZone)?.label}
          </h4>
          <p className="text-xs text-[#A0A0A0] mt-1 leading-relaxed">
            {zones.find((z) => z.id === activeZone)?.desc}. Projetado com excelente aproveitamento de área privativa e isolamento acústico refinado.
          </p>
        </div>
      </div>
    </div>
  );
};
