// Lokasi: components/WelcomePopup.tsx

'use client';

import { useState, useEffect } from 'react';
// --- PERUBAHAN DI SINI: Menambahkan DialogHeader ---
import { Dialog, DialogOverlay, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, Bot, PartyPopper, Calendar, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('kitversity-welcome-popup-v2');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('kitversity-welcome-popup-v2', 'true');
      }, 700);
      
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
      <DialogOverlay className="bg-black/30 backdrop-blur-sm" />
      <DialogContent 
        className={cn(
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", 
          "sm:max-w-sm p-0 overflow-hidden rounded-xl shadow-2xl border-none" 
        )}
      >
        <div className="p-6 text-center bg-white">
          <DialogHeader className="items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full mb-4 shadow-lg w-fit">
              <PartyPopper className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-xl font-extrabold text-gray-900 tracking-tight">
              Selamat Datang di Kitversity!
            </DialogTitle>
          </DialogHeader>
          
          <div className="my-5 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-bold text-md text-blue-800">
                  OPEN PRE-ORDER
              </p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500"/>
                  <p className="font-semibold text-sm text-gray-700">
                      1 Juli - 12 Juli 2025
                  </p>
              </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Butuh bantuan atau ada pertanyaan? Hubungi kami melalui:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Admin WA</span>
            </Button>
            <Button
              onClick={handleChatbotClick}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2"
            >
              <Bot className="h-5 w-5" />
              <span>Chatbot AI</span>
            </Button>
          </div>
        </div>

        <DialogClose asChild>
          <button 
            className="absolute right-3 top-3 bg-gray-100/50 hover:bg-gray-200/80 p-1.5 rounded-full transition-colors"
            aria-label="Tutup"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};