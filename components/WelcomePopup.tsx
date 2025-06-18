// Nama File: components/WelcomePopup.tsx

'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, Bot, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

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

  const handleChatbotClick = () => {
    router.push('/chat');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md text-center p-8">
        <DialogHeader className="items-center">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">Butuh Bantuan?</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground pt-2">
            Punya pertanyaan seputar produk atau pesanan? Kami menyediakan dua cara untuk membantu Anda:
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-3 mt-6">
          <Button
            size="lg"
            onClick={handleWhatsAppClick}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Chat via WhatsApp</span>
          </Button>
          <Button
            size="lg"
            onClick={handleChatbotClick}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2"
          >
            <Bot className="h-5 w-5" />
            <span>Chat dengan AI Kitversity</span>
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="mt-2"
          >
            Nanti Saja
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};