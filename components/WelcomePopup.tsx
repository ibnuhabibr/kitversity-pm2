// Nama File: components/WelcomePopup.tsx

'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('kitversity-welcome-popup');
    if (!hasSeenPopup) {
      // Kasih jeda dikit biar nggak langsung muncul
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('kitversity-welcome-popup', 'true');
      }, 1500); // Muncul setelah 1.5 detik
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleWhatsAppClick = () => {
    const phoneNumber = '6285135706028';
    const message = 'Halo! Saya ingin bertanya tentang produk Kitversity.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md text-center p-8">
        <DialogHeader className="items-center">
          <div className="bg-green-100 p-3 rounded-full mb-4">
            <MessageCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold">Butuh Bantuan?</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground pt-2">
            Punya pertanyaan seputar produk atau pesanan? Tim kami siap membantu via WhatsApp untuk respon super cepat!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-2 mt-4">
           <Button
            size="lg"
            onClick={handleWhatsAppClick}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Chat Sekarang di WhatsApp
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Nanti Saja
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};