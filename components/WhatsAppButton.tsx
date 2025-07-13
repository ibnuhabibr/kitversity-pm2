// Lokasi: components/WhatsAppButton.tsx

'use client';

import Image from 'next/image'; // 1. Import komponen Image dari Next.js
import { Button } from '@/components/ui/button';

// 2. Definisi komponen WhatsAppIcon (SVG) kita hapus semua

const WhatsAppButton = () => {
  const phoneNumber = '6285135706028';
  const message = 'Halo! Saya tertarik dengan produk di Kitversity. Bisa bantu saya?';
  
  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center" // Tambahan class flex
      size="icon"
      aria-label="Chat di WhatsApp"
    >
      {/* 3. Ganti SVG dengan komponen Image */}
      <Image
        src="/logo-whatsapp.svg" // Path ke file di folder public
        alt="Logo WhatsApp"
        width={28} // Atur ukuran ikonnya
        height={28}
      />
    </Button>
  );
};

export default WhatsAppButton;