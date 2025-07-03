'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck } from 'lucide-react';

// Ganti "kitversityadmin" dengan kata sandi yang lebih aman
const ADMIN_PASSWORD = "@Kikqthksbu#19"; 

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      // Simpan status login ke sessionStorage
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      toast({ title: "Login Berhasil", description: "Selamat datang, Admin!" });
      router.push('/admin');
    } else {
      setError('Kata sandi salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mx-auto bg-gray-800 text-white rounded-full h-12 w-12 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6" />
            </div>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Masukkan kata sandi untuk mengakses dasbor</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full">
              Masuk
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}