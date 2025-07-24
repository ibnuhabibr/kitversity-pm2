// Lokasi: components/WelcomePopup.tsx

'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Key baru agar popup muncul lagi untuk semua pengunjung setelah update
    const hasSeenPopup = sessionStorage.getItem('kitversity-welcome-popup-v4');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('kitversity-welcome-popup-v4', 'true');
      }, 500); // Popup muncul setelah 0.5 detik
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNavigateToProducts = () => {
    router.push('/produk');
    setIsOpen(false);
  };

  // Komponen Dialog sudah otomatis menyediakan tombol close (X)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className={cn(
          "sm:max-w-md p-0 overflow-hidden rounded-xl shadow-2xl border-none",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        )}
      >
        <div className="p-8 text-center bg-white">
          <DialogHeader className="items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full mb-4 shadow-lg w-fit">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-xl font-extrabold text-gray-900 tracking-tight">
              Selamat Datang di Wajah Baru Kitversity!
            </DialogTitle>
             <DialogDescription className="text-muted-foreground pt-2">
              Produk-produk terbaru untuk kebutuhan perkuliahanmu sudah tersedia. Jelajahi sekarang!
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6">
            <Button
              onClick={handleNavigateToProducts}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 font-bold"
            >
              Lihat Semua Produk
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Tombol 'X' untuk close sudah otomatis ada dari DialogContent */}
      </DialogContent>
    </Dialog>
  );
};