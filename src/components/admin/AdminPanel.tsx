import React, { useState, useEffect } from 'react';
import { Game, Order, Transaction, SiteConfig, TopupOption, Banner } from '../../types';
import TemplateManagerTable from './TemplateManagerTable';
import { 
  LayoutDashboard, ShoppingCart, Plus, Sparkles, AlertTriangle, Eye, RefreshCw, 
  Layers, ShieldCheck, Gamepad2, Settings, Image, Trash2, CheckCircle2, XCircle, 
  ArrowUpRight, HelpCircle, Save, Sliders, ChevronDown, Lock, Wallet, Users, 
  TrendingUp, LogOut, Menu, Moon, Sun, Bell, Play, Film, CreditCard, MoreVertical, 
  Activity, User as UserIcon
} from 'lucide-react';

interface AdminPanelProps {
  games: Game[];
  config: SiteConfig;
  onRefreshGames: () => void;
  onRefreshConfig: (updatedConfig: SiteConfig) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
  adminPath: 'login' | 'dashboard';
  onNavigate: (path: string) => void;
}

export default function AdminPanel({ games, config, onRefreshGames, onRefreshConfig, showToast, adminPath, onNavigate }: AdminPanelProps) {
  // Passcode Security state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('admin_logged_in') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // Redirect based on routing path and login status
  useEffect(() => {
    if (adminPath === 'dashboard' && !isAdminLoggedIn) {
      onNavigate('/admin/191869-login');
    } else if (adminPath === 'login' && isAdminLoggedIn) {
      onNavigate('/admin/dashboard');
    }
  }, [adminPath, isAdminLoggedIn]);

  // Tab and UI states
  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'inventory' | 'customizer' | 'banners' | 'profile'>('stats');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const [adminName, setAdminName] = useState(() => {
    return localStorage.getItem('admin_name') || 'Super Admin';
  });
  const [adminPasscode, setAdminPasscode] = useState(() => {
    return localStorage.getItem('admin_passcode') || '191869';
  });
  const [notifications, setNotifications] = useState([
    { id: '1', text: 'New wallet refill request: ৳ 500 BDT', time: '5 mins ago', read: false },
    { id: '2', text: 'New game order submitted: PUBG Mobile 660 UC', time: '12 mins ago', read: false },
    { id: '3', text: 'System secure firewall initialized successfully', time: '1 hour ago', read: true },
    { id: '4', text: 'Weekly revenue target 94% achieved', time: '1 day ago', read: true }
  ]);

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Selection / Editing States
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  
  // Customizer state
  const [siteName, setSiteName] = useState(config.siteName);
  const [siteSlogan, setSiteSlogan] = useState(config.siteSlogan);
  const [activeHeader, setActiveHeader] = useState(config.activeHeaderTemplate);
  const [activeFooter, setActiveFooter] = useState(config.activeFooterTemplate || 'style-1');
  const [activeCard, setActiveCard] = useState(config.activeCardTemplate);
  const [themeColor, setThemeColor] = useState(config.themeColor);
  const [activeWebsiteTemplate, setActiveWebsiteTemplate] = useState<'classic' | 'cyberpunk' | 'esports' | 'retro'>(config.activeWebsiteTemplate || 'classic');
  const [supportPhone, setSupportPhone] = useState(config.supportPhone);
  const [supportWhatsApp, setSupportWhatsApp] = useState(config.supportWhatsApp);
  const [announcementText, setAnnouncementText] = useState(config.announcementText);

  // New customizable fields (Widgets & Sections)
  const [showLiveActivity, setShowLiveActivity] = useState(config.showLiveActivity !== false);
  const [showStatsCounter, setShowStatsCounter] = useState(config.showStatsCounter !== false);
  const [showNoticeBanner, setShowNoticeBanner] = useState(config.showNoticeBanner !== false);
  const [sectionHomeTitle, setSectionHomeTitle] = useState(config.sectionHomeTitle || "FS Bazar Store");
  const [supportEmail, setSupportEmail] = useState(config.supportEmail || "pipobazarofficial@gmail.com");
  const [footerCopyright, setFooterCopyright] = useState(config.footerCopyright || "© 2026 Pipo Bazar BD. All Rights Reserved.");

  // Dropdown states for sidebar website customizer
  const [isCustomizerDropdownOpen, setIsCustomizerDropdownOpen] = useState(true);
  const [customizerSubTab, setCustomizerSubTab] = useState<'template' | 'widgets' | 'sections'>('template');

  // Helper for admin subpath routing
  const navigateAdminTab = (tab: 'stats' | 'orders' | 'inventory' | 'customizer' | 'banners' | 'profile', subtab?: 'template' | 'widgets' | 'sections') => {
    setActiveTab(tab);
    if (subtab) {
      setCustomizerSubTab(subtab);
    }
    
    let path = '/admin/dashboard';
    if (tab === 'orders') path = '/admin/dashboard/orders';
    else if (tab === 'inventory') path = '/admin/dashboard/inventory';
    else if (tab === 'banners') path = '/admin/dashboard/banners';
    else if (tab === 'profile') path = '/admin/dashboard/profile';
    else if (tab === 'customizer') {
      const activeSub = subtab || customizerSubTab || 'template';
      path = `/admin/dashboard/customizer/${activeSub}`;
    }
    onNavigate(path);
  };

  // Sync state from URL path on mount/update
  useEffect(() => {
    if (!isAdminLoggedIn) return;
    const path = window.location.pathname;
    if (path.includes('/customizer/templates') || path.includes('/customizer/template')) {
      setActiveTab('customizer');
      setCustomizerSubTab('template');
    } else if (path.includes('/customizer/widgets')) {
      setActiveTab('customizer');
      setCustomizerSubTab('widgets');
    } else if (path.includes('/customizer/sections')) {
      setActiveTab('customizer');
      setCustomizerSubTab('sections');
    } else if (path.endsWith('/orders') || path.endsWith('/orders/')) {
      setActiveTab('orders');
    } else if (path.endsWith('/inventory') || path.endsWith('/inventory/')) {
      setActiveTab('inventory');
    } else if (path.endsWith('/banners') || path.endsWith('/banners/')) {
      setActiveTab('banners');
    } else if (path.endsWith('/profile') || path.endsWith('/profile/')) {
      setActiveTab('profile');
    } else if (path.endsWith('/dashboard') || path.endsWith('/dashboard/')) {
      setActiveTab('stats');
    }
  }, [adminPath, isAdminLoggedIn]);

  // New Game state
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [newGameName, setNewGameName] = useState('');
  const [newGameLogo, setNewGameLogo] = useState('');
  const [newGameCategory, setNewGameCategory] = useState<'mobile' | 'pc' | 'vouchers' | 'subscriptions'>('mobile');
  const [newGameDesc, setNewGameDesc] = useState('');
  const [newGameInputs, setNewGameInputs] = useState<Array<'playerId' | 'characterName' | 'serverId' | 'email' | 'password'>>(['playerId']);

  // Add Item option form
  const [newOptName, setNewOptName] = useState('');
  const [newOptPrice, setNewOptPrice] = useState('');
  const [newOptStock, setNewOptStock] = useState('999');

  // Slide Banner Form
  const [newBannerImage, setNewBannerImage] = useState('');
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');

  // Live Activity Stream
  const [feed, setFeed] = useState<Array<{ id: string; name: string; action: string; item: string; status: 'completed' | 'pending' | 'cancelled'; time: string }>>([]);

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAdminData();
    }
  }, [activeTab, isAdminLoggedIn]);

  useEffect(() => {
    const names = ['Sakib H.', 'Tanvir A.', 'Mim A.', 'Rakib H.', 'Nusrat J.', 'Imran K.', 'Farhana I.', 'Jahidul I.', 'Sadia R.', 'Nayeem C.'];
    const items = [
      { action: 'purchased', item: 'PUBG UC 660', status: 'completed' as const },
      { action: 'subscribed to', item: 'ChatGPT Plus', status: 'completed' as const },
      { action: 'purchased', item: 'Free Fire Diamonds', status: 'pending' as const },
      { action: 'renewed', item: 'YouTube Premium', status: 'completed' as const },
      { action: 'subscribed to', item: 'Netflix Premium', status: 'completed' as const },
      { action: 'bought', item: 'PUBG Royal Pass', status: 'pending' as const },
      { action: 'cancelled', item: 'Free Fire Top-up', status: 'cancelled' as const },
    ];

    const generateInitialFeed = () => {
      const initial = [];
      for (let i = 0; i < 5; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const it = items[Math.floor(Math.random() * items.length)];
        initial.push({
          id: Math.random().toString(36).substring(2, 9),
          name,
          ...it,
          time: 'now'
        });
      }
      setFeed(initial);
    };

    generateInitialFeed();

    const interval = setInterval(() => {
      const name = names[Math.floor(Math.random() * names.length)];
      const it = items[Math.floor(Math.random() * items.length)];
      setFeed((prev) => [
        {
          id: Math.random().toString(36).substring(2, 9),
          name,
          ...it,
          time: 'now'
        },
        ...prev.slice(0, 4)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const ordersRes = await fetch('/api/orders');
      const ordersData = await ordersRes.json();
      setOrders(ordersData.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

      const txRes = await fetch('/api/transactions');
      const txData = await txRes.json();
      setTransactions(txData.sort((a: Transaction, b: Transaction) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error("Error loading admin data", err);
    } finally {
      setLoading(false);
    }
  };

  // Stats calculators
  const stats = {
    totalSales: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.price, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    completedOrders: orders.filter(o => o.status === 'completed').length,
    cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
    totalDeposits: transactions.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    pendingDeposits: transactions.filter(t => t.type === 'deposit' && t.status === 'pending')
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === adminPasscode) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('admin_logged_in', 'true');
      showToast('Access Granted! Welcome to Store Console.', 'success');
      setPasscodeError('');
      onNavigate('/admin/dashboard');
    } else {
      setPasscodeError('DECRYPTION FAILURE: INVALID PASSCODE ACCESS KEY.');
      showToast('Incorrect passcode!', 'error');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('admin_logged_in');
    showToast('Admin logged out successfully.', 'success');
    onNavigate('/admin/191869-login');
  };

  // Approve Order / Reject Order
  const handleOrderAction = async (orderId: string, action: 'completed' | 'cancelled') => {
    try {
      const response = await fetch('/api/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: action })
      });
      if (response.ok) {
        showToast(`Order marked as ${action}!`, 'success');
        fetchAdminData();
      } else {
        showToast("Error updating order", 'error');
      }
    } catch (err) {
      showToast("Server error.", 'error');
    }
  };

  // Verify Manual Wallet Deposit
  const handleDepositAction = async (txnId: string, action: 'completed' | 'failed') => {
    try {
      const response = await fetch('/api/transactions/verify-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txnId, status: action })
      });
      if (response.ok) {
        showToast(`Transaction marked as ${action}!`, 'success');
        fetchAdminData();
      } else {
        showToast("Error verifying transaction", 'error');
      }
    } catch (err) {
      showToast("Server error.", 'error');
    }
  };

  // Update site configuration
  const handleConfigSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedConfig = {
        siteName,
        siteSlogan,
        activeHeaderTemplate: activeHeader,
        activeFooterTemplate: activeFooter,
        activeCardTemplate: activeCard,
        themeColor,
        activeWebsiteTemplate,
        supportPhone,
        supportWhatsApp,
        announcementText,
        banners: config.banners,
        showLiveActivity,
        showStatsCounter,
        showNoticeBanner,
        sectionHomeTitle,
        supportEmail,
        footerCopyright
      };
      const response = await fetch('/api/config/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: updatedConfig })
      });
      if (response.ok) {
        showToast("Site customize settings saved successfully!", 'success');
        onRefreshConfig(updatedConfig);
      } else {
        showToast("Failed to save customize configuration.", 'error');
      }
    } catch (err) {
      showToast("Server error.", 'error');
    }
  };

  // Add a new game
  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameName) {
      showToast("Game title is required.", "error");
      return;
    }
    try {
      const response = await fetch('/api/games/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newGameName,
          logo: newGameLogo,
          category: newGameCategory,
          description: newGameDesc,
          inputsRequired: newGameInputs,
          topupOptions: []
        })
      });
      if (response.ok) {
        showToast("Game inventory created! Now you can add packages.", "success");
        onRefreshGames();
        setIsAddingGame(false);
        setNewGameName('');
        setNewGameLogo('');
        setNewGameDesc('');
      } else {
        showToast("Failed to add game.", "error");
      }
    } catch (err) {
      showToast("Server error.", "error");
    }
  };

  // Add Item package option to a game
  const handleAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGame || !newOptName || !newOptPrice) {
      showToast("Option name and price are required.", "error");
      return;
    }
    const price = Number(newOptPrice);
    const stock = Number(newOptStock);

    const newOption: TopupOption = {
      id: "opt-" + Math.random().toString(36).substr(2, 9),
      name: newOptName,
      price,
      stock
    };

    const updatedOptions = [...selectedGame.topupOptions, newOption];
    const updatedGame = { ...selectedGame, topupOptions: updatedOptions };

    try {
      const response = await fetch('/api/games/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: selectedGame.id, updatedGame })
      });
      if (response.ok) {
        showToast(`Added top-up pack: ${newOptName}!`, "success");
        setSelectedGame(updatedGame);
        onRefreshGames();
        setNewOptName('');
        setNewOptPrice('');
        setNewOptStock('999');
      } else {
        showToast("Error updating game items.", "error");
      }
    } catch (err) {
      showToast("Server error.", "error");
    }
  };

  // Remove pricing package option
  const handleRemoveOption = async (optionId: string) => {
    if (!selectedGame) return;
    const updatedOptions = selectedGame.topupOptions.filter(o => o.id !== optionId);
    const updatedGame = { ...selectedGame, topupOptions: updatedOptions };

    try {
      const response = await fetch('/api/games/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: selectedGame.id, updatedGame })
      });
      if (response.ok) {
        showToast("Top-up pack removed.", "success");
        setSelectedGame(updatedGame);
        onRefreshGames();
      } else {
        showToast("Error removing item.", "error");
      }
    } catch (err) {
      showToast("Server error.", "error");
    }
  };

  // Delete entire game catalog
  const handleDeleteGame = async (gameId: string) => {
    if (!confirm("Are you sure you want to delete this entire game?")) return;
    try {
      const response = await fetch('/api/games/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId })
      });
      if (response.ok) {
        showToast("Game completely deleted from store.", "success");
        setSelectedGame(null);
        onRefreshGames();
      } else {
        showToast("Error deleting game.", "error");
      }
    } catch (err) {
      showToast("Server error.", "error");
    }
  };

  // Add Slide Banner
  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerImage || !newBannerTitle) {
      showToast("Banner Image URL and Title are required.", "error");
      return;
    }
    const newBanner: Banner = {
      id: "bann-" + Math.random().toString(36).substr(2, 9),
      imageUrl: newBannerImage,
      title: newBannerTitle,
      subtitle: newBannerSubtitle
    };

    const updatedBanners = [...config.banners, newBanner];
    const updatedConfig = { ...config, banners: updatedBanners };

    try {
      const response = await fetch('/api/config/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: updatedConfig })
      });
      if (response.ok) {
        showToast("New promotional slider slide added!", "success");
        onRefreshConfig(updatedConfig);
        setNewBannerImage('');
        setNewBannerTitle('');
        setNewBannerSubtitle('');
      } else {
        showToast("Error updating banners", "error");
      }
    } catch (err) {
      showToast("Server error", "error");
    }
  };

  // Remove Slide Banner
  const handleRemoveBanner = async (bannerId: string) => {
    const updatedBanners = config.banners.filter(b => b.id !== bannerId);
    const updatedConfig = { ...config, banners: updatedBanners };

    try {
      const response = await fetch('/api/config/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: updatedConfig })
      });
      if (response.ok) {
        showToast("Promotional banner slide removed.", "success");
        onRefreshConfig(updatedConfig);
      } else {
        showToast("Error removing banner.", "error");
      }
    } catch (err) {
      showToast("Server error.", "error");
    }
  };

  // Database seed reset
  const handleResetDB = async () => {
    if (!confirm("Reset database to clean seed values? This deletes mock orders and sets default inventory!")) return;
    try {
      const response = await fetch('/api/admin/reset-db', { method: 'POST' });
      if (response.ok) {
        showToast("Database seeded successfully! Page refreshing...", "success");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      showToast("Error seeding db", "error");
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const toggleInputsSelection = (inputKey: 'playerId' | 'characterName' | 'serverId' | 'email' | 'password') => {
    if (newGameInputs.includes(inputKey)) {
      setNewGameInputs(newGameInputs.filter(item => item !== inputKey));
    } else {
      setNewGameInputs([...newGameInputs, inputKey]);
    }
  };

  if (!isAdminLoggedIn || adminPath === 'login') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0E14] text-[#EDF0F5] font-sans overflow-y-auto px-4 py-8">
        {/* Glowing circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#8B7CF6]/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#F5B822]/5 blur-[120px]" />

        <div className="relative w-full max-w-md bg-[#12161F] border border-[#232936] rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F5B822] to-[#8B7CF6] p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/10">
              <div className="w-full h-full bg-[#12161F] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-[#F5B822]" />
              </div>
            </div>
            <h1 className="font-display font-bold text-2xl text-white tracking-wide mt-4 uppercase">
              Nex<span className="text-[#F5B822]">Top</span>Up
            </h1>
            <p className="text-[11px] text-[#838EA3] tracking-widest font-mono uppercase mt-1">
              Store Console Security Firewall
            </p>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-[#838EA3] tracking-wider uppercase mb-2 font-mono text-left">
                System Passcode Access Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5B6478]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-[#171C27] border border-[#232936] focus:border-[#F5B822] focus:ring-1 focus:ring-[#F5B822] text-[#EDF0F5] placeholder-[#5B6478] rounded-xl pl-11 pr-4 py-3 text-center tracking-widest font-mono text-lg transition-all focus:outline-none"
                  autoFocus
                />
              </div>
              {passcodeError && (
                <p className="text-[10px] text-[#F2586B] font-mono mt-2 font-bold animate-pulse text-left">
                  {passcodeError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#F5B822] to-[#8B7CF6] hover:from-[#e5aa1c] hover:to-[#7c6be5] text-slate-950 font-display font-black tracking-wider uppercase py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              Decrypt Console
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#232936] text-center">
            <span className="text-[10px] text-[#5B6478] font-mono uppercase tracking-wider block">
              Authorized personnel only
            </span>
            <span className="text-[9px] text-[#5B6478]/70 font-mono mt-1 block">
              IP ADDRESS LOGGED & REPORTED UNDER SEC-OP PROTOCOLS
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Calculate percentages for charts
  const gameItemsOrdersCount = orders.filter(o => o.status === 'completed' && !o.gameName.toLowerCase().includes('premium')).length;
  const subsOrdersCount = orders.filter(o => o.status === 'completed' && o.gameName.toLowerCase().includes('premium')).length;
  const totalCompletedCount = stats.completedOrders || 1;
  const gameItemsPct = Math.round((gameItemsOrdersCount / totalCompletedCount) * 100) || 60;
  const subsPct = 100 - gameItemsPct;

  const totalAllOrdersCount = orders.length || 1;
  const orderSuccessRate = Math.round((stats.completedOrders / totalAllOrdersCount) * 100) || 90;

  return (
    <div className={`fixed inset-0 z-40 flex flex-col bg-[#0A0E14] text-[#EDF0F5] font-sans overflow-hidden ${themeMode === 'light' ? 'bg-[#F3F4F8] text-[#161A24]' : ''}`} style={{
      '--bg': themeMode === 'light' ? '#F3F4F8' : '#0A0E14',
      '--surface': themeMode === 'light' ? '#FFFFFF' : '#12161F',
      '--border': themeMode === 'light' ? '#E4E6EF' : '#232936',
      '--text': themeMode === 'light' ? '#161A24' : '#EDF0F5',
      '--muted': themeMode === 'light' ? '#6B7284' : '#838EA3',
      '--muted-dim': themeMode === 'light' ? '#9AA0B1' : '#5B6478',
      '--gold': '#F5B822',
      '--gold-dim': themeMode === 'light' ? '#FBF0D6' : '#4A3B14',
      '--violet': '#8B7CF6',
      '--violet-dim': themeMode === 'light' ? '#ECE9FD' : '#2B2650',
      '--success': '#35D48A',
      '--success-dim': themeMode === 'light' ? '#DDF6EB' : '#123326',
      '--danger': '#F2586B',
      '--danger-dim': themeMode === 'light' ? '#FCE4E8' : '#3A1620'
    } as any}>
      
      {/* TOP HEADER */}
      <header className="header h-[68px] flex-shrink-0 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--surface)] z-40">
        <div className="flex items-center gap-4">
          {/* Logo brand in top header */}
          <div className="brand flex items-center gap-[11px] whitespace-nowrap overflow-hidden">
            <div className="brand-mark w-9 h-9 rounded-xl bg-gradient-to-br from-[#F5B822] to-[#8B7CF6] flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/10">
              <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="brand-text font-display font-bold text-[17px] tracking-wide text-[var(--text)]">
              Nex<span className="text-[#F5B822]">Top</span>Up
            </div>
          </div>

          <div className="h-6 w-[1px] bg-[var(--border)] mx-1 hidden sm:block" />

          {/* Sidebar Toggle */}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="icon-btn w-[38px] h-[38px] rounded-xl bg-[#171C27]/50 border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-colors cursor-pointer"
          >
            <Menu className="w-[17px] h-[17px]" />
          </button>
        </div>

        <div className="header-right flex items-center gap-4">
          {/* Theme switcher */}
          <div className="theme-switch flex items-center gap-1 bg-[#171C27]/50 border border-[var(--border)] rounded-xl p-0.5">
            <button 
              onClick={() => setThemeMode('dark')}
              className={`w-[28px] h-[26px] rounded-lg flex items-center justify-center transition-all ${themeMode === 'dark' ? 'bg-[#1D2330] text-[#F5B822]' : 'text-[var(--muted-dim)]'}`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setThemeMode('light')}
              className={`w-[28px] h-[26px] rounded-lg flex items-center justify-center transition-all ${themeMode === 'light' ? 'bg-amber-100 text-[#F5B822]' : 'text-[var(--muted-dim)]'}`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Notification bell dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative icon-btn w-[38px] h-[38px] rounded-xl bg-[#171C27]/50 border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-colors cursor-pointer"
            >
              <Bell className="w-[17px] h-[17px]" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#F2586B] border-2 border-[var(--surface)]" />
              )}
            </button>

            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                <div className="absolute right-0 mt-2.5 w-80 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 overflow-hidden divide-y divide-[var(--border)] animate-fadeIn">
                  <div className="p-4 flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-[var(--text)] uppercase tracking-wider">Console Notifications</span>
                    <button 
                      onClick={() => {
                        setNotifications(notifications.map(n => ({ ...n, read: true })));
                        showToast("All notifications marked as read", "success");
                      }}
                      className="text-[10px] text-[#8B7CF6] hover:underline font-mono"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-[var(--border)]">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-3.5 text-left text-xs transition-colors hover:bg-[#171C27]/30 flex gap-2.5 items-start ${!notif.read ? 'bg-[#8B7CF6]/5' : ''}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${!notif.read ? 'bg-[#F5B822]' : 'bg-[var(--muted-dim)]'}`} />
                        <div className="flex-1 space-y-0.5">
                          <p className="text-[var(--text)] leading-relaxed">{notif.text}</p>
                          <span className="text-[10px] text-[var(--muted-dim)] font-mono">{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2.5 text-center bg-[#171C27]/20">
                    <button 
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-[10px] text-[var(--muted)] hover:text-[var(--text)] uppercase tracking-wider font-bold"
                    >
                      Dismiss Menu
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button 
              id="admin-profile-dropdown-btn"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              onBlur={() => setTimeout(() => setIsProfileDropdownOpen(false), 200)}
              className="profile flex items-center gap-2.5 pl-2 hover:opacity-90 transition-all select-none cursor-pointer focus:outline-none"
            >
              <div className="avatar w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B7CF6] to-[#F5B822] flex items-center justify-center shadow-md">
                <UserIcon className="w-4 h-4 text-[#0A0E14]" />
              </div>
              <div className="profile-text text-left hidden sm:block">
                <div className="profile-name text-[12.5px] font-extrabold text-[var(--text)] leading-tight flex items-center gap-1">
                  <span>{adminName}</span>
                  <ChevronDown size={12} className={`transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                <div className="profile-role text-[11px] text-[var(--muted)]">Admin Panel Operator</div>
              </div>
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-[#111622] border border-[#1d2435] rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-[#1d2435] animate-fadeIn text-left">
                {/* Profile Header Card */}
                <div className="p-4 bg-gradient-to-b from-[#182030] to-[#111622]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B7CF6] to-[#F5B822] flex items-center justify-center font-bold text-slate-900 shrink-0 shadow-md">
                      {adminName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-white truncate">{adminName}</p>
                      <p className="text-[10px] text-[var(--muted)] uppercase font-mono tracking-wider truncate">Console Admin</p>
                    </div>
                  </div>
                </div>

                {/* Dropdown Menu Items */}
                <div className="py-1">
                  <button 
                    onClick={() => {
                      navigateAdminTab('profile');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#1d2435] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <Sliders size={14} className="text-[#F5B822]" />
                    <span>Overview & Profile</span>
                  </button>
                  <button 
                    onClick={() => {
                      navigateAdminTab('customizer');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#1d2435] flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <Settings size={14} className="text-[#8B7CF6]" />
                    <span>Store Customizer</span>
                  </button>
                </div>

                <div className="py-1">
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-xs font-bold text-[#F2586B] hover:bg-rose-950/20 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                  >
                    <LogOut size={14} />
                    <span>Secure Exit</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* WORKSPACE & SIDEBAR AREA */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        
        {/* SIDEBAR UNDER HEADER */}
        <aside className={`sidebar h-full flex flex-col flex-shrink-0 bg-[var(--surface)] border-r border-[var(--border)] transition-all duration-300 z-30 ${
          isSidebarCollapsed 
            ? 'hidden md:flex md:w-[78px]' 
            : 'fixed inset-y-0 top-[68px] left-0 w-[252px] h-[calc(100vh-68px)] md:static md:w-[252px] md:h-full flex flex-col'
        }`}>
          <nav className="nav flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
            {!isSidebarCollapsed && <div className="nav-label text-[10px] text-[var(--muted-dim)] font-bold uppercase tracking-widest px-3 py-2">Menu</div>}
            
            <button
              onClick={() => navigateAdminTab('stats')}
              className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all ${
                activeTab === 'stats' 
                  ? 'bg-[#1D2330] text-white border-l-2 border-[#20947c]' 
                  : 'text-[var(--muted)] hover:bg-[#171C27] hover:text-[var(--text)]'
              }`}
            >
              <LayoutDashboard className={`w-[18px] h-[18px] shrink-0 ${activeTab === 'stats' ? 'text-[#20947c]' : ''}`} />
              {!isSidebarCollapsed && <span className="text-[13.5px] font-semibold">Dashboard</span>}
            </button>

            <button
              onClick={() => navigateAdminTab('orders')}
              className={`nav-item w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all ${
                activeTab === 'orders' 
                  ? 'bg-[#1D2330] text-white border-l-2 border-[#20947c]' 
                  : 'text-[var(--muted)] hover:bg-[#171C27] hover:text-[var(--text)]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <ShoppingCart className={`w-[18px] h-[18px] shrink-0 ${activeTab === 'orders' ? 'text-[#20947c]' : ''}`} />
                {!isSidebarCollapsed && <span className="text-[13.5px] font-semibold truncate">Orders</span>}
              </div>
              {!isSidebarCollapsed && stats.pendingOrders > 0 && (
                <span className="badge ml-auto bg-[#F2586B] text-white text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold">
                  {stats.pendingOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => navigateAdminTab('inventory')}
              className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all ${
                activeTab === 'inventory' 
                  ? 'bg-[#1D2330] text-white border-l-2 border-[#20947c]' 
                  : 'text-[var(--muted)] hover:bg-[#171C27] hover:text-[var(--text)]'
              }`}
            >
              <Gamepad2 className={`w-[18px] h-[18px] shrink-0 ${activeTab === 'inventory' ? 'text-[#20947c]' : ''}`} />
              {!isSidebarCollapsed && <span className="text-[13.5px] font-semibold">Game Items</span>}
            </button>

            {/* Customizer Dropdown Accordion */}
            <div className="w-full space-y-1">
              <button
                onClick={() => {
                  navigateAdminTab('customizer');
                  setIsCustomizerDropdownOpen(!isCustomizerDropdownOpen);
                }}
                className={`nav-item w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all ${
                  activeTab === 'customizer' 
                    ? 'bg-[#1D2330] text-white border-l-2 border-[#20947c]' 
                    : 'text-[var(--muted)] hover:bg-[#171C27] hover:text-[var(--text)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className={`w-[18px] h-[18px] shrink-0 ${activeTab === 'customizer' ? 'text-[#20947c]' : ''}`} />
                  {!isSidebarCollapsed && <span className="text-[13.5px] font-semibold">Website Customizer</span>}
                </div>
                {!isSidebarCollapsed && (
                  <ChevronDown size={14} className={`transform transition-transform ${isCustomizerDropdownOpen ? 'rotate-180' : ''}`} />
                )}
              </button>

              {/* Submenus when expanded */}
              {isCustomizerDropdownOpen && !isSidebarCollapsed && (
                <div className="pl-4 pr-1 py-1 flex flex-col gap-1 border-l border-slate-800 ml-5">
                  {/* Option 1: Template Name */}
                  <button
                    onClick={() => {
                      navigateAdminTab('customizer', 'template');
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-xs font-semibold cursor-pointer transition-colors ${
                      activeTab === 'customizer' && customizerSubTab === 'template'
                        ? 'text-[#20947c] bg-[#171C27]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Layers size={13} />
                    <span>Templates Name</span>
                  </button>

                  {/* Option 2: Widgets Name */}
                  <button
                    onClick={() => {
                      navigateAdminTab('customizer', 'widgets');
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-xs font-semibold cursor-pointer transition-colors ${
                      activeTab === 'customizer' && customizerSubTab === 'widgets'
                        ? 'text-[#20947c] bg-[#171C27]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Sliders size={13} />
                    <span>Widgets Name</span>
                  </button>

                  {/* Option 3: Section Name */}
                  <button
                    onClick={() => {
                      navigateAdminTab('customizer', 'sections');
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-xs font-semibold cursor-pointer transition-colors ${
                      activeTab === 'customizer' && customizerSubTab === 'sections'
                        ? 'text-[#20947c] bg-[#171C27]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Sparkles size={13} />
                    <span>Section Name</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigateAdminTab('banners')}
              className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all ${
                activeTab === 'banners' 
                  ? 'bg-[#1D2330] text-white border-l-2 border-[#20947c]' 
                  : 'text-[var(--muted)] hover:bg-[#171C27] hover:text-[var(--text)]'
              }`}
            >
              <Image className={`w-[18px] h-[18px] shrink-0 ${activeTab === 'banners' ? 'text-[#20947c]' : ''}`} />
              {!isSidebarCollapsed && <span className="text-[13.5px] font-semibold">Promotional Banners</span>}
            </button>

            <button
              onClick={() => navigateAdminTab('profile')}
              className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all ${
                activeTab === 'profile' 
                  ? 'bg-[#1D2330] text-white border-l-2 border-[#20947c]' 
                  : 'text-[var(--muted)] hover:bg-[#171C27] hover:text-[var(--text)]'
              }`}
            >
              <Sliders className={`w-[18px] h-[18px] shrink-0 ${activeTab === 'profile' ? 'text-[#20947c]' : ''}`} />
              {!isSidebarCollapsed && <span className="text-[13.5px] font-semibold">Overview & Profile</span>}
            </button>

            <div className="mt-auto border-t border-[var(--border)] pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[#F2586B] hover:bg-rose-950/20 cursor-pointer transition-all"
              >
                <LogOut className="w-[18px] h-[18px] shrink-0" />
                {!isSidebarCollapsed && <span className="text-[13.5px] font-bold">Secure Exit</span>}
              </button>
            </div>
          </nav>

          <div className="sidebar-foot px-5 py-4 border-t border-[var(--border)] flex items-center gap-2">
            <span className="status-dot w-2 h-2 rounded-full bg-[#35D48A] shadow-[0_0_8px_#35D48A] shrink-0" />
            {!isSidebarCollapsed && <span className="sidebar-foot-text text-[11px] text-[var(--muted)] font-mono">All servers encrypted</span>}
          </div>
        </aside>

        {/* WORKSPACE CONTENT */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[var(--bg)] p-6 space-y-6">

          {/* TAB 1: DASHBOARD STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* STAT CARDS GRID */}
              <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Total Users (Mock) */}
                <div className="stat-card bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4.5 flex flex-col gap-3 transition-transform hover:-translate-y-0.5" style={{ '--accent': '#F5B822', '--accent-dim': '#4A3B14' } as any}>
                  <div className="stat-top flex items-center justify-between">
                    <div className="stat-icon w-8.5 h-8.5 rounded-xl bg-[#4A3B14] text-[#F5B822] flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    {/* SVG Gauge */}
                    <svg className="gauge w-8 h-8 shrink-0" viewBox="0 0 36 36">
                      <circle className="track stroke-[#232936] fill-none stroke-[3]" cx="18" cy="18" r="15" />
                      <circle className="fill stroke-[#F5B822] stroke-linecap-round fill-none stroke-[3]" cx="18" cy="18" r="15" strokeDasharray="94" strokeDashoffset="75" />
                    </svg>
                  </div>
                  <div>
                    <div className="stat-value font-mono text-[23px] font-bold text-[var(--text)]">3,482</div>
                    <div className="stat-label text-xs text-[var(--muted)] font-medium">Total Registered Users</div>
                  </div>
                  <div className="stat-delta text-[11px] font-bold text-[#35D48A] flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 stroke-[3]" />
                    <span>+12.4% this month</span>
                  </div>
                </div>

                {/* Active Users (Mock) */}
                <div className="stat-card bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4.5 flex flex-col gap-3 transition-transform hover:-translate-y-0.5" style={{ '--accent': '#35D48A', '--accent-dim': '#123326' } as any}>
                  <div className="stat-top flex items-center justify-between">
                    <div className="stat-icon w-8.5 h-8.5 rounded-xl bg-[#123326] text-[#35D48A] flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    {/* SVG Gauge */}
                    <svg className="gauge w-8 h-8 shrink-0" viewBox="0 0 36 36">
                      <circle className="track stroke-[#232936] fill-none stroke-[3]" cx="18" cy="18" r="15" />
                      <circle className="fill stroke-[#35D48A] stroke-linecap-round fill-none stroke-[3]" cx="18" cy="18" r="15" strokeDasharray="94" strokeDashoffset="28" />
                    </svg>
                  </div>
                  <div>
                    <div className="stat-value font-mono text-[23px] font-bold text-[var(--text)]">812</div>
                    <div className="stat-label text-xs text-[var(--muted)] font-medium">Active Users (Today)</div>
                  </div>
                  <div className="stat-delta text-[11px] font-bold text-[#35D48A] flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 stroke-[3]" />
                    <span>68% online rate</span>
                  </div>
                </div>

                {/* Today's Sales */}
                <div className="stat-card bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4.5 flex flex-col gap-3 transition-transform hover:-translate-y-0.5" style={{ '--accent': '#8B7CF6', '--accent-dim': '#2B2650' } as any}>
                  <div className="stat-top flex items-center justify-between">
                    <div className="stat-icon w-8.5 h-8.5 rounded-xl bg-[#2B2650] text-[#8B7CF6] flex items-center justify-center shrink-0">
                      <Wallet className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="stat-value font-mono text-[23px] font-bold text-[var(--text)]">৳ {stats.totalSales}</div>
                    <div className="stat-label text-xs text-[var(--muted)] font-medium">Today's Total Sales</div>
                  </div>
                  <div className="stat-delta text-[11px] font-bold text-[#35D48A] flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 stroke-[3]" />
                    <span>9.1% vs yesterday</span>
                  </div>
                </div>

                {/* Total Sales (All Time) */}
                <div className="stat-card bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4.5 flex flex-col gap-3 transition-transform hover:-translate-y-0.5" style={{ '--accent': '#F5B822', '--accent-dim': '#4A3B14' } as any}>
                  <div className="stat-top flex items-center justify-between">
                    <div className="stat-icon w-8.5 h-8.5 rounded-xl bg-[#4A3B14] text-[#F5B822] flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="stat-value font-mono text-[23px] font-bold text-[var(--text)]">৳ {stats.totalSales + 546920}</div>
                    <div className="stat-label text-xs text-[var(--muted)] font-medium">Total Sales (All Time)</div>
                  </div>
                  <div className="stat-delta text-[11px] font-bold text-[#8B7CF6] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Lifetime Revenue</span>
                  </div>
                </div>

              </div>

              {/* ANALYTICS CHARTS GRID: DONUT + RADIAL + LIVE STREAM */}
              <div className="analytics-row grid grid-cols-1 xl:grid-cols-3 gap-4">
                
                {/* Revenue Split Donut */}
                <div className="analytics-card bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 flex flex-col justify-between">
                  <div className="panel-head mb-4 text-left">
                    <h2 className="font-display font-semibold text-sm text-[var(--text)] uppercase tracking-wide">Revenue Split</h2>
                    <p className="text-[11px] text-[var(--muted)]">Game items vs subscriptions</p>
                  </div>
                  
                  <div className="donut-wrap flex items-center gap-5 my-2">
                    <svg className="donut-svg w-28 h-28 shrink-0 rotate-[-90deg]" viewBox="0 0 120 120">
                      <circle className="donut-track stroke-[#171C27] stroke-[11] fill-none" cx="60" cy="60" r="50" />
                      {/* Segment 1: Game items */}
                      <circle 
                        className="donut-seg stroke-[#F5B822] stroke-[11] fill-none transition-all duration-1000" 
                        cx="60" cy="60" r="50" 
                        strokeDasharray={`${(314 * gameItemsPct) / 100} 314`} 
                        strokeDashoffset="0"
                      />
                      {/* Segment 2: Subscriptions */}
                      <circle 
                        className="donut-seg stroke-[#8B7CF6] stroke-[11] fill-none transition-all duration-1000" 
                        cx="60" cy="60" r="50" 
                        strokeDasharray={`${(314 * subsPct) / 100} 314`} 
                        strokeDashoffset={`-${(314 * gameItemsPct) / 100}`}
                      />
                    </svg>

                    <div className="donut-legend flex flex-col gap-2.5 flex-1 text-xs">
                      <div className="donut-legend-row flex items-center gap-2">
                        <span className="sw w-2.5 h-2.5 rounded-xs bg-[#F5B822] shrink-0" />
                        <span className="lbl text-[var(--muted)] flex-1">Game Items</span>
                        <span className="val font-mono font-bold text-[var(--text)]">{gameItemsPct}%</span>
                      </div>
                      <div className="donut-legend-row flex items-center gap-2">
                        <span className="sw w-2.5 h-2.5 rounded-xs bg-[#8B7CF6] shrink-0" />
                        <span className="lbl text-[var(--muted)] flex-1">Subscriptions</span>
                        <span className="val font-mono font-bold text-[var(--text)]">{subsPct}%</span>
                      </div>
                      <div className="donut-legend-row flex items-center gap-2 border-t border-[var(--border)] pt-2.5 mt-1">
                        <span className="lbl text-[var(--muted)] flex-1">Avg. order value</span>
                        <span className="val font-mono font-bold text-[var(--text)]">৳ 320</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Success Rate Radial */}
                <div className="analytics-card bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 flex flex-col justify-between">
                  <div className="panel-head mb-4 text-left">
                    <h2 className="font-display font-semibold text-sm text-[var(--text)] uppercase tracking-wide">Order Success Rate</h2>
                    <p className="text-[11px] text-[var(--muted)]">Completed vs cancelled</p>
                  </div>

                  <div className="relative flex items-center justify-center py-2">
                    <svg className="radial-svg w-32 h-32 rotate-[-90deg]" viewBox="0 0 140 140">
                      <circle className="radial-track stroke-[#171C27] stroke-[10] fill-none" cx="70" cy="70" r="58" />
                      <circle 
                        className="radial-fill stroke-[#35D48A] stroke-[10] fill-none transition-all duration-[1500ms]" 
                        cx="70" cy="70" r="58" 
                        strokeDasharray="364" 
                        strokeDashoffset={`${364 - (364 * orderSuccessRate) / 100}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="radial-center absolute flex flex-col items-center justify-center text-center">
                      <div className="radial-value font-mono font-black text-2xl text-[var(--text)]">{orderSuccessRate}%</div>
                      <div className="radial-caption text-[10px] text-[var(--muted)] font-mono">Success Rate</div>
                    </div>
                  </div>

                  <div className="radial-foot flex justify-around gap-2 text-center text-xs border-t border-[var(--border)] pt-3.5 mt-2">
                    <div className="radial-foot-item">
                      <div className="n font-mono font-bold text-[#35D48A]">{stats.completedOrders}</div>
                      <div className="l text-[10px] text-[var(--muted)]">Completed</div>
                    </div>
                    <div className="radial-foot-item">
                      <div className="n font-mono font-bold text-[#F5B822]">{stats.pendingOrders}</div>
                      <div className="l text-[10px] text-[var(--muted)]">Pending</div>
                    </div>
                    <div className="radial-foot-item">
                      <div className="n font-mono font-bold text-[#F2586B]">{stats.cancelledOrders}</div>
                      <div className="l text-[10px] text-[var(--muted)]">Cancelled</div>
                    </div>
                  </div>
                </div>

                {/* Real-time Order Stream Activity Feed */}
                <div className="analytics-card bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 flex flex-col justify-between">
                  <div className="panel-head mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="font-display font-semibold text-sm text-[var(--text)] uppercase tracking-wide">Live Activity Stream</h2>
                      <p className="text-[11px] text-[var(--muted)]">Realtime purchase nodes</p>
                    </div>
                    <span className="feed-live-badge inline-flex items-center gap-1 bg-emerald-500/10 text-[#35D48A] text-[10.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#35D48A] animate-ping" />
                      Live
                    </span>
                  </div>

                  <div className="feed-list flex flex-col gap-2 flex-1">
                    {feed.map((node) => (
                      <div key={node.id} className="feed-row flex items-center gap-3 p-2 rounded-xl hover:bg-[#171C27]/40 transition-colors">
                        <div className="feed-dot-wrap relative w-2 h-2 shrink-0">
                          <span className={`feed-dot block w-2 h-2 rounded-full ${
                            node.status === 'completed' ? 'bg-[#35D48A]' : node.status === 'pending' ? 'bg-[#F5B822]' : 'bg-[#F2586B]'
                          }`} />
                        </div>
                        <div className="feed-text text-left text-xs text-[var(--muted)] flex-1 truncate">
                          <strong className="text-[var(--text)]">{node.name}</strong> {node.action} <strong className="text-[var(--text)]">{node.item}</strong>
                        </div>
                        <div className="feed-time font-mono text-[10px] text-[var(--muted-dim)]">{node.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* MANUAL DEPOSIT CENTER */}
              <div className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                  <h3 className="text-sm font-extrabold text-[var(--text)] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    Deposit Verification Queue ({stats.pendingDeposits.length})
                  </h3>
                  <button 
                    onClick={fetchAdminData}
                    className="text-xs text-[#8B7CF6] hover:underline flex items-center gap-1 font-mono cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                  </button>
                </div>

                {stats.pendingDeposits.length === 0 ? (
                  <p className="text-xs text-[var(--muted)] p-6 border border-dashed border-[var(--border)] rounded-xl text-center">No manual deposits waiting for verification.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.pendingDeposits.map((tx) => (
                      <div key={tx.id} className="p-4 bg-[#171C27]/50 border border-[var(--border)] rounded-xl flex flex-col justify-between gap-3 text-xs font-mono">
                        <div className="text-left space-y-1">
                          <div className="text-[var(--text)] font-extrabold text-sm">Refill Request: ৳ {tx.amount} BDT</div>
                          <div className="text-[var(--muted)] text-[11px]">TxID: <span className="text-amber-400">{tx.transactionId}</span></div>
                          <div className="text-[var(--muted)] text-[11px]">Gateway: <span className="text-[#8B7CF6]">{tx.method}</span></div>
                          <div className="text-[10px] text-[var(--muted-dim)]">{formatDate(tx.createdAt)}</div>
                        </div>
                        <div className="flex gap-2 shrink-0 border-t border-[var(--border)] pt-3">
                          <button
                            onClick={() => handleDepositAction(tx.id, 'completed')}
                            className="flex-1 bg-gradient-to-r from-[#35D48A] to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-display font-extrabold py-2 px-3 rounded-lg text-[10px] uppercase tracking-wider cursor-pointer transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDepositAction(tx.id, 'failed')}
                            className="bg-[#3A1620]/40 hover:bg-[#3A1620]/80 text-[#F2586B] font-display font-extrabold py-2 px-3 rounded-lg text-[10px] uppercase tracking-wider border border-[#F2586B]/20 cursor-pointer transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RECENT ORDERS TABLE VIEW */}
              <div className="table-panel bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-4">
                <div className="panel-head flex items-center justify-between">
                  <div className="text-left">
                    <h2 className="font-display font-semibold text-sm text-[var(--text)] uppercase tracking-wide">Recent Orders Table</h2>
                    <p className="text-[11px] text-[var(--muted)]">Latest 8 transaction records</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="text-[10.5px] text-[var(--muted-dim)] font-bold uppercase py-3 border-b border-[var(--border)]">Order ID</th>
                        <th className="text-[10.5px] text-[var(--muted-dim)] font-bold uppercase py-3 border-b border-[var(--border)]">Customer</th>
                        <th className="text-[10.5px] text-[var(--muted-dim)] font-bold uppercase py-3 border-b border-[var(--border)]">Package</th>
                        <th className="text-[10.5px] text-[var(--muted-dim)] font-bold uppercase py-3 border-b border-[var(--border)]">Payment</th>
                        <th className="text-[10.5px] text-[var(--muted-dim)] font-bold uppercase py-3 border-b border-[var(--border)]">Amount</th>
                        <th className="text-[10.5px] text-[var(--muted-dim)] font-bold uppercase py-3 border-b border-[var(--border)]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 8).map((o) => (
                        <tr key={o.id} className="border-b border-[var(--border)]/40 hover:bg-[#171C27]/20 transition-all">
                          <td className="py-3.5 font-mono text-xs text-[var(--muted)]">{o.id}</td>
                          <td className="py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-6.5 h-6.5 rounded-lg bg-[#171C27] border border-[var(--border)] flex items-center justify-center">
                                <UserIcon className="w-3.5 h-3.5 text-[var(--muted)]" />
                              </div>
                              <span className="text-xs font-semibold text-[var(--text)]">{o.userEmail.split('@')[0]}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-xs text-[var(--text)]">
                            <div className="font-semibold">{o.gameName}</div>
                            <div className="text-[10px] text-[var(--muted)] font-mono">{o.optionName}</div>
                          </td>
                          <td className="py-3.5 font-mono text-[11px] text-[var(--muted)]">
                            <div>{o.paymentMethod}</div>
                            <div className="text-[9px] text-[#F5B822]">{o.transactionId || 'Wallet'}</div>
                          </td>
                          <td className="py-3.5 font-mono font-bold text-[#F5B822] text-xs">৳ {o.price} BDT</td>
                          <td className="py-3.5">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              o.status === 'completed' ? 'bg-[#123326] text-[#35D48A]' : o.status === 'pending' ? 'bg-[#4A3B14] text-[#F5B822]' : 'bg-[#3A1620] text-[#F2586B]'
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${o.status === 'completed' ? 'bg-[#35D48A]' : o.status === 'pending' ? 'bg-[#F5B822]' : 'bg-[#F2586B]'}`} />
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PENDING ORDERS MANAGER */}
          {activeTab === 'orders' && (
            <div id="admin-view-orders" className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="font-display font-extrabold text-lg text-[var(--text)] uppercase tracking-wide">Customer Top-Up Orders</h2>
                <p className="text-xs text-[var(--muted)]">Review, process, and deliver game top-ups or cancel orders.</p>
              </div>

              {loading ? (
                <p className="text-xs text-[var(--muted)]">Loading orders stream...</p>
              ) : orders.length === 0 ? (
                <p className="text-xs text-[var(--muted)] p-6 text-center border border-dashed border-[var(--border)] rounded-xl">No top-up orders recorded in database.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="text-left space-y-2.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-[var(--text)] text-sm">{order.gameName}</span>
                          <span className="text-[10px] font-bold text-slate-300 bg-[#171C27] border border-[var(--border)] px-2 py-0.5 rounded-md">{order.optionName}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            order.status === 'pending' ? 'bg-[#4A3B14] text-[#F5B822] animate-pulse' : order.status === 'completed' ? 'bg-[#123326] text-[#35D48A]' : 'bg-[#3A1620] text-[#F2586B]'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-[var(--muted)] font-mono">
                          <div><span className="text-[var(--muted-dim)]">Order ID:</span> {order.id}</div>
                          <div><span className="text-[var(--muted-dim)]">User Email:</span> {order.userEmail}</div>
                          <div><span className="text-[var(--muted-dim)]">Price BDT:</span> ৳ {order.price}</div>
                          <div><span className="text-[var(--muted-dim)]">Timestamp:</span> {formatDate(order.createdAt)}</div>
                          <div><span className="text-[var(--muted-dim)]">Method:</span> {order.paymentMethod}</div>
                          <div><span className="text-[var(--muted-dim)]">TxID Ref:</span> <span className="text-amber-400">{order.transactionId || 'Wallet Balance'}</span></div>
                        </div>

                        <div className="bg-[#171C27]/60 p-3.5 border border-[var(--border)] rounded-xl text-xs font-mono text-slate-300">
                          <span className="text-[var(--muted-dim)] font-bold block uppercase text-[9px] tracking-wider mb-2">Account Inputs (Required credentials):</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Object.entries(order.inputs).map(([key, val]) => (
                              <div key={key} className="truncate bg-[#12161F] border border-[var(--border)] px-2.5 py-1.5 rounded-lg flex items-center justify-between">
                                <span className="text-[#838EA3] text-[10px] uppercase font-bold shrink-0 mr-1">{key}:</span>
                                <span className="text-white truncate text-right font-bold">{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {order.status === 'pending' && (
                        <div className="flex gap-2 self-stretch md:self-auto shrink-0 md:flex-col justify-end">
                          <button
                            onClick={() => handleOrderAction(order.id, 'completed')}
                            className="flex-1 bg-gradient-to-r from-[#35D48A] to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-display font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex justify-center items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 size={14} /> Deliver Pack
                          </button>
                          <button
                            onClick={() => handleOrderAction(order.id, 'cancelled')}
                            className="bg-[#3A1620]/40 hover:bg-[#3A1620]/80 text-[#F2586B] font-display font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider border border-[#F2586B]/20 transition-all flex justify-center items-center gap-1.5 cursor-pointer"
                          >
                            <XCircle size={14} /> Cancel Order
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: STORE INVENTORY */}
          {activeTab === 'inventory' && (
            <div id="admin-view-inventory" className="space-y-6 animate-fadeIn text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--border)] pb-4">
                <div>
                  <h2 className="font-display font-extrabold text-lg text-[var(--text)] uppercase tracking-wide">Store Inventory catalogs</h2>
                  <p className="text-xs text-[var(--muted)]">Configure item titles, categories, inputs required, and pricing packages.</p>
                </div>
                <button
                  onClick={() => setIsAddingGame(!isAddingGame)}
                  className="bg-[#F5B822] hover:bg-[#e5aa1c] text-slate-950 font-display font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/10 active:scale-95 transition-all"
                >
                  <Plus size={16} /> Create Game Catalog
                </button>
              </div>

              {/* Form: Create Game */}
              {isAddingGame && (
                <form onSubmit={handleAddGame} id="form-add-game" className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-2xl space-y-4 animate-fadeIn">
                  <h3 className="text-xs font-black uppercase text-[#F5B822] flex items-center gap-2">
                    <Gamepad2 size={16} /> New Game Catalog Form
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--muted)] mb-1 uppercase tracking-wider">Game Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. PUBG Mobile or Free Fire"
                        value={newGameName}
                        onChange={(e) => setNewGameName(e.target.value)}
                        className="w-full bg-[#171C27] border border-[var(--border)] focus:border-[#F5B822] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#F5B822]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--muted)] mb-1 uppercase tracking-wider">Category</label>
                      <select
                        value={newGameCategory}
                        onChange={(e) => setNewGameCategory(e.target.value as any)}
                        className="w-full bg-[#171C27] border border-[var(--border)] focus:border-[#F5B822] rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                      >
                        <option value="mobile">Mobile Games</option>
                        <option value="pc">PC Games</option>
                        <option value="vouchers">Vouchers</option>
                        <option value="subscriptions">Subscriptions</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--muted)] mb-1 uppercase tracking-wider">Logo / Banner URL</label>
                      <input
                        type="text"
                        placeholder="Image address URL link"
                        value={newGameLogo}
                        onChange={(e) => setNewGameLogo(e.target.value)}
                        className="w-full bg-[#171C27] border border-[var(--border)] focus:border-[#F5B822] rounded-xl px-3 py-2 text-white text-xs focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--muted)] mb-1 uppercase tracking-wider">Inputs Required from Customers</label>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {(['playerId', 'characterName', 'serverId', 'email', 'password'] as const).map((inp) => (
                          <button
                            type="button"
                            key={inp}
                            onClick={() => toggleInputsSelection(inp)}
                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${newGameInputs.includes(inp) ? 'bg-[#F5B822]/10 text-[#F5B822] border-[#F5B822]' : 'bg-[#171C27] border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]'}`}
                          >
                            {inp}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--muted)] mb-1 uppercase tracking-wider">Brief Description</label>
                    <textarea
                      placeholder="Short summary details for the pricing catalog..."
                      value={newGameDesc}
                      onChange={(e) => setNewGameDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-[#171C27] border border-[var(--border)] focus:border-[#F5B822] rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingGame(false)}
                      className="px-4 py-2 border border-[var(--border)] text-[var(--muted)] hover:text-white rounded-xl text-xs hover:bg-[#171C27] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#F5B822] text-slate-950 font-display font-black rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-all"
                    >
                      Save Game
                    </button>
                  </div>
                </form>
              )}

              {/* Inventory Selector list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Games Sidebar */}
                <div className="md:col-span-1 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 space-y-2 h-[450px] overflow-y-auto">
                  <span className="text-[10px] text-[var(--muted-dim)] font-black uppercase tracking-wider block mb-2 px-1">Select catalog game</span>
                  {games.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGame(g)}
                      className={`w-full flex items-center gap-3 p-2 rounded-xl border text-left transition-all cursor-pointer ${selectedGame?.id === g.id ? 'border-[#F5B822] bg-[#171C27]' : 'border-transparent hover:bg-[#171C27]/50'}`}
                    >
                      <img src={g.logo} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0 border border-[var(--border)]" onError={(e)=>{e.currentTarget.src='https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=150'}} />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[var(--text)] truncate">{g.name}</h4>
                        <span className="text-[10px] text-[var(--muted)] block">{g.topupOptions.length} top-up packages</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Game Package Manager */}
                <div className="md:col-span-2 space-y-4">
                  {selectedGame ? (
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-5">
                      <div className="flex justify-between items-start gap-4 border-b border-[var(--border)] pb-4">
                        <div className="flex items-center gap-3">
                          <img src={selectedGame.logo} alt="" className="w-12 h-12 object-cover rounded-lg shrink-0 border border-[var(--border)]" onError={(e)=>{e.currentTarget.src='https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=150'}} />
                          <div className="text-left">
                            <h3 className="font-extrabold text-[var(--text)] text-base">{selectedGame.name}</h3>
                            <span className="text-[10px] text-[#8B7CF6] font-mono block uppercase tracking-wider mt-0.5">{selectedGame.category}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteGame(selectedGame.id)}
                          className="text-[#F2586B] hover:text-white bg-[#3A1620]/30 hover:bg-[#F2586B]/80 border border-[#F2586B]/20 p-2.5 rounded-xl transition-all cursor-pointer"
                          title="Delete Game Catalog"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Package Option list */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase text-[var(--muted)] tracking-wider">Current Packages / Prices</h4>
                        {selectedGame.topupOptions.length === 0 ? (
                          <p className="text-[11px] text-[var(--muted)] italic p-4 border border-dashed border-[var(--border)] rounded-xl text-center">No pricing packages loaded. Add one below!</p>
                        ) : (
                          <div className="space-y-2 max-h-[180px] overflow-y-auto">
                            {selectedGame.topupOptions.map((opt) => (
                              <div key={opt.id} className="flex justify-between items-center p-2.5 bg-[#171C27]/40 border border-[var(--border)] rounded-xl text-xs font-mono">
                                <div className="text-left">
                                  <span className="font-bold text-[var(--text)] block">{opt.name}</span>
                                  <span className="text-[10px] text-[var(--muted)] font-medium">Price: ৳ {opt.price} BDT | Stock: {opt.stock}</span>
                                </div>
                                <button
                                  onClick={() => handleRemoveOption(opt.id)}
                                  className="text-[#F2586B] hover:text-white p-2 rounded-lg hover:bg-rose-950/20 cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Form: Add option */}
                      <form onSubmit={handleAddOption} className="space-y-4 pt-3 border-t border-[var(--border)]">
                        <h4 className="text-xs font-black uppercase text-[#F5B822] tracking-wider text-left">Add Pricing Package Option</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1 text-left">Pack name</label>
                            <input
                              type="text"
                              placeholder="e.g. 115 Diamonds"
                              value={newOptName}
                              onChange={(e) => setNewOptName(e.target.value)}
                              className="w-full bg-[#171C27] border border-[var(--border)] focus:border-[#F5B822] rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1 text-left">Price (BDT)</label>
                            <input
                              type="number"
                              placeholder="৳ Price"
                              value={newOptPrice}
                              onChange={(e) => setNewOptPrice(e.target.value)}
                              className="w-full bg-[#171C27] border border-[var(--border)] focus:border-[#F5B822] rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1 text-left">Stock Quantity</label>
                            <input
                              type="number"
                              placeholder="Stock qty"
                              value={newOptStock}
                              onChange={(e) => setNewOptStock(e.target.value)}
                              className="w-full bg-[#171C27] border border-[var(--border)] focus:border-[#F5B822] rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-[#F5B822] hover:bg-[#e5aa1c] text-slate-950 font-display font-black py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer flex justify-center items-center gap-1.5 transition-all shadow-md active:scale-98"
                        >
                          <Plus size={14} /> Add Package Option
                        </button>
                      </form>
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--muted)] text-center p-12 border border-dashed border-[var(--border)] rounded-2xl">
                      Select a game catalog from the sidebar list to manage its items and packages.
                    </p>
                  )}
                </div>

              </div>
            </div>
          )}
            {/* TAB 4: VISUAL AESTHETIC CUSTOMIZER (With Templates, Widgets, and Sections customizer tabs) */}
          {activeTab === 'customizer' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-[var(--border)] pb-4 text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-extrabold text-lg text-[var(--text)] uppercase tracking-wide">
                    Website Customizer
                  </h2>
                  <p className="text-xs text-[var(--muted)]">
                    Configure design templates, toggle interactive widgets, and edit website section copy in real-time.
                  </p>
                </div>
                
                {/* Secondary navigation tab pills in customizer panel */}
                <div className="flex gap-2 bg-[#171C27] border border-[var(--border)] p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => navigateAdminTab('customizer', 'template')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      customizerSubTab === 'template'
                        ? 'bg-[#20947c] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🎨 Templates Name
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateAdminTab('customizer', 'widgets')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      customizerSubTab === 'widgets'
                        ? 'bg-[#20947c] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚙️ Widgets Name
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateAdminTab('customizer', 'sections')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      customizerSubTab === 'sections'
                        ? 'bg-[#20947c] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    📝 Section Name
                  </button>
                </div>
              </div>

              {/* Helper for mapping theme keys to Hex codes for preview */}
              {(() => {
                const getThemeHex = (col: string) => {
                  switch(col) {
                    case 'cyan': return '#06b6d4';
                    case 'violet': return '#8b5cf6';
                    case 'amber': return '#f59e0b';
                    case 'rose': return '#f43f5e';
                    case 'slate': return '#64748b';
                    case 'emerald':
                    default: return '#20947c';
                  }
                };

                return (
                  <>
                    {/* SECTION 1: TEMPLATES NAME VIEW (Exact Table & Edit Form matching screenshots) */}
                    {customizerSubTab === 'template' && (
                      <TemplateManagerTable
                        config={config}
                        onSaveConfig={async (updatedConfig) => {
                          const merged = { ...config, ...updatedConfig };
                          try {
                            const res = await fetch('/api/config/update', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ config: merged }),
                            });
                            if (res.ok) {
                              onRefreshConfig(merged);
                            }
                          } catch (e) {
                            console.error('Failed saving template config', e);
                          }
                        }}
                        showToast={showToast}
                      />
                    )}

                    {/* SECTION 2: WIDGETS NAME VIEW */}
                    {customizerSubTab === 'widgets' && (
                      <form onSubmit={handleConfigSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Controls */}
                        <div className="lg:col-span-6 space-y-5 bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] text-left flex flex-col justify-between">
                          <div className="space-y-5">
                            <h3 className="text-xs font-black uppercase text-[#20947c] tracking-wider">Interactive Widgets Toggle</h3>
                            <p className="text-[11px] text-slate-400 leading-normal">
                              Enable or disable custom components that display live activity, security trust stats, or emergency announcement bars.
                            </p>

                            {/* Widget 1: Live Activity Stream */}
                            <div className="border border-slate-800/60 p-4 rounded-xl space-y-2.5 bg-slate-950/20 flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <label className="block text-xs font-bold text-white">Live Purchase Activity Stream Feed</label>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                                  Shows random simulated real-time game purchases at the bottom of the home page to increase user conversion.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowLiveActivity(!showLiveActivity)}
                                className={`w-12 h-6.5 rounded-full p-1 transition-colors relative shrink-0 ${
                                  showLiveActivity ? 'bg-emerald-500' : 'bg-slate-700'
                                }`}
                              >
                                <span className={`block w-4.5 h-4.5 bg-white rounded-full transition-transform transform ${
                                  showLiveActivity ? 'translate-x-5.5' : 'translate-x-0'
                                }`} />
                              </button>
                            </div>

                            {/* Widget 2: Site Statistics Summary */}
                            <div className="border border-slate-800/60 p-4 rounded-xl space-y-2.5 bg-slate-950/20 flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <label className="block text-xs font-bold text-white">Site Security & Stats Badges Widget</label>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                                  Displays the 3-column trust markers (100% Secure Payments, Instant Deliveries, Helpdesk Support) below games catalog.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowStatsCounter(!showStatsCounter)}
                                className={`w-12 h-6.5 rounded-full p-1 transition-colors relative shrink-0 ${
                                  showStatsCounter ? 'bg-emerald-500' : 'bg-slate-700'
                                }`}
                              >
                                <span className={`block w-4.5 h-4.5 bg-white rounded-full transition-transform transform ${
                                  showStatsCounter ? 'translate-x-5.5' : 'translate-x-0'
                                }`} />
                              </button>
                            </div>

                            {/* Widget 3: Emergency Notice Banner */}
                            <div className="border border-slate-800/60 p-4 rounded-xl space-y-2.5 bg-slate-950/20 flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <label className="block text-xs font-bold text-white">Emergency Notice Ticker Bar</label>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                                  Shows a pulsing announcement/notice bar under the navigation header across the entire website.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowNoticeBanner(!showNoticeBanner)}
                                className={`w-12 h-6.5 rounded-full p-1 transition-colors relative shrink-0 ${
                                  showNoticeBanner ? 'bg-emerald-500' : 'bg-slate-700'
                                }`}
                              >
                                <span className={`block w-4.5 h-4.5 bg-white rounded-full transition-transform transform ${
                                  showNoticeBanner ? 'translate-x-5.5' : 'translate-x-0'
                                }`} />
                              </button>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-800 mt-6">
                            <button
                              type="submit"
                              className="w-full py-3 bg-[#20947c] hover:bg-[#187561] text-white font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex justify-center items-center gap-1.5 cursor-pointer active:scale-98"
                            >
                              <Save size={14} /> Save Active Widgets
                            </button>
                          </div>
                        </div>

                        {/* Right Real-time Monitor */}
                        <div className="lg:col-span-6 space-y-4 text-left">
                          <div className="bg-[#171C27] border border-[var(--border)] rounded-2xl p-5 space-y-4">
                            <div>
                              <span className="text-[9px] font-black tracking-widest text-[#20947c] uppercase font-mono">WIDGET STATUS SUMMARY</span>
                              <h4 className="font-extrabold text-xs text-slate-400 mt-1 uppercase">ACTIVE MODULES TRACKER</h4>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5 text-[10px] font-semibold">
                              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between">
                                <span className="text-slate-400">Live Activity Feed:</span>
                                <span className={showLiveActivity ? 'text-emerald-400 font-bold' : 'text-rose-500 font-bold'}>
                                  {showLiveActivity ? 'ACTIVE' : 'MUTED'}
                                </span>
                              </div>
                              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between">
                                <span className="text-slate-400">Emergency Banner:</span>
                                <span className={showNoticeBanner ? 'text-emerald-400 font-bold' : 'text-rose-500 font-bold'}>
                                  {showNoticeBanner ? 'VISIBLE' : 'HIDDEN'}
                                </span>
                              </div>
                              <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-between col-span-2">
                                <span className="text-slate-400">Site Security Statistics Grid:</span>
                                <span className={showStatsCounter ? 'text-emerald-400 font-bold' : 'text-rose-500 font-bold'}>
                                  {showStatsCounter ? 'ENABLED (VISIBLE UNDER GAMES CATALOG)' : 'DISABLED (COLLAPSED)'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* SECTION 3: SECTION NAME VIEW */}
                    {customizerSubTab === 'sections' && (
                      <form onSubmit={handleConfigSave} className="space-y-6">
                        {/* Grid 1: Home and Brand copy texts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Home Header Texts */}
                          <div className="space-y-4 bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] text-left">
                            <h3 className="text-xs font-black uppercase text-[#20947c] tracking-wider">Home Landing Module</h3>
                            
                            <div className="space-y-3">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Site Brand Name</label>
                                <input
                                  type="text"
                                  value={siteName}
                                  onChange={(e) => setSiteName(e.target.value)}
                                  className="w-full bg-[#171C27] border border-[var(--border)] rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-[#20947c]"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Brand Slogan Banner</label>
                                <input
                                  type="text"
                                  value={siteSlogan}
                                  onChange={(e) => setSiteSlogan(e.target.value)}
                                  className="w-full bg-[#171C27] border border-[var(--border)] rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-[#20947c]"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Games Catalog Section Title</label>
                                <input
                                  type="text"
                                  value={sectionHomeTitle}
                                  onChange={(e) => setSectionHomeTitle(e.target.value)}
                                  className="w-full bg-[#171C27] border border-[var(--border)] rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-[#20947c]"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {/* Support Contact Section */}
                          <div className="space-y-4 bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] text-left">
                            <h3 className="text-xs font-black uppercase text-[#20947c] tracking-wider">Support Contact Information</h3>
                            
                            <div className="space-y-3">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Hotline Number</label>
                                <input
                                  type="text"
                                  value={supportPhone}
                                  onChange={(e) => setSupportPhone(e.target.value)}
                                  className="w-full bg-[#171C27] border border-[var(--border)] rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-[#20947c]"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">WhatsApp Hotline Number</label>
                                <input
                                  type="text"
                                  value={supportWhatsApp}
                                  onChange={(e) => setSupportWhatsApp(e.target.value)}
                                  className="w-full bg-[#171C27] border border-[var(--border)] rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-[#20947c]"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Support Email Address</label>
                                <input
                                  type="email"
                                  value={supportEmail}
                                  onChange={(e) => setSupportEmail(e.target.value)}
                                  className="w-full bg-[#171C27] border border-[var(--border)] rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-[#20947c]"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer & Announcement alert area */}
                        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] text-left space-y-4">
                          <h3 className="text-xs font-black uppercase text-[#20947c] tracking-wider">Footer Copy & Announcement Alert Notice</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Announcement Notice Text</label>
                              <textarea
                                value={announcementText}
                                onChange={(e) => setAnnouncementText(e.target.value)}
                                rows={3}
                                className="w-full bg-[#171C27] border border-[var(--border)] rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-[#20947c] leading-relaxed"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Footer Copyright Info</label>
                              <textarea
                                value={footerCopyright}
                                onChange={(e) => setFooterCopyright(e.target.value)}
                                rows={3}
                                className="w-full bg-[#171C27] border border-[var(--border)] rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-[#20947c] leading-relaxed"
                                required
                              />
                            </div>
                          </div>

                          {/* Reset Database option */}
                          <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/20 p-3 rounded-xl">
                            <div className="text-left">
                              <span className="text-[10px] text-rose-500 font-extrabold uppercase tracking-wider block">Maintenance Database Action</span>
                              <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                                Reset the entire database to the default seeding. This will clear user data, orders, and reset site customizer configurations.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleResetDB}
                              className="py-1.5 px-4 bg-rose-950/30 border border-rose-900/40 hover:border-red-500/50 text-[#F2586B] font-display font-black text-[9px] uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <RefreshCw size={11} className="stroke-[2.5]" />
                              Reset All Seeding
                            </button>
                          </div>
                        </div>

                        {/* Sticky Action Bar */}
                        <button
                          type="submit"
                          className="w-full py-3 bg-[#20947c] hover:bg-[#187561] text-white font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex justify-center items-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          <Save size={16} /> Save Section Texts
                        </button>
                      </form>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* TAB 5: SLIDER PROMOTIONAL BANNERS */}
          {activeTab === 'banners' && (
            <div id="admin-view-banners" className="space-y-6 animate-fadeIn text-left">
              <div className="border-b border-[var(--border)] pb-4">
                <h2 className="font-display font-extrabold text-lg text-[var(--text)] uppercase tracking-wide">Slider Promo Banners</h2>
                <p className="text-xs text-[var(--muted)]">Add or remove promotional slider banners seen on the homepage carousel.</p>
              </div>

              {/* Form: Add Banner */}
              <form onSubmit={handleAddBanner} id="form-add-banner" className="bg-[var(--surface)] border border-[var(--border)] p-5 rounded-2xl space-y-4 animate-fadeIn">
                <h3 className="text-xs font-black uppercase text-[#F5B822] flex items-center gap-1.5">
                  <Plus size={16} /> Load Promotion Slide Form
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--muted)] mb-1 uppercase tracking-wider">Slide Header Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. কীভাবে ১ সেকেন্ডে PUBG UC কিনবেন?"
                      value={newBannerTitle}
                      onChange={(e) => setNewBannerTitle(e.target.value)}
                      className="w-full bg-[#171C27] border border-[var(--border)] focus:border-[#F5B822] rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--muted)] mb-1 uppercase tracking-wider">Slide Subtitle / Subtext</label>
                    <input
                      type="text"
                      placeholder="e.g. bKash / Nagad Instant Auto-Payment"
                      value={newBannerSubtitle}
                      onChange={(e) => setNewBannerSubtitle(e.target.value)}
                      className="w-full bg-[#171C27] border border-[var(--border)] focus:border-[#F5B822] rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-[var(--muted)] mb-1 uppercase tracking-wider">Banner Image Link URL *</label>
                    <input
                      type="text"
                      placeholder="Load banner illustration image address..."
                      value={newBannerImage}
                      onChange={(e) => setNewBannerImage(e.target.value)}
                      className="w-full bg-[#171C27] border border-[var(--border)] focus:border-[#F5B822] rounded-xl px-3 py-2 text-white text-xs focus:outline-none font-mono"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#F5B822] hover:bg-[#e5aa1c] text-slate-950 font-display font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex justify-center items-center gap-1.5 cursor-pointer shadow-md active:scale-98"
                >
                  Add Banner Slide
                </button>
              </form>

              {/* List Active Banners */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-[var(--muted)] tracking-wider">Current Homepage Slides</h3>
                {config.banners.length === 0 ? (
                  <p className="text-xs text-[var(--muted)]">No active slide banners. Homepage slider will be hidden.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {config.banners.map((banner) => (
                      <div key={banner.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden text-left relative group">
                        <img src={banner.imageUrl} alt="" className="w-full h-32 object-cover opacity-60" onError={(e)=>{e.currentTarget.src='https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400'}} />
                        <div className="p-4 absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-[#0A0E14] to-transparent">
                          <button
                            onClick={() => handleRemoveBanner(banner.id)}
                            className="self-end bg-[#3A1620]/80 hover:bg-[#F2586B] text-[#F2586B] hover:text-white p-2 rounded-xl border border-[#F2586B]/20 transition-all cursor-pointer"
                            title="Remove Slide"
                          >
                            <Trash2 size={14} />
                          </button>
                          <div>
                            <h4 className="text-xs font-bold text-white leading-tight truncate">{banner.title}</h4>
                            <span className="text-[10px] text-[#35D48A] block truncate mt-1">{banner.subtitle}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: ADMIN PROFILE & SECURE ACCESS SETTINGS */}
          {activeTab === 'profile' && (
            <div id="admin-view-profile" className="space-y-6 animate-fadeIn text-left max-w-2xl mx-auto">
              <div className="border-b border-[var(--border)] pb-4">
                <h2 className="font-display font-extrabold text-lg text-[var(--text)] uppercase tracking-wide">Admin Profile & Settings</h2>
                <p className="text-xs text-[var(--muted)]">Manage your administrative display identity and control dashboard access keys.</p>
              </div>

              {/* Profile Card */}
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 space-y-6 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#8B7CF6]/10 to-[#F5B822]/10 rounded-full blur-2xl" />
                
                <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-[var(--border)]">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B7CF6] to-[#F5B822] flex items-center justify-center shadow-lg shadow-[#8B7CF6]/20">
                    <UserIcon className="w-8 h-8 text-[#0A0E14]" />
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <h3 className="text-base font-black text-[var(--text)]">{adminName}</h3>
                    <p className="text-xs text-[var(--muted)] font-mono uppercase tracking-wider">System Super Administrator</p>
                    <div className="inline-flex items-center gap-1.5 bg-[#35D48A]/10 border border-[#35D48A]/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#35D48A]">
                      <span className="w-1 h-1 rounded-full bg-[#35D48A] animate-pulse" /> Verified Console Operator
                    </div>
                  </div>
                </div>

                {/* Form to update Name & Passcode */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const nameInput = form.elements.namedItem('adminNameInput') as HTMLInputElement;
                    const passInput = form.elements.namedItem('adminPasscodeInput') as HTMLInputElement;
                    const confirmPassInput = form.elements.namedItem('adminConfirmPasscodeInput') as HTMLInputElement;

                    if (!nameInput.value.trim()) {
                      showToast('Name cannot be empty.', 'error');
                      return;
                    }
                    if (passInput.value) {
                      if (passInput.value.length < 4) {
                        showToast('Access passcode must be at least 4 characters.', 'error');
                        return;
                      }
                      if (passInput.value !== confirmPassInput.value) {
                        showToast('Passcodes do not match.', 'error');
                        return;
                      }
                      setAdminPasscode(passInput.value);
                      localStorage.setItem('admin_passcode', passInput.value);
                    }

                    setAdminName(nameInput.value.trim());
                    localStorage.setItem('admin_name', nameInput.value.trim());
                    showToast('Admin Profile updated successfully!', 'success');
                    
                    // Clear passwords in form
                    passInput.value = '';
                    confirmPassInput.value = '';
                  }}
                  className="space-y-5"
                >
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">Admin Display Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="adminNameInput"
                        defaultValue={adminName}
                        required
                        className="w-full bg-[#171C27] border border-[var(--border)] focus:border-[#F5B822] rounded-xl pl-10 pr-4 py-2.5 text-white text-xs focus:outline-none font-medium transition-all"
                        placeholder="Enter admin name"
                      />
                      <UserIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="block text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">New Access Passcode</label>
                      <div className="relative">
                        <input
                          type="password"
                          name="adminPasscodeInput"
                          className="w-full bg-[#171C27] border border-[var(--border)] focus:border-[#F5B822] rounded-xl pl-10 pr-4 py-2.5 text-white text-xs focus:outline-none font-mono transition-all"
                          placeholder="•••••• (Leave blank to keep current)"
                        />
                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="block text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">Confirm New Passcode</label>
                      <div className="relative">
                        <input
                          type="password"
                          name="adminConfirmPasscodeInput"
                          className="w-full bg-[#171C27] border border-[var(--border)] focus:border-[#F5B822] rounded-xl pl-10 pr-4 py-2.5 text-white text-xs focus:outline-none font-mono transition-all"
                          placeholder="•••••• (Leave blank to keep current)"
                        />
                        <AlertTriangle size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#8B7CF6] to-[#F5B822] hover:opacity-90 text-[#0A0E14] font-display font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex justify-center items-center gap-2 cursor-pointer shadow-lg shadow-[#8B7CF6]/15 active:scale-98"
                    >
                      <CheckCircle2 size={16} /> Update Admin Profile Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
