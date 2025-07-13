'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Komponen ini tidak melakukan redirect, hanya menampilkan loading
// atau konten. Middleware yang menangani redirect.
export default function MiddlewareAuth({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Kita beri sedikit jeda untuk memastikan middleware sudah bekerja
    // dan halaman tidak 'flashing' antara loading dan konten.
    const timer = setTimeout(() => setIsVerifying(false), 250); // 250ms delay
    return () => clearTimeout(timer);
  }, [pathname]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-gray-800" />
      </div>
    );
  }

  return <>{children}</>;
}