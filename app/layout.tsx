import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Toaster } from '@/components/ui/toaster';
import { ChatbotWidget } from '@/components/ChatbotWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kitversity - Solusi Lengkap Mahasiswa Baru',
  description: 'Toko online terpercaya untuk kebutuhan mahasiswa baru di Surabaya. Alat tulis, tas, pakaian, elektronik, dan masih banyak lagi.',
  keywords: 'mahasiswa, alat tulis, tas kuliah, surabaya, kitversity',
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
              <ChatbotWidget />
              <Toaster />
            </div>
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}