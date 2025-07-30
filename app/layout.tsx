'use client'; 

import './globals.css';
import React from 'react';
import { usePathname } from 'next/navigation';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Toaster } from '@/components/ui/toaster';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import TimeLock from '@/components/TimeLock'; // <-- IMPORT KOMPONEN BARU

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    return (
      <html lang="id">
        <body className="font-sans">{children}</body>
      </html>
    );
  }

  return (
    <html lang="id">
      <body className="font-sans">
        {/* PENAMBAHAN KOMPONEN TIMELOCK DI SINI */}
        <TimeLock /> 
        <WishlistProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
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