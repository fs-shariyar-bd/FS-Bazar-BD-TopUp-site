import React from 'react';
import { SiteConfig, Game } from '../../types';
import { Trophy, ShieldCheck, Crown, MessageCircle, Phone, Award, Zap } from 'lucide-react';

interface FooterStyleProps {
  config: SiteConfig;
  games: Game[];
  onNavigate: (path: string) => void;
  onSelectGame?: (game: Game) => void;
}

export default function FooterStyle3({
  config,
  games,
  onNavigate,
  onSelectGame
}: FooterStyleProps) {
  return (
    <footer className="w-full bg-[#0a0e1a] text-slate-200 border-t border-violet-600/40 pt-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Arena Banner */}
        <div className="bg-gradient-to-r from-violet-900/60 via-indigo-900/60 to-purple-900/60 border border-violet-500/30 rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-violet-600/40">
              <Trophy size={24} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-wide uppercase italic">
                Official Gaming Topup Store
              </h3>
              <p className="text-xs text-violet-300 font-medium">
                Fast & Automated Diamond & UC delivery for BD Gamers.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href={`https://wa.me/${config.supportWhatsApp || config.supportPhone}`}
              target="_blank"
              rel="noreferrer"
              className="bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2 cursor-pointer uppercase"
            >
              <MessageCircle size={16} /> Live Support
            </a>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10">
          
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-black text-violet-400 uppercase tracking-widest mb-3">About Arena</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {config.siteName || "Pipo Bazar BD"} - Leading esports topup hub providing instant delivery with total account security.
            </p>
            <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center gap-2">
              <ShieldCheck size={16} /> 100% Automated bKash & Nagad API Integration
            </div>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-black text-violet-400 uppercase tracking-widest mb-3">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-300">
              <button onClick={() => onNavigate('/')} className="text-left hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => onNavigate('/')} className="text-left hover:text-white transition-colors">Terms of Use</button>
              <button onClick={() => onNavigate('/')} className="text-left hover:text-white transition-colors">Refund Policy</button>
              <button onClick={() => onNavigate('/')} className="text-left hover:text-white transition-colors">Contact Support</button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-black text-violet-400 uppercase tracking-widest mb-3">Top Games</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-300">
              {games.slice(0, 6).map((g) => (
                <button 
                  key={g.id}
                  onClick={() => onSelectGame ? onSelectGame(g) : onNavigate(`/game/${g.id}`)}
                  className="text-left hover:text-violet-400 transition-colors truncate"
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Copyright Line */}
      <div className="bg-[#060912] py-4 text-center text-xs text-slate-500 font-semibold border-t border-slate-900">
        <p>{config.footerCopyright || "© 2026 Arena Esports Topup BD. All Rights Reserved."}</p>
      </div>
    </footer>
  );
}
