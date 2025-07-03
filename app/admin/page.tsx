'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/admin/StatCard';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };
  
  if(isLoading) {
      return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
          </div>
      )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Pendapatan" value={formatPrice(stats?.totalRevenue || 0)} icon={<DollarSign className="h-5 w-5 text-green-500" />} />
        <StatCard title="Total Pesanan" value={stats?.totalOrders.toString() || '0'} icon={<ShoppingCart className="h-5 w-5 text-blue-500" />} />
        <StatCard title="Total Produk" value={stats?.totalProducts.toString() || '0'} icon={<Package className="h-5 w-5 text-orange-500" />} />
        <StatCard title="Total Pelanggan" value={stats?.totalUsers.toString() || '0'} icon={<Users className="h-5 w-5 text-purple-500" />} />
      </div>
      
      <Card>
          <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>Belum ada aktivitas terbaru untuk ditampilkan.</CardDescription>
          </CardHeader>
          <CardContent>
             {/* Di sini nanti bisa ditambahkan komponen untuk menampilkan pesanan terbaru */}
          </CardContent>
      </Card>
    </div>
  );
}