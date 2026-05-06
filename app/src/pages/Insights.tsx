import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { TrendingUp, Package, BarChart3, AlertTriangle, Bot, Lightbulb } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Insights() {
  const { state } = useApp();
  const isMobile = useIsMobile();

  const stats = useMemo(() => {
    const totalProducts = state.products.length;
    const totalTransactions = state.transactions.length;
    const lowStockItems = state.products.filter(p => p.stock <= 5 && p.stock > 0);
    const outOfStock = state.products.filter(p => p.stock === 0);

    const salesByProduct = new Map<string, number>();
    state.transactions.filter(t => t.type === 'OUT').forEach(t => {
      salesByProduct.set(t.productName, (salesByProduct.get(t.productName) || 0) + t.qty);
    });
    let bestSeller = '-';
    let bestSellerQty = 0;
    salesByProduct.forEach((qty, name) => {
      if (qty > bestSellerQty) { bestSellerQty = qty; bestSeller = name; }
    });

    const now = new Date();
    const weekData: { day: string; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      const dayRevenue = state.transactions
        .filter(t => t.createdAt.startsWith(dateStr) && t.type === 'OUT')
        .reduce((sum, t) => sum + t.totalPrice, 0);
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      weekData.push({ day: dayNames[d.getDay()], revenue: dayRevenue });
    }
    const maxRevenue = Math.max(...weekData.map(d => d.revenue), 1);

    return { totalProducts, totalTransactions, lowStockItems, outOfStock, bestSeller, bestSellerQty, weekData, maxRevenue };
  }, [state.products, state.transactions]);

  const predictions = [
    { product: 'Cabai Merah', qty: '+12 kg', emoji: '🌶️', urgency: 'high' },
    { product: 'Telur', qty: '+5 kg', emoji: '🥚', urgency: 'medium' },
    { product: 'Beras', qty: 'Stok cukup', emoji: '🍚', urgency: 'low' },
    { product: 'Minyak Goreng', qty: '+4 liter', emoji: '🧴', urgency: 'medium' },
  ];

  const overviewCards = (
    <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
      <div className="bg-white rounded-xl p-3.5 card-shadow animate-fade-up animate-delay-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#e8effe] flex items-center justify-center">
            <Package size={16} className="text-[#1A56DB]" />
          </div>
          <span className="text-[10px] font-bold text-[#9BA3BC]">Total SKU</span>
        </div>
        <div className="text-2xl font-extrabold text-[#1A1F3A]">{stats.totalProducts}</div>
        <div className="text-[10px] text-[#9BA3BC] font-medium">produk aktif</div>
      </div>
      <div className="bg-white rounded-xl p-3.5 card-shadow animate-fade-up animate-delay-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#fde8dc] flex items-center justify-center">
            <TrendingUp size={16} className="text-[#F97316]" />
          </div>
          <span className="text-[10px] font-bold text-[#9BA3BC]">Terlaris</span>
        </div>
        <div className="text-lg font-extrabold text-[#1A1F3A] leading-tight truncate">{stats.bestSeller}</div>
        <div className="text-[10px] text-[#9BA3BC] font-medium">{stats.bestSellerQty} terjual</div>
      </div>
      {!isMobile && (
        <>
          <div className="bg-white rounded-xl p-3.5 card-shadow animate-fade-up animate-delay-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#dcfce7] flex items-center justify-center">
                <TrendingUp size={16} className="text-[#22c55e]" />
              </div>
              <span className="text-[10px] font-bold text-[#9BA3BC]">Total Transaksi</span>
            </div>
            <div className="text-2xl font-extrabold text-[#1A1F3A]">{stats.totalTransactions}</div>
            <div className="text-[10px] text-[#9BA3BC] font-medium">semua waktu</div>
          </div>
          <div className="bg-white rounded-xl p-3.5 card-shadow animate-fade-up animate-delay-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#fee2e2] flex items-center justify-center">
                <AlertTriangle size={16} className="text-[#ef4444]" />
              </div>
              <span className="text-[10px] font-bold text-[#9BA3BC]">Stok Rendah</span>
            </div>
            <div className="text-2xl font-extrabold text-[#ef4444]">{stats.lowStockItems.length + stats.outOfStock.length}</div>
            <div className="text-[10px] text-[#9BA3BC] font-medium">perlu perhatian</div>
          </div>
        </>
      )}
    </div>
  );

  const weeklyChart = (
    <div className="bg-white rounded-xl p-4 card-shadow animate-fade-up animate-delay-3">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={16} className="text-[#1A56DB]" />
        <h3 className="text-sm font-extrabold text-[#1A1F3A]">Omzet Mingguan</h3>
      </div>
      <div className={`flex items-end justify-between gap-2 ${isMobile ? 'h-[120px]' : 'h-[160px]'}`}>
        {stats.weekData.map((d, i) => {
          const heightPercent = (d.revenue / stats.maxRevenue) * 100;
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className="text-[9px] font-bold text-[#9BA3BC]">
                {d.revenue > 0 ? `Rp ${(d.revenue / 1000).toFixed(0)}k` : ''}
              </div>
              <div
                className="w-full max-w-[40px] rounded-t-md transition-all duration-500"
                style={{
                  height: `${Math.max(heightPercent, 4)}%`,
                  background: d.revenue > 0 ? 'linear-gradient(to top, #1A56DB, #3B82F6)' : '#EEF0F6',
                }}
              />
              <div className="text-[9px] font-bold text-[#9BA3BC]">{d.day}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const stockAlerts = (stats.lowStockItems.length > 0 || stats.outOfStock.length > 0) && (
    <div className="bg-[#fee2e2] rounded-xl p-4 animate-fade-up animate-delay-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} className="text-[#ef4444]" />
        <h3 className="text-sm font-extrabold text-[#ef4444]">Peringatan Stok</h3>
      </div>
      <div className={`flex flex-col gap-2 ${!isMobile ? 'grid grid-cols-2 gap-2' : ''}`}>
        {stats.outOfStock.map(p => (
          <div key={p.id} className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2">
            <span className="text-xs font-bold text-[#ef4444]">{p.emoji} {p.name}</span>
            <span className="text-[10px] font-extrabold text-[#ef4444] bg-white px-2 py-0.5 rounded">HABIS</span>
          </div>
        ))}
        {stats.lowStockItems.map(p => (
          <div key={p.id} className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2">
            <span className="text-xs font-bold text-[#F97316]">{p.emoji} {p.name}</span>
            <span className="text-[10px] font-bold text-[#F97316]">Sisa {p.stock}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const aiPredictions = (
    <div className="bg-white rounded-xl p-4 card-shadow animate-fade-up animate-delay-5">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={16} className="text-[#F97316]" />
        <h3 className="text-sm font-extrabold text-[#1A1F3A]">Prediksi Belanja Minggu Depan</h3>
      </div>
      <div className={`${isMobile ? 'flex flex-col gap-2.5' : 'grid grid-cols-2 gap-x-6 gap-y-2'}`}>
        {predictions.map((pred, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-[#EEF0F6] last:border-b-0">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{pred.emoji}</span>
              <div>
                <div className="text-xs font-bold text-[#1A1F3A]">{pred.product}</div>
                <div className={`text-[10px] font-bold
                  ${pred.urgency === 'high' ? 'text-[#ef4444]' :
                    pred.urgency === 'medium' ? 'text-[#F97316]' : 'text-[#22c55e]'}`}>
                  {pred.urgency === 'high' ? 'Segera restock' :
                   pred.urgency === 'medium' ? 'Restock minggu ini' : 'Stok aman'}
                </div>
              </div>
            </div>
            <span className="text-xs font-extrabold text-[#1A1F3A]">{pred.qty}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const predictionFooter = (
    <div className="bg-gradient-to-r from-[#1340b8] to-[#1A56DB] rounded-xl p-4 animate-fade-up animate-delay-5">
      <div className="flex items-center gap-2 mb-2">
        <Bot size={16} className="text-white" />
        <span className="text-xs font-bold text-white/80">AI Prediction</span>
      </div>
      <div className={`font-extrabold text-white ${isMobile ? 'text-lg' : 'text-xl'}`}>
        Prediksi Omzet: Rp 2.800.000
      </div>
      <div className="text-[11px] text-white/60 font-medium mt-1">
        +12% dari minggu lalu berdasarkan pola penjualan
      </div>
    </div>
  );

  return (
    <div className={`flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-4 ${isMobile ? 'px-4 py-4' : 'px-6 py-6'}`}>
      {/* Header - mobile only */}
      {isMobile && (
        <div className="flex items-center gap-2 animate-fade-up animate-delay-1">
          <Bot size={20} className="text-[#1A56DB]" />
          <h2 className="text-[15px] font-extrabold text-[#1A1F3A]">AI Insights</h2>
        </div>
      )}

      {overviewCards}

      {isMobile ? (
        <>
          {weeklyChart}
          {stockAlerts}
          {aiPredictions}
          {predictionFooter}
        </>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            {weeklyChart}
            {stockAlerts}
          </div>
          <div className="flex flex-col gap-4">
            {aiPredictions}
            {predictionFooter}
          </div>
        </div>
      )}
    </div>
  );
}
