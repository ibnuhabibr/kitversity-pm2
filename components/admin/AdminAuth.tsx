'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    // Fungsi ini hanya akan berjalan di browser
    try {
      const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
      setStatus(isLoggedIn ? 'authenticated' : 'unauthenticated');
    } catch (error) {
      console.error("Tidak dapat mengakses sessionStorage:", error);
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    // Arahkan pengguna jika statusnya tidak terotentikasi dan pengecekan sudah selesai
    if (status === 'unauthenticated') {
      router.replace('/admin/login');
    }
  }, [status, router]);

  // Selama status masih loading, tampilkan spinner.
  // Ini akan dirender di server dan client pada render pertama, jadi 100% aman.
  if (status !== 'authenticated') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-gray-800" />
      </div>
    );
  }

  // Hanya jika status authenticated, tampilkan konten admin
  return <>{children}</>;
}