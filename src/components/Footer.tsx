import React from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Instagram, 
  MessageCircle, 
  Shield, 
  Lock, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { SiteSettings } from '../types';
import { createWhatsAppUrl } from '../utils/formatters';

interface FooterProps {
  navigate: (route: string) => void;
  settings: SiteSettings;
  isAdmin: boolean;
  onLogoutAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  navigate,
  settings,
  isAdmin,
  onLogoutAdmin,
}) => {
  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp || '5548998001744',
    'Olá Daniel! Estava no seu site e gostaria de tirar uma dúvida.'
  );

  const handleLink = (route: string) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#0A0A0A] text-[#8A8A8A] border-t border-[#2A2A2A] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#2A2A2A]">
          {/* Column 1: Brand & Profile */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2.5">
              <img
                src={settings.logoUrl || "https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png"}
                alt="Daniel Pacheco Consultoria Imobiliária Logo Oficial"
                className="h-14 sm:h-16 w-auto max-w-[230px] object-contain filter drop-shadow-[0_2px_12px_rgba(201,162,39,0.25)]"
              />
              <p className="text-xs text-[#C9A227] font-semibold tracking-wider">
                {settings.creci || 'CRECI: 38 813'} {settings.cnai ? `• ${settings.cnai}` : '• CNAI: 34 653'}
              </p>
            </div>
            <p className="text-xs leading-relaxed text-[#8A8A8A]">
              Consultoria imobiliária especializada em lançamentos na planta, empreendimentos oficiais e imóveis selecionados no Sul de Santa Catarina.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                id="footer-whatsapp-icon-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#181818] border border-[#2A2A2A] text-[#1F8A4C] flex items-center justify-center hover:bg-[#1F8A4C] hover:text-white transition-all"
                title="WhatsApp Direto"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>
              {settings.instagram && (
                <a
                  id="footer-instagram-icon-btn"
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#181818] border border-[#2A2A2A] text-[#E1306C] flex items-center justify-center hover:bg-[#E1306C] hover:text-white transition-all"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Navigation & Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  id="footer-nav-home"
                  onClick={() => handleLink('home')}
                  className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#5A5A5A]" />
                  <span>Página Inicial</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-portfolio"
                  onClick={() => handleLink('portfolio')}
                  className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#5A5A5A]" />
                  <span>Todos os Imóveis</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-na-planta"
                  onClick={() => handleLink('na-planta')}
                  className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#5A5A5A]" />
                  <span>Apartamentos na Planta</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-prontos"
                  onClick={() => handleLink('prontos')}
                  className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#5A5A5A]" />
                  <span>Imóveis Prontos para Morar</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-sobre"
                  onClick={() => handleLink('sobre')}
                  className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#5A5A5A]" />
                  <span>Sobre o Corretor Daniel Pacheco</span>
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-como-escolher"
                  onClick={() => handleLink('como-escolher')}
                  className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 text-[#5A5A5A]" />
                  <span>Guia: Como Escolher</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Regional Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider">
              Regiões Atendidas
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  id="footer-city-criciuma"
                  onClick={() => handleLink('cidades')}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  Criciúma (Centro, Santa Bárbara, Cruzeiro)
                </button>
              </li>
              <li>
                <button
                  id="footer-city-rincao"
                  onClick={() => handleLink('cidades')}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  Balneário Rincão & Lagoa dos Esteves
                </button>
              </li>
              <li>
                <button
                  id="footer-city-icara"
                  onClick={() => handleLink('cidades')}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  Içara (Loteamentos & Casas)
                </button>
              </li>
              <li>
                <button
                  id="footer-city-novaveneza"
                  onClick={() => handleLink('cidades')}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  Nova Veneza (Caravaggio & Centro)
                </button>
              </li>
              <li>
                <button
                  id="footer-city-others"
                  onClick={() => handleLink('cidades')}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  Cocal do Sul, Forquilhinha e Morro da Fumaça
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Business Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider">
              Atendimento Consultivo
            </h4>
            <div className="space-y-2.5 text-xs text-[#8A8A8A]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0 mt-0.5" />
                <span>{settings.address || 'Criciúma - SC'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <span>{settings.phone || '(48) 99800-1744'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <span>{settings.email || 'daniel.pacheco@creci.org.br'}</span>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#C9A227] shrink-0 mt-0.5" />
                <span>{settings.businessHours || 'Seg a Sex: 8h30 às 19h'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Admin Link & Legal Info */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#8A8A8A]">
          <div className="flex items-center gap-6 flex-wrap justify-center sm:justify-start">
            <span>© {new Date().getFullYear()} Daniel Pacheco Consultoria. Todos os direitos reservados.</span>
            <button
              id="footer-privacy-btn"
              onClick={() => handleLink('privacidade')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Política de Privacidade
            </button>
            <button
              id="footer-sitemap-btn"
              onClick={() => handleLink('mapa-do-site')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Mapa do Site
            </button>
            <button
              id="footer-replay-intro-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('dp_replay_intro'))}
              className="hover:text-[#C9A227] text-[#C9A227]/90 transition-colors cursor-pointer flex items-center gap-1"
              title="Reproduzir a animação cinematográfica de 6 segundos"
            >
              <span>✦ Rever Abertura (6s)</span>
            </button>
          </div>

          {/* Socials & Admin Link in the footer */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-xs">
              <a 
                href={settings.instagram || "https://instagram.com"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#C9A227] cursor-pointer transition-colors"
                title="Instagram"
              >
                IG
              </a>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#C9A227] cursor-pointer transition-colors"
                title="WhatsApp"
              >
                WA
              </a>
              <span className="hover:text-[#C9A227] cursor-pointer transition-colors">LI</span>
            </div>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  id="footer-admin-panel-btn"
                  onClick={() => handleLink('admin')}
                  className="px-2.5 py-1 rounded bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227]/20 flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold"
                >
                  <Shield className="w-3 h-3" />
                  <span>Painel Admin</span>
                </button>
                <button
                  id="footer-admin-logout-btn"
                  onClick={onLogoutAdmin}
                  className="hover:text-[#FFFFFF] text-[10px] underline uppercase tracking-wider"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                id="footer-admin-login-btn"
                onClick={() => handleLink('admin')}
                className="opacity-40 hover:opacity-100 transition-opacity uppercase tracking-widest font-bold border border-white/20 px-3 py-1 text-[9px] text-[#8A8A8A] hover:text-white cursor-pointer"
                title="Acesso restrito para administração do site"
              >
                Área Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
