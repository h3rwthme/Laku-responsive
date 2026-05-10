import { useApp } from '@/context/AppContext';
import { CheckCircle } from 'lucide-react';

export default function Toast() {
  const { state } = useApp();

  return (
    <div
      className={`fixed top-6 left-1/2 z-[999] flex items-center gap-2 px-5 py-3 rounded-full
                  bg-[#1A1F3A] text-white text-[13px] font-semibold whitespace-nowrap
                  transition-all duration-300 pointer-events-none
                  ${state.toast.visible
                    ? '-translate-x-1/2 translate-y-0 opacity-100'
                    : '-translate-x-1/2 -translate-y-20 opacity-0'
                  }`}
      style={{
        transitionTimingFunction: state.toast.visible
          ? 'cubic-bezier(0.34,1.56,0.64,1)'
          : 'ease-in',
      }}
    >
      <CheckCircle size={16} className="text-[#22c55e] shrink-0" />
      {state.toast.message}
    </div>
  );
}
