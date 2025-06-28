// Lokasi: app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Toaster } from '@/components/ui/toaster';
import dynamic from 'next/dynamic'; // <-- 1. Import dynamic

const inter = Inter({ subsets: ['latin'] });

// --- 2. Lazy load komponen yang tidak kritikal ---
const ChatbotWidget = dynamic(() =>
  import('@/components/ChatbotWidget').then((mod) => mod.ChatbotWidget),
  { ssr: false } // Nonaktifkan Server-Side Rendering untuk komponen ini
);

const WelcomePopup = dynamic(() =>
  import('@/components/WelcomePopup').then((mod) => mod.WelcomePopup),
  { ssr: false } // Nonaktifkan Server-Side Rendering untuk komponen ini
);

export const metadata: Metadata = {
  title: 'Kitversity - Solusi Lengkap Mahasiswa Baru',
  description: 'Toko online terpercaya untuk kebutuhan mahasiswa baru di Surabaya. Alat tulis, tas, pakaian, elektronik, dan masih banyak lagi.',
  keywords: 'mahasiswa, alat tulis, tas kuliah, surabaya, kitversity',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <WishlistProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <WhatsAppButton />
              <ChatbotWidget /> {/* <-- 3. Penggunaannya tetap sama */}
              <WelcomePopup />  {/* <-- 4. Tambahkan ini */}
              <Toaster />
            </div>
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}