'use client';

import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const handleWhatsAppClick = () => {
    const message = 'Halo! Saya ingin bertanya tentang produk Kitversity.';
    const whatsappUrl = `https://wa.me/6285135706028?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hubungi Kami
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Punya pertanyaan atau butuh bantuan? Tim customer service kami siap membantu Anda 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Informasi Kontak
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Alamat</h3>
                    <p className="text-gray-600">
                      Jl. Mojo II No.8, Mojo<br />
                      Kec. Gubeng, Surabaya<br />
                      Jawa Timur 60285
                    </p>
                  </div>
                </div>

                {/* Bagian Tombol WhatsApp Dihapus */}
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                    <p className="text-gray-600">+62 851-3570-6028</p>
                  </div>
                </div>

                {/* Bagian Tombol Email Dihapus dan Email dijadikan link */}
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a href="mailto:admin@kitversity.com" className="text-gray-600 hover:text-blue-600 transition-colors">
                      admin@kitversity.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Jam Operasional</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Setiap hari 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Methods */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Kontak Cepat
              </h3>
              <div className="space-y-3">
                <Button 
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-600 hover:bg-green-700 justify-start"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5 mr-3" />
                  Chat via WhatsApp
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  className="w-full justify-start"
                  size="lg"
                >
                  <a href="mailto:admin@kitversity.com?subject=Pertanyaan%20Kitversity&body=Halo%20Kitversity%2C%0A%0ASaya%20ingin%20bertanya%20tentang%20produk%20atau%20layanan%20Anda.%0A%0ATerima%20kasih.">
                    <Mail className="h-5 w-5 mr-3" />
                    Kirim Email
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-12">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Lokasi Kami
              </h2>
              <p className="text-gray-600 mt-2">
                Kunjungi toko offline kami di Surabaya. Anda dapat zoom in dan zoom out pada peta untuk melihat lokasi dengan lebih detail.
              </p>
            </div>
            <div className="relative h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.746974958808!2d112.7640169!3d-7.269608199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fb823160c90b%3A0x391bf7d781257977!2sMasjid%20Subulussalam!5e0!3m2!1sid!2sid!4v1749993017553!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Kitversity - Zoom in/out tersedia"
              />
            </div>
            <div className="p-4 bg-gray-50 border-t">
              <p className="text-sm text-gray-600">
                💡 Tips: Gunakan kontrol zoom (+/-) pada peta untuk melihat lokasi dengan lebih detail
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
