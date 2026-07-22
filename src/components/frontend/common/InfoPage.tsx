import React from 'react';
import { SiteConfig } from '../../../types';
import { ShieldCheck, FileText, RefreshCw, Phone, Mail, MapPin, MessageCircle, Info, ChevronRight, HelpCircle } from 'lucide-react';

interface InfoPageProps {
  path: string;
  config: SiteConfig;
  onNavigate: (path: string) => void;
}

export default function InfoPage({ path, config, onNavigate }: InfoPageProps) {
  const getPageType = () => {
    if (path.includes('privacy')) return 'privacy';
    if (path.includes('terms')) return 'terms';
    if (path.includes('refund')) return 'refund';
    if (path.includes('contact')) return 'contact';
    if (path.includes('about')) return 'about';
    return 'terms';
  };

  const pageType = getPageType();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn py-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('/')} className="hover:text-emerald-600 transition-colors">Home</button>
        <ChevronRight size={14} />
        <span className="text-slate-800 font-bold capitalize">
          {pageType === 'privacy' && 'Privacy Policy'}
          {pageType === 'terms' && 'Terms & Conditions'}
          {pageType === 'refund' && 'Refund & Return Policy'}
          {pageType === 'contact' && 'Contact Support'}
          {pageType === 'about' && 'About Us'}
        </span>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 md:p-10 space-y-6">
        {pageType === 'privacy' && (
          <div className="space-y-6 text-slate-700">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900">Privacy Policy</h1>
                <p className="text-xs text-slate-500">Last updated: January 2026</p>
              </div>
            </div>

            <p className="text-xs md:text-sm leading-relaxed">
              At <strong className="text-slate-900">{config.siteName || "Pipobazar BD"}</strong>, accessible from our official gaming platform, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded and how we use it.
            </p>

            <div className="space-y-4 text-xs md:text-sm">
              <h2 className="text-sm md:text-base font-bold text-slate-900">1. Information We Collect</h2>
              <p className="leading-relaxed">
                When you register or place an order for digital top-ups (Free Fire Diamonds, PUBG UC, Gift Cards), we may collect your email address, phone number, and Player ID / Game Account details necessary to complete the automated delivery.
              </p>

              <h2 className="text-sm md:text-base font-bold text-slate-900">2. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
                <li>To process and deliver your digital gaming top-ups instantly.</li>
                <li>To verify bKash, Nagad, and Rocket mobile banking transactions securely via direct API integration.</li>
                <li>To send transaction receipts and SMS/WhatsApp notifications regarding your order status.</li>
                <li>To prevent fraudulent orders and maintain platform security.</li>
              </ul>

              <h2 className="text-sm md:text-base font-bold text-slate-900">3. Data Security & Payment Protection</h2>
              <p className="leading-relaxed">
                We do not store or process your personal mobile banking PINs or password credentials. All mobile banking payment gateway requests are processed via encrypted SSL connections.
              </p>
            </div>
          </div>
        )}

        {pageType === 'terms' && (
          <div className="space-y-6 text-slate-700">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FileText size={28} />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900">Terms & Conditions</h1>
                <p className="text-xs text-slate-500">Official Platform Rules</p>
              </div>
            </div>

            <div className="space-y-4 text-xs md:text-sm leading-relaxed">
              <p>
                By accessing and placing an order on <strong className="text-slate-900">{config.siteName || "Pipobazar BD"}</strong>, you confirm that you are in agreement with and bound by the terms of service contained below.
              </p>

              <h2 className="text-sm md:text-base font-bold text-slate-900">1. Digital Item Delivery</h2>
              <p>
                All top-ups (diamonds, UC, in-game credits) are delivered digitally to the Player ID provided by the customer. Please verify your Player ID / In-Game Name before submitting an order.
              </p>

              <h2 className="text-sm md:text-base font-bold text-slate-900">2. Incorrect Player ID Responsibility</h2>
              <p>
                If a customer enters an incorrect Player ID during checkout and the order is completed automatically to that ID, {config.siteName} is not held liable for recovering or transferring the digital currency.
              </p>

              <h2 className="text-sm md:text-base font-bold text-slate-900">3. Account Verification</h2>
              <p>
                Orders flagged for security checks may require temporary WhatsApp / SMS verification to ensure account ownership and prevent unauthorized mobile banking usage.
              </p>
            </div>
          </div>
        )}

        {pageType === 'refund' && (
          <div className="space-y-6 text-slate-700">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <RefreshCw size={28} />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900">Refund & Return Policy</h1>
                <p className="text-xs text-slate-500">Instant Refund Guidelines</p>
              </div>
            </div>

            <div className="space-y-4 text-xs md:text-sm leading-relaxed">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-semibold">
                ✓ Cancelled or failed orders are automatically refunded to your Wallet balance within 5 minutes.
              </div>

              <h2 className="text-sm md:text-base font-bold text-slate-900">1. Eligible Refunds</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>System fails to deliver your top-up due to technical server error.</li>
                <li>In-game item is out of stock or price changed before fulfillment.</li>
                <li>Duplicate payment debited for a single order.</li>
              </ul>

              <h2 className="text-sm md:text-base font-bold text-slate-900">2. Non-Refundable Cases</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Order already completed to the correct Player ID submitted by the user.</li>
                <li>User changed their mind after successful digital top-up delivery.</li>
              </ul>
            </div>
          </div>
        )}

        {pageType === 'contact' && (
          <div className="space-y-6 text-slate-700">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                <Phone size={28} />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900">Contact Support</h1>
                <p className="text-xs text-slate-500">We are here to help 9 AM - 11 PM daily</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase">
                  <MessageCircle size={18} /> WhatsApp Live Support
                </div>
                <p className="text-xs text-slate-500">Instant chat response for order updates</p>
                <a 
                  href={`https://wa.me/${config.supportWhatsApp || config.supportPhone}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all"
                >
                  Message on WhatsApp
                </a>
              </div>

              <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase">
                  <Phone size={18} /> Direct Hotline
                </div>
                <p className="text-xs text-slate-500">Call for urgent top-up inquiries</p>
                <p className="text-base font-black text-slate-900 mt-2">{config.supportPhone || "+8801700000000"}</p>
              </div>

              <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase">
                  <Mail size={18} /> Official Email
                </div>
                <p className="text-xs text-slate-500">Business & Partnership inquiries</p>
                <p className="text-sm font-bold text-slate-900 mt-2">{config.supportEmail || "support@pipobazar.bd"}</p>
              </div>

              <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase">
                  <MapPin size={18} /> Headquarters
                </div>
                <p className="text-xs text-slate-500 font-medium">Dhaka, Bangladesh</p>
                <p className="text-xs text-slate-700 font-bold mt-2">100% Automated Digital Gaming Hub</p>
              </div>
            </div>
          </div>
        )}

        {pageType === 'about' && (
          <div className="space-y-6 text-slate-700">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Info size={28} />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900">About {config.siteName || "Pipobazar BD"}</h1>
                <p className="text-xs text-slate-500">Leading Automated Gaming Topup Store in Bangladesh</p>
              </div>
            </div>

            <div className="space-y-4 text-xs md:text-sm leading-relaxed">
              <p>
                <strong className="text-slate-900">{config.siteName || "Pipobazar BD"}</strong> is a premier esports and gaming digital top-up destination built specifically for gamers in Bangladesh. We provide 24/7 automated delivery for Free Fire Diamonds, PUBG Mobile UC, Mobile Legends Diamonds, Google Play Gift Cards, and Subscription Passes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                <div className="p-4 border border-slate-100 rounded-xl bg-slate-50 text-center">
                  <div className="text-lg font-black text-emerald-600">⚡ Instant</div>
                  <div className="text-[11px] font-semibold text-slate-500">Automated Delivery</div>
                </div>
                <div className="p-4 border border-slate-100 rounded-xl bg-slate-50 text-center">
                  <div className="text-lg font-black text-blue-600">🔒 100% Secure</div>
                  <div className="text-[11px] font-semibold text-slate-500">bKash & Nagad API</div>
                </div>
                <div className="p-4 border border-slate-100 rounded-xl bg-slate-50 text-center">
                  <div className="text-lg font-black text-violet-600">🎧 24/7</div>
                  <div className="text-[11px] font-semibold text-slate-500">Customer Support</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
