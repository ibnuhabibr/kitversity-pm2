'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Package, LogOut, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useEffect } from 'react';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Pesanan' },
  { href: '/admin/products', icon: Package, label: 'Produk' },
];

interface AdminSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  // Tutup sidebar setiap kali pindah halaman di mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [pathname, setIsOpen]);

  return (
    <>
      {/* Overlay hitam transparan di mobile */}
      <div 
        onClick={() => setIsOpen(false)} 
        className={cn(
            "fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )} 
      />
      
      <aside className={cn(
          "fixed lg:sticky top-0 h-full w-64 bg-gray-800 text-white flex flex-col z-40 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-20 flex items-center justify-between px-6 bg-gray-900 flex-shrink-0">
          <Link href="/admin">
             <Image
                  src="/kitversity-simply-logo.png"
                  alt="Kitversity Admin"
                  width={140}
                  height={40}
                  className="object-contain"
                />
          </Link>
          {/* Tombol Close hanya ada di mobile view */}
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <X size={24} />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin')
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-700">
         <Link href="/" className="flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
            <LogOut className="h-5 w-5 mr-3" />
            Kembali ke Toko
          </Link>
      </div>
      </aside>
    </>
  );
}