'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { APP_ROUTES } from '@/config/constants';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(APP_ROUTES.vault);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-8 shadow-xl">
            <span className="text-4xl">🔐</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Passwords,
            <br />
            <span className="text-blue-600">100% Secure</span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Privacy-first password manager with end-to-end encryption.
            Generate strong passwords and store them securely.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href={APP_ROUTES.register}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              href={APP_ROUTES.login}
              className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-4 rounded-xl transition duration-200 shadow-lg hover:shadow-xl border border-gray-200"
            >
              Sign In
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Zero-Knowledge
              </h3>
              <p className="text-gray-600">
                We never see your passwords. Everything is encrypted on your device.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Strong Generator
              </h3>
              <p className="text-gray-600">
                Create ultra-secure passwords with customizable options.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Fast & Simple
              </h3>
              <p className="text -gray-600">
                Clean interface. No complexity. Just secure password management.
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-16 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-gray-700">
              🔐 <strong>End-to-end encrypted</strong> • 
              🌐 <strong>Open source ready</strong> • 
              🚫 <strong>No tracking</strong>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}