'use client';

import { useRequireAuth } from '@/contexts/AuthContext';
import { useCrypto } from '@/contexts/CryptoContext';
import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useRequireAuth();
  const { isUnlocked } = useCrypto();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Vault Status Indicator */}
      <div className="bg-white border-b border-gray-200 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm">
            {isUnlocked ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-gray-700">Vault Unlocked</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-gray-700">Vault Locked</span>
              </>
            )}
          </div>
        </div>
      </div>

      <main>{children}</main>
    </div>
  );
}