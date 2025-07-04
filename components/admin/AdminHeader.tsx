'use client';

import { Bell, UserCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
    onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="flex justify-between items-center p-4 bg-white border-b shadow-sm">
      <div className="flex items-center">
        {/* Tombol menu ini hanya muncul di mobile/tablet */}
        <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={onMenuClick}>
            <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">Selamat Datang, Admin!</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="h-6 w-6 text-gray-500" />
        <UserCircle className="h-8 w-8 text-gray-600" />
      </div>
    </header>
  );
}