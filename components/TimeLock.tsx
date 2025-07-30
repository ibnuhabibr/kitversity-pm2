'use client';

import { useState, useEffect } from 'react';
import { PartyPopper } from 'lucide-react';
import Image from 'next/image';

export default function TimeLock() {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      // Atur waktu tutup pre-order (Tahun, Bulan (0-11), Tanggal, Jam, Menit, Detik)
      const lockTime = new Date(2025, 6, 30, 15, 0, 0); 
      
      if (now >= lockTime) {
        setIsLocked(true);
      }
    };
    
    // Cek waktu saat komponen dimuat
    checkTime();

    // Cek waktu setiap detik (opsional, tapi bagus untuk real-time)
    const interval = setInterval(checkTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isLocked) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-[9999] flex items-center justify-center p-6 text-center text-white animate-in fade-in-50 duration-500">
      <div className="max-w-md">
        <div className="flex justify-center mb-6">
        </div>
        <div className="bg-yellow-400 text-yellow-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg transform rotate-[-15deg]">
          <PartyPopper className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold mb-4">
          Pre-Order Kitversity Telah Ditutup!
        </h1>
        <p className="text-lg text-gray-300 mb-2">
          Terima kasih banyak atas antusiasme dan partisipasi teman-teman semua.
        </p>
        <p className="text-gray-400">
          Sampai jumpa di kesempatan berikutnya! Untuk informasi lebih lanjut mengenai pesanan, silakan cek grup WhatsApp yang telah disediakan.
        </p>
      </div>
    </div>
  );
}