import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Product, Transaction, CartItem, TabType, ToastState } from '@/types';

// Sample initial products
const initialProducts: Product[] = [
  { id: '1', name: 'Nasi Goreng', price: 15000, stock: 50, emoji: '🍛', createdAt: '2025-04-01T00:00:00Z' },
  { id: '2', name: 'Es Teh', price: 5000, stock: 30, emoji: '🥤', createdAt: '2025-04-01T00:00:00Z' },
  { id: '3', name: 'Beras 1kg', price: 12000, stock: 100, emoji: '🍚', createdAt: '2025-04-01T00:00:00Z' },
  { id: '4', name: 'Cabai Merah', price: 8000, stock: 20, emoji: '🌶️', createdAt: '2025-04-01T00:00:00Z' },
  { id: '5', name: 'Telur 1kg', price: 25000, stock: 40, emoji: '🥚', createdAt: '2025-04-01T00:00:00Z' },
  { id: '6', name: 'Minyak Goreng', price: 15000, stock: 25, emoji: '🧴', createdAt: '2025-04-01T00:00:00Z' },
  { id: '7', name: 'Mie Goreng', price: 10000, stock: 0, emoji: '🍜', createdAt: '2025-04-01T00:00:00Z' },
  { id: '8', name: 'Kopi', price: 6000, stock: 60, emoji: '☕', createdAt: '2025-04-01T00:00:00Z' },
];

// Sample initial transactions
const initialTransactions: Transaction[] = [
  {
    id: '1', productId: '1', productName: 'Nasi Goreng',
    type: 'OUT', qty: 3, totalPrice: 45000,
    note: 'Penjualan: 3x Nasi Goreng, 2x Es Teh',
    createdAt: '2026-05-06T10:15:00Z',
  },
  {
    id: '2', productId: '2', productName: 'Es Teh',
    type: 'OUT', qty: 2, totalPrice: 10000,
    note: 'Penjualan: 3x Nasi Goreng, 2x Es Teh',
    createdAt: '2026-05-06T10:15:00Z',
  },
  {
    id: '3', productId: '3', productName: 'Beras 1kg',
    type: 'IN', qty: 10, totalPrice: 120000,
    note: 'Pembelian: 10kg Beras',
    createdAt: '2026-05-06T11:30:00Z',
  },
  {
    id: '4', productId: '1', productName: 'Nasi Goreng',
    type: 'OUT', qty: 2, totalPrice: 30000,
    note: 'Penjualan: 2x Nasi Goreng',
    createdAt: '2026-05-06T12:45:00Z',
  },
  {
    id: '5', productId: '4', productName: 'Cabai Merah',
    type: 'OUT', qty: 5, totalPrice: 40000,
    note: 'Penjualan: 5x Cabai Merah',
    createdAt: '2026-05-06T14:20:00Z',
  },
  {
    id: '6', productId: '5', productName: 'Telur 1kg',
    type: 'IN', qty: 5, totalPrice: 125000,
    note: 'Pembelian: 5kg Telur',
    createdAt: '2026-05-06T15:00:00Z',
  },
  {
    id: '7', productId: '6', productName: 'Minyak Goreng',
    type: 'IN', qty: 4, totalPrice: 60000,
    note: 'Pembelian: 4 liter Minyak Goreng',
    createdAt: '2026-05-06T16:10:00Z',
  },
  {
    id: '8', productId: '3', productName: 'Beras 1kg',
    type: 'OUT', qty: 8, totalPrice: 96000,
    note: 'Penjualan: 8kg Beras',
    createdAt: '2026-05-05T09:30:00Z',
  },
  {
    id: '9', productId: '8', productName: 'Kopi',
    type: 'OUT', qty: 10, totalPrice: 60000,
    note: 'Penjualan: 10x Kopi',
    createdAt: '2026-05-05T11:00:00Z',
  },
];

interface AppState {
  products: Product[];
  transactions: Transaction[];
  cart: CartItem[];
  activeTab: TabType;
  toast: ToastState;
}

type AppAction =
  | { type: 'SET_TAB'; payload: TabType }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADJUST_STOCK'; payload: { productId: string; qty: number; type: 'IN' | 'OUT'; note?: string } }
  | { type: 'ADD_TO_CART'; payload: { productId: string; productName: string; price: number } }
  | { type: 'UPDATE_CART_QTY'; payload: { productId: string; delta: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SHOW_TOAST'; payload: string }
  | { type: 'HIDE_TOAST' };

const initialState: AppState = {
  products: initialProducts,
  transactions: initialTransactions,
  cart: [],
  activeTab: 'dashboard',
  toast: { visible: false, message: '' },
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.payload };

    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p),
      };

    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    case 'ADJUST_STOCK': {
      const { productId, qty, type, note } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (!product) return state;

      const newStock = type === 'IN' ? product.stock + qty : Math.max(0, product.stock - qty);
      const updatedProducts = state.products.map(p =>
        p.id === productId ? { ...p, stock: newStock } : p
      );

      const transaction: Transaction = {
        id: generateId(),
        productId,
        productName: product.name,
        type,
        qty,
        totalPrice: type === 'IN' ? product.price * qty * -1 : product.price * qty,
        note: note || `${type === 'IN' ? 'Penambahan' : 'Pengurangan'} stok: ${qty} ${product.name}`,
        createdAt: new Date().toISOString(),
      };

      return {
        ...state,
        products: updatedProducts,
        transactions: [transaction, ...state.transactions],
      };
    }

    case 'ADD_TO_CART': {
      const existing = state.cart.find(item => item.productId === action.payload.productId);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.productId === action.payload.productId
              ? { ...item, qty: item.qty + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, qty: 1 }],
      };
    }

    case 'UPDATE_CART_QTY': {
      const { productId, delta } = action.payload;
      const item = state.cart.find(c => c.productId === productId);
      if (!item) return state;
      const newQty = item.qty + delta;
      if (newQty <= 0) {
        return { ...state, cart: state.cart.filter(c => c.productId !== productId) };
      }
      return {
        ...state,
        cart: state.cart.map(c =>
          c.productId === productId ? { ...c, qty: newQty } : c
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'SHOW_TOAST':
      return { ...state, toast: { visible: true, message: action.payload } };

    case 'HIDE_TOAST':
      return { ...state, toast: { visible: false, message: '' } };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  showToast: (message: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const showToast = useCallback((message: string) => {
    dispatch({ type: 'SHOW_TOAST', payload: message });
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 2200);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, showToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
