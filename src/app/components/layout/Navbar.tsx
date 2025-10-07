'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { APP_ROUTES } from '@/config/constants';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Vault', path: APP_ROUTES.vault, icon: '🔐' },
    { name: 'Generator', path: APP_ROUTES.generator, icon: '⚡' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={APP_ROUTES.vault} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">🔐</span>
            </div>
            <span className="font-bold text-xl text-gray-900">SecureVault</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-gray-600">
              {user?.email}
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 py-2 flex gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-center transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="block">{item.icon}</span>
                <span className="text-xs">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}