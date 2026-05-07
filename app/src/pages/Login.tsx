import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Login() {
  const navigate = useNavigate();
  const { login, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!password.trim()) {
      newErrors.password = 'Password wajib diisi';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (login(email, password)) {
        showToast('Login berhasil!');
        navigate('/', { replace: true });
      } else {
        showToast('Email atau password salah');
        setErrors({ email: 'Kredensial tidak valid', password: undefined });
      }
      setIsLoading(false);
    }, 600);
  };

  const handleDemoLogin = () => {
    setEmail('demo@example.com');
    setPassword('demo123');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.24),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.2),_transparent_28%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <Card className="w-full overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/90 shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col justify-between gap-8 p-8 md:p-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm text-slate-100/80">
                  <img src="/logo.png" alt="Laku Warung" className="h-10 w-10 rounded-2xl object-cover"/>
                  <span className="font-semibold">Laku</span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold tracking-tight text-white">Masuk ke dashboard tokomu</h1>
                  <p className="max-w-xl text-base leading-7 text-slate-300">
                    Pantau stok, kelola kasir, dan lihat laporan harian dengan cepat.
                    Masuk sekarang untuk melihat semua data toko kamu dalam satu tempat.
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-slate-300">
                  <p className="inline-flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">✓</span>
                    Login aman dan ringan untuk toko kecil.
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-200/10 text-slate-200">✓</span>
                    Coba demo login dengan satu klik.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-950/90 p-5 text-sm text-slate-400 ring-1 ring-white/10">
                <p className="font-semibold text-slate-100">Akun demo</p>
                <p>Email: <span className="font-medium text-white">demo@example.com</span></p>
                <p>Password: <span className="font-medium text-white">demo123</span></p>
              </div>
            </div>

            <div className="bg-slate-950/95 p-8 md:p-10">
              <div className="mb-8 space-y-2 text-center">
                <p className="text-sm uppercase tracking-[0.24em] text-blue-300/80">Welcome</p>
                <h2 className="text-3xl font-bold text-white">Login ke akun toko</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-3">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-200">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="Nomor telepon, username atau email"
                    className={`w-full rounded-3xl border px-4 py-3 text-sm text-slate-950 outline-none transition ${
                      errors.email ? 'border-rose-500 bg-rose-50 focus:ring-rose-200' : 'border-slate-700 bg-slate-100/90 focus:border-blue-400 focus:ring-blue-400/30'
                    }`}
                  />
                  {errors.email && <p className="text-sm text-rose-400">{errors.email}</p>}
                </div>

                <div className="space-y-3">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-200">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    placeholder="Masukkan password"
                    className={`w-full rounded-3xl border px-4 py-3 text-sm text-slate-950 outline-none transition ${
                      errors.password ? 'border-rose-500 bg-rose-50 focus:ring-rose-200' : 'border-slate-700 bg-slate-100/90 focus:border-blue-400 focus:ring-blue-400/30'
                    }`}
                  />
                  {errors.password && <p className="text-sm text-rose-400">{errors.password}</p>}
                </div>

                <Button type="submit" className="w-full rounded-3xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
                  {isLoading ? 'Sedang masuk...' : 'Masuk Sekarang'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDemoLogin}
                  className="w-full rounded-3xl border-slate-700 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
                >
                  Coba login demo
                </Button>
              </form>

              <div className="mt-6 rounded-3xl bg-slate-900/70 p-4 text-sm text-slate-400 ring-1 ring-white/10">
                <p className="text-slate-300">Tidak punya akun? Gunakan tombol demo untuk masuk cepat, atau aktifkan akun toko di pengaturan.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
