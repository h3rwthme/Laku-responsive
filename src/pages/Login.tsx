import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Mail, Lock, Zap } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Email dan password harus diisi');
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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F8F9FD] via-[#F0F2FA] to-[#E8EDF8] flex flex-col">
      {/* Desktop background decoration */}
      {!isMobile && (
        <>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1A56DB]/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F97316]/5 rounded-full blur-3xl -z-10" />
        </>
      )}

      {/* Header section */}
      <div className={`flex-shrink-0 ${isMobile ? 'px-6 pt-8 pb-6' : 'px-8 py-12'}`}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1A56DB] to-[#1340b8] flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#1A1F3A]">Laku</h1>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex items-center justify-center ${isMobile ? 'px-4 pb-8' : 'px-8'}`}>
        <div className={`w-full ${isMobile ? '' : 'max-w-md'} bg-white rounded-3xl card-shadow overflow-hidden`}>
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-[#1A56DB] to-[#F97316]" />

          <div className={`${isMobile ? 'px-5 py-8' : 'px-8 py-10'} flex flex-col gap-6`}>
            {/* Title section */}
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-[#1A1F3A]">Selamat Datang Kembali</h2>
              <p className="text-sm text-[#9BA3BC]">Masuk ke akun Anda untuk mengelola toko</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email field */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#3D4566]">Email</label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                  focusedField === 'email' 
                    ? 'border-[#1A56DB] bg-[#e8effe]' 
                    : 'border-[#EEF0F6] bg-[#F8F9FC]'
                }`}>
                  <Mail size={18} className={focusedField === 'email' ? 'text-[#1A56DB]' : 'text-[#9BA3BC]'} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="flex-1 bg-transparent text-sm font-medium text-[#1A1F3A] placeholder-[#DDE1EF] outline-none"
                    placeholder="nama@domain.com"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#3D4566]">Password</label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                  focusedField === 'password' 
                    ? 'border-[#1A56DB] bg-[#e8effe]' 
                    : 'border-[#EEF0F6] bg-[#F8F9FC]'
                }`}>
                  <Lock size={18} className={focusedField === 'password' ? 'text-[#1A56DB]' : 'text-[#9BA3BC]'} />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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
                className="w-full mt-2 h-11 text-sm font-bold bg-gradient-to-r from-[#1A56DB] to-[#1340b8] hover:from-[#1340b8] hover:to-[#0f2fa3] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  'Masuk'
                )}
              </Button>

              {/* Demo info */}
              <div className="mt-2 p-3 rounded-lg bg-[#e8effe] border border-[#d4e4fb]">
                <p className="text-xs text-[#1A56DB] font-medium">
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
    </div>
  );
}
