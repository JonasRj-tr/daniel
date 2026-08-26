import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MessageCircle, 
  Menu, 
  X, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { SiteSettings } from '../types';
import { createWhatsAppUrl } from '../utils/formatters';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
  settings: SiteSettings;
  onOpenCuratedModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  navigate,
  settings,
  onOpenCuratedModal,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', route: 'home' },
    { label: 'Imóveis & Lançamentos', route: 'portfolio' },
    { label: 'Na Planta', route: 'na-planta' },
    { label: 'Prontos para Morar', route: 'prontos' },
    { label: 'Cidades', route: 'cidades' },
    { label: 'Sobre o Corretor', route: 'sobre' },
    { label: 'Como Escolher', route: 'como-escolher' },
    { label: 'Contato', route: 'contato' },
  ];

  const handleNavClick = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappMessage = 'Olá Daniel Pacheco! Gostaria de uma assessoria imobiliária personalizada no Sul de Santa Catarina.';
  const whatsappUrl = createWhatsAppUrl(settings.whatsapp || '5548998001744', whatsappMessage);

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'h-16 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#C9A86C]/20 shadow-2xl flex items-center'
            : 'h-20 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/90 to-transparent border-b border-[#C9A86C]/10 flex items-center'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Realtor Identity */}
          <button
            id="header-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left group transition-all cursor-pointer py-1"
            title="Daniel Pacheco Consultoria Imobiliária - Início"
          >
            <img
              src={settings.logoUrl || "https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png"}
              alt="Daniel Pacheco Consultoria Imobiliária Logo Oficial"
              className="h-10 sm:h-12 w-auto max-w-[190px] sm:max-w-[240px] object-contain group-hover:scale-105 transition-all duration-300 filter drop-shadow-[0_2px_12px_rgba(201,168,108,0.35)]"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-[11px] uppercase tracking-widest font-medium">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  id={`nav-link-${link.route}`}
                  onClick={() => handleNavClick(link.route)}
                  className={`pb-1 transition-all cursor-pointer ${
                    isActive
                      ? 'text-[#C9A86C] border-b-2 border-[#C9A86C] font-semibold'
                      : 'text-[#C0C0C0] hover:text-[#C9A86C] border-b-2 border-transparent'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="header-curated-btn"
              onClick={onOpenCuratedModal}
              className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#C9A86C] border border-[#C9A86C]/50 hover:bg-[#C9A86C]/10 hover:border-[#C9A86C] rounded-full flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A86C]" />
              <span>Curadoria VIP</span>
            </button>

            <a
              id="header-whatsapp-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:brightness-110 shadow-lg shadow-[#25D366]/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              id="header-mobile-whatsapp-icon"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#25D366] text-[#0A0A0A] rounded-lg"
              title="Falar no WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>
            
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#181818] border border-[#2A2A2A] text-[#F8F5F0] hover:text-[#C9A86C]"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-drawer"
          className="fixed inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl flex flex-col p-6 lg:hidden animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-6 border-b border-[#222]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#161616] border border-[#C9A86C]/50 flex items-center justify-center text-[#C9A86C]">
                <span className="font-serif-luxury font-bold">DP</span>
              </div>
              <div>
                <span className="text-base font-semibold text-[#F8F5F0]">{settings.realtorName}</span>
                <p className="text-[11px] text-[#A0A0A0]">{settings.creci}</p>
              </div>
            </div>
            <button
              id="close-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-[#1E1E1E] text-[#A0A0A0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  id={`mobile-link-${link.route}`}
                  onClick={() => handleNavClick(link.route)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#C9A86C] text-[#0A0A0A] font-semibold'
                      : 'text-[#E0E0E0] hover:bg-[#181818]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#0A0A0A]' : 'text-[#666]'}`} />
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#222] space-y-3">
            <button
              id="mobile-drawer-curated-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCuratedModal();
              }}
              className="w-full py-3 text-xs font-semibold text-[#C9A86C] bg-[#C9A86C]/10 border border-[#C9A86C]/40 rounded-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#C9A86C]" />
              <span>Solicitar Curadoria VIP Personalizada</span>
            </button>

            <a
              id="mobile-drawer-whatsapp-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 text-xs font-semibold text-[#0A0A0A] bg-[#25D366] rounded-xl flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Conversar com Daniel no WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};
