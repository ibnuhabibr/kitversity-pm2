'use client';

import { Bell, UserCircle, Menu, PanelLeftClose, PanelRightClose } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
    onMenuClick: () => void;
    isSidebarOpen: boolean;
}

export default function AdminHeader({ onMenuClick, isSidebarOpen }: AdminHeaderProps) {
  return (
    <header className="flex-shrink-0 flex justify-between items-center p-4 bg-white border-b shadow-sm">
      <div className="flex items-center">
        {/* Tombol menu untuk semua ukuran layar */}
        <Button variant="ghost" size="icon" className="mr-2" onClick={onMenuClick}>
            {isSidebarOpen ? <PanelLeftClose className="h-6 w-6" /> : <PanelRightClose className="h-6 w-6" />}
        </Button>
        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">Dasbor Admin</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="h-6 w-6 text-gray-500" />
        <UserCircle className="h-8 w-8 text-gray-600" />
      </div>
    </header>
  );
}