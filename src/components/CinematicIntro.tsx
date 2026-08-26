import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Volume2, VolumeX, ArrowRight, Compass, Building2, ShieldCheck, Key } from 'lucide-react';

export const OFFICIAL_LOGO_URL = 'https://i.postimg.cc/wv36Qv93/Chat-GPT-Image-26-de-ago-de-2026-09-58-21-(1).png';

interface CinematicIntroProps {
  onComplete: () => void;
  realtorName?: string;
  creci?: string;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onComplete,
  realtorName = 'Daniel Pacheco',
  creci = 'CRECI: 38 813 • CNAI: 34 653',
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(6);
  const [progress, setProgress] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activePhase, setActivePhase] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play luxury harmonic sound using Web Audio API
  const playHarmonicChime = (freq = 440, type: OscillatorType = 'sine', duration = 1.2) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      // Soft pitch bend upward for luxury shimmer
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not supported or blocked, graceful fallback
    }
  };

  // 6-Second Timer Loop
  useEffect(() => {
    const totalDurationMs = 6000;
    const intervalMs = 30;
    const startTime = Date.now();

    // Trigger initial chime
    playHarmonicChime(329.63, 'sine', 1.5); // E4 note

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsed / totalDurationMs) * 100);
      const remainingSecs = Math.max(0, Math.ceil((totalDurationMs - elapsed) / 1000));

      setProgress(currentProgress);
      setSecondsLeft(remainingSecs);

      // Phase transitions with sound cues
      if (elapsed >= 1500 && elapsed < 1600) {
        setActivePhase(2);
        playHarmonicChime(493.88, 'triangle', 1.8); // B4 note
      } else if (elapsed >= 3400 && elapsed < 3500) {
        setActivePhase(3);
        playHarmonicChime(659.25, 'sine', 2.0); // E5 note
      } else if (elapsed >= 5200 && elapsed < 5300) {
        setActivePhase(4);
        playHarmonicChime(987.77, 'sine', 1.2); // B5 high shimmer
      }

      if (elapsed >= totalDurationMs) {
        clearInterval(timer);
        onComplete();
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [onComplete, soundEnabled]);

  // Gold luxury star/particle background on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle definition
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      pulse: number;
      color: string;
    }

    const particles: Particle[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.8 - 0.2, // Drift upward
      opacity: Math.random() * 0.8 + 0.2,
      pulse: Math.random() * 0.05 + 0.01,
      color: Math.random() > 0.3 ? '#C9A86C' : '#FFFFFF',
    }));

    // Floating rays
    let rayAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial dark gold ambient glow in center
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        20,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.65
      );
      gradient.addColorStop(0, 'rgba(201, 168, 108, 0.12)');
      gradient.addColorStop(0.4, 'rgba(15, 15, 15, 0.95)');
      gradient.addColorStop(1, '#050505');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Rotating subtle golden light sweep rays
      rayAngle += 0.003;
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(rayAngle);
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const a1 = (i * Math.PI) / 3;
        const a2 = a1 + 0.25;
        const r = Math.max(width, height);
        ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
        ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
        ctx.closePath();
        ctx.fillStyle = 'rgba(201, 168, 108, 0.018)';
        ctx.fill();
      }
      ctx.restore();

      // Render gold sparkles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += Math.sin(Date.now() * p.pulse) * 0.02;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color === '#C9A86C' 
          ? `rgba(201, 168, 108, ${Math.max(0.1, Math.min(1, p.opacity))})` 
          : `rgba(255, 255, 255, ${Math.max(0.1, Math.min(0.9, p.opacity))})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#C9A86C';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <motion.div
      id="cinematic-intro-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-[#050505] text-[#F8F5F0] overflow-hidden select-none"
    >
      {/* Background Interactive Star & Ray Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Rotating Background Gold Concentric Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="w-[500px] h-[500px] sm:w-[680px] sm:h-[680px] rounded-full border border-dashed border-[#C9A86C]/40 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] rounded-full border border-[#C9A86C]/30 flex items-center justify-center"
          >
            <div className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] rounded-full border border-dotted border-[#C9A86C]/50" />
          </motion.div>
        </motion.div>
      </div>

      {/* Top Bar Controls */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between relative z-20">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C9A86C] font-semibold">
          <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Consultoria Imobiliária</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            id="intro-sound-toggle"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
            title={soundEnabled ? 'Silenciar Áudio' : 'Ativar Efeitos Sonoros'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#C9A86C]" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>

          {/* Skip Intro Button */}
          <button
            id="intro-skip-btn"
            onClick={onComplete}
            className="px-4 py-2 rounded-full bg-[#C9A86C]/10 hover:bg-[#C9A86C] text-[#C9A86C] hover:text-[#0A0A0A] border border-[#C9A86C]/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
          >
            <span>Pular Entrada</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Center Stage: The 6-Second Multi-Effect Reveal */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center my-auto max-w-4xl w-full px-4">
        {/* Cinematic Multi-Layer Gold Core Glow */}
        <div className="absolute w-[340px] h-[340px] sm:w-[540px] sm:h-[540px] bg-gradient-to-r from-[#C9A86C]/30 via-amber-400/20 to-[#C9A86C]/30 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute w-[220px] h-[220px] sm:w-[380px] sm:h-[380px] bg-[#E6CA85]/15 rounded-full blur-[60px] pointer-events-none" />

        {/* 1. Official Logo Container - Large, Complete & Uncropped with Metallic Shimmer */}
        <motion.div
          initial={{ scale: 0.82, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative group w-full flex flex-col items-center justify-center my-2"
        >
          {/* Subtle Ambient Golden Accent Frame & Corner Accents */}
          <div className="relative w-full max-w-xl sm:max-w-2xl lg:max-w-3xl flex items-center justify-center p-4 sm:p-8">
            <img
              src={OFFICIAL_LOGO_URL}
              alt="Daniel Pacheco Consultoria Imobiliária - Logo Oficial Completa"
              className="w-full h-auto max-h-[260px] sm:max-h-[340px] lg:max-h-[380px] object-contain filter drop-shadow-[0_0_30px_rgba(201,168,108,0.5)] transition-transform duration-700 hover:scale-[1.02]"
            />

            {/* Metallic Light Sweep Animation Across the Full Logo */}
            <motion.div
              animate={{ x: ['-200%', '250%'] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-25 pointer-events-none"
            />
          </div>
        </motion.div>

        {/* 2. Sub-Tagline & Regional Authority */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="space-y-2.5 mt-2"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-[#C9A86C]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.4em] text-[#C9A86C] font-semibold">
              Alto Padrão & Lançamentos Exclusivos
            </span>
            <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-[#C9A86C]" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-gray-300 tracking-wider">
            <span>Criciúma</span>
            <span className="text-[#C9A86C]">•</span>
            <span>Balneário Rincão</span>
            <span className="text-[#C9A86C]">•</span>
            <span>Içara</span>
            <span className="text-[#C9A86C]">•</span>
            <span>Sul Catarinense</span>
          </div>
        </motion.div>

        {/* 3. Real-Time Phase Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs"
        >
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all duration-500 ${
            activePhase >= 1 ? 'border-[#C9A86C]/60 text-[#C9A86C] bg-[#C9A86C]/10 shadow-[0_0_15px_rgba(201,168,108,0.2)]' : 'border-white/10 text-gray-500 bg-white/5'
          }`}>
            <Building2 className="w-3.5 h-3.5" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Empreendimentos Oficiais</span>
          </div>

          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all duration-500 ${
            activePhase >= 2 ? 'border-[#C9A86C]/60 text-[#C9A86C] bg-[#C9A86C]/10 shadow-[0_0_15px_rgba(201,168,108,0.2)]' : 'border-white/10 text-gray-500 bg-white/5'
          }`}>
            <Key className="w-3.5 h-3.5" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Financiamento Direto</span>
          </div>

          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all duration-500 ${
            activePhase >= 3 ? 'border-[#C9A86C]/60 text-[#C9A86C] bg-[#C9A86C]/10 shadow-[0_0_15px_rgba(201,168,108,0.2)]' : 'border-white/10 text-gray-500 bg-white/5'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">{creci}</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar: 6-Second Radial Countdown & Linear Progress Bar */}
      <footer className="w-full max-w-4xl mx-auto relative z-20 space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C9A86C] animate-ping" />
            <span className="text-gray-300">Iniciando experiência imobiliária...</span>
          </div>

          {/* 6-Second Circular Countdown Badge */}
          <div className="flex items-center gap-2 bg-black/60 border border-white/10 px-3 py-1 rounded-full">
            <div className="relative w-5 h-5 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#C9A86C] transition-all duration-100 ease-linear"
                  strokeDasharray={`${progress}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
            <span className="text-[#C9A86C] font-bold">{secondsLeft}s</span>
          </div>
        </div>

        {/* Glowing Linear Progress Bar */}
        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/10 p-[1px]">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C9A86C] via-amber-300 to-[#C9A86C] rounded-full shadow-[0_0_12px_#C9A86C]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </footer>
    </motion.div>
  );
};
