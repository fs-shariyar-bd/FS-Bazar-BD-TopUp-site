import React from 'react';
import { SiteConfig, Game } from '../../types';
import { Phone, MessageCircle, Facebook, Youtube, Instagram, ShieldCheck, Heart } from 'lucide-react';

interface FooterStyleProps {
  config: SiteConfig;
  games: Game[];
  onNavigate: (path: string) => void;
  onSelectGame?: (game: Game) => void;
}

export default function FooterStyle1({
  config,
  games,
  onNavigate,
  onSelectGame
}: FooterStyleProps) {
  return (
    <footer className="w-full bg-[#111827] text-white pt-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10">
          
          {/* Column 1: Helpline Capsules */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white mb-6">HELPLINE</h3>
            
            <div className="space-y-3">
              {/* Phone Helpline */}
              <div className="border border-white/20 rounded-full px-5 py-3 flex items-center gap-4 bg-white/5 max-w-sm">
                <Phone size={20} className="text-white shrink-0" />
                <div className="h-8 w-[1px] bg-white/20" />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-white/75 font-semibold uppercase tracking-wider">Call Support</span>
                  <span className="text-sm font-black tracking-wide text-white">{config.supportPhone || "+8801787375523"}</span>
                </div>
              </div>
              
              {/* WhatsApp Helpline */}
              <a 
                href={`https://wa.me/${config.supportWhatsApp || config.supportPhone}`} 
                target="_blank" 
                rel="noreferrer" 
                className="border border-white/20 hover:border-white/40 rounded-full px-5 py-3 flex items-center gap-4 bg-white/5 max-w-sm transition-all block group"
              >
                <div className="flex items-center gap-4 w-full">
                  <MessageCircle size={20} className="text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="h-8 w-[1px] bg-white/20" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-white/75 font-semibold uppercase tracking-wider">WhatsApp 24/7</span>
                    <span className="text-sm font-black tracking-wide text-white">{config.supportWhatsApp || config.supportPhone}</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Column 2: Information Links */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-white mb-6">About</h3>
              <ul className="space-y-3 text-white/85 font-semibold text-[11px]">
                <li><button onClick={() => onNavigate('/')} className="hover:underline transition-all">Terms & Condition</button></li>
                <li><button onClick={() => onNavigate('/')} className="hover:underline transition-all">Privacy Policy</button></li>
                <li><button onClick={() => onNavigate('/')} className="hover:underline transition-all">Shipment Info</button></li>
                <li><button onClick={() => onNavigate('/')} className="hover:underline transition-all">Refund and Return Policy</button></li>
              </ul>
            </div>
            
            <div className="space-y-4 pt-10">
              <ul className="space-y-3 text-white/85 font-semibold text-[11px]">
                <li><button onClick={() => onNavigate('/')} className="hover:underline transition-all">Contact Us</button></li>
                <li><button onClick={() => onNavigate('/')} className="hover:underline transition-all">About Us</button></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Fast Games */}
          <div className="lg:col-span-1.5 space-y-4 text-left">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white mb-6">Top Games</h3>
            <ul className="space-y-3 text-white/85 font-semibold text-[11px]">
              {games.slice(0, 4).map((g) => (
                <li key={g.id}>
                  <button 
                    onClick={() => onSelectGame ? onSelectGame(g) : onNavigate(`/game/${g.id}`)} 
                    className="hover:underline transition-all truncate max-w-[120px] block"
                  >
                    {g.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div className="lg:col-span-1.5 space-y-4 text-left">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white mb-6">Stay Connected</h3>
            <div className="space-y-2 text-[11px]">
              <span className="font-extrabold text-white block">{config.siteName || "Pipo Bazar BD"}</span>
              <span className="text-white/80 block leading-tight font-medium">
                Email: <span className="font-semibold">{config.supportEmail || "pipobazarofficial@gmail.com"}</span>
              </span>
            </div>
            <div className="flex gap-2.5 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white">
                <Facebook size={14} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white">
                <Youtube size={14} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center text-white">
                <Instagram size={14} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Payment Badges Bar */}
      <div className="w-full bg-white py-4 border-y border-slate-100 text-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-slate-400 font-extrabold tracking-widest text-xs uppercase">Pay With</span>
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[9px] font-black tracking-tight select-none">
            <span className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-blue-800">VISA</span>
            <span className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-amber-600">MasterCard</span>
            <span className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-purple-700 font-extrabold">Rocket</span>
            <span className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[#E2136E] font-bold">bKash</span>
            <span className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[#F26422] font-bold">Nagad</span>
            <span className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-yellow-600 font-bold">Upay</span>
            <span className="bg-slate-50 border border-emerald-500/30 rounded px-2 py-1 text-emerald-600 font-extrabold">Verified EPS</span>
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="bg-[#0b101b] py-4 text-center text-xs text-slate-500 font-medium">
        <p>{config.footerCopyright || "© 2026 Pipo Bazar BD. All Rights Reserved."}</p>
      </div>
    </footer>
  );
}
