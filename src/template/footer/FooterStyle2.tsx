import React from 'react';
import { SiteConfig, Game } from '../../types';
import { Terminal, Shield, Cpu, MessageSquare, PhoneCall, Zap, Flame } from 'lucide-react';

interface FooterStyleProps {
  config: SiteConfig;
  games: Game[];
  onNavigate: (path: string) => void;
  onSelectGame?: (game: Game) => void;
}

export default function FooterStyle2({
  config,
  games,
  onNavigate,
  onSelectGame
}: FooterStyleProps) {
  return (
    <footer className="w-full bg-[#050811] text-cyan-400 font-mono border-t-2 border-cyan-500/40 pt-12 relative overflow-hidden">
      {/* Background Cyber Grid effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10">
          
          {/* Cyber Terminal Support Box */}
          <div className="lg:col-span-4 bg-[#091122] border border-cyan-500/30 p-5 rounded-none shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <div className="flex items-center gap-2 text-pink-500 font-black text-xs uppercase mb-4 border-b border-cyan-500/20 pb-2">
              <Terminal size={14} /> SYS_COMMUNICATION_LINK
            </div>
            
            <div className="space-y-3">
              <div className="bg-black border border-cyan-500/40 p-3 font-mono text-xs">
                <span className="text-[9px] text-pink-400 block font-bold">// VOICE_HOTLINE</span>
                <span className="text-white font-black text-sm tracking-widest">{config.supportPhone || "+8801787375523"}</span>
              </div>
              
              <a 
                href={`https://wa.me/${config.supportWhatsApp || config.supportPhone}`}
                target="_blank"
                rel="noreferrer"
                className="bg-black border border-pink-500/50 hover:bg-pink-950 p-3 block transition-colors"
              >
                <span className="text-[9px] text-cyan-400 block font-bold">// WHATSAPP_ENCRYPTED</span>
                <span className="text-pink-400 font-black text-sm tracking-widest">{config.supportWhatsApp || config.supportPhone}</span>
              </a>
            </div>
          </div>

          {/* Quick Cyber Links */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-black text-pink-500 uppercase tracking-widest mb-4">// DIRECTIVES</h3>
              <ul className="space-y-2 text-xs font-bold text-slate-300">
                <li><button onClick={() => onNavigate('/')} className="hover:text-cyan-400 transition-colors">TERMS_OF_SERVICE</button></li>
                <li><button onClick={() => onNavigate('/')} className="hover:text-cyan-400 transition-colors">PRIVACY_POLICY</button></li>
                <li><button onClick={() => onNavigate('/')} className="hover:text-cyan-400 transition-colors">REFUND_RULES</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-black text-pink-500 uppercase tracking-widest mb-4">// TOP_GAMES</h3>
              <ul className="space-y-2 text-xs font-bold text-slate-300">
                {games.slice(0, 4).map((g) => (
                  <li key={g.id}>
                    <button 
                      onClick={() => onSelectGame ? onSelectGame(g) : onNavigate(`/game/${g.id}`)}
                      className="hover:text-cyan-400 transition-colors truncate max-w-[120px] block"
                    >
                      {g.name.toUpperCase()}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* System Info */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-black text-pink-500 uppercase tracking-widest">// NODE_IDENTITY</h3>
            <p className="text-xs text-slate-300 font-medium">
              {config.siteName || "CYBER_BAZAR"} // AUTOMATED BD TOPUP GATEWAY
            </p>
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 text-[10px] text-cyan-300">
              <p className="font-mono">STATUS: 100% ONLINE</p>
              <p className="font-mono">ENCRYPTION: AES_256_GCM</p>
            </div>
          </div>

        </div>
      </div>

      {/* Payment Bar */}
      <div className="w-full bg-black border-y border-cyan-500/30 py-3 text-center text-xs">
        <span className="text-cyan-500 font-black tracking-widest uppercase mr-4">GATEWAYS_SUPPORTED:</span>
        <span className="text-pink-400 font-bold tracking-wider">bKash // Nagad // Rocket // Upay // Visa // MasterCard</span>
      </div>

      <div className="bg-[#02040a] py-3 text-center text-[10px] text-slate-500 font-mono">
        <p>{config.footerCopyright || "© 2026 CYBER BAZAR BD. ALL RIGHTS RESERVED."}</p>
      </div>
    </footer>
  );
}
