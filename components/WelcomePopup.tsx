// Lokasi: components/WelcomePopup.tsx

'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PartyPopper, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Key baru agar popup muncul lagi untuk semua pengunjung setelah update
    const hasSeenPopup = sessionStorage.getItem('kitversity-welcome-popup-amerta2025');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('kitversity-welcome-popup-amerta2025', 'true');
      }, 1000); // Popup muncul setelah 1 detik
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNavigateToProducts = () => {
    router.push('/produk');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className={cn(
          "sm:max-w-lg p-0 overflow-hidden rounded-2xl shadow-2xl border-none",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        )}
      >
        {/* Konten dijamin center dengan flexbox */}
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white">
          <DialogHeader className="items-center">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full mb-5 shadow-lg w-fit transform hover:scale-110 transition-transform duration-300">
              <PartyPopper className="h-10 w-10 text-white" />
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Koleksi Spesial Amerta 2025 Telah Tiba!
            </DialogTitle>
             <DialogDescription className="text-muted-foreground pt-3 text-base">
              Semua kebutuhan PKKMB Universitas Airlangga-mu ada di sini. Siap jadi Ksatria Airlangga?
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-8 w-full">
            <Button
              onClick={handleNavigateToProducts}
              size="lg"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-950 font-bold text-base py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Jelajahi Koleksi Amerta
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Tombol Close manual sudah DIHAPUS. 
          Kita akan pakai tombol close 'X' bawaan dari DialogContent yang posisinya sudah pas.
        */}
      </DialogContent>
    </Dialog>
  );
};