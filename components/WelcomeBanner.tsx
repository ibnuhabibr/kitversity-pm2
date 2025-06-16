'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WelcomeBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the banner before
    const hasSeenBanner = localStorage.getItem('kitversity-welcome-banner');
    
    if (!hasSeenBanner) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('kitversity-welcome-banner', 'true');
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '6285135706028';
    const message = 'Halo! Saya ingin bertanya tentang produk Kitversity.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-blue-50 border-b border-blue-200 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-800 font-medium">
            Punya pertanyaan? Hubungi kami langsung di WhatsApp untuk respon cepat! 
            Tinggal klik tombol chat di sisi kanan laman ini.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={handleWhatsAppClick}
            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3"
          >
            Chat Sekarang
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClose}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;