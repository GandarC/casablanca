import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Shield,
  ChevronDown,
  Lock,
  AlertTriangle,
  Zap,
  Eye,
} from 'lucide-react';

// ============================================================
// CONSTANTS
// ============================================================

const BOOT_LINES = [
  'SİSTEM BAŞLATILIYOR...',
  'OCEAN SCANNER v4.2.1 YÜKLENDİ',
  'ÇEKİRDEK DOĞRULAMA: BAŞARILI',
  'AĞ BAĞLANTISI: ŞİFRELİ',
  'ERİŞİM: ONAYLANDI',
];

const TERMINAL_LOGS = [
  { type: 'sys', msg: 'Ocean Scanner v4.2.1 başlatıldı' },
  { type: 'auth', msg: 'Çekirdek doğrulama başarılı' },
  { type: 'scan', msg: 'Bellek alanı taranıyor... 0x0000-0xFFFF' },
  { type: 'scan', msg: 'İşlem listesi doğrulanıyor...' },
  { type: 'ok', msg: '127 işlem doğrulandı' },
  { type: 'sys', msg: 'Ocean Scanner çekirdek erişimi sağlandı...' },
  { type: 'scan', msg: 'Hafıza taranıyor (0x8F9A)...' },
  { type: 'warn', msg: 'Şüpheli işlem tespit edildi: PID 4829' },
  { type: 'alert', msg: 'Yetkisiz memory injection: 0x7F3A' },
  { type: 'detect', msg: '[TESPİT] Yetkisiz enjeksiyon bulundu.' },
  { type: 'exec', msg: '[İNFAZ] Hedef sunucudan silindi. Kanıtlar arşivlendi.' },
  { type: 'ok', msg: 'Sistem bütünlüğü doğrulandı' },
  { type: 'scan', msg: 'Network trafiği izleniyor... 0xD4C1' },
  { type: 'ok', msg: '312 bağlantı doğrulandı' },
  { type: 'warn', msg: 'Anormal paket yapısı: SRC 192.168.x.x' },
  { type: 'detect', msg: '[TESPİT] Modmenu enjeksiyonu engellendi' },
  { type: 'exec', msg: '[İNFAZ] Hedef kalıcı olarak yasaklandı' },
  { type: 'ok', msg: 'Tehdit seviyesi: MINIMAL' },
];

const TEAM_MEMBERS = [
  { name: 'Tamashi', role: 'Ac Leader', seed: 7 },
  { name: 'Kaiser', role: 'Ac Master', seed: 13 },
  { name: 'Atizade', role: 'Ac Team', seed: 23 },
  { name: 'Sxd', role: 'Ac Team', seed: 37 },
];

// ============================================================
// ANIMATION VARIANTS
// ============================================================



// ============================================================
// CUSTOM HOOKS
// ============================================================

function useTextScramble(finalText: string, isActive: boolean): string {
  const [displayText, setDisplayText] = useState(finalText);
  const chars = '!@#$%^&*()_+-=[]{}|;:<>?/~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  useEffect(() => {
    if (!isActive) {
      setDisplayText(finalText);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        finalText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return finalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      iteration += 0.5;
      if (iteration >= finalText.length) {
        clearInterval(interval);
        setDisplayText(finalText);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [isActive, finalText]);

  return displayText;
}

// ============================================================
// BOOT SEQUENCE
// ============================================================

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines((prev) => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setExiting(true), 400);
        setTimeout(() => onComplete(), 1200);
      }
    }, 350);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <div className="font-mono text-sm max-w-md w-full px-8">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className={`mb-2 ${
              i === lines.length - 1 ? 'text-cyan-400' : 'text-neutral-500'
            }`}
          >
            <span className="text-neutral-700 mr-2">{'>'}</span>
            {line}
          </motion.div>
        ))}
        <span className="cursor-blink text-cyan-500 text-sm">_</span>
      </div>
    </motion.div>
  );
}

// ============================================================
// BACKGROUND PULSE
// ============================================================

