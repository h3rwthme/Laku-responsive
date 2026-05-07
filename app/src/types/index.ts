export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  emoji: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  type: 'IN' | 'OUT';
  qty: number;
  totalPrice: number;
  note?: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  qty: number;
}

export type TabType = 'dashboard' | 'products' | 'pos' | 'records' | 'insights';

export interface ToastState {
  visible: boolean;
  message: string;
}

export interface ModalState {
  open: boolean;
  title: string;
  content: React.ReactNode;
}

export interface DashboardStats {
  todayProfit: number;
  cashOnHand: number;
  todayRevenue: number;
  todayExpense: number;
  targetProfit: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}
