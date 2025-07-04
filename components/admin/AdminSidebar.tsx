'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Package, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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

  return (
    <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-gray-800 text-white flex flex-col z-40 transition-transform duration-300 ease-in-out",
        // Logika buka-tutup sekarang berlaku untuk semua ukuran layar
        isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="h-20 flex items-center justify-center px-6 bg-gray-900">
        <Link href="/admin">
           <Image
                src="/kitversity-simply-logo.png"
                alt="Kitversity Admin"
                width={140}
                height={40}
                className="object-contain"
              />
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith(item.href) && item.href !== '/admin' || pathname === item.href
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
  );
}