function BackgroundPulse() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-cyan-500/[0.04] blur-[150px] pulse-glow-anim" />
    </div>
  );
}

// ============================================================
// SYSTEM HEADER
// ============================================================

function SystemHeader() {
  return (
    <motion.header
      className="fixed top-0 left-0 w-full z-50 px-6 py-5 flex items-center justify-between"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5, duration: 1 }}
    >
      <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-wider text-neutral-600">
        <div className="relative">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
          <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping opacity-40" />
        </div>
        <span>SİSTEM: BAĞLI</span>
      </div>
      <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-wider text-neutral-700">
        <Lock size={10} />
        <span>OCEAN_ACTIVE</span>
      </div>
    </motion.header>
  );
}

// ============================================================
// SECTION 1: HERO (KARŞILAMA)
// ============================================================

function HeroSection() {
  const title = 'CASABLANCA';

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 grid-bg">
      {/* Main Title */}
      <div className="flex items-center justify-center mb-4">
        {title.split('').map((letter, i) => (
          <motion.span
            key={i}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter glitch-text flicker"
            data-text={letter}
            initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              delay: 2.8 + i * 0.07,
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>

      {/* Powered By */}
      <motion.div
        className="flex items-center gap-2 mb-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.6, duration: 0.8 }}
      >
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-500/50" />
        <span className="font-mono text-sm tracking-[0.3em] text-cyan-500/70 uppercase">
          powered by OCEAN_
        </span>
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-500/50" />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="font-mono text-xs sm:text-sm text-neutral-600 tracking-wider text-center max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1.2 }}
      >
        Görünmeyeni görürüz. Sisteme sızanları yok ederiz.
      </motion.p>

      {/* Scroll Hint */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5, duration: 1 }}
      >
        <span className="font-mono text-[10px] tracking-widest text-neutral-700">
          {'>'} aşağı_kaydır
        </span>
        <div className="bounce-subtle text-neutral-700">
          <ChevronDown size={14} />
        </div>
      </motion.div>
    </section>
  );
}

// ============================================================
// NODE PATTERN (for team cards)
// ============================================================

function NodePattern({ seed, hovered }: { seed: number; hovered: boolean }) {
  const nodes = Array.from({ length: 9 }, (_, i) => ({
    x: ((seed * (i + 1) * 7 + i * 31) % 76) + 12,
    y: ((seed * (i + 1) * 13 + i * 17) % 60) + 20,
  }));

  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [0, 3], [1, 4], [2, 5], [3, 6], [5, 7], [6, 8], [7, 8],
  ];

  return (
    <svg
      className="w-full h-full absolute inset-0 transition-opacity duration-500"
      style={{ opacity: hovered ? 0.5 : 0.15 }}
    >
      {connections.map(([a, b], i) => (
        <line
          key={`line-${i}`}
          x1={`${nodes[a].x}%`}
          y1={`${nodes[a].y}%`}
          x2={`${nodes[b].x}%`}
          y2={`${nodes[b].y}%`}
          stroke="#06b6d4"
          strokeWidth="0.5"
          opacity={hovered ? 0.6 : 0.25}
          className="transition-opacity duration-500"
        />
      ))}
      {nodes.map((node, i) => (
        <g key={`node-${i}`}>
          <circle
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={hovered ? 3 : 2}
            fill="#06b6d4"
            opacity={hovered ? 0.9 : 0.4}
            className="transition-all duration-500"
          />
          {hovered && (
            <circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r="6"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="0.3"
              opacity="0.3"
            />
          )}
        </g>
      ))}
    </svg>
  );
}

// ============================================================
// TEAM CARD
// ============================================================

