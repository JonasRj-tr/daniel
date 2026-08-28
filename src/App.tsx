import React, { useState, useEffect } from 'react';
import { Property, SiteSettings } from './types';
import { DEFAULT_SETTINGS } from './data/initialSettings';
import { INITIAL_PROPERTIES } from './data/initialProperties';
import { 
  initFirebaseData, 
  subscribeProperties, 
  subscribeSettings, 
  subscribeAdminState,
  getIsAdminCached,
  logoutAdmin
} from './firebase/firebaseService';

// Layout Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CuratedFormModal } from './components/CuratedFormModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { AIAssistantFloating } from './components/AIAssistantFloating';
import { CookieBanner } from './components/CookieBanner';
import { CinematicIntro } from './components/CinematicIntro';
import { AnimatePresence } from 'motion/react';

// Pages
import { HomePage } from './pages/HomePage';
import { PortfolioPage } from './pages/PortfolioPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { NaPlantaPage } from './pages/NaPlantaPage';
import { ImoveisProntosPage } from './pages/ImoveisProntosPage';
import { CidadesPage } from './pages/CidadesPage';
import { ComoEscolherPage } from './pages/ComoEscolherPage';
import { SobrePage } from './pages/SobrePage';
import { ContatoPage } from './pages/ContatoPage';
import { AdminPage } from './pages/AdminPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { SiteMapPage } from './pages/SiteMapPage';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => getIsAdminCached());
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isCuratedModalOpen, setIsCuratedModalOpen] = useState<boolean>(false);

  // Initialize and subscribe to Firestore
  useEffect(() => {
    initFirebaseData();

    const unsubProps = subscribeProperties((data) => {
      if (data && data.length > 0) {
        setProperties(data);
      }
    });

    const unsubSettings = subscribeSettings((data) => {
      if (data) {
        setSettings(data);
      }
    });

    const unsubAdmin = subscribeAdminState((loggedIn) => {
      setIsAdmin(loggedIn);
    });

    const handleCustomAuth = (e: Event) => {
      const customEvent = e as CustomEvent<{ isAdmin: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.isAdmin === 'boolean') {
        setIsAdmin(customEvent.detail.isAdmin);
      } else {
        setIsAdmin(getIsAdminCached());
      }
    };

    const handleReplayIntro = () => {
      setShowIntro(true);
    };

    window.addEventListener('dp_admin_auth_changed', handleCustomAuth);
    window.addEventListener('dp_replay_intro', handleReplayIntro);

    return () => {
      unsubProps();
      unsubSettings();
      unsubAdmin();
      window.removeEventListener('dp_admin_auth_changed', handleCustomAuth);
      window.removeEventListener('dp_replay_intro', handleReplayIntro);
    };
  }, []);

  // Handle URL hash navigation if present
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('imovel-')) {
        const code = hash.replace('imovel-', '');
        const found = properties.find((p) => p.code === code);
        if (found) {
          setSelectedProperty(found);
          setCurrentRoute('property-detail');
        }
      } else if (['home', 'portfolio', 'na-planta', 'prontos', 'cidades', 'como-escolher', 'sobre', 'contato', 'admin', 'privacy', 'sitemap'].includes(hash)) {
        setCurrentRoute(hash);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [properties]);

  // Navigate helper
  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = route;
  };

  // Property detail select helper
  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setCurrentRoute('property-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = `imovel-${property.code}`;
  };

  return (
    <div className="min-h-screen bg-[#F7F3EB] text-[#111111] flex flex-col font-sans selection:bg-[#C9A227]/30 selection:text-[#111111]">
      {/* Header */}
      <Header
        settings={settings}
        currentRoute={currentRoute}
        navigate={navigate}
        onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            properties={properties}
            settings={settings}
            navigate={navigate}
            onSelectProperty={handleSelectProperty}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {currentRoute === 'portfolio' && (
          <PortfolioPage
            properties={properties}
            settings={settings}
            onSelectProperty={handleSelectProperty}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {currentRoute === 'na-planta' && (
          <NaPlantaPage
            properties={properties}
            settings={settings}
            onSelectProperty={handleSelectProperty}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {currentRoute === 'prontos' && (
          <ImoveisProntosPage
            properties={properties}
            settings={settings}
            onSelectProperty={handleSelectProperty}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {currentRoute === 'cidades' && (
          <CidadesPage
            properties={properties}
            settings={settings}
            onSelectProperty={handleSelectProperty}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {currentRoute === 'como-escolher' && (
          <ComoEscolherPage
            settings={settings}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {currentRoute === 'sobre' && (
          <SobrePage
            settings={settings}
            navigate={navigate}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {currentRoute === 'contato' && (
          <ContatoPage settings={settings} />
        )}

        {currentRoute === 'property-detail' && selectedProperty && (
          <PropertyDetailPage
            property={selectedProperty}
            allProperties={properties}
            settings={settings}
            onBack={() => navigate('portfolio')}
            onSelectProperty={handleSelectProperty}
            onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
          />
        )}

        {currentRoute === 'admin' && (
          <AdminPage
            properties={properties}
            settings={settings}
            isAdmin={isAdmin}
            onSelectProperty={handleSelectProperty}
          />
        )}

        {currentRoute === 'privacy' && (
          <PrivacyPolicyPage
            settings={settings}
            onBack={() => navigate('home')}
          />
        )}

        {currentRoute === 'sitemap' && (
          <SiteMapPage
            properties={properties}
            settings={settings}
            navigate={navigate}
            onSelectProperty={handleSelectProperty}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        navigate={navigate}
        isAdmin={isAdmin}
        onLogoutAdmin={logoutAdmin}
        onOpenCuratedModal={() => setIsCuratedModalOpen(true)}
      />

      {/* Curated Lead Form Modal */}
      <CuratedFormModal
        isOpen={isCuratedModalOpen}
        onClose={() => setIsCuratedModalOpen(false)}
        settings={settings}
        properties={properties}
      />

      {/* Floating WhatsApp Contact Button (Right side) */}
      <WhatsAppFloatingButton settings={settings} onOpenCuratedModal={() => setIsCuratedModalOpen(true)} />

      {/* Floating AI Virtual Assistant (Left side, discreet & non-intrusive) */}
      <AIAssistantFloating 
        settings={settings} 
        properties={properties} 
        onOpenCuratedModal={() => setIsCuratedModalOpen(true)} 
      />

      {/* LGPD Cookie Consent Banner */}
      <CookieBanner />

      {/* 6-Second Luxury Cinematic Intro */}
      <AnimatePresence>
        {showIntro && (
          <CinematicIntro
            onComplete={() => setShowIntro(false)}
            realtorName={settings.realtorName}
            creci={settings.creci}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
