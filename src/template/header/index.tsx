import React from 'react';
import { SiteConfig, User } from '../../types';
import HeaderStyle1 from './HeaderStyle1';
import HeaderStyle2 from './HeaderStyle2';
import HeaderStyle3 from './HeaderStyle3';
import HeaderStyle4 from './HeaderStyle4';
import HeaderStyle5 from './HeaderStyle5';
import HeaderStyle6 from './HeaderStyle6';

interface HeaderProps {
  config: SiteConfig;
  user: User | null;
  cartCount?: number;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
  onOpenCart?: () => void;
  onNavigate?: (path: string) => void;
  onSearch?: (query: string) => void;
  onLogout?: () => void;
}

export default function DynamicHeader(props: HeaderProps) {
  const handleOpenAuth = props.onOpenAuth || props.onOpenAuthModal || (() => {});
  const handleOpenCart = props.onOpenCart || (() => {});
  const handleNavigate = props.onNavigate || (() => {});
  const handleSearch = props.onSearch || (() => {});
  const handleLogout = props.onLogout || (() => {});
  const cartCount = props.cartCount || 0;

  const headerProps = {
    ...props,
    cartCount,
    onOpenAuth: handleOpenAuth,
    onOpenCart: handleOpenCart,
    onNavigate: handleNavigate,
    onSearch: handleSearch,
    onLogout: handleLogout
  };

  const activeHeader = (props.config?.activeHeaderTemplate || 'style-1') as string;

  if (activeHeader === 'style-2' || activeHeader === 'Header style 2' || activeHeader === 'cyberpunk') {
    return <HeaderStyle2 {...headerProps} />;
  }

  if (activeHeader === 'style-3' || activeHeader === 'Header style 3' || activeHeader === 'esports') {
    return <HeaderStyle3 {...headerProps} />;
  }

  if (activeHeader === 'style-4' || activeHeader === 'Header style 4' || activeHeader === 'minimal') {
    return <HeaderStyle4 {...headerProps} />;
  }

  if (activeHeader === 'style-5' || activeHeader === 'Header style 5') {
    return <HeaderStyle5 {...headerProps} />;
  }

  if (activeHeader === 'style-6' || activeHeader === 'Header style 6') {
    return <HeaderStyle6 {...headerProps} />;
  }

  return <HeaderStyle1 {...headerProps} />;
}
