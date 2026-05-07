import { useApp } from '@/context/AppContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import StatusBar from '@/components/StatusBar';
import TopNav from '@/components/TopNav';
import BottomNav from '@/components/BottomNav';
import SideNav from '@/components/SideNav';
import Toast from '@/components/Toast';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import POS from '@/pages/POS';
import Records from '@/pages/Records';
import Insights from '@/pages/Insights';
import { useIsMobile } from '@/hooks/use-mobile';

export default function App() {
  const { state } = useApp();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          state.auth.isLoggedIn ? <Navigate to="/" replace /> : <Login />
        }
      />
      <Route
        path="/*"
        element={
          state.auth.isLoggedIn ? <AppContent /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

function AppContent() {
  const { state } = useApp();
  const isMobile = useIsMobile();

  const renderPage = () => {
    switch (state.activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'products': return <Products />;
      case 'pos': return <POS />;
      case 'records': return <Records />;
      case 'insights': return <Insights />;
      default: return <Dashboard />;
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen w-full bg-[#E8EDF8] flex justify-center items-center">
        <div className="w-full max-w-[430px] min-h-screen bg-[#F8F9FD] flex flex-col relative">
          <StatusBar />
          <TopNav />
          <main className="flex-1 flex flex-col overflow-hidden relative">
            {renderPage()}
          </main>
          <BottomNav />
          <Toast />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#E8EDF8] flex">
      <SideNav />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopNav isDesktop />
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {renderPage()}
        </main>
      </div>
      <Toast />
    </div>
  );
}
