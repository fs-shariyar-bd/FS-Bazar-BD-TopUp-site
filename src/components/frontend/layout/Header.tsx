import React, { useState } from 'react';
import { Search, User, Wallet, LogOut, LayoutDashboard, Settings, Compass, PhoneCall } from 'lucide-react';
import { User as UserType, SiteConfig } from '../../../types';

const siteLogo = '/src/assets/images/fs_bazar_logo.png';

interface MobileHeaderProps {
  user: UserType | null;
  onNavigate: (page: 'home' | 'user' | 'admin') => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
}

function MobileHeader({ user, onNavigate, onOpenAuthModal }: MobileHeaderProps) {
  const defaultAvatar = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=60';
  
  return (
    <header className="block md:hidden w-full bg-gradient-to-r from-[#ece9fc]/90 via-[#f5f3ff]/95 to-[#ebeeff]/90 backdrop-blur-md border-b border-purple-200/40 sticky top-0 z-50 px-4 py-3 shadow-xs">
      <div className="flex items-center justify-between">
        {/* Brand Logo - TB Topup Bazar */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-1.5 cursor-pointer select-none active:scale-98 transition-all"
        >
          {/* Crown + Shield group */}
          <div className="relative flex flex-col items-center">
            {/* Crown */}
            <div className="text-[#5e17eb] -mb-[3px] z-10">
              <svg className="w-5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M2 22h20v-2H2v2zm1-3l3-12 4 4 4-8 4 8 4-4 3 12H3z" />
              </svg>
            </div>
            {/* Shield with TB */}
            <div 
              className="relative w-8 h-8 bg-gradient-to-b from-[#7c3aed] to-[#5b21b6] flex items-center justify-center shadow-md shadow-purple-500/10 border border-purple-400/20" 
              style={{ 
                clipPath: 'polygon(50% 0%, 100% 22%, 100% 78%, 50% 100%, 0% 78%, 0% 22%)',
                borderRadius: '0 0 4px 4px'
              }}
            >
              <span className="text-white font-sans font-black text-[10px] tracking-tight">TB</span>
            </div>
          </div>
          
          {/* Logo text side */}
          <div className="flex flex-col items-start leading-none mt-1">
            <div className="bg-[#5e17eb] text-white px-1 py-0.5 rounded-xs text-[7px] font-black tracking-wider uppercase">
              TOPUP
            </div>
            <div className="text-xs font-black text-slate-900 tracking-widest mt-0.5">
              BAZAR
            </div>
          </div>
        </div>

        {/* Right side: Wallet & User profile */}
        <div className="flex items-center gap-2.5">
          {/* Wallet pill button */}
          <div 
            onClick={() => {
              if (user) {
                onNavigate('user');
              } else {
                onOpenAuthModal('login');
              }
            }}
            className="bg-[#5e17eb] hover:bg-[#4d0fd2] active:scale-95 text-white rounded-full px-3.5 py-1.5 flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-purple-600/20 border border-purple-400/10"
          >
            <Wallet size={13} className="text-white stroke-[2.5]" />
            <span className="text-xs font-black tracking-wide font-mono">
              {user ? user.walletBalance : 0}৳
            </span>
          </div>

          {/* User profile avatar */}
          <button
            onClick={() => {
              if (user) {
                onNavigate('user');
              } else {
                onOpenAuthModal('login');
              }
            }}
            className="relative focus:outline-none active:scale-95 transition-all"
          >
            <img 
              src={user?.avatar || defaultAvatar} 
              alt="User profile" 
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md shadow-purple-200"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

interface HeaderProps {
  user: UserType | null;
  config: SiteConfig;
  onLogout: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onNavigate: (page: 'home' | 'user' | 'admin') => void;
  onSearch: (query: string) => void;
}

export default function Header({ user, config, onLogout, onOpenAuthModal, onNavigate, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch(val);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  // Helper theme color classes mapping
  const colorMap = {
    emerald: { bg: 'bg-emerald-600 hover:bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500', accent: 'emerald' },
    cyan: { bg: 'bg-cyan-600 hover:bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500', accent: 'cyan' },
    violet: { bg: 'bg-violet-600 hover:bg-violet-500', text: 'text-violet-400', border: 'border-violet-500', accent: 'violet' },
    amber: { bg: 'bg-amber-500 hover:bg-amber-400', text: 'text-amber-400', border: 'border-amber-500', accent: 'amber' },
    rose: { bg: 'bg-rose-600 hover:bg-rose-500', text: 'text-rose-400', border: 'border-rose-500', accent: 'rose' },
    slate: { bg: 'bg-slate-700 hover:bg-slate-600', text: 'text-slate-300', border: 'border-slate-500', accent: 'slate' }
  };

  const currentColors = colorMap[config.themeColor || 'emerald'];

  // 1. CLASSIC HEADER (Resembles Pipo Bazar exactly)
  if (config.activeHeaderTemplate === 'classic') {
    return (
      <>
        <header id="header-classic" className="hidden md:block w-full bg-white border-b border-slate-200/80 shadow-xs">
        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Logo */}
          <div 
            id="classic-logo"
            onClick={() => onNavigate('home')} 
            className="flex items-center cursor-pointer select-none shrink-0 group"
          >
            <img 
              src={siteLogo} 
              alt="FS Bazar BD Logo" 
              className="h-12 md:h-16 w-auto object-contain group-hover:scale-102 transition-all duration-300" 
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:flex w-full md:max-w-xl gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 focus-within:border-[#20947c] focus-within:bg-white transition-all">
            <div className="flex items-center pl-3 text-slate-400">
              <Search size={18} />
            </div>
            <input
              id="input-classic-search"
              type="text"
              placeholder="FF Diamonds, PUBG UC, CoC Gold Pass..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-transparent border-none py-1.5 px-2 text-slate-800 placeholder-slate-400 text-sm focus:outline-none font-medium"
            />
            <button
              id="btn-classic-search"
              type="submit"
              className="bg-[#20947c] hover:bg-[#16705d] text-white font-extrabold text-xs px-5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Auth & Profile */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Wallet balance */}
                <div 
                  id="wallet-trigger"
                  onClick={() => onNavigate('user')}
                  className="flex items-center gap-2 bg-emerald-50/60 hover:bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 cursor-pointer group transition-all"
                >
                  <Wallet size={16} className="text-[#20947c] group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-black text-slate-700">৳ {user.walletBalance} BDT</span>
                </div>

                {/* Dashboard / Navigation */}
                {user.role === 'admin' && (
                  <button 
                    id="btn-navigate-admin"
                    onClick={() => onNavigate('admin')}
                    className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer mr-1"
                  >
                    <LayoutDashboard size={13} className="stroke-[2.5]" />
                    <span className="hidden sm:inline">Admin</span>
                  </button>
                )}

                <button 
                  id="btn-navigate-user"
                  onClick={() => onNavigate('user')}
                  className="flex items-center gap-2.5 bg-white border border-slate-200/85 rounded-full pl-1.5 pr-4.5 py-1.5 hover:bg-slate-50/80 transition-all cursor-pointer shadow-xs select-none"
                >
                  <img 
                    src={user.avatar || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=60'} 
                    alt="User Profile" 
                    className="w-8 h-8 rounded-full object-cover border border-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-sm font-bold text-slate-700 tracking-tight max-w-[150px] truncate">
                    {user.name}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <button
                  id="btn-classic-login"
                  onClick={() => onOpenAuthModal('login')}
                  className="text-slate-600 hover:text-slate-800 border border-slate-200 px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  id="btn-classic-register"
                  onClick={() => onOpenAuthModal('register')}
                  className="bg-[#20947c] hover:bg-[#16705d] text-white px-4 py-2 rounded-xl font-extrabold transition-colors cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <MobileHeader user={user} onNavigate={onNavigate} onOpenAuthModal={onOpenAuthModal} />
    </>
    );
  }

  // 2. MODERN HEADER (Glassmorphism, Floating layout)
  if (config.activeHeaderTemplate === 'modern') {
    return (
      <>
        <header id="header-modern" className="hidden md:block w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          {/* Brand */}
          <div onClick={() => onNavigate('home')} className="flex items-center cursor-pointer select-none shrink-0 group">
            <img 
              src={siteLogo} 
              alt="FS Bazar BD Logo" 
              className="h-10 md:h-12 w-auto object-contain group-hover:scale-102 transition-all duration-300" 
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md items-center bg-slate-900/60 rounded-full border border-slate-800/80 px-4 py-1.5 focus-within:border-slate-700 transition-all">
            <input
              id="input-modern-search"
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-transparent border-none text-xs text-slate-200 placeholder-slate-600 w-full focus:outline-none"
            />
            <Search size={14} className="text-slate-500 shrink-0 ml-1" />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div onClick={() => onNavigate('user')} className="flex items-center gap-1 text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                  <Wallet size={12} className={currentColors.text} />
                  <span>৳ {user.walletBalance}</span>
                </div>

                <div className="h-4 w-px bg-slate-800" />

                {user.role === 'admin' && (
                  <button onClick={() => onNavigate('admin')} className="text-xs font-semibold text-amber-400 flex items-center gap-1 hover:text-amber-300">
                    <Settings size={14} /> Admin
                  </button>
                )}

                <button 
                  onClick={() => onNavigate('user')} 
                  className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 rounded-full pl-1 pr-3.5 py-1 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <img 
                    src={user.avatar || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=60'} 
                    alt="User Profile" 
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <span className="truncate max-w-[120px]">{user.name}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => onOpenAuthModal('login')} className="text-xs text-slate-400 hover:text-white font-medium">
                  Sign In
                </button>
                <button onClick={() => onOpenAuthModal('register')} className={`${currentColors.bg} text-xs font-bold text-white px-4 py-1.5 rounded-full shadow-md`}>
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <MobileHeader user={user} onNavigate={onNavigate} onOpenAuthModal={onOpenAuthModal} />
    </>
    );
  }

  // 3. MINIMAL HEADER (Spacious White/Slate Style, centered nav)
  if (config.activeHeaderTemplate === 'minimal') {
    return (
      <>
        <header id="header-minimal" className="hidden md:block w-full border-b border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div onClick={() => onNavigate('home')} className="cursor-pointer flex items-center select-none shrink-0 group">
            <img 
              src={siteLogo} 
              alt="FS Bazar BD Logo" 
              className="h-10 md:h-12 w-auto object-contain group-hover:scale-102 transition-all duration-300" 
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('home')} className="text-xs tracking-wider font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
              <Compass size={14} /> SHOP
            </button>

            {user ? (
              <>
                <button onClick={() => onNavigate('user')} className="text-xs tracking-wider font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
                  <Wallet size={14} /> ৳ {user.walletBalance}
                </button>
                {user.role === 'admin' && (
                  <button onClick={() => onNavigate('admin')} className="text-xs tracking-wider font-bold text-amber-400 hover:text-amber-300">
                    CONTROL
                  </button>
                )}
                <button 
                  onClick={() => onNavigate('user')} 
                  className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer bg-slate-900 border border-slate-800 rounded-full pl-1 pr-3 py-1"
                >
                  <img 
                    src={user.avatar || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=60'} 
                    alt="User Profile" 
                    className="w-5 h-5 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <span className="truncate max-w-[100px]">{user.name}</span>
                </button>
              </>
            ) : (
              <div className="flex gap-4">
                <button onClick={() => onOpenAuthModal('login')} className="text-xs font-medium tracking-wider text-slate-400 hover:text-white uppercase">
                  Log In
                </button>
                <button onClick={() => onOpenAuthModal('register')} className="text-xs font-bold tracking-wider text-emerald-400 hover:text-emerald-300 uppercase">
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <MobileHeader user={user} onNavigate={onNavigate} onOpenAuthModal={onOpenAuthModal} />
    </>
    );
  }

  // 4. GLOWING HEADER (Dark Gaming look with Cyan/Violet Neon Border Glow)
  const neonColor = config.themeColor === 'emerald' ? 'shadow-[0_0_15px_rgba(16,185,129,0.3)] border-emerald-500' :
                    config.themeColor === 'cyan' ? 'shadow-[0_0_15px_rgba(6,182,212,0.3)] border-cyan-500' :
                    config.themeColor === 'violet' ? 'shadow-[0_0_15px_rgba(139,92,246,0.3)] border-violet-500' :
                    'shadow-[0_0_15px_rgba(245,158,11,0.3)] border-amber-500';

  return (
    <>
      <header id="header-glowing" className={`hidden md:block w-full bg-slate-950 border-b-2 ${neonColor} py-4`}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center gap-4">
        {/* Glowing Logo */}
        <div onClick={() => onNavigate('home')} className="flex items-center cursor-pointer select-none shrink-0 group">
          <img 
            src={siteLogo} 
            alt="FS Bazar BD Logo" 
            className="h-10 md:h-12 w-auto object-contain group-hover:scale-102 transition-all duration-300 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" 
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Dynamic Nav Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div onClick={() => onNavigate('user')} className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-2 cursor-pointer hover:border-cyan-500 transition-colors">
                <Wallet size={14} className="text-cyan-400" />
                <span className="text-xs font-bold text-white font-mono">৳ {user.walletBalance} BDT</span>
              </div>
              {user.role === 'admin' && (
                <button onClick={() => onNavigate('admin')} className="text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-2 rounded-lg font-mono uppercase tracking-wider">
                  PANEL
                </button>
              )}
              <button 
                onClick={() => onNavigate('user')} 
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-full pl-1 pr-3.5 py-1 text-xs font-bold font-mono text-white transition-all cursor-pointer"
              >
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=60'} 
                  alt="User Profile" 
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <span className="truncate max-w-[100px]">{user.name}</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => onOpenAuthModal('login')} className="bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 px-4 py-2 rounded-lg text-xs font-bold font-mono">
                SIGN_IN
              </button>
              <button onClick={() => onOpenAuthModal('register')} className="bg-cyan-500 text-black hover:bg-cyan-400 px-4 py-2 rounded-lg text-xs font-black font-mono">
                JOIN_NOW
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
    <MobileHeader user={user} onNavigate={onNavigate} onOpenAuthModal={onOpenAuthModal} />
  </>
  );
}
