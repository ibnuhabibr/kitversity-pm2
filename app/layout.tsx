// Lokasi: app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// ... import lainnya ...

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kitversity - Solusi Lengkap Mahasiswa Baru',
  description: 'Toko online terpercaya untuk kebutuhan mahasiswa baru di Surabaya. Alat tulis, tas, pakaian, elektronik, dan masih banyak lagi.',
  keywords: 'mahasiswa, alat tulis, tas kuliah, surabaya, kitversity',
  // --- GANTI BAGIAN ICONS DENGAN INI ---
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest', // <-- Tambahin baris ini
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  // ... sisa kode layout (body, provider, dll) tetap sama
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* ... sisa kode tidak berubah ... */}
      </body>
    </html>
  );
}