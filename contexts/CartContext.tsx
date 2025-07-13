'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Mendefinisikan tipe data untuk Produk
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string[];
  rating: number;
  sold: number;
  description: string;
  specifications: string;
  variants?: { name: string; options: string[] }[];
}

// Mendefinisikan tipe data untuk item di dalam keranjang
export interface CartItem extends Product {
  cartItemId: string; // ID unik untuk item di dalam keranjang
  quantity: number;
  selectedVariants?: { [key: string]: string };
}

// Mendefinisikan struktur state dari keranjang
interface CartState {
  items: CartItem[];
}

// Mendefinisikan action yang bisa dilakukan
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; selectedVariants?: { [key: string]: string } } }
  | { type: 'REMOVE_ITEM'; payload: { cartItemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

// Fungsi reducer untuk mengelola perubahan state
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'LOAD_CART':
      return { ...state, items: action.payload };

    // --- LOGIKA DIPERBAIKI DI SINI ---
    case 'ADD_ITEM': {
      const { product, quantity, selectedVariants } = action.payload;

      const findId = `${product.id}-${selectedVariants ? Object.entries(selectedVariants).sort().map(([key, value]) => `${key}-${value}`).join('_') : 'no-variant'}`;

      const existingItemIndex = state.items.findIndex(item => {
        const itemVariantId = item.selectedVariants ? Object.entries(item.selectedVariants).sort().map(([key, value]) => `${key}-${value}`).join('_') : 'no-variant';
        return `${item.id}-${itemVariantId}` === findId;
      });

      if (existingItemIndex > -1) {
        // Jika item sudah ada, perbarui kuantitasnya
        const updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + quantity,
            };
          }
          return item;
        });
        return { ...state, items: updatedItems };
      } else {
        // Jika item baru, tambahkan ke keranjang
        const newItem: CartItem = {
          ...product,
          quantity,
          selectedVariants,
          cartItemId: `${findId}-${Date.now()}`,
        };
        return { ...state, items: [...state.items, newItem] };
      }
    }
    // --- AKHIR PERBAIKAN ---

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.cartItemId !== action.payload.cartItemId),
      };

    case 'UPDATE_QUANTITY': {
      const { cartItemId, quantity } = action.payload;
      return {
        ...state,
        items: state.items.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item
        ),
      };
    }
      
    case 'CLEAR_CART':
      localStorage.removeItem('kitversity-cart');
      return { ...state, items: [] };

    default:
      return state;
  }
};

// Membuat Context
const CartContext = createContext<{
  state: CartState;
  addItem: (product: Product, quantity?: number, selectedVariants?: { [key: string]: string }) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
} | null>(null);

// Komponen Provider
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('kitversity-cart');
        if (savedCart) {
          dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
        }
      }
    } catch (error) {
      console.error('Gagal memuat keranjang dari localStorage', error);
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('kitversity-cart', JSON.stringify(state.items));
      }
    } catch (error) {
      console.error('Gagal menyimpan keranjang ke localStorage', error);
    }
  }, [state.items]);

  const addItem = (product: Product, quantity = 1, selectedVariants = {}) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, selectedVariants } });
  };

  const removeItem = (cartItemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { cartItemId } });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity > 0) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
    } else {
      removeItem(cartItemId);
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateQuantity, clearCart, getTotalItems, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook kustom untuk menggunakan context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
};