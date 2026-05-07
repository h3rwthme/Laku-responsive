import { useApp } from '@/context/AppContext';
import type { TabType } from '@/types';
import { LayoutDashboard, Package, Calculator, Receipt, BarChart3 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'products', label: 'Stok', icon: Package },
  { key: 'pos', label: 'Kasir', icon: Calculator },
  { key: 'records', label: 'Catatan', icon: Receipt },
  { key: 'insights', label: 'Analisis', icon: BarChart3 },
];

export default function BottomNav() {
  const { state, dispatch } = useApp();
  const isMobile = useIsMobile();

  // Only show on mobile
  if (!isMobile) return null;

  return (
    <nav className="shrink-0 bg-white border-t border-[#EEF0F6] z-50"
         style={{ boxShadow: '0 -4px 20px rgba(26,79,214,0.07)' }}>
      <div className="flex items-center justify-around px-2 pt-2 pb-[max(12px,env(safe-area-inset-bottom))]">
        {tabs.map(tab => {
          const isActive = state.activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => dispatch({ type: 'SET_TAB', payload: tab.key })}
              className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-colors duration-150 min-w-[56px]
                         active:scale-95"
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={`transition-colors duration-150 ${isActive ? 'text-[#1A56DB]' : 'text-[#9BA3BC]'}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className={`text-[10px] font-bold transition-colors duration-150 ${isActive ? 'text-[#1A56DB]' : 'text-[#9BA3BC]'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-4 h-0.5 bg-[#1A56DB] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
