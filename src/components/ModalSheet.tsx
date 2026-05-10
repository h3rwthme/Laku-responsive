import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function ModalSheet({ open, onClose, title, children }: ModalSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end modal-overlay"
      style={{ backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-3xl p-5 pb-8 modal-sheet"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#DDE1EF] rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-[#1A1F3A]">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F8F9FC] flex items-center justify-center active:scale-95"
          >
            <X size={16} className="text-[#9BA3BC]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