function TeamCard({
  name,
  role,
  seed,
  delay,
}: {
  name: string;
  role: string;
  seed: number;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const scrambledName = useTextScramble(name, hovered);
  const scrambledRole = useTextScramble(role, hovered);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`
          relative overflow-hidden rounded-sm
          border transition-all duration-500
          ${
            hovered
              ? 'border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.12)]'
              : 'border-white/[0.04]'
          }
        `}
      >
        {/* Card Background */}
        <div className="bg-black/60 backdrop-blur-sm">
          {/* Geometric Pattern Area */}
          <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
            <NodePattern seed={seed} hovered={hovered} />

            {/* Abstract silhouette glow */}
            <div
              className={`
                absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-28
                bg-gradient-to-t from-black via-neutral-900/80 to-transparent
                rounded-t-full transition-all duration-700
                ${hovered ? 'scale-110 opacity-80' : 'opacity-30'}
              `}
            />

            {/* Glitch overlay on hover */}
            {hovered && (
              <>
                <motion.div
                  className="absolute inset-0 bg-cyan-500/[0.03]"
                  animate={{ opacity: [0.03, 0.06, 0.02, 0.05, 0.03] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background:
                      'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.03) 2px, rgba(6,182,212,0.03) 4px)',
                  }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.15, repeat: 3 }}
                />
              </>
            )}
          </div>

          {/* Info Section */}
          <div className="px-4 py-5 space-y-3">
            {/* Name */}
            <div>
              <h3
                className={`
                  font-mono text-lg font-bold tracking-wider transition-colors duration-300
                  ${hovered ? 'text-cyan-400' : 'text-white'}
                `}
              >
                {scrambledName}
              </h3>
            </div>

            {/* Role */}
            <div className="flex items-center gap-2">
              <span
                className={`
                  font-mono text-[11px] tracking-wider px-2 py-0.5 rounded-sm border transition-all duration-300
                  ${
                    hovered
                      ? 'border-cyan-500/40 text-cyan-400 bg-cyan-500/5'
                      : 'border-white/[0.06] text-neutral-500 bg-white/[0.02]'
                  }
                `}
              >
                {scrambledRole}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.04]" />

            {/* Redacted Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-neutral-700 w-10">ID</span>
                <div className="h-2 flex-1 bg-neutral-800/60 rounded-sm overflow-hidden">
                  <div className="h-full w-full bg-neutral-800/80" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-neutral-700 w-10">KONUM</span>
                <div className="h-2 w-2/3 bg-neutral-800/60 rounded-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-neutral-700 w-10">DURUM</span>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                      hovered ? 'bg-cyan-500' : 'bg-emerald-500'
                    }`}
                  />
                  <span
                    className={`font-mono text-[9px] tracking-wider transition-colors duration-300 ${
                      hovered ? 'text-cyan-500' : 'text-emerald-600'
                    }`}
                  >
                    AKTİF
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// SECTION 2: SYNDICATE (EKİP)
// ============================================================

function SyndicateSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative min-h-screen py-32 px-4 sm:px-8 md:px-16 lg:px-24"
    >
      {/* Section Header */}
      <motion.div
        className="mb-16 md:mb-20"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Shield size={14} className="text-neutral-700" />
          <span className="font-mono text-xs tracking-[0.2em] text-neutral-700 uppercase">
            [_EKİP_]
          </span>
        </div>
        <div className="h-px w-full max-w-xs bg-gradient-to-r from-white/[0.06] to-transparent" />
      </motion.div>

      {/* Team Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
        {TEAM_MEMBERS.map((member, i) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            seed={member.seed}
            delay={0.1 + i * 0.12}
          />
        ))}
      </div>
    </section>
  );
}

// ============================================================
// TERMINAL LINE
// ============================================================

function TerminalLine({
  log,
  index,
}: {
  log: { type: string; msg: string };
  index: number;
}) {
  const typeStyles: Record<string, { color: string; prefix: string }> = {
    sys: { color: 'text-cyan-500/80', prefix: 'SYS' },
    auth: { color: 'text-emerald-500/80', prefix: 'AUTH' },
    scan: { color: 'text-neutral-500', prefix: 'SCAN' },
    ok: { color: 'text-emerald-400/70', prefix: 'OK' },
    warn: { color: 'text-amber-400/80', prefix: 'WARN' },
    alert: { color: 'text-red-400/90', prefix: 'ALERT' },
    detect: { color: 'text-orange-400/90', prefix: 'TESPİT' },
    exec: { color: 'text-red-500/90', prefix: 'İNFAZ' },
  };

  const style = typeStyles[log.type] || typeStyles.scan;

  const now = new Date();
  const time = new Date(now.getTime() - (TERMINAL_LOGS.length - index) * 2300);
  const timestamp = time.toTimeString().split(' ')[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-2 font-mono text-[11px] sm:text-xs leading-relaxed"
    >
      <span className="text-neutral-700 shrink-0">{timestamp}</span>
      <span className={`${style.color} shrink-0 w-14`}>[{style.prefix}]</span>
      <span className="text-neutral-400">{log.msg}</span>
    </motion.div>
  );
}

// ============================================================
// SECTION 3: WEAPON (OCEAN HAKKINDA)
// ============================================================

function WeaponSection() {
  const [logs, setLogs] = useState<typeof TERMINAL_LOGS>([]);
  const [logIndex, setLogIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Start adding logs when in view
  useEffect(() => {
    if (!isInView || isStarted) return;
    setIsStarted(true);

    // Add first few logs quickly
    const initialLogs = TERMINAL_LOGS.slice(0, 3);
    setLogs(initialLogs);
    setLogIndex(3);
  }, [isInView, isStarted]);

  // Continuously add logs
  useEffect(() => {
    if (!isStarted) return;

    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLog = TERMINAL_LOGS[logIndex % TERMINAL_LOGS.length];
        const updated = [...prev, newLog];
        // Keep max 25 lines
        if (updated.length > 25) return updated.slice(-25);
        return updated;
      });
      setLogIndex((prev) => prev + 1);
    }, 2200);

    return () => clearInterval(interval);
  }, [isStarted, logIndex]);

  // Auto scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 px-4 sm:px-8 md:px-16 lg:px-24"
    >
      {/* Section Header */}
      <motion.div
        className="mb-16 md:mb-20"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Terminal size={14} className="text-neutral-700" />
          <span className="font-mono text-xs tracking-[0.2em] text-neutral-700 uppercase">
            [_MOTOR: OCEAN_]
          </span>
        </div>
        <div className="h-px w-full max-w-xs bg-gradient-to-r from-white/[0.06] to-transparent" />
      </motion.div>

      {/* Terminal Window */}
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="rounded-lg border border-white/[0.04] overflow-hidden bg-black/70 backdrop-blur-xl shadow-2xl">
          {/* Terminal Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04] bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              </div>
            </div>
            <span className="font-mono text-[10px] tracking-wider text-neutral-700">
              ocean_scanner@casablanca:~
            </span>
            <div className="flex items-center gap-1.5">
              <Zap size={10} className="text-cyan-500/40" />
              <span className="font-mono text-[9px] text-cyan-500/40">LIVE</span>
            </div>
          </div>

          {/* Terminal Body */}
          <div
            ref={terminalRef}
            className="p-4 sm:p-6 h-[340px] sm:h-[400px] overflow-y-auto scanlines space-y-1.5"
          >
            {logs.map((log, i) => (
              <TerminalLine key={`${i}-${log.msg}`} log={log} index={i} />
            ))}
            {isStarted && (
              <div className="font-mono text-[11px] sm:text-xs text-cyan-500/60 terminal-cursor">
                &nbsp;
              </div>
            )}
          </div>
        </div>

        {/* Description below terminal */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 1 }}
        >
          <p className="font-mono text-sm text-neutral-600 tracking-wider">
            Derin tarama. Sıfır tolerans. Acıma yok.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================================
