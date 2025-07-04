'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminAuth from '@/components/admin/AdminAuth';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <AdminAuth>
      <div className="flex h-screen bg-gray-100 font-sans">
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className={cn(
            "flex-1 flex flex-col overflow-hidden transition-all duration-300",
            // Ketika sidebar terbuka di desktop, beri margin kiri
            isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
        )}>
          <AdminHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </AdminAuth>
  );
}