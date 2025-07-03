import { Bell, UserCircle } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="flex justify-between items-center p-4 bg-white border-b">
      <h1 className="text-xl font-semibold text-gray-800">Selamat Datang, Admin!</h1>
      <div className="flex items-center space-x-4">
        <Bell className="h-6 w-6 text-gray-500" />
        <UserCircle className="h-8 w-8 text-gray-600" />
      </div>
    </header>
  );
}