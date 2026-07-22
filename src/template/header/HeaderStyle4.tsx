import React, { useState } from 'react';
import { SiteConfig, User } from '../../types';
import { 
  User as UserIcon, LogOut, 
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

export default function HeaderStyle4({
  config,
  user,
  onOpenAuth,
  onNavigate,
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

          {/* Right Navigation & Vibrant Green Login Button (UC Ghor Style) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-[#0B2545]">
            <button 
              onClick={() => onNavigate('/')} 
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Topup
            </button>
            <button 
              onClick={() => onNavigate('/contact')} 
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Contact Us
            </button>

            {/* UC Ghor Signature Solid Green Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-[#00E640] hover:bg-[#00c838] text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer"
                >
                  <UserIcon size={15} />
                  <span>{user.name}</span>
                  <span className="bg-slate-950 text-white px-1.5 py-0.5 rounded text-[10px] font-mono">
                    ৳{user.walletBalance || 0}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs text-slate-800">
                    <button
                      onClick={() => { onNavigate('/user/dashboard'); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserIcon size={14} /> My Profile
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => { onNavigate('/admin/dashboard'); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-emerald-700 hover:bg-emerald-50 font-bold flex items-center gap-2 border-t border-slate-100"
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
                className="bg-[#00E640] hover:bg-[#00c838] text-slate-950 font-extrabold text-sm px-8 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-800"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-slate-100 space-y-2">
            <button onClick={() => { onNavigate('/'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 font-bold text-slate-800">
              Topup
            </button>
            <button onClick={() => { onNavigate('/contact'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 font-bold text-slate-800">
              Contact Us
            </button>
            {!user && (
              <button onClick={() => { onOpenAuth('login'); setIsMobileMenuOpen(false); }} className="w-full bg-[#00E640] text-slate-950 font-extrabold py-2.5 rounded-xl text-xs mt-2">
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
