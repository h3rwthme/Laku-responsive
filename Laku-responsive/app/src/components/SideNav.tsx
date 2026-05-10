import { useApp } from '@/context/AppContext';
import type { TabType } from '@/types';
import { LayoutDashboard, Package, Calculator, Receipt, BarChart3, Home } from 'lucide-react';
import { useIsTablet } from '@/hooks/use-mobile';

const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'products', label: 'Stok Barang', icon: Package },
  { key: 'pos', label: 'Kasir', icon: Calculator },
  { key: 'records', label: 'Catatan', icon: Receipt },
  { key: 'insights', label: 'Analisis AI', icon: BarChart3 },
];

export default function SideNav() {
  const { state, dispatch } = useApp();
  const isTablet = useIsTablet();

  return (
    <nav
      className={`
        flex flex-col bg-white border-r border-[#EEF0F6] shrink-0
        ${isTablet ? 'w-[72px]' : 'w-[240px]'}
      `}
      style={{ boxShadow: '4px 0 20px rgba(26,79,214,0.06)', minHeight: '100vh' }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[#EEF0F6] ${isTablet ? 'justify-center px-0' : ''}`}>
        <div className="w-9 h-9 bg-[#1A56DB] rounded-xl flex items-center justify-center shrink-0">
          <Home size={18} className="text-white" strokeWidth={2.5} />
        </div>
        {!isTablet && (
          <div>
            <div className="text-[#1A1F3A] font-extrabold text-base leading-tight tracking-tight">LAKU</div>
            <div className="text-[#9BA3BC] text-[10px] font-semibold leading-tight">Warung Bu Sri</div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-1 p-2 flex-1 mt-1">
        {tabs.map(tab => {
          const isActive = state.activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => dispatch({ type: 'SET_TAB', payload: tab.key })}
              title={isTablet ? tab.label : undefined}
              className={`
                flex items-center gap-3 rounded-xl transition-all duration-150
                ${isTablet ? 'justify-center p-3' : 'px-3 py-2.5'}
                ${isActive
                  ? 'bg-[#1A56DB] text-white'
                  : 'text-[#9BA3BC] hover:bg-[#F4F6FD] hover:text-[#1A1F3A]'
                }
              `}
            >
              <Icon
                size={isTablet ? 22 : 18}
                strokeWidth={isActive ? 2.5 : 2}
                className="shrink-0"
              />
              {!isTablet && (
                <span className={`text-sm font-bold ${isActive ? 'text-white' : ''}`}>
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Avatar - dynamic dari state */}
      <div className={`p-3 border-t border-[#EEF0F6] flex items-center gap-3 ${isTablet ? 'justify-center' : 'px-4'}`}>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0
                    bg-gradient-to-br from-[#f9c97c] to-[#F97316] border-2 border-white"
          style={{ boxShadow: '0 2px 8px rgba(249,115,22,0.3)' }}
        >
          {state.user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        {!isTablet && (
          <div className="min-w-0">
            <div className="text-xs font-bold text-[#1A1F3A] truncate">{state.user?.name || 'User'}</div>
            <div className="text-[10px] text-[#9BA3BC] font-medium truncate">{state.user?.email || ''}</div>
          </div>
        )}
      </div>
    </nav>
  );
}
