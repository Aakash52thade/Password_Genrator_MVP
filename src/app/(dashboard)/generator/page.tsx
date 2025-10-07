'use client';

export default function GeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Password Generator
          </h1>
          <p className="text-gray-600">
            Generate strong, secure passwords with customizable options
          </p>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Generator Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            We're building an awesome password generator with advanced options!
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-800">
              Features in development:<br />
              • Customizable length<br />
              • Character type selection<br />
              • Strength meter<br />
              • Copy to clipboard<br />
              • Save to vault
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}