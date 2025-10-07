'use client';

import { useCrypto } from '@/contexts/CryptoContext';
import { useAuth } from '@/contexts/AuthContext';

export default function VaultPage() {
  const { isUnlocked } = useCrypto();
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Password Vault
          </h1>
          <p className="text-gray-600">
            Your secure passwords are protected with end-to-end encryption
          </p>
        </div>

        {/* Vault Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          {isUnlocked ? (
            <>
              <div className="text-6xl mb-4">🔓</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Vault Unlocked
              </h2>
              <p className="text-gray-600 mb-6">
                Welcome back, {user?.email}! Your vault is ready to use.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  ✓ All your passwords are encrypted with your master key
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Vault Locked
              </h2>
              <p className="text-gray-600 mb-6">
                Your vault is locked. Please refresh the page or log in again.
              </p>
            </>
          )}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-center text-blue-800">
            🚧 <strong>Vault functionality coming soon!</strong> You'll be able to save, view, and manage your passwords here.
          </p>
        </div>
      </div>
    </div>
  );
}