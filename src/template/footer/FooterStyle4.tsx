import React from 'react';
import { SiteConfig, Game } from '../../types';
import { Gamepad2, ShieldCheck, Heart } from 'lucide-react';

interface FooterStyleProps {
  config: SiteConfig;
  games: Game[];
  onNavigate: (path: string) => void;
  onSelectGame?: (game: Game) => void;
}

export default function FooterStyle4({
  config,
  games,
  onNavigate
}: FooterStyleProps) {
  return (
    <footer className="w-full bg-[#0a0f1d] text-slate-300 py-8 border-t border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
        
        <div className="flex items-center justify-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Gamepad2 size={16} />
          </div>
          <span className="text-sm font-extrabold text-white">{config.siteName || "Pipo Bazar"}</span>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-semibold text-slate-400">
          <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors">Home</button>
          <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors">Privacy</button>
          <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors">Terms</button>
          <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors">Contact</button>
        </div>

        <p className="text-[11px] text-slate-500 font-medium">
          {config.footerCopyright || "© 2026 Pipo Bazar BD. All Rights Reserved."}
        </p>
      </div>
    </footer>
  );
}
