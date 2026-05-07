import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import ModalSheet from '@/components/ModalSheet';
import { Wallet, ShoppingBag, Mic, TrendingUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Dashboard() {
  const { state } = useApp();
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [listening, setListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Tekan untuk merekam');

  const today = new Date().toISOString().split('T')[0];
  const todayTransactions = state.transactions.filter(t => t.createdAt.startsWith(today));

  const todayRevenue = todayTransactions
    .filter(t => t.type === 'OUT')
    .reduce((sum, t) => sum + t.totalPrice, 0);
  const todayExpense = todayTransactions
    .filter(t => t.type === 'IN')
    .reduce((sum, t) => sum + Math.abs(t.totalPrice), 0);
  const todayProfit = todayRevenue - todayExpense * 0.2;
  const cashOnHand = 1200000 + todayRevenue - todayExpense;

  const stats = [
    {
      key: 'laba',
      label: 'Laba Hari Ini',
      value: `Rp ${todayProfit.toLocaleString('id-ID')}`,
      bg: 'bg-[#1A56DB]',
      shadow: 'stat-blue-shadow',
      icon: Wallet,
      detailTitle: 'Laba Hari Ini',
      detailRows: [
        ['Total Penjualan', `Rp ${todayRevenue.toLocaleString('id-ID')}`],
        ['Total HPP', `Rp ${Math.floor(todayExpense * 0.2).toLocaleString('id-ID')}`],
        ['Laba Bersih', `Rp ${Math.floor(todayProfit).toLocaleString('id-ID')}`],
        ['Target Harian', 'Rp 300.000'],
        ['Status', todayProfit >= 300000 ? '✅ Tercapai' : '⏳ Belum Tercapai'],
      ],
    },
    {
      key: 'kas',
      label: 'Kas di Tangan',
      value: `Rp ${cashOnHand.toLocaleString('id-ID')}`,
      bg: 'bg-[#F97316]',
      shadow: 'stat-orange-shadow',
      icon: ShoppingBag,
      detailTitle: 'Kas di Tangan',
      detailRows: [
        ['Saldo Awal', 'Rp 1.000.000'],
        ['Pemasukan Hari Ini', `Rp ${todayRevenue.toLocaleString('id-ID')}`],
        ['Pengeluaran Hari Ini', `Rp ${todayExpense.toLocaleString('id-ID')}`],
        ['Saldo Sekarang', `Rp ${cashOnHand.toLocaleString('id-ID')}`],
      ],
    },
  ];

  const openModal = (key: string) => {
    const stat = stats.find(s => s.key === key);
    if (!stat) return;
    setModalTitle(stat.detailTitle);
    setModalContent(
      <div>
        {stat.detailRows.map(([label, value], i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-[#EEF0F6] last:border-b-0">
            <span className="text-[13px] font-semibold text-[#3D4566]">{label}</span>
            <span className="text-[13px] font-bold text-[#1A1F3A]">{value}</span>
          </div>
        ))}
      </div>
    );
    setModalOpen(true);
  };

  const openInsightModal = () => {
    setModalTitle('🤖 AI Insight Minggu Depan');
    setModalContent(
      <div>
        {[
          ['Cabai Merah', '+12 kg'],
          ['Telur', '+5 kg'],
          ['Beras', 'Stok cukup'],
          ['Minyak Goreng', '+4 liter'],
          ['Prediksi Omzet', 'Rp 2.800.000'],
        ].map(([label, value], i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-[#EEF0F6] last:border-b-0">
            <span className="text-[13px] font-semibold text-[#3D4566]">{label}</span>
            <span className="text-[13px] font-bold text-[#1A1F3A]">{value}</span>
          </div>
        ))}
      </div>
    );
    setModalOpen(true);
  };

  const startListening = () => {
    setListening(true);
    setVoiceStatus('🔴 Sedang merekam...');
  };

  const stopListening = () => {
    if (!listening) return;
    setListening(false);
    setVoiceStatus('⏳ Memproses...');
    setTimeout(() => {
      setVoiceStatus('✅ Transaksi dicatat!');
      setTimeout(() => setVoiceStatus('Tekan untuk merekam'), 2000);
    }, 1200);
  };

  const recentTx = useMemo(() => {
    const txMap = new Map<string, { time: string; desc: string; ai: string; type: 'sale' | 'purchase' }>();
    state.transactions.slice(0, 6).forEach(t => {
      const hour = new Date(t.createdAt).getHours().toString().padStart(2, '0');
      const minute = new Date(t.createdAt).getMinutes().toString().padStart(2, '0');
      const time = `${hour}:${minute}`;

      if (t.type === 'OUT') {
        const profit = Math.floor(t.totalPrice * 0.8);
        const key = `sale-${time}`;
        if (!txMap.has(key)) {
          txMap.set(key, {
            time,
            desc: t.note || `Penjualan: ${t.qty}x ${t.productName}`,
            ai: `AI: Laba +Rp ${profit.toLocaleString('id-ID')}. Stok OK.`,
            type: 'sale',
          });
        }
      } else {
        const key = `buy-${t.id}`;
        txMap.set(key, {
          time,
          desc: t.note || `Pembelian: ${t.qty}x ${t.productName}`,
          ai: `AI: Biaya -Rp ${Math.abs(t.totalPrice).toLocaleString('id-ID')}. Stok +${t.qty} ${t.productName}.`,
          type: 'purchase',
        });
      }
    });
    return Array.from(txMap.values()).slice(0, isMobile ? 3 : 5);
  }, [state.transactions, isMobile]);

  const content = (
    <>
      {/* Stat Cards */}
      <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.key}
              onClick={() => openModal(stat.key)}
              className={`${stat.bg} ${stat.shadow} rounded-2xl p-3.5 pb-3 flex flex-col gap-1.5
                         text-white text-left relative overflow-hidden
                         active:scale-[0.97] transition-transform
                         animate-fade-up ${i === 0 ? 'animate-delay-1' : 'animate-delay-2'}`}
            >
              <div className="absolute right-[-14px] top-[-14px] w-[70px] h-[70px] rounded-full bg-white/10" />
              <div className={`rounded-lg bg-white/20 flex items-center justify-center relative z-10 ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`}>
                <Icon size={isMobile ? 18 : 22} className="text-white" strokeWidth={2} />
              </div>
              <div className={`font-semibold opacity-85 relative z-10 ${isMobile ? 'text-[11px]' : 'text-xs'}`}>{stat.label}</div>
              <div className={`font-extrabold tracking-tight relative z-10 ${isMobile ? 'text-xl' : 'text-2xl'}`}>{stat.value}</div>
            </button>
          );
        })}

        {/* Extra stats for desktop */}
        {!isMobile && (
          <>
            <div className="bg-white rounded-2xl p-3.5 flex flex-col gap-1.5 card-shadow animate-fade-up animate-delay-3">
              <div className="w-10 h-10 rounded-lg bg-[#dcfce7] flex items-center justify-center">
                <TrendingUp size={22} className="text-[#22c55e]" strokeWidth={2} />
              </div>
              <div className="text-xs font-semibold text-[#9BA3BC]">Total Transaksi</div>
              <div className="text-2xl font-extrabold text-[#1A1F3A] tracking-tight">{state.transactions.length}</div>
            </div>
            <div className="bg-white rounded-2xl p-3.5 flex flex-col gap-1.5 card-shadow animate-fade-up animate-delay-4">
              <div className="w-10 h-10 rounded-lg bg-[#fde8dc] flex items-center justify-center">
                <ShoppingBag size={22} className="text-[#F97316]" strokeWidth={2} />
              </div>
              <div className="text-xs font-semibold text-[#9BA3BC]">Total Produk</div>
              <div className="text-2xl font-extrabold text-[#1A1F3A] tracking-tight">{state.products.length}</div>
            </div>
          </>
        )}
      </div>

      {/* Desktop: 2-col layout for transactions + voice */}
      <div className={`${isMobile ? 'flex flex-col gap-4' : 'grid grid-cols-3 gap-4'}`}>
        {/* Recent Transactions */}
        <div className={`flex flex-col gap-2.5 ${isMobile ? '' : 'col-span-2'}`}>
          <div className="flex justify-between items-center animate-fade-up animate-delay-3">
            <h3 className={`font-extrabold text-[#1A1F3A] ${isMobile ? 'text-[15px]' : 'text-base'}`}>Transaksi Terbaru</h3>
            <span className="text-xs font-bold text-[#1A56DB] cursor-pointer hover:underline">Lihat semua</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {recentTx.map((tx, i) => (
              <div
                key={i}
                className="bg-white rounded-[10px] p-3 flex gap-3 items-start card-shadow
                           hover:card-shadow-hover active:scale-[0.98] transition-all
                           animate-fade-up"
                style={{ animationDelay: `${0.15 + i * 0.05}s` }}
              >
                <div className={`rounded-full flex items-center justify-center shrink-0 text-[15px]
                  ${tx.type === 'sale' ? 'bg-[#dcfce7]' : 'bg-[#fee2e2]'}
                  ${isMobile ? 'w-[34px] h-[34px]' : 'w-10 h-10'}`}>
                  {tx.type === 'sale' ? '💬' : '🛒'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-[#9BA3BC]">{tx.time}</div>
                  <div className="text-xs font-semibold text-[#1A1F3A] leading-relaxed mt-0.5">{tx.desc}</div>
                  <div className="text-[11px] text-[#9BA3BC] font-medium mt-0.5">
                    {tx.ai.includes('Laba') ? (
                      <>AI: Laba <span className="text-[#22c55e] font-bold">+{tx.ai.split('+')[1]}</span></>
                    ) : (
                      <>AI: Biaya <span className="text-[#ef4444] font-bold">-{tx.ai.split('-')[1]}</span></>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {recentTx.length === 0 && (
              <div className="text-center py-8 text-[#9BA3BC] text-sm">Belum ada transaksi hari ini</div>
            )}
          </div>
        </div>

        {/* Right column: AI Insight + Voice */}
        <div className="flex flex-col gap-3">
          {/* AI Insight Card */}
          <button
            onClick={openInsightModal}
            className="bg-white rounded-[10px] p-3.5 flex gap-3 items-center card-shadow border-l-[3px] border-[#1A56DB]
                       hover:card-shadow-hover active:scale-[0.98] transition-all animate-fade-up animate-delay-5 text-left"
          >
            <div className="w-10 h-10 bg-[#e8effe] rounded-[10px] flex items-center justify-center shrink-0">
              <TrendingUp size={22} className="text-[#1A56DB]" strokeWidth={2} />
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-[#1A56DB] uppercase tracking-wider">AI Insight</div>
              <div className="text-xs font-semibold text-[#3D4566] mt-0.5 leading-relaxed">
                Prediksi Belanja Minggu Depan: Cabai Merah (+12kg), Telur (+5 Papan).
              </div>
            </div>
          </button>

          {/* Voice Section */}
          <div
            className="relative rounded-2xl p-5 flex items-center justify-center flex-col gap-3 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1340b8 0%, #1A56DB 100%)',
              boxShadow: '0 8px 32px rgba(26,79,214,0.18)',
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='white' stroke-width='1' fill='none'/%3E%3Ccircle cx='50' cy='50' r='25' stroke='white' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
                backgroundSize: '80px 80px',
              }}
            />
            <div className="text-[11px] font-bold text-white/65 uppercase tracking-[1.2px] text-center relative z-10">
              Tahan &amp; Bicara untuk Nyetor
            </div>
            <button
              className={`relative z-10 w-20 h-20 rounded-full neumorphic-btn flex items-center justify-center
                         transition-all duration-150 ${listening ? 'animate-pulse-ring' : ''}
                         active:scale-95`}
              onMouseDown={startListening}
              onMouseUp={stopListening}
              onTouchStart={startListening}
              onTouchEnd={stopListening}
              onMouseLeave={() => listening && stopListening()}
            >
              <Mic size={32} className="text-[#2a4a90]" strokeWidth={2.5} />
            </button>
            <div className={`text-xs font-semibold relative z-10 ${listening ? 'text-pink-300' : 'text-white/85'}`}>
              {voiceStatus}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className={`flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-4
      ${isMobile ? 'px-4 py-4' : 'px-6 py-6'}`}>
      {/* Store Header (mobile only) */}
      {isMobile && (
        <div className="flex justify-between items-center animate-fade-up animate-delay-1">
          <h2 className="text-[15px] font-extrabold text-[#1A1F3A] tracking-tight">WARUNG BU SRI</h2>
        </div>
      )}
      {content}
      <ModalSheet open={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>
        {modalContent}
      </ModalSheet>
    </div>
  );
}