// MAGNETIC BUTTON
// ============================================================

function MagneticButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setPosition({ x: x * 0.35, y: y * 0.35 });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => window.open('https://discord.gg/casablanca', '_blank')}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
        mass: 0.5,
      }}
      className={`
        relative group px-10 py-4 font-mono text-sm tracking-[0.2em]
        border rounded-sm transition-all duration-500 cursor-pointer
        ${
          isHovered
            ? 'border-cyan-500/60 text-cyan-300 shadow-[0_0_40px_rgba(6,182,212,0.2),0_0_80px_rgba(6,182,212,0.1)]'
            : 'border-white/[0.08] text-neutral-500'
        }
      `}
    >
      {/* Background glow */}
      <div
        className={`
          absolute inset-0 rounded-sm transition-opacity duration-500
          bg-gradient-to-r from-cyan-500/5 via-cyan-500/10 to-cyan-500/5
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* Glitch line effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'linear-gradient(0deg, transparent 0%, transparent 48%, rgba(6,182,212,0.06) 49%, rgba(6,182,212,0.06) 51%, transparent 52%, transparent 100%)',
              'linear-gradient(0deg, transparent 0%, transparent 28%, rgba(6,182,212,0.04) 29%, rgba(6,182,212,0.04) 31%, transparent 32%, transparent 100%)',
              'linear-gradient(0deg, transparent 0%, transparent 68%, rgba(6,182,212,0.05) 69%, rgba(6,182,212,0.05) 71%, transparent 72%, transparent 100%)',
              'linear-gradient(0deg, transparent 0%, transparent 48%, rgba(6,182,212,0.06) 49%, rgba(6,182,212,0.06) 51%, transparent 52%, transparent 100%)',
            ],
          }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <span className="relative z-10 flex items-center gap-3">
        {isHovered ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Eye size={14} className="text-cyan-400" />
          </motion.span>
        ) : (
          <Lock size={14} />
        )}
        AĞA KATIL
      </span>
    </motion.button>
  );
}

// ============================================================
// SECTION 4: GATEWAY (İLETİŞİM)
// ============================================================

function GatewaySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-4"
    >
      {/* Vast empty space with subtle atmospheric elements */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border border-white/[0.015]" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-white/[0.02]" />
        <div className="absolute w-[200px] h-[200px] rounded-full border border-white/[0.025]" />
      </div>

      {/* Connection Prompt */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="font-mono text-base sm:text-lg md:text-xl text-neutral-600 tracking-wider text-center">
          <span className="text-cyan-500/50">{'>'}</span>{' '}
          <span className="text-neutral-500">connect</span>{' '}
          <span className="text-cyan-500/70">casablanca_network</span>
        </div>
      </motion.div>

      {/* Decorative line */}
      <motion.div
        className="mb-12 flex items-center gap-3"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-white/[0.06]" />
        <div className="w-1 h-1 rounded-full bg-cyan-500/30" />
        <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-white/[0.06]" />
      </motion.div>

      {/* Magnetic Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <MagneticButton />
      </motion.div>

      {/* Bottom warning */}
      <motion.div
        className="absolute bottom-16 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] text-neutral-800">
          <AlertTriangle size={8} />
          <span>YALNIZCA DAVETLİ ERİŞİM</span>
          <AlertTriangle size={8} />
        </div>
      </motion.div>
    </section>
  );
}

// ============================================================
// SECTION DIVIDER
// ============================================================

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="h-px w-12 bg-white/[0.03]" />
      <div className="mx-3 w-1 h-1 rounded-full bg-cyan-500/20" />
      <div className="h-px w-12 bg-white/[0.03]" />
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const [booted, setBooted] = useState(false);

  return (
    <main className="relative bg-black min-h-screen text-neutral-400 overflow-x-hidden noise-overlay">
      {/* Boot Sequence */}
      <AnimatePresence>
        {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      {/* Background Effects */}
      <BackgroundPulse />

      {/* System Header */}
      <SystemHeader />

      {/* Main Content */}
      <div
        style={{
          opacity: booted ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        <HeroSection />
        <SectionDivider />
        <SyndicateSection />
        <SectionDivider />
        <WeaponSection />
        <SectionDivider />
        <GatewaySection />

        {/* Footer */}
        <footer className="py-12 text-center border-t border-white/[0.02]">
          <div className="font-mono text-[9px] tracking-[0.3em] text-neutral-800 uppercase">
            CASABLANCA © {new Date().getFullYear()} — Tüm hakları saklıdır
          </div>
        </footer>
      </div>
    </main>
  );
}
