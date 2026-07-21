import React, { useState, useEffect } from 'react';
import { User, Order, Transaction, SiteConfig } from '../../../types';
import { ShieldAlert, UserCheck, Calendar, Wallet, ShoppingBag, Landmark, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, ChevronRight, MessageSquare, HelpCircle, User as UserIcon, Camera, Edit, RefreshCw, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import PaymentModal from '../common/PaymentModal';

interface UserDashboardProps {
  user: User;
  config: SiteConfig;
  onRefreshUser: (updatedUser: User) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
  initialTab?: 'profile' | 'deposit' | 'orders' | 'deposits_log';
}

const AVATAR_PRESETS = [
  { name: 'Beach Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=60' },
  { name: 'Esports Gamer', url: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=150&auto=format&fit=crop&q=60' },
  { name: 'Neon Cyberpunk', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=60' },
  { name: 'Retro Console', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=60' },
  { name: 'Futuristic Tech', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&auto=format&fit=crop&q=60' },
  { name: 'Cosmic Star', url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=150&auto=format&fit=crop&q=60' },
];

export default function UserDashboard({ user, config, onRefreshUser, showToast, initialTab }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'deposit' | 'orders' | 'deposits_log'>('profile');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Deposit Form states
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [depositMethod, setDepositMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  // Profile Edit States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editNumber, setEditNumber] = useState(user.number || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Password Change States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setEditName(user.name);
    setEditNumber(user.number || '');
  }, [user]);

  const getSupportPin = (userId: string) => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const pin = Math.abs(hash % 900000) + 100000;
    return pin;
  };

  const getWeeklySpent = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return orders
      .filter(o => o.status === 'completed' && new Date(o.createdAt) >= oneWeekAgo)
      .reduce((sum, o) => sum + o.price, 0);
  };

  const getTotalSpent = () => {
    return orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.price, 0);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("File is too large. Please upload an image under 5MB.", "error");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 150;
        const MAX_HEIGHT = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        handleUpdateProfileAvatar(compressedDataUrl);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfileAvatar = async (avatarUrl: string) => {
    try {
      setIsUploading(true);
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          avatar: avatarUrl
        })
      });
      const data = await response.json();
      if (response.ok) {
        showToast("Profile picture updated successfully!", "success");
        onRefreshUser(data.user);
      } else {
        showToast(data.error || "Failed to update profile picture.", "error");
      }
    } catch (err) {
      showToast("Network error occurred.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateUserInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast("Name cannot be empty.", "error");
      return;
    }
    try {
      setIsSavingProfile(true);
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: editName.trim(),
          number: editNumber.trim()
        })
      });
      const data = await response.json();
      if (response.ok) {
        showToast("Profile info updated successfully!", "success");
        onRefreshUser(data.user);
        setIsEditModalOpen(false);
      } else {
        showToast(data.error || "Failed to update profile info.", "error");
      }
    } catch (err) {
      showToast("Network error occurred.", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast("Current password is required.", "error");
      return;
    }
    if (!newPassword) {
      showToast("New password is required.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match.", "error");
      return;
    }

    const hasMinLength = newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword);

    if (!(hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar)) {
      showToast("Please satisfy all password complexity requirements.", "error");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          currentPassword,
          password: newPassword
        })
      });
      const data = await response.json();
      if (response.ok) {
        showToast("Password updated successfully!", "success");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(data.error || "Failed to update password.", "error");
      }
    } catch (err) {
      showToast("Network error occurred.", "error");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user.id, activeTab]);

  useEffect(() => {
    if (activeTab !== 'orders') return;

    // Polling interval of 5 seconds for real-time status updates
    const interval = setInterval(async () => {
      try {
        const ordersRes = await fetch(`/api/orders?userId=${user.id}`);
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        }
      } catch (err) {
        console.error("Error polling order status:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user.id, activeTab]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const ordersRes = await fetch(`/api/orders?userId=${user.id}`);
      const ordersData = await ordersRes.json();
      setOrders(ordersData.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

      const txRes = await fetch(`/api/transactions?userId=${user.id}`);
      const txData = await txRes.json();
      setTransactions(txData.sort((a: Transaction, b: Transaction) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDepositClick = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(depositAmount);
    if (!amt || amt < 10) {
      showToast("Minimum deposit amount is 10 BDT.", "error");
      return;
    }
    setIsPayModalOpen(true);
  };

  const handlePaymentSuccess = async (details: { transactionId: string; senderNumber: string; isInstantGateway: boolean }) => {
    try {
      const response = await fetch('/api/transactions/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount: Number(depositAmount),
          paymentMethod: depositMethod,
          transactionId: details.transactionId,
          senderNumber: details.senderNumber,
          isInstantGateway: details.isInstantGateway
        })
      });
      const data = await response.json();
      if (response.ok) {
        if (details.isInstantGateway) {
          showToast(`Wallet credited instantly with ৳${depositAmount} BDT!`, 'success');
        } else {
          showToast(`Deposit submitted! Admin will verify Transaction ID: ${details.transactionId}`, 'success');
        }
        // Update user state
        onRefreshUser({ ...user, walletBalance: data.walletBalance });
        setDepositAmount('');
        setActiveTab('deposits_log');
      } else {
        showToast(data.error || "Deposit failed.", "error");
      }
    } catch (err) {
      showToast("Server error during deposit.", "error");
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const statusBadge = (status: 'pending' | 'completed' | 'cancelled' | 'failed') => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-950/50 border border-emerald-800 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <CheckCircle2 size={10} /> Completed
          </span>
        );
      case 'cancelled':
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 bg-red-950/50 border border-red-900 text-red-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <XCircle size={10} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-950/50 border border-amber-900 text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
            <Clock size={10} /> Pending
          </span>
        );
    }
  };  return (
    <div id="user-dashboard-root" className="max-w-4xl mx-auto w-full">
      {/* WORKSPACE AREA */}
      <div className="space-y-6 text-left">
        {activeTab === 'profile' && (
          <div id="panel-profile" className="bg-[#f0f4fc]/40 border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs text-center">
            {/* Profile Avatar & Greeting block */}
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative group">
                {/* Glowing border ring */}
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 p-[3.5px] shadow-[0_0_20px_rgba(108,92,231,0.25)] transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_0_25px_rgba(108,92,231,0.4)]">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=60'}
                    alt="User Profile"
                    className="w-full h-full object-cover rounded-full bg-slate-900 border-2 border-white"
                  />
                </div>
                {/* Upload Overlay */}
                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-[10px] font-bold">
                  <Camera size={16} className="mb-0.5" />
                  <span>Change Photo</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/55 rounded-full">
                    <RefreshCw size={24} className="text-white animate-spin" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                {/* Hi, Name */}
                <h3 className="text-lg md:text-xl font-bold text-[#6c5ce7] font-sans">
                  Hi, {user.name}
                </h3>
                {/* Available Balance: 0 Tk */}
                <div className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-black text-slate-800">
                  <span>Available Balance : {user.walletBalance} Tk</span>
                  <button 
                    onClick={fetchUserData} 
                    disabled={loading}
                    className="p-1 hover:bg-slate-200/80 rounded-full transition-colors duration-300 animate-none"
                    title="Refresh Balance"
                  >
                    <RefreshCw size={13} className={`stroke-[2.5] ${loading ? 'animate-spin text-[#6c5ce7]' : 'text-slate-600'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Cards Grid with purple borders */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {/* Card 1: Support Pin */}
              <div className="border border-[#6c5ce7] rounded-xl p-4 bg-white hover:shadow-xs transition-shadow text-center flex flex-col justify-center min-h-[95px]">
                <span className="text-lg font-black text-[#6c5ce7] block mb-1">
                  {getSupportPin(user.id)}
                </span>
                <span className="text-[11px] md:text-xs font-black text-[#6c5ce7] tracking-tight">
                  Support Pin
                </span>
              </div>

              {/* Card 2: Weeklly Spent */}
              <div className="border border-[#6c5ce7] rounded-xl p-4 bg-white hover:shadow-xs transition-shadow text-center flex flex-col justify-center min-h-[95px]">
                <span className="text-lg font-black text-[#6c5ce7] block mb-1">
                  {getWeeklySpent()} ৳
                </span>
                <span className="text-[11px] md:text-xs font-black text-[#6c5ce7] tracking-tight">
                  Weeklly Spent
                </span>
              </div>

              {/* Card 3: Total Spent */}
              <div className="border border-[#6c5ce7] rounded-xl p-4 bg-white hover:shadow-xs transition-shadow text-center flex flex-col justify-center min-h-[95px]">
                <span className="text-lg font-black text-[#6c5ce7] block mb-1">
                  {getTotalSpent()}
                </span>
                <span className="text-[11px] md:text-xs font-black text-[#6c5ce7] tracking-tight">
                  Total Spent
                </span>
              </div>

              {/* Card 4: Total Order */}
              <div className="border border-[#6c5ce7] rounded-xl p-4 bg-white hover:shadow-xs transition-shadow text-center flex flex-col justify-center min-h-[95px]">
                <span className="text-lg font-black text-[#6c5ce7] block mb-1">
                  {orders.length}
                </span>
                <span className="text-[11px] md:text-xs font-black text-[#6c5ce7] tracking-tight">
                  Total Order
                </span>
              </div>
            </div>

            {/* Account Information Section Panel */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs text-left">
              {/* Header */}
              <div className="bg-slate-50/50 px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
                <div className="text-slate-800 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-input">
                    <path d="M2 18V6c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"/>
                    <path d="M12 12a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1Z"/>
                    <circle cx="12" cy="10" r="1"/>
                  </svg>
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm md:text-base font-sans tracking-tight">Account Information</h4>
              </div>

              {/* Content Grid */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Available Balance card */}
                <div className="border border-slate-100 rounded-xl p-6 bg-[#fbfcfc] flex flex-col items-center justify-center text-center space-y-3 min-h-[140px]">
                  <div className="bg-[#5f27cd] text-white px-8 py-2 rounded-[4px] font-black text-sm tracking-wide shadow-xs min-w-[130px]">
                    {user.walletBalance.toFixed(2)}৳
                  </div>
                  <span className="text-[15px] font-black text-slate-800 font-serif">Available Balance</span>
                </div>

                {/* Account Verified/Not Verified card */}
                <div className="border border-slate-100 rounded-xl p-6 bg-[#fbfcfc] flex flex-col items-center justify-center text-center space-y-3 min-h-[140px]">
                  {user.number && user.number.trim() ? (
                    <>
                      {/* Blue verification check icon */}
                      <div className="text-blue-500 fill-blue-500 shrink-0">
                        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <span className="text-[15px] font-black text-slate-800 font-serif">Account Verified!</span>
                    </>
                  ) : (
                    <>
                      {/* Rose warning cross icon */}
                      <div className="text-rose-500 shrink-0">
                        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                      </div>
                      <span className="text-[15px] font-black text-rose-600 font-serif">Not Verified!</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* User Information Section Panel */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs text-left">
              {/* Header */}
              <div className="bg-slate-50/50 px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="text-slate-800 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4"/>
                      <path d="M12 8h.01"/>
                    </svg>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm md:text-base font-sans tracking-tight font-serif">User Information</h4>
                </div>

                {/* Subtly integrated Edit Profile Button */}
                <button
                  onClick={() => {
                    setEditName(user.name);
                    setEditNumber(user.number || '');
                    setIsEditModalOpen(true);
                  }}
                  className="flex items-center gap-1 text-[#6c5ce7] hover:text-[#5b4cc4] font-extrabold text-xs py-1 px-2.5 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                  title="Edit Profile"
                >
                  <Edit size={13} className="stroke-[2.5]" />
                  <span>Edit</span>
                </button>
              </div>

              {/* Info fields */}
              <div className="p-5 space-y-3 font-serif text-slate-800 text-sm md:text-[15px]">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <span className="font-bold min-w-[70px]">email :</span>
                  <span className="text-slate-700 font-sans break-all">{user.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <span className="font-bold min-w-[70px]">Phone :</span>
                  <span className="text-slate-700 font-sans">{user.number || ''}</span>
                </div>
              </div>
            </div>

            {/* Password Update Section Panel */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs text-left">
              {/* Header */}
              <div className="bg-slate-50/50 px-5 py-3.5 border-b border-slate-100 flex items-center gap-2.5">
                <div className="text-slate-800 shrink-0">
                  <Lock size={20} className="text-[#6c5ce7] stroke-[2.5]" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm md:text-base font-sans tracking-tight font-serif">Change Password</h4>
              </div>

              {/* Form */}
              <form onSubmit={handleUpdatePassword} className="p-5 space-y-4 font-sans">
                {/* Current Password */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-11 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#6c5ce7]/20 focus:border-[#6c5ce7] focus:bg-white transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new strong password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-11 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#6c5ce7]/20 focus:border-[#6c5ce7] focus:bg-white transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Real-time Complexity indicators */}
                  {newPassword && (
                    <div className="mt-3.5 p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password Strength</span>
                        <span className={`text-[11px] font-extrabold ${
                          newPassword.length === 0 ? 'text-slate-400' :
                          [
                            newPassword.length >= 8,
                            /[A-Z]/.test(newPassword),
                            /[a-z]/.test(newPassword),
                            /[0-9]/.test(newPassword),
                            /[^A-Za-z0-9]/.test(newPassword)
                          ].filter(Boolean).length <= 2 ? 'text-rose-500' :
                          [
                            newPassword.length >= 8,
                            /[A-Z]/.test(newPassword),
                            /[a-z]/.test(newPassword),
                            /[0-9]/.test(newPassword),
                            /[^A-Za-z0-9]/.test(newPassword)
                          ].filter(Boolean).length <= 4 ? 'text-amber-500' : 'text-emerald-500'
                        }`}>
                          {newPassword.length === 0 ? '' :
                           [
                             newPassword.length >= 8,
                             /[A-Z]/.test(newPassword),
                             /[a-z]/.test(newPassword),
                             /[0-9]/.test(newPassword),
                             /[^A-Za-z0-9]/.test(newPassword)
                           ].filter(Boolean).length <= 2 ? 'Weak' :
                           [
                             newPassword.length >= 8,
                             /[A-Z]/.test(newPassword),
                             /[a-z]/.test(newPassword),
                             /[0-9]/.test(newPassword),
                             /[^A-Za-z0-9]/.test(newPassword)
                           ].filter(Boolean).length <= 4 ? 'Medium' : 'Strong Password ✨'}
                        </span>
                      </div>
                      
                      {/* Strength score bar */}
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex gap-0.5">
                        <div className={`h-full flex-1 transition-all duration-300 ${
                          [
                            newPassword.length >= 8,
                            /[A-Z]/.test(newPassword),
                            /[a-z]/.test(newPassword),
                            /[0-9]/.test(newPassword),
                            /[^A-Za-z0-9]/.test(newPassword)
                          ].filter(Boolean).length >= 1 
                            ? ( [
                                  newPassword.length >= 8,
                                  /[A-Z]/.test(newPassword),
                                  /[a-z]/.test(newPassword),
                                  /[0-9]/.test(newPassword),
                                  /[^A-Za-z0-9]/.test(newPassword)
                                ].filter(Boolean).length <= 2 ? 'bg-rose-500' :
                                [
                                  newPassword.length >= 8,
                                  /[A-Z]/.test(newPassword),
                                  /[a-z]/.test(newPassword),
                                  /[0-9]/.test(newPassword),
                                  /[^A-Za-z0-9]/.test(newPassword)
                                ].filter(Boolean).length <= 4 ? 'bg-amber-500' : 'bg-emerald-500' )
                            : 'bg-transparent'
                        }`} />
                        <div className={`h-full flex-1 transition-all duration-300 ${
                          [
                            newPassword.length >= 8,
                            /[A-Z]/.test(newPassword),
                            /[a-z]/.test(newPassword),
                            /[0-9]/.test(newPassword),
                            /[^A-Za-z0-9]/.test(newPassword)
                          ].filter(Boolean).length >= 3 
                            ? ( [
                                  newPassword.length >= 8,
                                  /[A-Z]/.test(newPassword),
                                  /[a-z]/.test(newPassword),
                                  /[0-9]/.test(newPassword),
                                  /[^A-Za-z0-9]/.test(newPassword)
                                ].filter(Boolean).length <= 4 ? 'bg-amber-500' : 'bg-emerald-500' )
                            : 'bg-slate-200'
                        }`} />
                        <div className={`h-full flex-1 transition-all duration-300 ${
                          [
                            newPassword.length >= 8,
                            /[A-Z]/.test(newPassword),
                            /[a-z]/.test(newPassword),
                            /[0-9]/.test(newPassword),
                            /[^A-Za-z0-9]/.test(newPassword)
                          ].filter(Boolean).length >= 5 
                            ? 'bg-emerald-500'
                            : 'bg-slate-200'
                        }`} />
                      </div>

                      {/* Complexity list */}
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-medium pt-1 text-left">
                        <li className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={newPassword.length >= 8 ? 'text-emerald-600 font-bold' : 'text-slate-500'}>At least 8 characters</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={/[A-Z]/.test(newPassword) ? 'text-emerald-600 font-bold' : 'text-slate-500'}>One uppercase letter (A-Z)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(newPassword) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={/[a-z]/.test(newPassword) ? 'text-emerald-600 font-bold' : 'text-slate-500'}>One lowercase letter (a-z)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={/[0-9]/.test(newPassword) ? 'text-emerald-600 font-bold' : 'text-slate-500'}>One number (0-9)</span>
                        </li>
                        <li className="flex items-center gap-2 sm:col-span-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(newPassword) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-emerald-600 font-bold' : 'text-slate-500'}>One special character (e.g. !@#$%)</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-11 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#6c5ce7]/20 focus:border-[#6c5ce7] focus:bg-white transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  
                  {confirmPassword && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-left">
                      <span className={`w-1.5 h-1.5 rounded-full ${confirmPassword === newPassword ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className={`text-[11px] font-bold ${confirmPassword === newPassword ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {confirmPassword === newPassword ? 'Passwords match' : 'Passwords do not match'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={
                      isUpdatingPassword ||
                      !currentPassword ||
                      !newPassword ||
                      confirmPassword !== newPassword ||
                      !(
                        newPassword.length >= 8 &&
                        /[A-Z]/.test(newPassword) &&
                        /[a-z]/.test(newPassword) &&
                        /[0-9]/.test(newPassword) &&
                        /[^A-Za-z0-9]/.test(newPassword)
                      )
                    }
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#6c5ce7] hover:bg-[#5b4cc4] disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {isUpdatingPassword ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={14} />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* ADD MONEY - Styled exactly like Image 4 */}
        {activeTab === 'deposit' && (
          <div id="panel-deposit" className="space-y-6">
            
            {/* Box 1: Request Add Money */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden p-6 shadow-xs text-left">
              <div className="flex items-center gap-3.5 mb-6">
                {/* Green Circle Badge with number 1 */}
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#20947c] text-white text-xs font-black shrink-0 shadow-xs">
                  1
                </div>
                <h2 className="text-[17px] font-sans font-black text-[#20947c] tracking-tight">Request Add Money</h2>
              </div>

              <form onSubmit={handleDepositClick} className="space-y-5">
                {/* Select Operator with BKash/Nagad styled beautifully */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Select Gateway Operator
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-w-sm">
                    <button
                      id="operator-bkash"
                      type="button"
                      onClick={() => setDepositMethod('bKash')}
                      className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${depositMethod === 'bKash' ? 'border-[#E2136E] bg-[#E2136E]/5 shadow-xs' : 'border-slate-100 bg-[#fbfcfc] hover:border-slate-200'}`}
                    >
                      <img src="https://bkash.b-cdn.net/wp-content/uploads/2021/04/bKash_logo_01.png" alt="bKash" className="h-6 object-contain" onError={(e)=>{e.currentTarget.src='https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=100'}} />
                    </button>
                    <button
                      id="operator-nagad"
                      type="button"
                      onClick={() => setDepositMethod('Nagad')}
                      className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${depositMethod === 'Nagad' ? 'border-[#F26422] bg-[#F26422]/5 shadow-xs' : 'border-slate-100 bg-[#fbfcfc] hover:border-slate-200'}`}
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nagad_Logo.svg/1200px-Nagad_Logo.svg.png" alt="Nagad" className="h-6 object-contain" onError={(e)=>{e.currentTarget.src='https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=100'}} />
                    </button>
                  </div>
                </div>

                {/* Amount input fields styled exactly like Image 4 */}
                <div className="max-w-md text-left">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Amount
                  </label>
                  <input
                    id="input-deposit-amount"
                    type="number"
                    placeholder="Amount"
                    min="10"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-5 py-3.5 bg-[#fbfcfc] border border-slate-200 rounded-full text-slate-800 placeholder-slate-400 font-bold focus:outline-none focus:ring-2 focus:ring-[#20947c]/30 focus:border-[#20947c] transition-all text-sm shadow-xs"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {['100', '200', '500', '1000', '2000'].map((amt) => (
                      <button
                        id={`preset-amt-${amt}`}
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(amt)}
                        className="bg-slate-50 border border-slate-200/60 text-slate-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-[#20947c] hover:text-white hover:border-[#20947c] transition-all cursor-pointer"
                      >
                        ৳{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-w-md pt-2">
                  <button
                    id="btn-recharge-submit"
                    type="submit"
                    className="w-full bg-[#165a4a] hover:bg-[#11483b] text-white font-extrabold py-3.5 px-6 rounded-full transition-all shadow-md shadow-[#165a4a]/20 cursor-pointer text-sm"
                  >
                    Add Money
                  </button>
                </div>
              </form>
            </div>

            {/* Box 2: How To Add Money */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden p-6 shadow-xs text-left">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#20947c] text-white text-xs font-black shrink-0 shadow-xs">
                  2
                </div>
                <h2 className="text-[17px] font-sans font-black text-[#20947c] tracking-tight">How To Add Money</h2>
              </div>

              {/* Subtitle rule */}
              <div className="mb-4">
                <p className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                  Instant Add Money করার নিয়ম:
                </p>
              </div>

              {/* Real YouTube Video ID embed for PipoBazar Add Money */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-200/60 shadow-sm">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/FstLreB6v10?si=pipoAddMoney"
                  title="কীভাবে ADD MONEY করবেন PipoBazar এ!"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

          </div>
        )}

        {/* MY ORDERS - Styled exactly like Image 2 */}
        {activeTab === 'orders' && (
          <div id="panel-orders" className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            {/* Header row exactly like Image 2 */}
            <div className="border-b border-slate-100 bg-[#fbfcfc] px-6 py-4 flex items-center gap-3">
              {/* Custom list icon matching the screenshot exactly */}
              <div className="text-slate-800">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 17h6" />
                  <path d="M9 12h6" />
                  <path d="M9 7h6" />
                  <circle cx="6" cy="7" r="0.5" fill="currentColor" />
                  <circle cx="6" cy="12" r="0.5" fill="currentColor" />
                  <circle cx="6" cy="17" r="0.5" fill="currentColor" />
                </svg>
              </div>
              <h2 className="text-base font-serif font-extrabold text-slate-900 tracking-tight">My Orders</h2>
            </div>

            {/* Body of My Orders */}
            <div className="p-8">
              {loading ? (
                <div className="text-center py-12 text-slate-500 font-bold">Loading orders...</div>
              ) : orders.length === 0 ? (
                /* No order data found view matching Image 2 EXACTLY */
                <div className="text-center py-6 space-y-4">
                  <p className="text-base font-serif font-extrabold text-slate-900">No order data found !</p>
                  <button
                    id="btn-order-now-fallback"
                    onClick={() => {
                      window.location.href = '/';
                    }}
                    className="bg-[#eb4d4b] hover:bg-[#d83a38] text-white font-extrabold text-xs py-2 px-6 rounded-[4px] transition-colors uppercase tracking-wider cursor-pointer shadow-xs"
                  >
                    Order Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-5 bg-slate-50 border border-slate-200/50 rounded-2xl flex flex-col gap-5 text-left">
                      {/* Top Info section */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm md:text-base font-serif">{order.gameName}</span>
                            <span className="text-[10px] font-bold text-[#20947c] bg-[#20947c]/10 px-2 py-0.5 rounded-sm">{order.optionName}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-500 font-mono font-medium">
                            <div><span className="text-slate-400">Order ID:</span> <span className="text-slate-700">{order.id}</span></div>
                            <div><span className="text-slate-400">Method:</span> <span className="text-slate-700">{order.paymentMethod}</span></div>
                            <div><span className="text-slate-400">Price:</span> <span className="text-slate-900 font-bold">৳ {order.price} BDT</span></div>
                            <div><span className="text-slate-400">Date:</span> <span className="text-slate-700">{formatDate(order.createdAt)}</span></div>
                          </div>

                          <div className="bg-white p-3 border border-slate-200/60 rounded-xl text-[11px] font-mono text-slate-700 max-w-xl">
                            <span className="text-slate-400 font-bold block uppercase text-[8px] tracking-wider mb-1.5">Inputs:</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                              {Object.entries(order.inputs).map(([key, val]) => (
                                <div key={key} className="truncate"><span className="text-slate-400 capitalize">{key}:</span> <span className="text-slate-800 font-bold">{val}</span></div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-2 self-stretch md:self-auto shrink-0 bg-white md:bg-transparent p-3 md:p-0 rounded-xl border border-slate-100 md:border-0">
                          <span className="text-[9px] font-bold uppercase font-mono text-slate-400 tracking-wider md:hidden block">Current Status</span>
                          {statusBadge(order.status)}
                          {order.transactionId && <span className="text-[10px] font-mono font-bold text-slate-400">TxnID: {order.transactionId}</span>}
                        </div>
                      </div>

                      {/* Visual Timeline component */}
                      <div className="border-t border-slate-200/60 pt-4 mt-1">
                        <span className="text-[10px] font-bold uppercase font-mono text-slate-400 tracking-wider block mb-4">Order Status Timeline</span>
                        
                        <div className="relative flex items-center justify-between w-full max-w-xl mx-auto px-2 sm:px-6 py-2">
                          {/* Progress Line Background */}
                          <div className="absolute top-[18px] left-[12%] right-[12%] h-[3px] bg-slate-200 -translate-y-1/2 z-0" />
                          
                          {/* Active Progress Line */}
                          <div 
                            className={`absolute top-[18px] left-[12%] h-[3px] -translate-y-1/2 z-0 transition-all duration-500 ${
                              order.status === 'completed' 
                                ? 'w-[76%] bg-[#20947c]' 
                                : order.status === 'cancelled'
                                ? 'w-[76%] bg-rose-500'
                                : 'w-[38%] bg-amber-500'
                            }`} 
                          />

                          {/* Step 1: Placed */}
                          <div className="relative flex flex-col items-center z-10 text-center">
                            <div className="w-9 h-9 rounded-full bg-[#20947c] text-white flex items-center justify-center shadow-md shadow-[#20947c]/20 border-2 border-white">
                              <ShoppingBag size={14} className="stroke-[2.5]" />
                            </div>
                            <span className="text-[11px] font-extrabold text-slate-800 mt-2 font-serif">Order Placed</span>
                            <span className="text-[9px] font-medium font-mono text-emerald-600 mt-0.5">Success</span>
                          </div>

                          {/* Step 2: Verified */}
                          <div className="relative flex flex-col items-center z-10 text-center">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-all duration-300 ${
                              order.status === 'completed'
                                ? 'bg-[#20947c] text-white shadow-[#20947c]/10'
                                : order.status === 'cancelled'
                                ? 'bg-rose-100 text-rose-500 border-rose-200'
                                : 'bg-amber-500 text-white animate-pulse shadow-amber-500/25'
                            }`}>
                              <UserCheck size={14} className="stroke-[2.5]" />
                            </div>
                            <span className="text-[11px] font-extrabold text-slate-800 mt-2 font-serif">Verified</span>
                            <span className={`text-[9px] font-medium font-mono mt-0.5 ${
                              order.status === 'completed' 
                                ? 'text-emerald-600' 
                                : order.status === 'cancelled' 
                                ? 'text-rose-500' 
                                : 'text-amber-600'
                            }`}>
                              {order.status === 'completed' ? 'Approved' : order.status === 'cancelled' ? 'Closed' : 'Checking...'}
                            </span>
                          </div>

                          {/* Step 3: Completed / Cancelled */}
                          <div className="relative flex flex-col items-center z-10 text-center">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-all duration-300 ${
                              order.status === 'completed'
                                ? 'bg-[#20947c] text-white shadow-[#20947c]/20'
                                : order.status === 'cancelled'
                                ? 'bg-rose-500 text-white shadow-rose-500/20'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                            }`}>
                              {order.status === 'cancelled' ? (
                                <XCircle size={14} className="stroke-[2.5]" />
                              ) : (
                                <CheckCircle2 size={14} className="stroke-[2.5]" />
                              )}
                            </div>
                            <span className={`text-[11px] font-extrabold mt-2 font-serif ${order.status === 'cancelled' ? 'text-rose-600' : 'text-slate-800'}`}>
                              {order.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                            </span>
                            <span className={`text-[9px] font-medium font-mono mt-0.5 ${
                              order.status === 'completed' 
                                ? 'text-emerald-600' 
                                : order.status === 'cancelled' 
                                ? 'text-rose-500 font-semibold' 
                                : 'text-slate-400'
                            }`}>
                              {order.status === 'completed' ? 'Delivered' : order.status === 'cancelled' ? 'Failed' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ALL TRANSACTION - Styled exactly like Image 3 */}
        {activeTab === 'deposits_log' && (
          <div id="panel-deposits-log" className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            {/* Header row exactly like Image 3 */}
            <div className="border-b border-slate-100 bg-[#fbfcfc] px-6 py-4 flex items-center gap-3">
              <div className="text-slate-800">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 17h6" />
                  <path d="M9 12h6" />
                  <path d="M9 7h6" />
                  <circle cx="6" cy="7" r="0.5" fill="currentColor" />
                  <circle cx="6" cy="12" r="0.5" fill="currentColor" />
                  <circle cx="6" cy="17" r="0.5" fill="currentColor" />
                </svg>
              </div>
              <h2 className="text-base font-serif font-extrabold text-slate-900 tracking-tight">All Transaction</h2>
            </div>

            {/* Table of transactions matching Image 3 layout exactly */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead>
                  <tr className="bg-[#e9ecef] text-slate-700 uppercase tracking-wider font-extrabold text-[11px]">
                    <th className="py-3.5 px-6 text-center border-r border-slate-200/60 w-1/3">NUMBER</th>
                    <th className="py-3.5 px-6 text-center border-r border-slate-200/60 w-1/3">AMOUNT</th>
                    <th className="py-3.5 px-6 text-center w-1/3">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400 font-bold">Loading transaction history...</td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-slate-400 font-medium">No transaction records found.</td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 text-center font-mono">
                        <td className="py-3.5 px-6 border-r border-slate-100 font-bold text-slate-800">
                          {tx.senderNumber || tx.id.substring(0, 10).toUpperCase()}
                        </td>
                        <td className={`py-3.5 px-6 border-r border-slate-100 font-extrabold text-sm ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tx.type === 'deposit' ? '+' : '-'} ৳{tx.amount}
                        </td>
                        <td className="py-3.5 px-6 font-bold flex justify-center">
                          <span className={`inline-block px-3 py-1 rounded-[4px] text-[10px] uppercase font-extrabold ${
                            tx.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            tx.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse' :
                            'bg-rose-50 text-rose-600 border border-rose-100'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}

                  {/* Summary row matching the exact look in Image 3 */}
                  <tr className="bg-[#fbfcfc] border-t-2 border-slate-100">
                    <td className="py-4 px-6 text-right border-r border-slate-100 font-extrabold text-slate-900 text-sm">
                      Total:
                    </td>
                    <td className="py-4 px-6 text-center border-r border-slate-100 font-black text-slate-950 text-sm">
                      ৳ {user.walletBalance} BDT
                    </td>
                    <td className="py-4 px-6">
                      {/* empty status block */}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Payment gateway backdrop portal */}
      <PaymentModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        amount={Number(depositAmount)}
        paymentMethod={depositMethod}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsEditModalOpen(false)}
          />

          {/* Modal content container */}
          <div className="relative bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 text-left font-sans">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Edit size={18} className="text-[#6c5ce7]" />
                <span>Edit Profile Information</span>
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateUserInfo} className="space-y-4">
              {/* Profile image selection inside modal as well */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Choose Avatar Preset
                </label>
                <div className="grid grid-cols-6 gap-2 mb-3">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleUpdateProfileAvatar(preset.url)}
                      className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all shrink-0 ${
                        user.avatar === preset.url 
                          ? 'border-[#6c5ce7] scale-110 shadow-[0_0_8px_rgba(108,92,231,0.4)]' 
                          : 'border-slate-200 hover:border-slate-350 hover:scale-105'
                      }`}
                      title={preset.name}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      {user.avatar === preset.url && (
                        <div className="absolute inset-0 bg-[#6c5ce7]/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white fill-[#6c5ce7] drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 cursor-pointer transition-colors text-xs font-bold text-slate-700">
                    <Camera size={14} className="text-[#6c5ce7]" />
                    <span>Upload Custom Image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {isUploading && <span className="text-[11px] text-[#6c5ce7] animate-pulse font-bold">Uploading...</span>}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#6c5ce7]/20 focus:border-[#6c5ce7] focus:bg-white transition-all"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editNumber}
                  onChange={(e) => setEditNumber(e.target.value)}
                  placeholder="e.g. 017XXXXXXXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#6c5ce7]/20 focus:border-[#6c5ce7] focus:bg-white transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2 bg-[#6c5ce7] hover:bg-[#5b4cc4] disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isSavingProfile ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
