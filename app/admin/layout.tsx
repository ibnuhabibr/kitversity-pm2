// Lokasi: app/admin/layout.tsx

// Layout ini hanya bertugas untuk menampilkan konten di dalamnya
// tanpa menambahkan sidebar atau proteksi.
export default function AdminRootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <>{children}</>;
  }