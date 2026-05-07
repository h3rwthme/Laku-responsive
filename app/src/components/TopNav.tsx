import { useApp } from '@/context/AppContext';
import { Bell, Search, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useIsTablet } from '@/hooks/use-mobile';

const tabTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Selamat datang kembali 👋' },
  products: { title: 'Stok Barang', subtitle: 'Kelola inventori warung' },
  pos: { title: 'Kasir', subtitle: 'Proses transaksi penjualan' },
  records: { title: 'Catatan', subtitle: 'Riwayat semua transaksi' },
  insights: { title: 'Analisis AI', subtitle: 'Insight cerdas untuk bisnismu' },
};

export default function TopNav({ isDesktop = false }: { isDesktop?: boolean }) {
  const { state, showToast, logout } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const isTablet = useIsTablet();
  const currentTab = tabTitles[state.activeTab] || tabTitles.dashboard;
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileOpen && profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);


  // Mobile TopNav (unchanged original style)
  if (!isDesktop) {
    return (
      <div className="shrink-0 bg-[#1A56DB] flex justify-between items-center px-5 py-2 pb-4">
        <div className="flex items-center gap-2">
          <div>
            <div className="text-white font-extrabold text-lg leading-tight tracking-tight">
              LAKU
            </div>
            <div className="text-white/70 text-xs font-semibold leading-tight ml-0.5">
              {tabTitles[state.activeTab]?.subtitle || 'Dashboard'}
            </div>
          </div>
        </div>
        <div className="flex gap-2.5 items-center">
          <div ref={profileRef} className="relative">
          <button
            type="button"
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer bg-gradient-to-br from-[#f9c97c] to-[#F97316] border-2 border-white/50 active:scale-95 transition-transform"
            onClick={() => setProfileOpen((value) => !value)}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
          >
            S
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-12 z-50 min-w-[180px] overflow-hidden rounded-2xl border border-[#EEF0F6] bg-white shadow-xl">
              <button
                type="button"
                onClick={() => {
                  logout();
                  setProfileOpen(false);
                  showToast('Logout berhasil');
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
          <button
            className="relative w-[34px] h-[34px] rounded-full bg-white/20 flex items-center justify-center
                       active:bg-white/30 transition-colors active:scale-95"
            onClick={() => {
              setNotifOpen(!notifOpen);
              showToast('3 notifikasi baru');
            }}
          >
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F97316] rounded-full border border-[#1A56DB]" />
            <Bell size={18} className="text-white" strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }

  // Desktop/Tablet TopNav
  return (
    <div
      className="shrink-0 bg-white border-b border-[#EEF0F6] flex justify-between items-center px-6 py-4"
      style={{ boxShadow: '0 2px 16px rgba(26,79,214,0.06)' }}
    >
      <div>
        <h1 className="text-xl font-extrabold text-[#1A1F3A] leading-tight">{currentTab.title}</h1>
        <p className="text-sm text-[#9BA3BC] font-medium leading-tight mt-0.5">{currentTab.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search bar (desktop only) */}
        {!isTablet && (
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA3BC]" />
            <input
              type="text"
              placeholder="Cari sesuatu..."
              className="w-[220px] h-9 pl-9 pr-4 bg-[#F4F6FD] rounded-xl text-sm font-medium text-[#1A1F3A]
                         placeholder:text-[#9BA3BC] outline-none focus:ring-2 focus:ring-[#1A56DB]/30 transition-all"
            />
          </div>
        )}

        {/* Notification */}
        <button
          className="relative w-9 h-9 rounded-xl bg-[#F4F6FD] flex items-center justify-center
                     hover:bg-[#E8EDF8] transition-colors active:scale-95"
          onClick={() => showToast('3 notifikasi baru')}
        >
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F97316] rounded-full" />
          <Bell size={16} className="text-[#1A1F3A]" strokeWidth={2} />
        </button>

        {/* Avatar */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white cursor-pointer bg-gradient-to-br from-[#f9c97c] to-[#F97316] active:scale-95 transition-transform"
            onClick={() => setProfileOpen((value) => !value)}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
          >
            S
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-11 z-50 min-w-[200px] overflow-hidden rounded-3xl border border-[#EEF0F6] bg-white shadow-xl">
              <div className="px-4 py-3 border-b border-[#EEF0F6]">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#9BA3BC]">Logged in as</p>
                <p className="mt-1 truncate text-sm font-semibold text-[#1A1F3A]">{state.auth.user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setProfileOpen(false);
                  showToast('Logout berhasil');
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
