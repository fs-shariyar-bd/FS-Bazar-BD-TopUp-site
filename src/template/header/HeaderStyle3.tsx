import React, { useState } from 'react';
import { SiteConfig, User } from '../../types';
import { 
  User as UserIcon, LogOut, 
  Wallet, ShieldCheck, Gamepad2, ChevronDown, Menu, X, Phone
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

export default function HeaderStyle3({
  config,
  user,
  onOpenAuth,
  onNavigate,
  onSearch,
  onLogout
}: HeaderStyleProps) {
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

          {/* Right Navigation Items (TopUpBuzz Style) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-[#0B2545]">
            <button 
              onClick={() => onNavigate('/')} 
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              Topup
            </button>
            <button 
              onClick={() => onNavigate('/contact')} 
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              Contact Us
            </button>

            {/* Wallet & Avatar Pill (TopUpBuzz Signature Style) */}
            {user ? (
              <div className="relative flex items-center gap-2">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-[#0B2545] hover:bg-[#07192f] text-white px-4 py-2 rounded-full font-bold text-xs transition-all shadow-sm cursor-pointer"
                >
                  <Wallet size={15} />
                  <span>{user.walletBalance || 0} ৳</span>
                </button>

                {/* Circular Avatar */}
                <div 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-9 h-9 rounded-full bg-indigo-900 border-2 border-[#0B2545] overflow-hidden cursor-pointer hover:scale-105 transition-transform flex items-center justify-center text-white font-bold text-xs shadow-2xs"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name ? user.name[0].toUpperCase() : 'U'
                  )}
                </div>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs text-slate-800">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-[#0B2545] truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.number || user.email}</p>
                    </div>
                    <button
                      onClick={() => { onNavigate('/user/dashboard'); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserIcon size={14} /> My Profile
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => { onNavigate('/admin/dashboard'); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-rose-700 hover:bg-rose-50 font-bold flex items-center gap-2 border-t border-slate-100"
                      >
                        <ShieldCheck size={14} /> Admin Panel
                      </button>
                    )}
                    <button
                      onClick={() => { onLogout(); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="bg-[#0B2545] hover:bg-[#07192f] text-white px-6 py-2.5 rounded-full text-xs font-black transition-all shadow-md cursor-pointer"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#0B2545]"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-slate-100 space-y-2">
            <button onClick={() => { onNavigate('/'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 font-bold text-[#0B2545]">
              Topup
            </button>
            <button onClick={() => { onNavigate('/contact'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 font-bold text-[#0B2545]">
              Contact Us
            </button>
            {!user && (
              <button onClick={() => { onOpenAuth('login'); setIsMobileMenuOpen(false); }} className="w-full bg-[#0B2545] text-white py-2 rounded-xl font-bold text-xs mt-2">
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
