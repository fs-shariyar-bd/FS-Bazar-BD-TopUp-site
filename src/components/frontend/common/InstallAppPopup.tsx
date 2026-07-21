import React from 'react';
import { Download, X } from 'lucide-react';
import { motion } from 'motion/react';

interface InstallAppPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall?: () => void;
}

export default function InstallAppPopup({ isOpen, onClose, onInstall }: InstallAppPopupProps) {
  if (!isOpen) return null;

  const handleInstallClick = () => {
    if (onInstall) {
      onInstall();
    } else {
      // Simulate successful installation
      alert("Installing Pipobazar Progressive Web App (PWA) onto your home screen...");
    }
  };

  return (
    <motion.div
      id="install-app-popup-container"
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-[310px] bg-[#022438] text-white p-5 rounded-[4px] shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/5 space-y-4"
    >
      {/* Title & Close */}
      <div className="flex items-center justify-between">
        <h4 className="text-base font-bold text-white tracking-wide">Install App</h4>
        <button
          id="btn-close-install-popup"
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors cursor-pointer"
          title="Dismiss"
        >
          <X size={15} className="stroke-[2.5]" />
        </button>
      </div>

      {/* Subtext description matching image exactly */}
      <p className="text-xs text-slate-200/90 leading-normal font-medium text-left">
        Install our app for a better experience
      </p>

      {/* Install Button matching Image exactly */}
      <button
        id="btn-confirm-install-popup"
        onClick={handleInstallClick}
        className="w-full bg-white hover:bg-slate-50 text-[#022438] font-bold text-xs py-2.5 rounded-[4px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
      >
        <Download size={14} className="stroke-[3]" />
        <span>Install Now</span>
      </button>
    </motion.div>
  );
}
