'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
// Perhatikan: import AdminAuth sudah dihapus dari sini

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    // Pembungkus <AdminAuth> juga sudah dihapus
    <div className="flex h-screen bg-gray-100 font-sans">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
      )}>
        <AdminHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}