import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('dp_cookies_accepted');
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('dp_cookies_accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div 
      id="cookie-consent-banner"
      className="fixed bottom-6 left-6 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 p-4 rounded-lg shadow-2xl max-w-[280px] text-[#F8F5F0] animate-in slide-in-from-bottom-3 duration-300"
    >
      <p className="text-[10px] mb-2.5 leading-relaxed text-gray-300">
        Utilizamos cookies para melhorar sua experiência em nossa curadoria digital e consultoria imobiliária.
      </p>
      <div className="flex items-center gap-2">
        <button
          id="cookie-accept-btn"
          onClick={handleAccept}
          className="bg-white text-black px-4 py-1 text-[9px] font-bold uppercase tracking-wider hover:bg-[#C9A86C] transition-colors cursor-pointer rounded-sm"
        >
          Aceitar
        </button>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-400 hover:text-white px-2 py-1 text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
