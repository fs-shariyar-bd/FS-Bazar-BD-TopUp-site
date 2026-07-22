import React from 'react';
import fsBazarLogo from '../../assets/images/fs_bazar_logo.png';

interface TemplateDemoPreviewProps {
  type: string;
  className?: string;
}

export default function TemplateDemoPreview({ type, className = '' }: TemplateDemoPreviewProps) {
  const normalizedType = type.trim();

  // HEADER STYLE 1: PiPO BaZaR Style (Emerald Outline Search + Green Search Button + Profile Pill)
  if (normalizedType === 'Header style 1') {
    return (
      <div className={`w-full h-full bg-white rounded-lg p-2 flex items-center justify-between gap-2 border border-slate-200 select-none ${className}`}>
        {/* Main Logo */}
        <div className="flex items-center gap-1 shrink-0">
          <img src={fsBazarLogo} alt="Logo" className="h-6 w-auto object-contain" />
        </div>

        {/* Green Border Search Bar */}
        <div className="flex-1 max-w-[140px] flex border border-[#20947c] rounded overflow-hidden bg-white">
          <div className="px-1.5 py-0.5 text-[6px] text-slate-400 flex-1 truncate">Search</div>
          <div className="bg-[#20947c] text-white font-bold text-[6px] px-2 py-0.5 flex items-center">Search</div>
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-1 border border-slate-200 rounded-full px-1.5 py-0.5 bg-white shrink-0">
          <div className="w-3.5 h-3.5 rounded-full bg-indigo-900 text-white flex items-center justify-center text-[6px] font-bold">F</div>
          <span className="text-[6px] font-bold text-slate-800 hidden sm:inline truncate max-w-[50px]">Ferdouss</span>
          <span className="text-[5px] text-slate-400">▾</span>
        </div>
      </div>
    );
  }

  // HEADER STYLE 2: RRR BAZAR Style (Capsule Search + Blue Gradient Buttons)
  if (normalizedType === 'Header style 2') {
    return (
      <div className={`w-full h-full bg-white rounded-lg p-2 flex items-center justify-between gap-2 border border-slate-200 select-none ${className}`}>
        {/* Main Logo */}
        <div className="flex items-center gap-1 shrink-0">
          <img src={fsBazarLogo} alt="Logo" className="h-6 w-auto object-contain" />
        </div>

        {/* Capsule Search Bar */}
        <div className="flex-1 max-w-[140px] flex border border-slate-200 rounded-full overflow-hidden bg-white">
          <div className="px-2 py-0.5 text-[6px] text-slate-400 flex-1 truncate">Search games...</div>
          <div className="bg-gradient-to-r from-blue-800 to-indigo-950 text-white font-bold text-[6px] px-2.5 py-0.5 rounded-r-full flex items-center">Search</div>
        </div>

        {/* Blue Gradient Login Button */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-950 text-white font-black text-[6px] px-3 py-1 rounded-md shrink-0 uppercase">
          Login
        </div>
      </div>
    );
  }

  // HEADER STYLE 3: TopUpBuzz Style (Right Links + Wallet Pill + Avatar)
  if (normalizedType === 'Header style 3') {
    return (
      <div className={`w-full h-full bg-white rounded-lg p-2 flex items-center justify-between gap-2 border border-slate-200 select-none ${className}`}>
        {/* Main Logo */}
        <div className="flex items-center gap-1 shrink-0">
          <img src={fsBazarLogo} alt="Logo" className="h-6 w-auto object-contain" />
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[6px] font-bold text-[#0B2545]">Topup</span>
          <span className="text-[6px] font-bold text-[#0B2545]">Contact Us</span>
          <div className="bg-[#0B2545] text-white px-2 py-0.5 rounded-full text-[6px] font-bold flex items-center gap-0.5">
            <span>💳</span>
            <span>0 ৳</span>
          </div>
          <div className="w-4 h-4 rounded-full bg-indigo-900 text-white flex items-center justify-center text-[6px] font-bold border border-[#0B2545]">F</div>
        </div>
      </div>
    );
  }

  // HEADER STYLE 4: UC Ghor Style (Top Line + Right Links + Vibrant Green Login)
  if (normalizedType === 'Header style 4') {
    return (
      <div className={`w-full h-full bg-white rounded-lg p-2 flex items-center justify-between gap-2 border-t-2 border-slate-900 border-b border-slate-200 select-none ${className}`}>
        {/* Main Logo */}
        <div className="flex items-center gap-1 shrink-0">
          <img src={fsBazarLogo} alt="Logo" className="h-6 w-auto object-contain" />
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[6px] font-bold text-slate-800">Topup</span>
          <span className="text-[6px] font-bold text-slate-800">Contact Us</span>
          <div className="bg-[#00E640] text-slate-950 font-black text-[7px] px-3 py-1 rounded">
            Login
          </div>
        </div>
      </div>
    );
  }

  // HEADER STYLE 5: RR TOPUP Style (Dropdown Links + Icon Links + Blue Login Button)
  if (normalizedType === 'Header style 5') {
    return (
      <div className={`w-full h-full bg-white rounded-lg p-2 flex items-center justify-between gap-2 border border-slate-200 select-none ${className}`}>
        {/* Main Logo */}
        <div className="flex items-center gap-1 shrink-0">
          <img src={fsBazarLogo} alt="Logo" className="h-6 w-auto object-contain" />
        </div>

        {/* Right Nav Dropdowns & Icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[5px] font-bold text-slate-700">Uid Topup ▾</span>
          <span className="text-[5px] font-bold text-slate-700">Vouchers ▾</span>
          <span className="text-[5px] font-bold text-slate-700">💳 Topup</span>
          <span className="text-[5px] font-bold text-slate-700">🎧 Contact</span>
          <div className="bg-[#2563EB] text-white font-bold text-[6px] px-2.5 py-1 rounded-md">
            Login
          </div>
        </div>
      </div>
    );
  }

  // HEADER STYLE 6: BEST TOPUP Style (Diamond Logo + Royal Blue Login Button)
  if (normalizedType === 'Header style 6') {
    return (
      <div className={`w-full h-full bg-white rounded-lg p-2 flex items-center justify-between gap-2 border border-slate-200 select-none ${className}`}>
        {/* Main Logo */}
        <div className="flex items-center gap-1 shrink-0">
          <img src={fsBazarLogo} alt="Logo" className="h-6 w-auto object-contain" />
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[6px] font-bold text-slate-800">Topup</span>
          <span className="text-[6px] font-bold text-slate-800">Contact Us</span>
          <div className="bg-[#1D4ED8] text-white font-black text-[6px] px-3 py-1 rounded">
            Login
          </div>
        </div>
      </div>
    );
  }

  // HERO STYLE THREE
  if (normalizedType === 'Hero style three' || normalizedType.toLowerCase().includes('hero')) {
    return (
      <div className={`w-full h-full bg-[#f4ece1] rounded-lg p-2.5 flex flex-col justify-between select-none relative overflow-hidden ${className}`}>
        <div className="flex items-center justify-between h-full gap-2">
          <div className="flex-1 space-y-1 z-10">
            <span className="text-[7px] font-black tracking-widest text-slate-500 uppercase block">NEW COLLECTION</span>
            <h4 className="text-[10px] sm:text-[11px] font-extrabold text-slate-900 leading-tight">
              Explore Our Top Products & Experience Best in Store
            </h4>
            <p className="text-[6px] text-slate-600 line-clamp-2">
              Discover uniquely designed home page that combines style and functionality.
            </p>
            <div className="pt-1">
              <span className="inline-block bg-slate-900 text-white text-[7px] font-bold px-2 py-0.5 rounded-sm shadow-xs">
                Shop Now →
              </span>
            </div>
          </div>
          <div className="w-1/2 h-full rounded-md bg-cover bg-center shadow-xs border border-amber-900/10 shrink-0"
               style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80')` }}
          />
        </div>
      </div>
    );
  }

  // BENEFIT SECTION
  if (normalizedType === 'Benefit' || normalizedType.toLowerCase().includes('benefit')) {
    return (
      <div className={`w-full h-full bg-white rounded-lg p-2 flex items-center justify-center select-none ${className}`}>
        <div className="grid grid-cols-2 gap-1.5 w-full">
          <div className="p-1.5 rounded bg-slate-50 border border-slate-100 flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center text-[8px]">⚡</div>
            <div>
              <div className="text-[7px] font-bold text-slate-800">Instant Delivery</div>
              <div className="text-[5px] text-slate-400">24/7 Automated</div>
            </div>
          </div>
          <div className="p-1.5 rounded bg-slate-50 border border-slate-100 flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-[8px]">🔒</div>
            <div>
              <div className="text-[7px] font-bold text-slate-800">Secure Payment</div>
              <div className="text-[5px] text-slate-400">Bkash/Nagad API</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // EXPLORE CATEGORIES
  if (normalizedType === 'Explore categories' || normalizedType.toLowerCase().includes('category')) {
    return (
      <div className={`w-full h-full bg-slate-50 rounded-lg p-2 flex flex-col justify-center select-none ${className}`}>
        <div className="text-[7px] font-bold text-slate-700 mb-1">Explore Categories</div>
        <div className="grid grid-cols-4 gap-1">
          {[
            { name: 'Free Fire', bg: 'bg-amber-500', img: '🔥' },
            { name: 'PUBG UC', bg: 'bg-blue-600', img: '🪖' },
            { name: 'MLBB', bg: 'bg-purple-600', img: '⚔️' },
            { name: 'Gift Cards', bg: 'bg-emerald-600', img: '🎁' }
          ].map((cat, i) => (
            <div key={i} className="bg-white p-1 rounded border border-slate-200 text-center shadow-2xs">
              <div className={`w-4 h-4 ${cat.bg} text-white rounded-full mx-auto flex items-center justify-center text-[7px]`}>{cat.img}</div>
              <div className="text-[6px] font-semibold text-slate-800 mt-0.5 truncate">{cat.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // PRODUCT GALLERY SIX / SEVEN / EIGHT
  if (normalizedType.toLowerCase().includes('product gallery') || normalizedType.toLowerCase().includes('fashion')) {
    return (
      <div className={`w-full h-full bg-white rounded-lg p-1.5 flex flex-col justify-between select-none ${className}`}>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[7px] font-extrabold text-slate-800">{type}</span>
          <span className="text-[5px] text-emerald-600 font-bold">View All →</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[
            { title: '115 Diamonds', price: '৳ 80', img: '💎' },
            { title: '610 Diamonds', price: '৳ 420', img: '💎' },
            { title: 'Weekly Pass', price: '৳ 165', img: '⭐' }
          ].map((prod, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded p-1 text-center space-y-0.5">
              <div className="w-full h-5 bg-emerald-100/60 rounded flex items-center justify-center text-[9px]">{prod.img}</div>
              <div className="text-[5px] font-bold text-slate-800 truncate">{prod.title}</div>
              <div className="text-[6px] font-black text-emerald-600">{prod.price}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // BANNER STYLE FOUR
  if (normalizedType === 'Banner style four' || normalizedType.toLowerCase().includes('banner')) {
    return (
      <div className={`w-full h-full bg-slate-100 rounded-lg p-1.5 flex items-center gap-1.5 select-none ${className}`}>
        <div className="flex-1 h-full bg-gradient-to-r from-emerald-600 to-teal-700 rounded p-1.5 text-white flex flex-col justify-between">
          <span className="text-[5px] font-mono tracking-widest text-emerald-200 uppercase">PROMO BANNER</span>
          <div className="text-[7px] font-black leading-tight">Get 20% Bonus Diamonds Today!</div>
          <span className="text-[5px] bg-white text-emerald-800 font-bold px-1 py-0.5 rounded w-fit">Top Up Now</span>
        </div>
        <div className="flex-1 h-full bg-gradient-to-r from-indigo-600 to-purple-700 rounded p-1.5 text-white flex flex-col justify-between">
          <span className="text-[5px] font-mono tracking-widest text-indigo-200 uppercase">WEEKLY PASS</span>
          <div className="text-[7px] font-black leading-tight">Special Discounted Membership</div>
          <span className="text-[5px] bg-white text-indigo-800 font-bold px-1 py-0.5 rounded w-fit">Claim Offer</span>
        </div>
      </div>
    );
  }

  // EXPLORE BRANDS
  if (normalizedType === 'Explore brands' || normalizedType.toLowerCase().includes('brand')) {
    return (
      <div className={`w-full h-full bg-white rounded-lg p-2 flex flex-col justify-center select-none ${className}`}>
        <div className="text-[7px] font-bold text-slate-700 mb-1">Explore Official Brands</div>
        <div className="grid grid-cols-4 gap-1">
          {['Garena', 'Tencent', 'Moonton', 'Razer'].map((b, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 p-1 rounded text-center">
              <span className="text-[6px] font-extrabold text-slate-700 tracking-tight">{b}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // FOOTER STYLE 1
  if (normalizedType === 'Footer style 1') {
    return (
      <div className={`w-full h-full bg-slate-900 rounded-lg p-2 text-white flex flex-col justify-between select-none ${className}`}>
        <div className="flex justify-between items-start text-[6px]">
          <div>
            <div className="font-extrabold text-emerald-400 text-[7px]">TopUp Store</div>
            <div className="text-slate-400">Trusted gaming topup in Bangladesh.</div>
          </div>
          <div className="flex gap-2 text-slate-300">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Contact</span>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-1 flex justify-between items-center text-[5px] text-slate-500">
          <span>© 2026 All Rights Reserved</span>
          <span className="text-emerald-400 font-bold">bKash | Nagad | Rocket</span>
        </div>
      </div>
    );
  }

  // FOOTER STYLE 2
  if (normalizedType === 'Footer style 2') {
    return (
      <div className={`w-full h-full bg-slate-950 rounded-lg p-2 text-cyan-300 border border-cyan-900/50 flex flex-col justify-between select-none ${className}`}>
        <div className="flex justify-between items-center text-[6px] font-mono">
          <span className="text-cyan-400 font-bold">SYSTEM.TERMINAL_FOOTER</span>
          <span className="text-pink-400">v2.4.0 ONLINE</span>
        </div>
        <div className="text-[5px] font-mono text-slate-400">API Latency: 12ms | Encrypted SSL Gateway</div>
      </div>
    );
  }

  // FOOTER STYLE 3
  if (normalizedType === 'Footer style 3') {
    return (
      <div className={`w-full h-full bg-purple-950 rounded-lg p-2 text-purple-200 flex flex-col justify-between select-none ${className}`}>
        <div className="flex justify-between items-center text-[6px]">
          <span className="font-black text-amber-400">ESPORTS ARENA</span>
          <span>Support 24/7</span>
        </div>
        <div className="border-t border-purple-800 pt-1 text-[5px] text-purple-400 text-center">
          Powered by Esports Arena Bangladesh
        </div>
      </div>
    );
  }

  // FOOTER STYLE 4
  if (normalizedType === 'Footer style 4') {
    return (
      <div className={`w-full h-full bg-slate-900 rounded-lg p-2 text-slate-300 flex items-center justify-center select-none ${className}`}>
        <div className="bg-slate-800 rounded-full px-4 py-1 text-[6px] flex items-center gap-3">
          <span>© 2026 Store</span>
          <span>•</span>
          <span className="hover:text-white">Privacy</span>
          <span>•</span>
          <span className="hover:text-white">Terms</span>
        </div>
      </div>
    );
  }

  // DEFAULT FALLBACK PREVIEW
  return (
    <div className={`w-full h-full bg-slate-100 rounded-lg p-2 flex flex-col justify-center items-center text-slate-700 select-none ${className}`}>
      <span className="text-[9px] font-bold uppercase">{type}</span>
      <span className="text-[6px] text-slate-400 mt-0.5">Template Preview Section</span>
    </div>
  );
}
