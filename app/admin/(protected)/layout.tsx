// Lokasi: app/admin/(protected)/layout.tsx
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminAuth from '@/components/admin/AdminAuth';
import { Toaster } from "@/components/ui/toaster";

export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Pastikan tidak ada tag <html> atau <body> di sini
    <AdminAuth>
      <div className="flex h-screen bg-gray-100 font-sans">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </AdminAuth>
  );
}