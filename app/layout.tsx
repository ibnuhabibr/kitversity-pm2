'use client'; 

import './globals.css';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // <-- Import usePathname
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Toaster } from '@/components/ui/toaster';
import { ChatbotWidget } from '@/components/ChatbotWidget';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // <-- Dapatkan path URL saat ini
  const isAdminPage = pathname.startsWith('/admin'); // <-- Cek apakah ini halaman admin

  // Jika ini adalah halaman admin, tampilkan layout kosong
  if (isAdminPage) {
    return (
      <html lang="id">
        <body className="font-sans">{children}</body>
      </html>
    );
  }

  // Jika bukan halaman admin, tampilkan layout toko seperti biasa
  return (
    <html lang="id">
      <body className="font-sans">
        <WishlistProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              {/* Header dan komponen lain hanya dirender di halaman toko */}
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <WhatsAppButton />
              <ChatbotWidget />
              <Toaster />
            </div>
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}