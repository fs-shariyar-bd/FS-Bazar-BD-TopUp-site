import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldAlert, KeyRound, Smartphone, Lock, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  paymentMethod: 'bKash' | 'Nagad';
  onPaymentSuccess: (details: { transactionId: string; senderNumber: string; isInstantGateway: boolean }) => void;
}

export default function PaymentModal({ isOpen, onClose, amount, paymentMethod, onPaymentSuccess }: PaymentModalProps) {
  const [gatewayMode, setGatewayMode] = useState<'instant' | 'manual'>('instant');
  
  // Instant Gateway States
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Number, 2: OTP, 3: PIN, 4: Success
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [otpSent, setOtpSent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Manual States
  const [manualSender, setManualSender] = useState('');
  const [manualTxId, setManualTxId] = useState('');

  // Generate random OTP code
  useEffect(() => {
    if (step === 2) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpSent(code);
      // Simulate SMS alert
      setTimeout(() => {
        alert(`[SIMULATION] Your ${paymentMethod} Verification Code is: ${code}. Do not share this with anyone.`);
      }, 1000);
    }
  }, [step]);

  const handleNextStep = () => {
    setError('');
    if (step === 1) {
      if (!/^01[3-9]\d{8}$/.test(phoneNumber)) {
        setError('Please enter a valid 11-digit Bangladeshi mobile number.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(2);
      }, 1000);
    } else if (step === 2) {
      if (otp !== otpSent) {
        setError('Incorrect verification code. Please try again.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(3);
      }, 1000);
    } else if (step === 3) {
      if (pin.length < 4) {
        setError('Please enter your secure 4-digit or 5-digit PIN.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const generatedTxId = paymentMethod.substring(0, 2).toUpperCase() + Math.random().toString(36).substring(2, 10).toUpperCase();
        setStep(4);
        setTimeout(() => {
          onPaymentSuccess({
            transactionId: generatedTxId,
            senderNumber: phoneNumber,
            isInstantGateway: true
          });
          onClose();
          reset();
        }, 1500);
      }, 1500);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!manualSender || !manualTxId) {
      setError('Both sender number and Transaction ID are required.');
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(manualSender)) {
      setError('Please enter a valid sender mobile number.');
      return;
    }
    onPaymentSuccess({
      transactionId: manualTxId.trim(),
      senderNumber: manualSender.trim(),
      isInstantGateway: false
    });
    onClose();
    reset();
  };

  const reset = () => {
    setStep(1);
    setPhoneNumber('');
    setOtp('');
    setPin('');
    setManualSender('');
    setManualTxId('');
    setError('');
  };

  if (!isOpen) return null;

  // Colors
  const isBkash = paymentMethod === 'bKash';
  const brandBg = isBkash ? 'bg-[#E2136E]' : 'bg-[#F26422]';
  const brandText = isBkash ? 'text-[#E2136E]' : 'text-[#F26422]';
  const logoUrl = isBkash 
    ? 'https://raw.githubusercontent.com/shipon17/bkash-payment-gateway-with-laravel/main/public/bkash.png'
    : 'https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png';

  return (
    <div id="payment-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <motion.div 
        id="payment-modal-box"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-slate-900 shadow-2xl border border-slate-800"
      >
        {/* Header bar */}
        <div className={`p-4 flex items-center justify-between text-white ${brandBg}`}>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-wider">{paymentMethod} Sandbox</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">SECURE</span>
          </div>
          <button 
            id="close-payment-modal"
            onClick={() => { onClose(); reset(); }}
            className="rounded-full bg-black/10 p-1 hover:bg-black/20 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-slate-800 bg-slate-950 text-xs">
          <button
            id="btn-instant-gateway"
            onClick={() => { setGatewayMode('instant'); setError(''); }}
            className={`flex-1 py-3 text-center font-semibold transition-colors ${gatewayMode === 'instant' ? `${brandText} border-b-2 border-current bg-slate-900` : 'text-slate-400 hover:text-slate-200'}`}
          >
            🔒 Instant Auto API Gateway
          </button>
          <button
            id="btn-manual-transfer"
            onClick={() => { setGatewayMode('manual'); setError(''); }}
            className={`flex-1 py-3 text-center font-semibold transition-colors ${gatewayMode === 'manual' ? `${brandText} border-b-2 border-current bg-slate-900` : 'text-slate-400 hover:text-slate-200'}`}
          >
            📝 Manual Send Money
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="mb-6 flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
            <div>
              <span className="text-xs text-slate-400 block uppercase">Merchant Amount</span>
              <span className="text-2xl font-bold text-white">৳ {amount} BDT</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block uppercase">Receiver Account</span>
              <span className="text-sm font-semibold text-slate-200">01787375523</span>
            </div>
          </div>

          {error && (
            <div id="payment-error-alert" className="mb-4 flex gap-2 items-start bg-red-950/40 border border-red-800/60 p-3 rounded-lg text-xs text-red-400">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {gatewayMode === 'instant' ? (
            <div>
              {/* INSTANT CHECKOUT WIZARD */}
              {step === 1 && (
                <div id="gateway-step-1" className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex h-12 items-center justify-center p-2 bg-slate-950 rounded-lg mb-3">
                      <img src={isBkash ? "https://bkash.b-cdn.net/wp-content/uploads/2021/04/bKash_logo_01.png" : "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nagad_Logo.svg/1200px-Nagad_Logo.svg.png"} alt={paymentMethod} className="h-8 object-contain" onError={(e)=>{e.currentTarget.src='https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=100'}} />
                    </div>
                    <h3 className="text-sm font-medium text-slate-300">Enter your {paymentMethod} Account Number</h3>
                    <p className="text-xs text-slate-400 mt-1">We will send a 6-digit verification code to this number.</p>
                  </div>

                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      id="input-gateway-phone"
                      type="tel"
                      placeholder="017XXXXXXXX"
                      maxLength={11}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-slate-700"
                    />
                  </div>

                  <button
                    id="btn-gateway-submit-phone"
                    onClick={handleNextStep}
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 shadow-md ${brandBg} hover:brightness-110 active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2`}
                  >
                    {loading ? <RefreshCw className="animate-spin" size={18} /> : 'Proceed to Verify'}
                  </button>
                </div>
              )}

              {step === 2 && (
                <div id="gateway-step-2" className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex p-3 bg-slate-950 rounded-full mb-3 text-emerald-500">
                      <Lock size={24} />
                    </div>
                    <h3 className="text-sm font-medium text-slate-300">Enter Verification OTP</h3>
                    <p className="text-xs text-slate-400 mt-1">An OTP has been sent to <span className="font-mono text-slate-200">{phoneNumber}</span></p>
                  </div>

                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      id="input-gateway-otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-center tracking-widest placeholder:tracking-normal placeholder:text-slate-600 focus:outline-none focus:border-slate-700"
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Didn't receive OTP?</span>
                    <button 
                      id="btn-gateway-resend-otp"
                      type="button" 
                      onClick={() => {
                        const code = Math.floor(100000 + Math.random() * 900000).toString();
                        setOtpSent(code);
                        alert(`[SIMULATION] Resent ${paymentMethod} Code: ${code}`);
                      }}
                      className="text-slate-300 hover:underline font-semibold"
                    >
                      Resend OTP
                    </button>
                  </div>

                  <button
                    id="btn-gateway-submit-otp"
                    onClick={handleNextStep}
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 shadow-md ${brandBg} hover:brightness-110 active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2`}
                  >
                    {loading ? <RefreshCw className="animate-spin" size={18} /> : 'Verify OTP'}
                  </button>
                </div>
              )}

              {step === 3 && (
                <div id="gateway-step-3" className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex p-3 bg-slate-950 rounded-full mb-3 text-red-500">
                      <Lock size={24} />
                    </div>
                    <h3 className="text-sm font-medium text-slate-300">Enter Secure PIN</h3>
                    <p className="text-xs text-slate-400 mt-1">This is a sandbox simulation. Enter any 4 or 5 digit PIN to complete secure transaction.</p>
                  </div>

                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      id="input-gateway-pin"
                      type="password"
                      placeholder="•••••"
                      maxLength={5}
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-center tracking-widest placeholder:tracking-normal placeholder:text-slate-600 focus:outline-none focus:border-slate-700"
                    />
                  </div>

                  <button
                    id="btn-gateway-submit-pin"
                    onClick={handleNextStep}
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 shadow-md ${brandBg} hover:brightness-110 active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2`}
                  >
                    {loading ? <RefreshCw className="animate-spin" size={18} /> : `Confirm & Pay ৳ ${amount}`}
                  </button>
                </div>
              )}

              {step === 4 && (
                <div id="gateway-step-4" className="text-center py-6 space-y-4">
                  <div className="inline-flex p-4 bg-emerald-950/60 border border-emerald-500 rounded-full text-emerald-500">
                    <CheckCircle size={40} className="animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Payment Successful</h3>
                    <p className="text-xs text-slate-400 mt-1">Thank you. Your auto-payment has been secured & validated.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* MANUAL PAYMENTS GUIDE */
            <form onSubmit={handleManualSubmit} id="manual-payment-form" className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-300">
                <p className="font-bold text-white">How to pay manually:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>Go to your {paymentMethod} App/Dial menu.</li>
                  <li>Choose <span className="text-white font-bold">Send Money</span>.</li>
                  <li>Enter Merchant Number: <span className="text-white font-bold font-mono">01787375523</span></li>
                  <li>Enter Amount: <span className="text-white font-bold font-mono">৳{amount} BDT</span></li>
                  <li>Submit payment and get the Transaction ID (TxID).</li>
                </ol>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Your Sender {paymentMethod} Number</label>
                <input
                  id="input-manual-sender"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  maxLength={11}
                  value={manualSender}
                  onChange={(e) => setManualSender(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Payment Transaction ID (TxID)</label>
                <input
                  id="input-manual-txn"
                  type="text"
                  placeholder="e.g. TR8X92K3PL"
                  value={manualTxId}
                  onChange={(e) => setManualTxId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-slate-700 text-sm"
                />
              </div>

              <button
                id="btn-manual-submit"
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 shadow-md ${brandBg} hover:brightness-110 active:scale-[0.98]`}
              >
                Submit Transaction
              </button>
            </form>
          )}

          <div className="mt-6 flex justify-center items-center gap-2 text-[10px] text-slate-500">
            <svg className="w-4 h-4 fill-current text-slate-500" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <span>Secured SSL-Encryption Sandbox Mode</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
