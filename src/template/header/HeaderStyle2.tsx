import React, { useState } from 'react';
import { SiteConfig, User } from '../../types';
import { 
  Search, User as UserIcon, LogOut, 
  Wallet, ShieldCheck, Gamepad2, ChevronDown, Menu, X
} from 'lucide-react';
import fsBazarLogo from '../../assets/images/fs_bazar_logo.png';

interface HeaderStyleProps {
  config: SiteConfig;
  user: User | null;
  cartCount?: number;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenCart?: () => void;
  onNavigate: (path: string) => void;
  onSearch: (query: string) => void;
  onLogout: () => void;
}

export default function HeaderStyle2({
  config,
  user,
  onOpenAuth,
  onNavigate,
  onSearch,
  onLogout
}: HeaderStyleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Main website logo component
  const renderMainLogo = () => {
    const logoSrc = config.logoUrl || fsBazarLogo;
    return (
      <img 
        src={logoSrc} 
        alt={config.siteName || "Logo"} 
        className="h-10 w-auto max-w-[200px] object-contain cursor-pointer" 
        onClick={() => onNavigate('/')}
      />
    );
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Main Website Logo */}
          <div 
            onClick={() => onNavigate('/')}
            className="cursor-pointer shrink-0 hover:opacity-90 transition-opacity"
          >
            {renderMainLogo()}
          </div>

          {/* Capsule Search Bar (RRR BAZAR Style) */}
          <form 
            onSubmit={(e) => { e.preventDefault(); onSearch(searchQuery); }} 
            className="hidden md:flex flex-1 max-w-lg mx-6"
          >
            <div className="flex w-full border border-slate-200 rounded-full overflow-hidden bg-white shadow-2xs focus-within:border-blue-700 transition-all">
              <input
                type="text"
                placeholder="Search games and packages..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                className="w-full px-5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              <button 
                type="submit" 
                className="bg-gradient-to-r from-blue-800 to-indigo-950 hover:from-blue-900 hover:to-indigo-900 text-white font-extrabold text-xs px-8 py-2.5 rounded-r-full transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Search size={14} />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Login / Profile Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-800 to-indigo-950 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:shadow-md transition-all"
                >
                  <UserIcon size={14} />
                  <span>{user.name}</span>
                  <span className="bg-blue-950 text-blue-200 px-1.5 py-0.5 rounded text-[10px] font-mono">
                    ৳{user.walletBalance || 0}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs">
                    <button
                      onClick={() => { onNavigate('/user/dashboard'); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                    >
                      <UserIcon size={14} /> Profile Dashboard
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => { onNavigate('/admin/dashboard'); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-blue-700 hover:bg-blue-50 font-bold flex items-center gap-2 border-t border-slate-100"
                      >
                        <ShieldCheck size={14} /> Admin Panel
                      </button>
                    )}
                    <button
                      onClick={() => { onLogout(); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 border-t border-slate-100"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs font-black text-white bg-gradient-to-r from-blue-800 to-indigo-950 hover:from-blue-900 hover:to-indigo-900 px-7 py-2.5 rounded-xl shadow-md cursor-pointer transition-all uppercase tracking-wider"
              >
                Login
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>

        {/* Mobile Search Input */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-slate-100 space-y-3">
            <form onSubmit={(e) => { e.preventDefault(); onSearch(searchQuery); }} className="flex border border-slate-200 rounded-full overflow-hidden bg-white">
              <input
                type="text"
                placeholder="Search games and packages..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                className="w-full px-4 py-2 text-xs text-slate-800 focus:outline-none"
              />
              <button type="submit" className="bg-blue-800 text-white px-4 font-bold text-xs">
                Search
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
