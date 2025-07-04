'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import MiddlewareAuth from '@/components/admin/MiddlewareAuth'; // Ganti nama untuk kejelasan

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <html lang="id">
      <body className="font-sans">
        <MiddlewareAuth>
          <div className="flex h-screen bg-gray-100">
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className={cn(
                "flex-1 flex flex-col overflow-hidden transition-all duration-300",
                // Logika margin untuk desktop saat sidebar di-toggle
                isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
            )}>
              <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </MiddlewareAuth>
      </body>
    </html>
  );
}