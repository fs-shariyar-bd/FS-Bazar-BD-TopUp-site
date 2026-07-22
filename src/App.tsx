import React, { useState, useEffect } from 'react';
import { Game, TopupOption, User, SiteConfig } from './types';
import Header from './template/header';
import DynamicFooter from './template/footer';
import GameCard from './components/frontend/common/GameCard';
import BannerSlider from './components/frontend/common/BannerSlider';
import UserDashboard from './components/frontend/user/UserDashboard';
import AdminPanel from './components/admin/AdminPanel';
import PaymentModal from './components/frontend/common/PaymentModal';
import AccountSidebar from './components/frontend/user/AccountSidebar';
import InstallAppPopup from './components/frontend/common/InstallAppPopup';
import InfoPage from './components/frontend/common/InfoPage';
import { 
  X, CheckCircle, ShieldCheck, HeartHandshake, Phone, Mail, 
  HelpCircle, MessageCircle, AlertCircle, ShoppingBag, ShieldAlert,
  Wallet, ChevronRight, User as UserIcon, Lock, Landmark, RefreshCw, Clock,
  ArrowLeft, Facebook, Youtube, Instagram, Bookmark, LayoutGrid, Home, CircleUser
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Config & catalog states
  const [games, setGames] = useState<Game[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Live Activity Alert Notification state
  const [activeLiveActivity, setActiveLiveActivity] = useState<{
    name: string;
    game: string;
    amount: string;
    time: string;
  } | null>(null);

  // Auth & Session States
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [forgotEmailOrPhone, setForgotEmailOrPhone] = useState('');
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [authError, setAuthError] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1); // 1: Identify account, 2: OTP verification, 3: New password
  const [simulatedOTP, setSimulatedOTP] = useState('');
  const [userInputOTP, setUserInputOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');

  // Page Navigation State
  const [currentPage, setCurrentPage] = useState<'home' | 'user' | 'admin' | 'info'>('home');
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInstallPopupOpen, setIsInstallPopupOpen] = useState(() => {
    return localStorage.getItem('install_popup_dismissed') !== 'true';
  });
  const [userDashboardTab, setUserDashboardTab] = useState<'profile' | 'deposit' | 'orders' | 'deposits_log'>('profile');
  const [activeMobileTab, setActiveMobileTab] = useState<'home' | 'deposit' | 'orders' | 'codes' | 'profile'>('home');

  // Periodic Simulated Live Activity purchase ticker (Only runs if enabled in Admin Customizer)
  useEffect(() => {
    if (!config || config.showLiveActivity === false) {
      setActiveLiveActivity(null);
      return;
    }

    const firstNames = ["Sabbir", "Rakib", "Ariful", "Nayeem", "Tasnim", "Sakib", "Tanvir", "Sujon", "Rony", "Maruf", "Sumon", "Arafat", "Sajid", "Habib"];
    const lastNames = ["A.", "H.", "M.", "S.", "R.", "K.", "N.", "I.", "F.", "B.", "Y."];
    const itemOffers = [
      { game: "Free Fire", amount: "115 Diamonds" },
      { game: "Free Fire", amount: "240 Diamonds" },
      { game: "Free Fire", amount: "Weekly Lite Pass" },
      { game: "PUBG Mobile", amount: "60 UC" },
      { game: "PUBG Mobile", amount: "325 UC" },
      { game: "Mobile Legends", amount: "86 Diamonds" },
      { game: "Clash of Clans", amount: "Gold Pass" },
      { game: "Free Fire", amount: "Monthly Pass" }
    ];

    const triggerNotification = () => {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const offer = itemOffers[Math.floor(Math.random() * itemOffers.length)];
      
      setActiveLiveActivity({
        name: `${fName} ${lName}`,
        game: offer.game,
        amount: offer.amount,
        time: "Just now"
      });

      // Clear after 6 seconds
      setTimeout(() => {
        setActiveLiveActivity(null);
      }, 6000);
    };

    // Trigger first purchase after 4 seconds, then every 16 seconds
    const initialTimeout = setTimeout(triggerNotification, 4000);
    const interval = setInterval(triggerNotification, 16000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [config]);

  // Synchronize path and page states on back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update current page and mobile tab whenever current path changes
  useEffect(() => {
    if (currentPath.startsWith('/admin')) {
      setCurrentPage('admin');
    } else if (currentPath.startsWith('/user')) {
      setCurrentPage('user');
      if (currentPath.includes('profile')) setUserDashboardTab('profile');
      else if (currentPath.includes('deposit') && !currentPath.includes('deposits_log')) setUserDashboardTab('deposit');
      else if (currentPath.includes('deposits_log')) setUserDashboardTab('deposits_log');
      else if (currentPath.includes('orders')) setUserDashboardTab('orders');
    } else if (['/privacy', '/terms', '/refund', '/contact', '/about'].some(p => currentPath.startsWith(p))) {
      setCurrentPage('info');
    } else {
      setCurrentPage('home');
    }
  }, [currentPath]);

  // Navigate helper that pushes state to history and updates active path
  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentPage === 'home') {
      setActiveMobileTab('home');
    } else if (currentPage === 'user') {
      if (userDashboardTab === 'deposit') {
        setActiveMobileTab('deposit');
      } else if (userDashboardTab === 'orders') {
        if (activeMobileTab !== 'codes') {
          setActiveMobileTab('orders');
        }
      } else if (userDashboardTab === 'profile') {
        setActiveMobileTab('profile');
      }
    }
  }, [currentPage, userDashboardTab]);

  // Purchase Wizard States
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedOption, setSelectedOption] = useState<TopupOption | null>(null);
  const [purchaseInputs, setPurchaseInputs] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Wallet'>('bKash');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Notification / Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Pre-login prompt alert
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Initialize and load configurations
  useEffect(() => {
    loadAppConfigs();
    // Default check if there's a stored mock session
    const savedUser = sessionStorage.getItem('user_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Update selected game based on URL route
  useEffect(() => {
    if (games.length > 0) {
      const gameIdMatch = currentPath.match(/^\/game\/([^/]+)/);
      if (gameIdMatch) {
        const gameId = gameIdMatch[1];
        const foundGame = games.find(g => g.id === gameId);
        if (foundGame) {
          setSelectedGame(foundGame);
        } else {
          setSelectedGame(null);
        }
      } else {
        setSelectedGame(null);
      }
    }
  }, [currentPath, games]);

  // Synchronize active tab from user dashboard URL parameter
  useEffect(() => {
    if (currentPath === '/user/dashboard' || currentPath === '/user/dashboard/') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'profile' || tab === 'deposit' || tab === 'orders' || tab === 'deposits_log') {
        setUserDashboardTab(tab);
      }
    }
  }, [currentPath]);

  // Redirect unauthenticated user attempting to access /user/* routes
  useEffect(() => {
    if (currentPath.startsWith('/user/') && !user && !loading) {
      navigateTo('/');
      setAuthMode('login');
      setAuthModalOpen(true);
      showToast('Please log in to access your dashboard.', 'error');
    }
  }, [currentPath, user, loading]);

  const loadAppConfigs = async () => {
    try {
      setLoading(true);
      const configRes = await fetch('/api/config');
      const configData = await configRes.json();
      setConfig(configData);

      const gamesRes = await fetch('/api/games');
      const gamesData = await gamesRes.json();
      setGames(gamesData);
    } catch (err) {
      console.error("Error loading app configurations", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Auth Logic: Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authEmail || !authPassword) {
      setAuthError("Please fill in both email and password.");
      return;
    }
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        sessionStorage.setItem('user_session', JSON.stringify(data.user));
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        setAuthModalOpen(false);
        // Reset forms
        setAuthEmail('');
        setAuthPassword('');
      } else {
        setAuthError(data.error || "Login failed.");
      }
    } catch (err) {
      setAuthError("Server communication failed.");
    }
  };

  // Auth Logic: Forgot Password - Step 1
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!forgotEmailOrPhone) {
      setAuthError("Email or Phone number is required.");
      return;
    }
    if (!captchaChecked) {
      setAuthError("Please complete the captcha verification.");
      return;
    }
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: forgotEmailOrPhone })
      });
      const data = await response.json();
      if (response.ok) {
        showToast(data.message || "OTP sent successfully!", 'success');
        setSimulatedOTP(data.otp || "123456");
        setForgotStep(2); // proceed to OTP verification step
      } else {
        setAuthError(data.error || "Failed to find account.");
      }
    } catch (err) {
      setAuthError("Server communication failed.");
    }
  };

  // Auth Logic: Reset Password - Submit new password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!newPassword || !newConfirmPassword) {
      setAuthError("Both password fields are required.");
      return;
    }
    if (newPassword.length < 4) {
      setAuthError("Password must be at least 4 characters long.");
      return;
    }
    if (newPassword !== newConfirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          emailOrPhone: forgotEmailOrPhone,
          newPassword: newPassword
        })
      });
      const data = await response.json();
      if (response.ok) {
        showToast("Password reset successfully! Please log in.", 'success');
        // Reset states
        setAuthMode('login');
        setForgotStep(1);
        setForgotEmailOrPhone('');
        setSimulatedOTP('');
        setUserInputOTP('');
        setNewPassword('');
        setNewConfirmPassword('');
        setCaptchaChecked(false);
      } else {
        setAuthError(data.error || "Failed to reset password.");
      }
    } catch (err) {
      setAuthError("Server communication failed.");
    }
  };

  // Auth Logic: Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authEmail || !authPassword || !authName) {
      setAuthError("Name, email, and password are required.");
      return;
    }
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: authEmail,
          password: authPassword,
          name: authName,
          number: authPhone
        })
      });
      const data = await response.json();
      if (response.ok) {
        showToast("Registration successful! Please log in now.", 'success');
        setAuthMode('login');
        setAuthName('');
        setAuthPhone('');
      } else {
        setAuthError(data.error || "Registration failed.");
      }
    } catch (err) {
      setAuthError("Server communication failed.");
    }
  };

  // Auth: Logout
  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('user_session');
    setCurrentPage('home');
    showToast("Logged out successfully.", 'success');
  };

  // Place Top-Up Order
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("Please log in to place an order.", "error");
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }

    if (!selectedGame || !selectedOption) {
      showToast("Please select a game pack to buy.", "error");
      return;
    }

    // Validate inputs required
    const missingInputs = selectedGame.inputsRequired.filter(input => !purchaseInputs[input]);
    if (missingInputs.length > 0) {
      showToast(`Please fill in all account credentials: ${missingInputs.join(', ')}`, "error");
      return;
    }

    if (paymentMethod === 'Wallet') {
      if (user.walletBalance < selectedOption.price) {
        showToast("Insufficient wallet balance. Please add money to your wallet.", "error");
        return;
      }
      
      // Call Wallet Checkout API
      try {
        const response = await fetch('/api/orders/place', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            gameId: selectedGame.id,
            optionId: selectedOption.id,
            inputs: purchaseInputs,
            paymentMethod: 'Wallet'
          })
        });
        const data = await response.json();
        if (response.ok) {
          showToast("Order placed successfully! Wallet debited.", "success");
          setUser({ ...user, walletBalance: data.walletBalance });
          sessionStorage.setItem('user_session', JSON.stringify({ ...user, walletBalance: data.walletBalance }));
          setSelectedGame(null);
          setSelectedOption(null);
          setPurchaseInputs({});
          navigateTo('/user/dashboard?tab=orders');
        } else {
          showToast(data.error || "Failed to process wallet payment.", "error");
        }
      } catch (err) {
        showToast("Server error.", "error");
      }
    } else {
      // Direct bKash/Nagad checkout gateway pop-up!
      setIsCheckoutModalOpen(true);
    }
  };

  const handleCheckoutPaymentSuccess = async (details: { transactionId: string; senderNumber: string; isInstantGateway: boolean }) => {
    if (!user || !selectedGame || !selectedOption) return;
    try {
      const response = await fetch('/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          gameId: selectedGame.id,
          optionId: selectedOption.id,
          inputs: purchaseInputs,
          paymentMethod: paymentMethod,
          transactionId: details.transactionId,
          senderNumber: details.senderNumber
        })
      });
      const data = await response.json();
      if (response.ok) {
        showToast(`Instant Order Submitted successfully! Transaction ID: ${details.transactionId}`, "success");
        setSelectedGame(null);
        setSelectedOption(null);
        setPurchaseInputs({});
        navigateTo('/user/dashboard?tab=orders');
      } else {
        showToast(data.error || "Order failed.", "error");
      }
    } catch (err) {
      showToast("Server communication error.", "error");
    }
  };

  const handleNavigate = (page: string) => {
    if (page === 'home' || page === '/') {
      setSelectedGame(null);
      navigateTo('/');
    } else if (page === 'user' || page.startsWith('/user')) {
      if (user) {
        navigateTo(page === 'user' ? '/user/profile' : page);
      } else {
        setAuthMode('login');
        setAuthModalOpen(true);
        showToast('Please log in to access your dashboard.', 'error');
      }
    } else if (page === 'admin' || page.startsWith('/admin')) {
      const isLogged = sessionStorage.getItem('admin_logged_in') === 'true';
      if (isLogged) {
        navigateTo('/admin/dashboard');
      } else {
        navigateTo('/admin/191869-login');
      }
    } else {
      navigateTo(page.startsWith('/') ? page : `/${page}`);
    }
  };

  const handleNavigateTab = (tab: 'profile' | 'deposit' | 'orders' | 'deposits_log') => {
    setUserDashboardTab(tab);
    navigateTo(`/user/dashboard?tab=${tab}`);
  };

  const handleContactClick = () => {
    const footerElement = document.getElementById('main-footer');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <RefreshCw className="animate-spin text-emerald-500 mb-4" size={32} />
        <span className="text-sm font-semibold tracking-widest font-mono uppercase">Loading Bazar Interface...</span>
      </div>
    );
  }

  // Filter games based on search and category
  const filteredGames = games.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || g.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Theme styling helpers
  const themeColors = {
    emerald: 'emerald-500',
    cyan: 'cyan-400',
    violet: 'violet-400',
    amber: 'amber-400',
    rose: 'rose-500',
    slate: 'slate-300'
  };

  const currentThemeHex = themeColors[config.themeColor || 'emerald'];

  const activeTpl = config.activeWebsiteTemplate || 'classic';

  const getWrapperClass = () => {
    if (activeTpl === 'cyberpunk') {
      return "min-h-screen bg-[#070b14] text-slate-100 font-mono selection:bg-cyan-500 selection:text-black pb-12 flex flex-col justify-between";
    }
    if (activeTpl === 'esports') {
      return "min-h-screen bg-[#090d18] text-slate-100 font-sans selection:bg-violet-600 selection:text-white pb-12 flex flex-col justify-between";
    }
    if (activeTpl === 'retro') {
      return "min-h-screen bg-[#110520] text-slate-100 font-mono selection:bg-rose-500 selection:text-white pb-12 flex flex-col justify-between";
    }
    return "min-h-screen bg-[#f4f7f9] text-slate-800 font-sans selection:bg-[#20947c] selection:text-white pb-12 flex flex-col justify-between";
  };

  return (
    <div id="app-wrapper" className={getWrapperClass()}>
      
      {/* GLOBAL TOAST NOTIFIER */}
      <AnimatePresence>
        {toast && (
          <motion.div
            id="global-toast-alert"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl border font-semibold text-xs shadow-2xl flex items-center gap-3 backdrop-blur-md ${
              toast.type === 'success' 
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-emerald-950/20' 
                : 'bg-red-950/90 border-red-500 text-red-300 shadow-red-950/20'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={16} /> : <ShieldAlert size={16} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {currentPage === 'admin' ? (
        /* ADMIN PANEL (Has its own dedicated Admin Header, navigation & sidebar) */
        <AdminPanel 
          games={games}
          config={config}
          onRefreshGames={loadAppConfigs}
          onRefreshConfig={(updatedConfig) => {
            setConfig(updatedConfig);
          }}
          showToast={showToast}
          adminPath={currentPath.includes('dashboard') ? 'dashboard' : 'login'}
          onNavigate={navigateTo}
        />
      ) : (
        /* FRONTEND PUBLIC STORE LAYOUT */
        <>
          <div className="w-full">
            {/* CUSTOM SELECTED FRONTEND HEADER TEMPLATE */}
            <Header 
              user={user}
              config={config}
              onLogout={handleLogout}
              onOpenAuthModal={(mode) => {
                setAuthMode(mode);
                setAuthModalOpen(true);
              }}
              onNavigate={handleNavigate}
              onSearch={(val) => {
                setSearchQuery(val);
                setSelectedGame(null);
                if (currentPage !== 'home') {
                  setCurrentPage('home');
                }
              }}
            />

            {/* Dynamic Announcement Alert Marquee */}
            {config && config.showNoticeBanner !== false && (
              <div id="announcement-ticker" className="w-full bg-slate-900 border-b border-slate-800 py-2.5 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 text-xs">
                  <span className={`bg-${currentThemeHex}/10 border border-${currentThemeHex}/30 text-${currentThemeHex} font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm shrink-0 animate-pulse`}>
                    Notice
                  </span>
                  <div className="relative w-full overflow-hidden h-4">
                    <div className="absolute whitespace-nowrap animate-marquee font-medium text-slate-300">
                      {config.announcementText}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PRIMARY MAIN LAYOUT CANVAS */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
          
          {currentPage === 'home' && !selectedGame && (
            <div id="home-view" className="space-y-12">
              
              {/* Dynamic sliding banners */}
              {config.banners.length > 0 && (
                <BannerSlider banners={config.banners} />
              )}

              {/* Store categories navigation slider */}
              <div className="flex flex-row items-center justify-between gap-3 sm:gap-6 border-b border-slate-100 pb-3">
                <div className="text-left shrink-0">
                  <h2 className="text-sm sm:text-lg md:text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5 sm:gap-2">
                    <span className="w-1.5 h-5 sm:h-6 bg-[#20947c] inline-block rounded-full" />
                    {config?.sectionHomeTitle || "FS Bazar Store"}
                  </h2>
                </div>

                {/* Filter list */}
                <div className="flex overflow-x-auto gap-1.5 sm:gap-2 pb-1 scrollbar-none font-semibold text-[11px] sm:text-xs">
                  {[
                    { id: 'all', label: 'All Categories' },
                    { id: 'mobile', label: 'Mobile Games' },
                    { id: 'pc', label: 'PC Games' },
                    { id: 'vouchers', label: 'Vouchers' },
                    { id: 'subscriptions', label: 'Subscriptions' },
                  ].map((cat) => (
                    <button
                      id={`category-filter-btn-${cat.id}`}
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full cursor-pointer transition-all whitespace-nowrap border ${
                        activeCategory === cat.id
                          ? 'bg-[#20947c]/10 border-[#20947c] text-[#20947c] font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid lists of catalog items based on customization */}
              {filteredGames.length === 0 ? (
                <div className="text-center py-20 border border-slate-200 border-dashed rounded-3xl text-slate-500 bg-white">
                  <ShoppingBag size={48} className="mx-auto mb-3 text-slate-400" />
                  <p className="text-sm font-bold text-slate-700">No gaming items match your query.</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching another game title or clear search bar.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {filteredGames.map((game) => (
                    <GameCard 
                      key={game.id}
                      game={game}
                      template={config.activeCardTemplate}
                      themeColor={config.themeColor}
                      activeWebsiteTemplate={config.activeWebsiteTemplate}
                      onSelect={(g) => {
                        navigateTo(`/game/${g.id}`);
                        setSelectedOption(null);
                        setPurchaseInputs({});
                        if (!user) {
                          setShowLoginPrompt(true);
                        }
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Security features badge */}
              {config && config.showStatsCounter !== false && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white border border-slate-200/80 p-6 rounded-3xl mt-12 text-left shadow-xs">
                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-[#20947c] shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">100% Secure Payments</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Official bKash/Nagad automatic API sandbox checks with immediate transaction logs.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-[#20947c] shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Instant Deliveries</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Top-ups are auto-debited or manual queue verified in less than 5 minutes.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-[#20947c] shrink-0">
                      <HeartHandshake size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Helpdesk Help</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Speak to store owners or reach out directly via WhatsApp for quick assistance.</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* DEDICATED IN-PAGE DETAILS PAGE - NO POPUPS (Matches image 4 same-to-same) */}
          {currentPage === 'home' && selectedGame && (
            <div id="game-details-view" className="space-y-6 text-left max-w-4xl mx-auto">

              {/* Back to Catalog button */}
              <button 
                onClick={() => navigateTo('/')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-xs font-black uppercase tracking-wider bg-slate-50 border border-slate-200/60 rounded-full px-4 py-2 self-start cursor-pointer hover:bg-slate-100 transition-all shadow-xs"
              >
                <ArrowLeft size={14} className="stroke-[3]" />
                Back to Catalog
              </button>

              {/* Title Section resembling Image 4 */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                  <img src={selectedGame.logo} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-extrabold text-slate-800">{selectedGame.name}</h1>
                  <p className="text-xs text-slate-400 mt-1">{selectedGame.description || 'Secure direct in-game player ID delivery.'}</p>
                </div>
              </div>

              {/* Step Form Wrapper */}
              <form onSubmit={handleOrderSubmit} className="space-y-6">

                {/* STEP 1: Account Info */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <span className="bg-[#20947c] text-white font-extrabold text-sm rounded-full h-7 w-7 flex items-center justify-center">1</span>
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Account Info</h3>
                  </div>
                  <div className="space-y-2 max-w-md">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Player Id *</label>
                    <input
                      id="details-player-id"
                      type="text"
                      required
                      placeholder="Enter player id"
                      value={purchaseInputs['playerId'] || ''}
                      onChange={(e) => setPurchaseInputs({ ...purchaseInputs, playerId: e.target.value })}
                      className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#20947c] focus:ring-1 focus:ring-[#20947c] transition-all font-semibold shadow-xs"
                    />
                  </div>
                </div>

                {/* STEP 2: Select Package */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <span className="bg-[#20947c] text-white font-extrabold text-sm rounded-full h-7 w-7 flex items-center justify-center">2</span>
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Select Package</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedGame.topupOptions.map((opt) => {
                      const isOutOfStock = opt.stock === 0;
                      const isSelected = selectedOption?.id === opt.id;
                      
                      return (
                        <button
                          id={`opt-details-choice-${opt.id}`}
                          key={opt.id}
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => setSelectedOption(opt)}
                          className={`relative py-4 px-3 rounded-[2px] border text-center cursor-pointer transition-all flex items-center justify-center min-h-[56px] bg-white overflow-hidden ${
                            isOutOfStock 
                              ? 'opacity-60 border-slate-200 bg-slate-50 cursor-not-allowed'
                              : isSelected
                                ? 'border-[#20947c] border-2 bg-white ring-0 shadow-sm'
                                : 'border-slate-200 hover:border-[#20947c]/30 hover:shadow-xs'
                          }`}
                        >
                          {/* Upper-Left checkmark badge matching Image 5 exactly */}
                          {isSelected && !isOutOfStock && (
                            <div className="absolute top-0 left-0 bg-[#20947c] text-white rounded-br-[10px] rounded-tl-[2px] w-6 h-5 flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="4.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}

                          <div className="flex items-center justify-center flex-wrap gap-1.5 min-w-0">
                            <span className={`font-bold text-xs sm:text-sm truncate ${isSelected ? 'text-[#20947c]' : 'text-slate-800'}`}>
                              {opt.name}
                            </span>
                            <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-[#20947c]' : 'text-[#20947c]'}`}>
                              ৳ {opt.price}
                            </span>
                            {isOutOfStock && (
                              <span className="inline-block bg-amber-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded uppercase ml-1">
                                Out of stock
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STEP 3: Select Payment */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <span className="bg-[#20947c] text-white font-extrabold text-sm rounded-full h-7 w-7 flex items-center justify-center">3</span>
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Select Payment</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Payment 1: Auto Payment */}
                    <div
                      id="details-pay-bkash-nagad"
                      onClick={() => setPaymentMethod('bKash')}
                      className={`relative border rounded-[2px] p-4 flex flex-col justify-between items-center text-center cursor-pointer min-h-[150px] transition-all bg-white hover:shadow-sm ${
                        paymentMethod === 'bKash' || paymentMethod === 'Nagad'
                          ? 'border-[#20947c] bg-[#20947c]/5 ring-1 ring-[#20947c]'
                          : 'border-slate-200 hover:border-[#20947c]/30'
                      }`}
                    >
                      {(paymentMethod === 'bKash' || paymentMethod === 'Nagad') && (
                        <div className="absolute top-2.5 left-2.5 bg-[#20947c] text-white rounded-[1px] p-0.5 shadow-xs">
                          <CheckCircle size={12} className="stroke-[3]" />
                        </div>
                      )}
                      {/* Logo block */}
                      <div className="flex items-center gap-1.5 py-2">
                        <span className="text-[#E2136E] font-extrabold text-xs bg-[#E2136E]/10 rounded-[1px] px-1.5 py-0.5">bKash</span>
                        <span className="text-[#F26422] font-extrabold text-xs bg-[#F26422]/10 rounded-[1px] px-1.5 py-0.5">Nagad</span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-700">Auto Payment</span>
                      <div className={`w-full text-center text-[9px] font-bold py-1.5 rounded-[2px] mt-3 uppercase tracking-wider transition-all ${
                        paymentMethod === 'bKash' || paymentMethod === 'Nagad'
                          ? 'bg-[#20947c] text-white'
                          : 'bg-slate-50 border border-slate-100 text-slate-500'
                      }`}>
                        Payment Now
                      </div>
                    </div>

                    {/* Payment 2: EPS Payment */}
                    <div
                      id="details-pay-eps"
                      onClick={() => setPaymentMethod('bKash')} // map to default bKash for sandbox checkout fallback
                      className="relative border border-slate-200 rounded-[2px] p-4 hover:border-[#20947c]/30 flex flex-col justify-between items-center text-center cursor-pointer min-h-[150px] transition-all bg-white hover:shadow-sm"
                    >
                      {/* Logo block */}
                      <div className="flex items-center gap-1.5 py-2">
                        <span className="text-slate-400 font-extrabold text-[10px] bg-slate-50 border border-slate-100 rounded-[1px] px-1.5 py-0.5">EPS Gate</span>
                      </div>
                      <span className="text-xs font-bold text-slate-500">EPS Payment</span>
                      <div className="w-full text-center text-[9px] font-bold py-1.5 rounded-[2px] mt-3 uppercase tracking-wider bg-slate-50 border border-slate-100 text-slate-500">
                        Select EPS
                      </div>
                    </div>

                    {/* Payment 3: Pipobazar Wallet */}
                    <div
                      id="details-pay-wallet"
                      onClick={() => {
                        if (!user) {
                          showToast("Please login first to use your Pipobazar wallet.", "error");
                        } else {
                          setPaymentMethod('Wallet');
                        }
                      }}
                      className={`relative border rounded-[2px] p-4 flex flex-col justify-between items-center text-center cursor-pointer min-h-[150px] transition-all bg-white hover:shadow-sm ${
                        paymentMethod === 'Wallet'
                          ? 'border-[#20947c] bg-[#20947c]/5 ring-1 ring-[#20947c]'
                          : 'border-slate-200 hover:border-[#20947c]/30'
                      }`}
                    >
                      {paymentMethod === 'Wallet' && (
                        <div className="absolute top-2.5 left-2.5 bg-[#20947c] text-white rounded-[1px] p-0.5 shadow-xs">
                          <CheckCircle size={12} className="stroke-[3]" />
                        </div>
                      )}
                      {/* Logo block */}
                      <div className="flex items-center gap-1 py-2">
                        <span className="text-slate-800 font-black tracking-tighter text-xs">PIPO <span className="text-[#20947c]">BAZAR</span></span>
                      </div>
                      <div className="space-y-0.5 flex flex-col items-center">
                        <span className="text-xs font-bold text-slate-500 block">Pipobazar Wallet</span>
                        {user && (
                          <span className="text-[10px] text-emerald-600 font-mono block font-bold">Balance: ৳ {user.walletBalance} BDT</span>
                        )}
                      </div>
                      <div className={`w-full text-center text-[9px] font-bold py-1.5 rounded-[2px] mt-3 uppercase tracking-wider transition-all ${
                        paymentMethod === 'Wallet'
                          ? 'bg-[#20947c] text-white'
                          : 'bg-slate-50 border border-slate-100 text-slate-500'
                      }`}>
                        Use Wallet
                      </div>
                    </div>
                  </div>

                  {/* Wallet insufficient warnings */}
                  {paymentMethod === 'Wallet' && user && user.walletBalance < (selectedOption?.price || 0) && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl flex items-center gap-2 mt-2 font-semibold">
                      <ShieldAlert size={14} />
                      <span>Insufficient wallet balance. You need ৳ {selectedOption?.price} BDT but have only ৳ {user.walletBalance} BDT.</span>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                    {!user ? (
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          id="details-action-login"
                          type="button"
                          onClick={() => {
                            setAuthMode('login');
                            setAuthModalOpen(true);
                          }}
                          className="px-6 py-2.5 border-2 border-[#20947c] text-[#20947c] hover:bg-[#20947c]/5 font-extrabold rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Login to Buy
                        </button>
                        <span className="text-xs text-slate-400 font-semibold">Please log in to finalize your purchase.</span>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                        <div className="text-left font-mono">
                          {selectedOption ? (
                            <div>
                              <span className="text-xs text-slate-400 font-sans block uppercase font-bold">Selected Pack Price</span>
                              <span className="text-lg font-black text-[#20947c]">৳ {selectedOption.price} BDT</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-sans font-bold">Please select a package in Step 2</span>
                          )}
                        </div>
                        
                        <button
                          id="details-action-buy"
                          type="submit"
                          disabled={!selectedOption}
                          className="px-10 py-3.5 bg-[#20947c] hover:bg-[#1a836a] text-white font-extrabold rounded-full text-xs uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-emerald-950/10 cursor-pointer"
                        >
                          Buy Pack Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* STEP 4: Rules & Conditions */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs space-y-4 text-left">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <span className="bg-[#20947c] text-white font-extrabold text-sm rounded-full h-7 w-7 flex items-center justify-center">4</span>
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Rules & Conditions</h3>
                  </div>

                  <div className="border border-blue-100 bg-blue-50/20 rounded-xl p-4 sm:p-5 text-xs text-slate-600 font-medium space-y-2.5 leading-relaxed">
                    <p className="flex items-start gap-2">
                      <span className="text-emerald-600 shrink-0 mt-0.5">☉</span>
                      <span>শুধুমাত্র Bangladesh সার্ভারে ID Code দিয়ে টপ আপ হবে।</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-emerald-600 shrink-0 mt-0.5">☉</span>
                      <span>Player ID Code ভুল দিয়ে Diamond না পেলে PipoBazar কর্তৃপক্ষ দায়ী নয়।</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-emerald-600 shrink-0 mt-0.5">☉</span>
                      <span>Order কমপ্লিট হওয়ার পরেও আইডিতে ডাইমন্ড না গেলে চেক করার জন্য ID Pass দিতে হবে।</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-emerald-600 shrink-0 mt-0.5">☉</span>
                      <span>অর্ডার Cancel হলে কি কারণে তা Cancel হয়েছে তা অর্ডার হিস্টোরিতে দেওয়া থাকে অনুগ্রহ পূর্বক দেখে পুনরায় সঠিক তথ্য দিয়ে অর্ডার করবেন।</span>
                    </p>
                  </div>
                </div>

              </form>
            </div>
          )}

          {currentPage === 'user' && user && (
            <UserDashboard 
              user={user}
              config={config}
              onRefreshUser={(updatedUser) => {
                setUser(updatedUser);
                sessionStorage.setItem('user_session', JSON.stringify(updatedUser));
              }}
              showToast={showToast}
              initialTab={userDashboardTab}
            />
          )}

          {currentPage === 'info' && (
            <InfoPage 
              path={currentPath} 
              config={config} 
              onNavigate={handleNavigate} 
            />
          )}

        </main>
      </div>

      {/* DYNAMIC FOOTER TEMPLATE (Configurable from Admin Panel) */}
      <DynamicFooter 
        config={config} 
        games={games} 
        onNavigate={handleNavigate} 
        onSelectGame={(g) => { setSelectedGame(g); handleNavigate('home'); }} 
      />
    </>
  )}

      {/* MODAL 1: AUTHENTICATION POPUP */}
      <AnimatePresence>
        {authModalOpen && (
          <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <motion.div
              id="auth-modal-box"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white border border-blue-50/80 p-7 rounded-[2px] shadow-[0_4px_24px_rgba(15,23,42,0.08)] space-y-5 text-left"
            >
              <button
                id="close-auth-modal"
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>

              {/* Login View */}
              {authMode === 'login' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Login</h3>
                  </div>

                  {authError && (
                    <div id="auth-error-alert" className="p-3 bg-red-50 border border-red-100 rounded-[2px] text-[11px] text-red-600 flex gap-2 items-start">
                      <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* Sign in with Google Button */}
                  <button
                    type="button"
                    onClick={() => showToast("Google Sign-In is simulated. Please use demo credentials.", "error")}
                    className="w-auto flex items-center gap-2 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-[2px] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.68 1.44 7.6l3.87 3C6.27 7.75 8.91 5.04 12 5.04z" />
                      <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.45c-.28 1.44-1.1 2.66-2.33 3.48v2.88h3.76c2.2-2.02 3.61-5 3.61-8.46z" />
                      <path fill="#FBBC05" d="M5.31 14.4c-.24-.72-.38-1.49-.38-2.4s.14-1.68.38-2.4V6.6H1.44C.52 8.22 0 10.05 0 12s.52 3.78 1.44 5.4l3.87-3z" />
                      <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.76-2.88c-1.04.7-2.38 1.12-4.17 1.12-3.09 0-5.73-2.71-6.69-5.56H1.44v3C3.37 20.32 7.35 23 12 23z" />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>

                  <form onSubmit={handleLogin} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5">Email</label>
                      <input
                        id="input-auth-email"
                        type="email"
                        placeholder="Email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 px-3.5 py-2.5 rounded-[2px] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5">Password</label>
                      <input
                        id="input-auth-password"
                        type="password"
                        placeholder="Password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 px-3.5 py-2.5 rounded-[2px] transition-all"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs py-1">
                      <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded-[2px] focus:ring-blue-500 cursor-pointer"
                        />
                        <span>Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => { setAuthMode('forgot_password'); setAuthError(''); }}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      id="btn-auth-submit"
                      type="submit"
                      className="w-full py-2.5 bg-[#155d4d] hover:bg-[#0f4d3e] text-white font-bold rounded-[2px] tracking-wide transition-all shadow-xs cursor-pointer text-center text-xs"
                    >
                      Login
                    </button>
                  </form>

                  <div className="text-center text-[11px] text-slate-600 pt-1">
                    Don't have any account?{' '}
                    <button
                      id="toggle-auth-reg"
                      onClick={() => { setAuthMode('register'); setAuthError(''); }}
                      className="text-blue-600 hover:underline font-bold"
                    >
                      Create One
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password View */}
              {authMode === 'forgot_password' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Account Recovery</h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {forgotStep === 1 && "Identify your account to request a secure OTP reset code."}
                      {forgotStep === 2 && "Enter the 6-digit verification code sent to your registered contact."}
                      {forgotStep === 3 && "Set a new secure password to regain access to your account."}
                    </p>
                  </div>

                  {authError && (
                    <div id="auth-error-alert" className="p-3 bg-red-50 border border-red-100 rounded-[2px] text-[11px] text-red-600 flex gap-2 items-start">
                      <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* STEP 1: Enter email/phone & captcha */}
                  {forgotStep === 1 && (
                    <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1.5">Email or Phone</label>
                        <input
                          id="input-forgot-email"
                          type="text"
                          placeholder="Enter your email or phone number"
                          value={forgotEmailOrPhone}
                          onChange={(e) => setForgotEmailOrPhone(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 px-3.5 py-2.5 rounded-[2px] transition-all"
                        />
                      </div>

                      {/* reCAPTCHA Custom Widget */}
                      <div className="bg-slate-50/70 border border-slate-200/80 p-3 flex items-center justify-between rounded-[2px] shadow-2xs select-none">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setCaptchaChecked(!captchaChecked)}
                            className="w-6 h-6 border-2 border-slate-300 bg-white flex items-center justify-center transition-all hover:border-slate-400 focus:outline-none rounded-[2px]"
                          >
                            {captchaChecked && (
                              <svg className="w-4 h-4 text-emerald-600 stroke-[4.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <span className="text-xs text-slate-700 font-medium">I'm not a robot</span>
                        </div>

                        <div className="flex flex-col items-center justify-center text-[7px] text-slate-400 leading-none">
                          <svg className="w-6 h-6 text-blue-500 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                          </svg>
                          <span className="font-bold tracking-wider text-[7px]">reCAPTCHA</span>
                          <span className="text-[6px] text-slate-400/80 mt-0.5">Privacy - Terms</span>
                        </div>
                      </div>

                      <button
                        id="btn-forgot-submit"
                        type="submit"
                        className="w-full py-2.5 bg-[#155d4d] hover:bg-[#0f4d3e] text-white font-bold rounded-[2px] tracking-wide transition-all shadow-xs cursor-pointer text-center text-xs"
                      >
                        Send Reset Code
                      </button>
                    </form>
                  )}

                  {/* STEP 2: Verify OTP Code */}
                  {forgotStep === 2 && (
                    <div className="space-y-4 text-xs">
                      {/* Interactive Simulated OTP helper badge */}
                      <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-lg text-left space-y-1">
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Developer Sandbox Guide</span>
                        <p className="text-[11px] text-amber-900 font-medium">
                          Check your simulated mailbox! Use this security key to verify:
                        </p>
                        <button 
                          onClick={() => setUserInputOTP(simulatedOTP)}
                          className="mt-1 inline-flex items-center gap-1.5 bg-amber-600 text-white hover:bg-amber-700 px-3 py-1 rounded font-mono text-xs font-extrabold cursor-pointer transition-colors"
                          title="Click to autofill OTP"
                        >
                          {simulatedOTP}
                          <span className="text-[9px] font-sans font-normal text-amber-100">(autofill)</span>
                        </button>
                      </div>

                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          setAuthError('');
                          if (userInputOTP === simulatedOTP) {
                            showToast("Verification successful! Please choose a new password.", 'success');
                            setForgotStep(3);
                          } else {
                            setAuthError("Incorrect code. Please verify the code and try again.");
                          }
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-slate-700 font-bold mb-1.5">Verification Code</label>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="Enter 6-digit code"
                            value={userInputOTP}
                            onChange={(e) => setUserInputOTP(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 px-3.5 py-2.5 rounded-[2px] text-center font-mono text-lg tracking-widest transition-all"
                          />
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const response = await fetch('/api/auth/forgot-password', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ emailOrPhone: forgotEmailOrPhone })
                                });
                                const data = await response.json();
                                if (response.ok) {
                                  setSimulatedOTP(data.otp);
                                  showToast("A new verification code was sent!", "success");
                                }
                              } catch(e) {}
                            }}
                            className="text-emerald-700 hover:underline font-bold"
                          >
                            Resend Code
                          </button>
                          <button
                            type="button"
                            onClick={() => setForgotStep(1)}
                            className="text-slate-500 hover:underline"
                          >
                            Change Email/Phone
                          </button>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#155d4d] hover:bg-[#0f4d3e] text-white font-bold rounded-[2px] tracking-wide transition-all shadow-xs cursor-pointer text-center text-xs"
                        >
                          Verify OTP Code
                        </button>
                      </form>
                    </div>
                  )}

                  {/* STEP 3: Setup New Password */}
                  {forgotStep === 3 && (
                    <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1.5">New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 px-3.5 py-2.5 rounded-[2px] transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1.5">Confirm New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={newConfirmPassword}
                          onChange={(e) => setNewConfirmPassword(e.target.value)}
                          className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 px-3.5 py-2.5 rounded-[2px] transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-[2px] tracking-wide transition-all shadow-xs cursor-pointer text-center text-xs"
                      >
                        Reset Password & Login
                      </button>
                    </form>
                  )}

                  <div className="text-center text-[11px] text-slate-600 pt-1">
                    <button
                      id="back-to-login"
                      onClick={() => { 
                        setAuthMode('login'); 
                        setForgotStep(1); 
                        setAuthError(''); 
                      }}
                      className="text-blue-600 hover:underline font-bold"
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              )}

              {/* Register View */}
              {authMode === 'register' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Create Account</h3>
                  </div>

                  {authError && (
                    <div id="auth-error-alert" className="p-3 bg-red-50 border border-red-100 rounded-[2px] text-[11px] text-red-600 flex gap-2 items-start">
                      <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleRegister} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5">Full Name</label>
                      <input
                        id="input-auth-name"
                        type="text"
                        placeholder="e.g. Ferdous Shariyar"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 px-3.5 py-2.5 rounded-[2px] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5">Email Address</label>
                      <input
                        id="input-auth-email"
                        type="email"
                        placeholder="name@gmail.com"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 px-3.5 py-2.5 rounded-[2px] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5">Password</label>
                      <input
                        id="input-auth-password"
                        type="password"
                        placeholder="••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 px-3.5 py-2.5 rounded-[2px] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5">Mobile Number (Optional)</label>
                      <input
                        id="input-auth-phone"
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 px-3.5 py-2.5 rounded-[2px] transition-all font-mono"
                      />
                    </div>

                    <button
                      id="btn-auth-submit"
                      type="submit"
                      className="w-full py-2.5 bg-[#155d4d] hover:bg-[#0f4d3e] text-white font-bold rounded-[2px] tracking-wide transition-all shadow-xs cursor-pointer text-center text-xs"
                    >
                      Create Account
                    </button>
                  </form>

                  <div className="text-center text-[11px] text-slate-600 pt-1">
                    Already have an account?{' '}
                    <button
                      id="toggle-auth-login"
                      onClick={() => { setAuthMode('login'); setAuthError(''); }}
                      className="text-blue-600 hover:underline font-bold"
                    >
                      Sign In here
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Credentials Alert helper */}
              <div className="bg-slate-50 p-3 rounded-[2px] border border-slate-150 text-[10px] space-y-1 text-slate-500 font-mono">
                <span className="text-amber-600 font-bold block uppercase tracking-wider text-[9px]">Demo Logins Available:</span>
                <div>👤 <span className="text-slate-700 font-medium">Customer:</span> customer@bazar.com / user (Balance ৳1250)</div>
                <div>👑 <span className="text-slate-700 font-medium">Admin:</span> admin@bazar.com / admin</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DYNAMIC CHECKOUT GATEWAY SANBOX PORTAL */}
      <PaymentModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        amount={selectedOption?.price || 0}
        paymentMethod={paymentMethod === 'Wallet' ? 'bKash' : paymentMethod as any}
        onPaymentSuccess={handleCheckoutPaymentSuccess}
      />

      {/* NEW SIDEBAR DRAWERS & POPUPS FOR USER ACCOUNTS */}
      <AnimatePresence>
        {isSidebarOpen && user && (
          <AccountSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            user={user}
            onLogout={handleLogout}
            onNavigateTab={handleNavigateTab}
            onContactClick={handleContactClick}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInstallPopupOpen && (
          <InstallAppPopup
            isOpen={isInstallPopupOpen}
            onClose={() => {
              setIsInstallPopupOpen(false);
              localStorage.setItem('install_popup_dismissed', 'true');
            }}
          />
        )}
      </AnimatePresence>
      
      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-2 py-2 pb-safe-bottom">
        <div className="flex items-center justify-around w-full max-w-lg mx-auto">
          {/* Home Tab */}
          <button
            id="mobile-nav-home"
            onClick={() => {
              setCurrentPage('home');
              setSelectedGame(null);
              setActiveMobileTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-all cursor-pointer ${
              activeMobileTab === 'home' 
                ? 'text-[#0c1a30] font-black' 
                : 'text-slate-500 font-semibold hover:text-slate-700'
            }`}
          >
            <Home size={20} className={`transition-transform duration-200 ${activeMobileTab === 'home' ? 'scale-110 stroke-[2.5]' : 'stroke-[2]'}`} />
            <span className="text-[10px] sm:text-xs tracking-tight">Home</span>
          </button>

          {/* Add Money Tab */}
          <button
            id="mobile-nav-add-money"
            onClick={() => {
              if (user) {
                handleNavigateTab('deposit');
                setActiveMobileTab('deposit');
              } else {
                setAuthMode('login');
                setAuthModalOpen(true);
              }
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-all cursor-pointer ${
              activeMobileTab === 'deposit' 
                ? 'text-[#0c1a30] font-black' 
                : 'text-slate-500 font-semibold hover:text-slate-700'
            }`}
          >
            <div className="relative">
              <Wallet size={20} className={`transition-transform duration-200 ${activeMobileTab === 'deposit' ? 'scale-110 stroke-[2.5]' : 'stroke-[2]'}`} />
              <span className="absolute -top-1.5 -right-1.5 bg-[#5e17eb] text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white">+</span>
            </div>
            <span className="text-[10px] sm:text-xs tracking-tight">Add Money</span>
          </button>

          {/* My Orders Tab */}
          <button
            id="mobile-nav-orders"
            onClick={() => {
              if (user) {
                handleNavigateTab('orders');
                setActiveMobileTab('orders');
              } else {
                setAuthMode('login');
                setAuthModalOpen(true);
              }
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-all cursor-pointer ${
              activeMobileTab === 'orders' 
                ? 'text-[#0c1a30] font-black' 
                : 'text-slate-500 font-semibold hover:text-slate-700'
            }`}
          >
            <Bookmark size={20} className={`transition-transform duration-200 ${activeMobileTab === 'orders' ? 'scale-110 stroke-[2.5]' : 'stroke-[2]'}`} />
            <span className="text-[10px] sm:text-xs tracking-tight">My Orders</span>
          </button>

          {/* My Codes Tab */}
          <button
            id="mobile-nav-codes"
            onClick={() => {
              if (user) {
                handleNavigateTab('orders');
                setActiveMobileTab('codes');
              } else {
                setAuthMode('login');
                setAuthModalOpen(true);
              }
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-all cursor-pointer ${
              activeMobileTab === 'codes' 
                ? 'text-[#0c1a30] font-black' 
                : 'text-slate-500 font-semibold hover:text-slate-700'
            }`}
          >
            <LayoutGrid size={20} className={`transition-transform duration-200 ${activeMobileTab === 'codes' ? 'scale-110 stroke-[2.5]' : 'stroke-[2]'}`} />
            <span className="text-[10px] sm:text-xs tracking-tight">My Codes</span>
          </button>

          {/* My Account Tab */}
          <button
            id="mobile-nav-account"
            onClick={() => {
              if (user) {
                handleNavigateTab('profile');
                setActiveMobileTab('profile');
              } else {
                setAuthMode('login');
                setAuthModalOpen(true);
              }
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-all cursor-pointer ${
              activeMobileTab === 'profile' 
                ? 'text-[#0c1a30] font-black' 
                : 'text-slate-500 font-semibold hover:text-slate-700'
            }`}
          >
            <CircleUser size={20} className={`transition-transform duration-200 ${activeMobileTab === 'profile' ? 'scale-110 stroke-[2.5]' : 'stroke-[2]'}`} />
            <span className="text-[10px] sm:text-xs tracking-tight">My Account</span>
          </button>
        </div>
      </div>

      {/* Dynamic Simulated Live Activity Purchase Ticker Toast */}
      <AnimatePresence>
        {activeLiveActivity && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 md:bottom-6 left-4 md:left-6 z-[9999] max-w-sm w-full sm:w-[320px] bg-slate-900/95 border border-slate-800 text-white p-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] backdrop-blur-md flex gap-3 text-left"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShoppingBag size={18} className="animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black text-[#F5B822] uppercase tracking-wide truncate">Live Activity Feed</span>
                <span className="text-[9px] font-mono font-bold text-emerald-400 shrink-0 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Delivered
                </span>
              </div>
              <p className="text-[11px] font-extrabold text-white mt-1 leading-tight truncate">
                {activeLiveActivity.name}
              </p>
              <p className="text-[10px] text-slate-300 mt-0.5 font-semibold truncate">
                Purchased <span className="text-emerald-400 font-bold">{activeLiveActivity.amount}</span> of {activeLiveActivity.game}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
