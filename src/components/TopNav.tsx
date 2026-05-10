import { useApp } from '@/context/AppContext';
import { Bell, Search, LogOut, User, Mail } from 'lucide-react';
import { useState } from 'react';
import { useIsTablet } from '@/hooks/use-mobile';
import ModalSheet from './ModalSheet';

const tabTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Selamat datang kembali 👋' },
  products: { title: 'Stok Barang', subtitle: 'Kelola inventori warung' },
  pos: { title: 'Kasir', subtitle: 'Proses transaksi penjualan' },
  records: { title: 'Catatan', subtitle: 'Riwayat semua transaksi' },
  insights: { title: 'Analisis AI', subtitle: 'Insight cerdas untuk bisnismu' },
};

export default function TopNav({ isDesktop = false }: { isDesktop?: boolean }) {
  const { state, showToast, logout, updateUser } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const isTablet = useIsTablet();
  const currentTab = tabTitles[state.activeTab] || tabTitles.dashboard;

  // Sync profileName setiap kali modal dibuka
  const handleOpenProfile = () => {
    setProfileName(state.user?.name || '');
    setProfileOpen(true);
  };

  const handleSaveProfile = () => {
    if (!profileName.trim()) {
      showToast('Nama tidak boleh kosong');
      return;
    }
    updateUser({ name: profileName });
    showToast('Profil berhasil diperbarui');
    setProfileOpen(false);
  };

  // Mobile TopNav
  if (!isDesktop) {
    return (
      <>
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
            <div
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer
                          bg-gradient-to-br from-[#f9c97c] to-[#F97316] border-2 border-white/50 active:scale-95 transition-transform"
              onClick={handleOpenProfile}
            >
              {state.user?.name?.[0]?.toUpperCase() || 'U'}
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
            <button
              className="w-[34px] h-[34px] rounded-full bg-white/20 flex items-center justify-center
                         active:bg-white/30 transition-colors active:scale-95 hover:bg-red-500/30"
              onClick={() => {
                logout();
                showToast('Logout berhasil');
              }}
              title="Logout"
            >
              <LogOut size={18} className="text-white" strokeWidth={2} />
            </button>
          </div>
        </div>
        
        {/* Profile Modal */}
        <ModalSheet open={profileOpen} onClose={() => setProfileOpen(false)} title="Edit Profil">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f9c97c] to-[#F97316] flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{state.user?.name?.[0]?.toUpperCase() || 'U'}</span>
              </div>
              <p className="text-xs text-[#9BA3BC]">{state.user?.email || 'email@domain.com'}</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#3D4566]">Nama Toko</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-[#EEF0F6] bg-[#F8F9FC] focus-within:border-[#1A56DB]">
                <User size={18} className="text-[#9BA3BC]" />
                <input
                  type="text"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  className="flex-1 bg-transparent text-sm font-medium text-[#1A1F3A] outline-none"
                  placeholder="Nama toko Anda"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#3D4566]">Email</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-[#EEF0F6] bg-[#F8F9FC]">
                <Mail size={18} className="text-[#9BA3BC]" />
                <input
                  type="email"
                  value={state.user?.email || ''}
                  disabled
                  className="flex-1 bg-transparent text-sm font-medium text-[#1A1F3A] outline-none cursor-not-allowed opacity-60"
                />
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              className="w-full mt-4 h-11 bg-gradient-to-r from-[#1A56DB] to-[#1340b8] hover:from-[#1340b8] hover:to-[#0f2fa3] text-white font-bold rounded-xl transition-all active:scale-95"
            >
              Simpan Perubahan
            </button>
          </div>
        </ModalSheet>
      </>
    );
  }

  // Desktop/Tablet TopNav
  return (
    <>
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
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white cursor-pointer
                        bg-gradient-to-br from-[#f9c97c] to-[#F97316] active:scale-95 transition-transform hover:shadow-md"
            onClick={handleOpenProfile}
            title="Buka profil"
          >
            {state.user?.name?.[0]?.toUpperCase() || 'U'}
          </button>

          {/* Logout Button */}
          <button
            className="w-9 h-9 rounded-xl bg-[#fee2e2] flex items-center justify-center
                       hover:bg-[#fecaca] transition-colors active:scale-95"
            onClick={() => {
              logout();
              showToast('Logout berhasil');
            }}
            title="Logout"
          >
            <LogOut size={16} className="text-[#ef4444]" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      <ModalSheet open={profileOpen} onClose={() => setProfileOpen(false)} title="Edit Profil">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f9c97c] to-[#F97316] flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{state.user?.name?.[0]?.toUpperCase() || 'U'}</span>
            </div>
            <p className="text-xs text-[#9BA3BC]">{state.user?.email || 'email@domain.com'}</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#3D4566]">Nama Toko</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-[#EEF0F6] bg-[#F8F9FC] focus-within:border-[#1A56DB]">
              <User size={18} className="text-[#9BA3BC]" />
              <input
                type="text"
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
                className="flex-1 bg-transparent text-sm font-medium text-[#1A1F3A] outline-none"
                placeholder="Nama toko Anda"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#3D4566]">Email</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-[#EEF0F6] bg-[#F8F9FC]">
              <Mail size={18} className="text-[#9BA3BC]" />
              <input
                type="email"
                value={state.user?.email || ''}
                disabled
                className="flex-1 bg-transparent text-sm font-medium text-[#1A1F3A] outline-none cursor-not-allowed opacity-60"
              />
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full mt-4 h-11 bg-gradient-to-r from-[#1A56DB] to-[#1340b8] hover:from-[#1340b8] hover:to-[#0f2fa3] text-white font-bold rounded-xl transition-all active:scale-95"
          >
            Simpan Perubahan
          </button>
        </div>
      </ModalSheet>
    </>
  );
}
