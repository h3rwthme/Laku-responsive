import { Wifi, Signal, Battery } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function StatusBar() {
  // Only show on mobile
  const isMobile = useIsMobile();
  if (!isMobile) return null;

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  return (
    <div className="shrink-0 bg-[#1A56DB] flex justify-between items-center px-6 pt-3 pb-2">
      <span className="text-xs font-bold text-white">{timeStr}</span>
      <div className="flex gap-1.5 items-center">
        <Signal size={14} className="text-white" strokeWidth={2.5} />
        <Wifi size={14} className="text-white" strokeWidth={2} />
        <Battery size={18} className="text-white" strokeWidth={2} />
      </div>
    </div>
  );
}
