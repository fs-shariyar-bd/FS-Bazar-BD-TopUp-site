import React from 'react';
import { Home, Bookmark, LayoutGrid, List, Wallet, Info, LogOut } from 'lucide-react';
import { User, SiteConfig } from '../../../types';
import { motion } from 'motion/react';

interface AccountSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onLogout: () => void;
  onNavigateTab: (tab: 'profile' | 'deposit' | 'orders' | 'deposits_log') => void;
  onContactClick: () => void;
}

export default function AccountSidebar({
  isOpen,
  onClose,
  user,
  onLogout,
  onNavigateTab,
  onContactClick
}: AccountSidebarProps) {
  if (!isOpen) return null;

  // Find initials or first name for short display
  const displayName = user.name.length > 15 ? user.name.substring(0, 14) + '...' : user.name;

  // Standard avatar or default fallback matching user profile beach
  const avatarUrl = user.avatar || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=60';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Click outside Overlay */}
      <div 
        id="sidebar-overlay"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <motion.div
          id="account-sidebar-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="w-80 max-w-md bg-white border-l border-slate-100 shadow-[0_0_30px_rgba(0,0,0,0.08)] flex flex-col justify-between"
        >
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            
            {/* Header User profile block matching Image 1 exactly */}
            <div className="p-6 border-b border-slate-100 flex gap-4 items-start bg-white">
              {/* Profile Image (Beach sunset or user customized) */}
              <img 
                src={avatarUrl} 
                alt={user.name} 
                className="w-14 h-14 object-cover border border-slate-200 rounded-[2px]" 
                referrerPolicy="no-referrer"
              />
              
              <div className="flex flex-col text-left space-y-1.5 min-w-0">
                <h3 className="font-extrabold text-slate-900 text-sm leading-tight tracking-tight truncate">
                  Hi, {displayName}
                </h3>
                <span className="text-[11px] text-slate-500 font-medium block truncate" title={user.email}>
                  {user.email}
                </span>

                {/* Purple Logout Button */}
                <button
                  id="sidebar-logout-btn"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="mt-1 flex items-center justify-center gap-1.5 bg-[#6100c1] hover:bg-[#5000a3] text-white font-bold text-xs py-1.5 px-3 rounded-[2px] transition-colors w-max cursor-pointer"
                >
                  <LogOut size={12} className="stroke-[2.5]" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Menu Items matching Image 1 */}
            <div className="p-4 space-y-1">
              {/* My Account */}
              <button
                id="sidebar-menu-account"
                onClick={() => {
                  onNavigateTab('profile');
                  onClose();
                }}
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-slate-50 text-slate-800 hover:text-[#20947c] rounded-[2px] transition-colors text-left font-serif font-extrabold text-[15px]"
              >
                <Home size={18} className="text-slate-700 shrink-0" />
                <span>My Account</span>
              </button>

              {/* My Orders */}
              <button
                id="sidebar-menu-orders"
                onClick={() => {
                  onNavigateTab('orders');
                  onClose();
                }}
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-slate-50 text-slate-800 hover:text-[#20947c] rounded-[2px] transition-colors text-left font-serif font-extrabold text-[15px]"
              >
                <Bookmark size={18} className="text-slate-700 shrink-0" />
                <span>My Orders</span>
              </button>

              {/* My Codes */}
              <button
                id="sidebar-menu-codes"
                onClick={() => {
                  onNavigateTab('orders'); // maps to orders where delivered digital codes are listed
                  onClose();
                }}
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-slate-50 text-slate-800 hover:text-[#20947c] rounded-[2px] transition-colors text-left font-serif font-extrabold text-[15px]"
              >
                <LayoutGrid size={18} className="text-slate-700 shrink-0" />
                <span>My Codes</span>
              </button>

              {/* My Transaction */}
              <button
                id="sidebar-menu-transactions"
                onClick={() => {
                  onNavigateTab('deposits_log');
                  onClose();
                }}
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-slate-50 text-slate-800 hover:text-[#20947c] rounded-[2px] transition-colors text-left font-serif font-extrabold text-[15px]"
              >
                <List size={18} className="text-slate-700 shrink-0" />
                <span>My Transaction</span>
              </button>

              {/* Add Money */}
              <button
                id="sidebar-menu-addmoney"
                onClick={() => {
                  onNavigateTab('deposit');
                  onClose();
                }}
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-slate-50 text-slate-800 hover:text-[#20947c] rounded-[2px] transition-colors text-left font-serif font-extrabold text-[15px]"
              >
                <Wallet size={18} className="text-slate-700 shrink-0" />
                <span>Add Money</span>
              </button>

              {/* Contact Us */}
              <button
                id="sidebar-menu-contact"
                onClick={() => {
                  onContactClick();
                  onClose();
                }}
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-slate-50 text-slate-800 hover:text-[#20947c] rounded-[2px] transition-colors text-left font-serif font-extrabold text-[15px]"
              >
                <Info size={18} className="text-slate-700 shrink-0" />
                <span>Contact Us</span>
              </button>
            </div>

          </div>

          {/* Close Sidebar button in bottom footer wrapper */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
            <button
              id="sidebar-footer-close"
              onClick={onClose}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-1.5 hover:bg-slate-100 rounded-[2px] transition-all cursor-pointer"
            >
              Close Drawer
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
