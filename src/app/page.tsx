
export default function Home() {
  return (
  <main className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full animate-fade-in">
        <h1 className="text-3xl font-bold text-primary-600 mb-4">
          🔐 SecureVault
        </h1>
        <p className="text-gray-600">
          Your privacy-first password manager
        </p>
        <div className="mt-6 space-y-2">
          <div className="h-4 bg-primary-200 rounded animate-pulse"></div>
          <div className="h-4 bg-primary-100 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    </main>  );
}
