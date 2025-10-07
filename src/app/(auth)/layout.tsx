'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { APP_ROUTES } from '@/config/constants';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to vault if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(APP_ROUTES.vault);
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading or children
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {children}
    </div>
  );
}