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

export default function HeaderStyle1({
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

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

          {/* Search Bar (PiPO BaZaR Style: Green rounded border with solid green button) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="flex w-full border-2 border-[#20947c] rounded-xl overflow-hidden bg-white shadow-2xs">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                className="w-full px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              <button 
                type="submit" 
                className="bg-[#20947c] hover:bg-[#1a7d68] text-white font-extrabold text-sm px-6 py-2 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Search size={16} />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Right Navigation & User Actions */}
          <div className="flex items-center gap-3">
            
            {/* User Profile / Login Capsule */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 border border-slate-200 rounded-full py-1.5 px-3 bg-white hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-900 text-white flex items-center justify-center font-bold text-xs overflow-hidden border border-slate-200">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name ? user.name[0].toUpperCase() : 'U'
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-800 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 font-mono bg-emerald-50 px-1.5 py-0.5 rounded">
                    ৳{user.walletBalance || 0}
                  </span>
                  <ChevronDown size={14} className="text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.number || user.email}</p>
                    </div>
                    <button
                      onClick={() => { onNavigate('/user/dashboard'); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <UserIcon size={14} /> My Profile
                    </button>
                    <button
                      onClick={() => { onNavigate('/user/dashboard/orders'); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <Wallet size={14} /> Orders & Deposit
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => { onNavigate('/admin/dashboard'); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-[#20947c] hover:bg-emerald-50 font-bold flex items-center gap-2 border-t border-slate-100"
                      >
                        <ShieldCheck size={14} /> Admin Panel
                      </button>
                    )}
                    <button
                      onClick={() => { onLogout(); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium border-t border-slate-100"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="text-xs font-bold text-white bg-[#20947c] hover:bg-[#187561] px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
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
            <form onSubmit={handleSearchSubmit} className="flex border-2 border-[#20947c] rounded-xl overflow-hidden bg-white">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                className="w-full px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
              <button type="submit" className="bg-[#20947c] text-white px-4 font-bold text-xs">
                Search
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
