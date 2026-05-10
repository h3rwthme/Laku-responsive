import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Mail, Lock, Zap, AlertCircle } from 'lucide-react';

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export default function Login() {
  const { dispatch, showToast, login } = useApp();
  const isMobile = useIsMobile();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shakeField, setShakeField] = useState<string | null>(null);

  const triggerShake = (field: string) => {
    setShakeField(field);
    setTimeout(() => setShakeField(null), 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim()) {
      setError('Email harus diisi');
      triggerShake('email');
      return;
    }
    
    if (!password.trim()) {
      setError('Password harus diisi');
      triggerShake('password');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const user = { id: generateId(), name: email.split('@')[0], email };
      login(user);
      dispatch({ type: 'SET_TAB', payload: 'dashboard' });
      showToast('Login berhasil');
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F8F9FD] via-[#F0F2FA] to-[#E8EDF8] flex flex-col overflow-hidden">
      {/* Desktop background decoration */}
      {!isMobile && (
        <>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1A56DB]/5 rounded-full blur-3xl -z-10 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F97316]/5 rounded-full blur-3xl -z-10 animate-pulse" />
        </>
      )}

      {/* Header section */}
      <div className={`flex-shrink-0 ${isMobile ? 'px-4 pt-6 pb-4' : 'px-8 py-12'}`}>
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-gradient-to-br from-[#1A56DB] to-[#1340b8] flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
            <Zap size={isMobile ? 18 : 20} className="text-white" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#1A1F3A]">Laku</h1>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex items-center justify-center ${isMobile ? 'px-3 pb-6' : 'px-8'}`}>
        <div className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'} bg-white rounded-2xl sm:rounded-3xl card-shadow overflow-hidden animate-in fade-in zoom-in duration-700 delay-100`}>
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-[#1A56DB] to-[#F97316]" />

          <div className={`${isMobile ? 'px-4 py-6 sm:py-8' : 'px-8 py-10'} flex flex-col gap-6`}>
            {/* Title section */}
            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1A1F3A]">Selamat Datang Kembali</h2>
              <p className="text-xs sm:text-sm text-[#9BA3BC]">Masuk ke akun Anda untuk mengelola toko</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 p-3 rounded-lg bg-red-50 border border-red-200 flex gap-2">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email field */}
              <div className={`flex flex-col gap-2 animate-in fade-in duration-700 delay-300 ${shakeField === 'email' ? 'animate-shake' : ''}`}>
                <label className="text-xs sm:text-sm font-semibold text-[#3D4566]">Email</label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300 transform ${
                  shakeField === 'email' 
                    ? 'border-red-500 bg-red-50 scale-98' 
                    : focusedField === 'email' 
                    ? 'border-[#1A56DB] bg-[#e8effe] scale-102' 
                    : 'border-[#EEF0F6] bg-[#F8F9FC] hover:border-[#d4e4fb] hover:scale-101'
                }`} style={shakeField === 'email' ? { animation: 'shake 0.5s ease-in-out' } : {}}>
                  <Mail size={18} className={`transition-all duration-300 flex-shrink-0 ${
                    shakeField === 'email'
                      ? 'text-red-500' 
                      : focusedField === 'email' 
                      ? 'text-[#1A56DB]' 
                      : 'text-[#9BA3BC]'
                  }`} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="flex-1 bg-transparent text-sm font-medium text-[#1A1F3A] placeholder-[#DDE1EF] outline-none"
                    placeholder="nama@domain.com"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className={`flex flex-col gap-2 animate-in fade-in duration-700 delay-300 ${shakeField === 'password' ? 'animate-shake' : ''}`} style={shakeField === 'password' ? { animation: 'shake 0.5s ease-in-out' } : {}}>
                <label className="text-xs sm:text-sm font-semibold text-[#3D4566]">Password</label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300 transform ${
                  shakeField === 'password'
                    ? 'border-red-500 bg-red-50 scale-98'
                    : focusedField === 'password' 
                    ? 'border-[#1A56DB] bg-[#e8effe] scale-102' 
                    : 'border-[#EEF0F6] bg-[#F8F9FC] hover:border-[#d4e4fb] hover:scale-101'
                }`}>
                  <Lock size={18} className={`transition-all duration-300 flex-shrink-0 ${
                    shakeField === 'password'
                      ? 'text-red-500'
                      : focusedField === 'password' 
                      ? 'text-[#1A56DB]' 
                      : 'text-[#9BA3BC]'
                  }`} />
                  <input
                    type="password"
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="flex-1 bg-transparent text-sm font-medium text-[#1A1F3A] placeholder-[#DDE1EF] outline-none"
                    placeholder="Masukkan password Anda"
                  />
                </div>
              </div>

              {/* Submit button */}
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full mt-2 h-11 text-sm font-bold bg-gradient-to-r from-[#1A56DB] to-[#1340b8] hover:from-[#1340b8] hover:to-[#0f2fa3] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:scale-102 active:scale-98 animate-in fade-in duration-700 delay-400"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Masuk
                  </span>
                )}
              </Button>

              {/* Demo info */}
              <div className="mt-2 p-3 rounded-lg bg-[#e8effe] border border-[#d4e4fb] animate-in fade-in duration-700 delay-500 hover:border-[#1A56DB] transition-colors">
                <p className="text-xs sm:text-sm text-[#1A56DB] font-medium">
                  💡 Demo: gunakan email apapun dengan password apapun
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer - only on mobile */}
      {isMobile && (
        <div className="flex-shrink-0 px-6 py-4 text-center border-t border-[#EEF0F6]">
          <p className="text-xs text-[#9BA3BC]">
            Laku © 2026 • Sistem Manajemen Toko
          </p>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes slide-in-from-top-8 {
          from {
            opacity: 0;
            transform: translateY(-32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-from-top-4 {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-from-top-2 {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .slide-in-from-top-8 {
          animation: slide-in-from-top-8 0.5s ease-out;
        }
        
        .slide-in-from-top-4 {
          animation: slide-in-from-top-4 0.5s ease-out;
        }
        
        .slide-in-from-top-2 {
          animation: slide-in-from-top-2 0.3s ease-out;
        }
        
        .zoom-in {
          animation: zoom-in 0.5s ease-out;
        }
        
        .scale-98 {
          transform: scale(0.98);
        }
        
        .scale-101 {
          transform: scale(1.01);
        }
        
        .scale-102 {
          transform: scale(1.02);
        }
        
        .fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .delay-100 {
          animation-delay: 100ms;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
        .delay-400 {
          animation-delay: 400ms;
        }
        
        .delay-500 {
          animation-delay: 500ms;
        }
        
        .duration-300 {
          animation-duration: 300ms;
        }
        
        .duration-700 {
          animation-duration: 700ms;
        }
      `}</style>
    </div>
  );
}
