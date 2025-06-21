import Image from 'next/image';
import Link from 'next/link';
import { Instagram, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
  <div className="flex items-center space-x-3 mb-4">
    {/* Logo baru di footer */}
    <Image
      src="/logo-kitversity.png"
      alt="Kitversity Logo"
      width={40}
      height={40}
    />
    <span className="text-xl font-bold">Kitversity</span>
  </div>
  <p className="text-gray-400 text-sm leading-relaxed">
    Solusi lengkap untuk mahasiswa baru di Surabaya. Kami menyediakan 
    semua kebutuhan kuliah dengan kualitas terbaik dan harga terjangkau.
  </p>
</div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Link Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/produk" className="text-gray-400 hover:text-white transition-colors">
                  Produk
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="text-gray-400 hover:text-white transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hubungi Kami</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📍 Jl. Mojo II No.8, Mojo, Kec. Gubeng, Surabaya</p>
              <p>📧 admin@kitversity.com</p>
              <p>📞 +62 851-3570-6028</p>
            </div>
            
            {/* Social Media */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Ikuti Kami:</p>
              <div className="flex space-x-3">
                <a 
                  href="https://www.instagram.com/kitversity/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://wa.me/6285135706028" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2025 Kitversity. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;