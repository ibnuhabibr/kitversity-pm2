'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { Toaster } from "@/components/ui/toaster";
import MiddlewareAuth from '@/components/admin/MiddlewareAuth';

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Default sidebar tertutup di mobile, terbuka di desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <MiddlewareAuth>
      <div className="flex h-screen bg-gray-100 font-sans">
        {/* Sidebar sekarang menerima state dan fungsi untuk mengubahnya */}
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        {/* Konten Utama */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </MiddlewareAuth>
  );
}