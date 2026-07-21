import React from 'react';
import { Game } from '../../../types';
import { Gamepad2, ArrowRight, ShieldCheck, Zap, Coins } from 'lucide-react';
import { motion } from 'motion/react';

interface GameCardProps {
  key?: string | number;
  game: Game;
  template: 'grid' | 'compact' | 'modern' | 'hover_glow';
  themeColor: 'emerald' | 'cyan' | 'violet' | 'amber' | 'rose' | 'slate';
  activeWebsiteTemplate?: 'classic' | 'cyberpunk' | 'esports' | 'retro';
  onSelect: (game: Game) => void;
}

export default function GameCard({ game, template, themeColor, activeWebsiteTemplate = 'classic', onSelect }: GameCardProps) {
  
  const getThemeHex = (col: string) => {
    switch(col) {
      case 'cyan': return '#06b6d4';
      case 'violet': return '#8b5cf6';
      case 'amber': return '#f59e0b';
      case 'rose': return '#f43f5e';
      case 'slate': return '#64748b';
      case 'emerald':
      default: return '#20947c';
    }
  };

  const accentHex = getThemeHex(themeColor);

  // 1. CYBERPUNK THEME GAME CARD DESIGN
  if (activeWebsiteTemplate === 'cyberpunk') {
    return (
      <motion.div 
        whileHover={{ scale: 1.02, y: -4 }}
        id={`game-card-${game.id}`}
        onClick={() => onSelect(game)}
        className="group relative bg-[#0d1527] border border-cyan-500/30 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.05)] hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]"
      >
        {/* Futuristic corner details */}
        <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 z-10" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-pink-500 z-10" />

        {/* HUD Overlay Label */}
        <div className="absolute top-2 left-2 z-10 bg-black/80 border border-cyan-500/50 rounded px-1.5 py-0.5 text-[8px] font-mono text-cyan-400 tracking-wider uppercase flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
          SYS_OK
        </div>

        {/* Game poster image */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
          <img 
            src={game.logo} 
            alt={game.name} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400";
            }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1527] via-transparent to-transparent opacity-60" />
        </div>

        {/* Cyberpunk centered title info */}
        <div className="p-3 bg-slate-900/90 text-left border-t border-cyan-500/15">
          <span className="text-[7px] font-mono tracking-widest text-pink-500 uppercase block font-semibold mb-0.5">🎮 INTERNET_ITEM //</span>
          <h3 className="text-xs font-black tracking-tight text-slate-100 truncate group-hover:text-cyan-400 transition-colors uppercase font-mono">
            {game.name}
          </h3>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[8px] font-mono text-slate-500">SECURE_AUTO</span>
            <div className="text-[9px] font-mono font-black text-cyan-400 tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              RUN_PACK <ArrowRight size={10} />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // 2. ESPORTS ELITE THEME GAME CARD DESIGN
  if (activeWebsiteTemplate === 'esports') {
    return (
      <motion.div 
        whileHover={{ y: -6 }}
        id={`game-card-${game.id}`}
        onClick={() => onSelect(game)}
        className="group relative bg-[#131926] border-2 border-slate-800 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-xl hover:border-[#8b5cf6] hover:shadow-[#8b5cf6]/10"
      >
        {/* Esports Premium Badge */}
        <div className="absolute top-3 right-3 z-10 bg-[#8b5cf6] text-white rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md shadow-[#8b5cf6]/30">
          <Zap size={8} /> ELITE
        </div>

        {/* Game poster with neon shade overlay */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
          <img 
            src={game.logo} 
            alt={game.name} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400";
            }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131926] via-transparent to-transparent opacity-80" />
        </div>

        {/* Esports Title Block */}
        <div className="p-3.5 bg-[#131926] text-left">
          <span className="text-[8px] font-bold text-[#8b5cf6] tracking-widest uppercase block mb-1">PRO SERVICE</span>
          <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-wide truncate group-hover:text-purple-400 transition-colors uppercase italic">
            {game.name}
          </h3>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <ShieldCheck size={11} className="text-emerald-400" /> Auto Delivery
            </span>
            <span className="text-[#8b5cf6] font-black group-hover:scale-105 transition-transform flex items-center gap-1 font-mono uppercase text-[9px]">
              GET ITEM
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // 3. RETRO ARCADE THEME GAME CARD DESIGN
  if (activeWebsiteTemplate === 'retro') {
    return (
      <div 
        id={`game-card-${game.id}`}
        onClick={() => onSelect(game)}
        className="group relative bg-[#180a2b] border-2 border-rose-500 rounded-none overflow-hidden cursor-pointer transition-all duration-200 active:translate-y-1 shadow-[4px_4px_0px_#f43f5e] hover:shadow-[6px_6px_0px_#ff007f] hover:translate-x-[-2px] hover:translate-y-[-2px]"
      >
        {/* Retro blinking indicator */}
        <div className="absolute top-2 left-2 z-10 bg-black border-2 border-rose-500 px-1 text-[7px] font-mono text-rose-400 animate-pulse uppercase font-extrabold tracking-widest">
          1P PLAY
        </div>

        {/* Star dust image backdrop */}
        <div className="relative aspect-square w-full overflow-hidden bg-black border-b-2 border-rose-500">
          <img 
            src={game.logo} 
            alt={game.name} 
            className="h-full w-full object-cover filter saturate-120 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400";
            }}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* 8-Bit Title */}
        <div className="p-3 bg-black/95 text-center font-mono">
          <h3 className="text-xs font-black text-yellow-300 tracking-wider truncate uppercase">
            {game.name}
          </h3>
          <div className="mt-2 bg-rose-950/40 border border-rose-500/50 py-1.5 rounded-none group-hover:bg-rose-500 transition-colors">
            <span className="text-[9px] font-black tracking-widest text-rose-300 group-hover:text-white uppercase flex items-center justify-center gap-1">
              <Coins size={10} /> INSERT COIN
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 4. CLASSIC THEME (Original clean rounded theme)
  return (
    <motion.div 
      whileHover={{ scale: 1.01, y: -3 }}
      id={`game-card-${game.id}`}
      onClick={() => onSelect(game)}
      className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        <img 
          src={game.logo} 
          alt={game.name} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400";
          }}
          referrerPolicy="no-referrer"
        />
      </div>
      
      {/* Horizontal Divider Line */}
      <div className="w-full border-t border-slate-100" />

      {/* Product Title Centered Block */}
      <div className="py-3.5 px-3 flex flex-col items-center justify-center min-h-[55px] bg-white rounded-b-2xl">
        <h3 className="text-xs md:text-sm font-extrabold text-slate-800 tracking-tight text-center group-hover:text-[#20947c] transition-colors line-clamp-2 leading-snug">
          {game.name}
        </h3>
      </div>
    </motion.div>
  );
}
