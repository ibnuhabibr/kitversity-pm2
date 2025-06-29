'use client'; // <-- Tambahkan ini di baris paling atas

import './globals.css';
import React, { useState, useEffect } from 'react'; // <-- Tambahkan import
import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { Megaphone, X } from 'lucide-react';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Toaster } from '@/components/ui/toaster';
import { ChatbotWidget } from '@/components/ChatbotWidget';

const inter = Inter({ subsets: ['latin'] });

// --- Komponen Baru untuk Announcement Bar ---
function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Cek sessionStorage, jika bar sudah pernah ditutup, jangan tampilkan lagi
    const isDismissed = sessionStorage.getItem('announcementDismissed');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('announcementDismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gradient-to-r from-gray-800 via-gray-900 to-black px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
       <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-30"
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-6 text-white">
          <strong className="font-semibold">
            <Megaphone className="inline-block h-5 w-5 mr-2" />
            Open Pre-Order
          </strong>
          <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
            <circle cx={1} cy={1} r={1} />
          </svg>
          Sesi pemesanan perlengkapan ospek dibuka 1 - 12 Juli 2025.
        </p>
        <Link
          href="/produk"
          className="flex-none rounded-full bg-gray-50 px-3.5 py-1 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          Belanja sekarang <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      <div className="flex flex-1 justify-end">
        <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px] text-white hover:bg-white/10 rounded-full" onClick={handleDismiss}>
          <span className="sr-only">Tutup</span>
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
         {/* Metadata bisa dipindahkan ke sini jika diperlukan di client component */}
      </head>
      <body className={inter.className}>
        <WishlistProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <AnnouncementBar />
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