export interface TopupOption {
  id: string;
  name: string; // e.g., "115 Diamonds", "660 UC"
  price: number; // in BDT
  stock: number;
}

export interface Game {
  id: string;
  name: string;
  logo: string;
  category: 'mobile' | 'pc' | 'vouchers' | 'subscriptions';
  description: string;
  topupOptions: TopupOption[];
  inputsRequired: Array<'playerId' | 'characterName' | 'serverId' | 'email' | 'password' | 'accountType'>;
  isPopular?: boolean;
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  gameId: string;
  gameName: string;
  optionId: string;
  optionName: string;
  price: number;
  inputs: Record<string, string>;
  paymentMethod: 'bKash' | 'Nagad';
  transactionId: string;
  senderNumber: string;
  status: OrderStatus;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  walletBalance: number;
  number?: string;
  avatar?: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  link?: string;
}

export interface SiteConfig {
  activeHeaderTemplate: 'classic' | 'modern' | 'minimal' | 'glowing' | 'cyberpunk' | 'esports' | 'style-1' | 'style-2' | 'style-3' | 'style-4';
  activeFooterTemplate?: 'style-1' | 'style-2' | 'style-3' | 'style-4' | 'classic' | 'cyberpunk' | 'esports' | 'minimal';
  activeCardTemplate: 'grid' | 'compact' | 'modern' | 'hover_glow';
  themeColor: 'emerald' | 'cyan' | 'violet' | 'amber' | 'rose' | 'slate';
  activeWebsiteTemplate?: 'classic' | 'cyberpunk' | 'esports' | 'retro';
  siteName: string;
  siteSlogan: string;
  supportPhone: string;
  supportWhatsApp: string;
  announcementText: string;
  banners: Banner[];
  showLiveActivity?: boolean;
  showStatsCounter?: boolean;
  showNoticeBanner?: boolean;
  sectionHomeTitle?: string;
  supportEmail?: string;
  footerCopyright?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'purchase' | 'refund';
  amount: number;
  method?: string;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}
