// src/app/(dashboard)/generator/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePasswordGenerator } from '@/hooks/usePasswordGenerator';
import { copyToClipboard } from '@/lib/utils/clipboard';
import toast from 'react-hot-toast';

export default function GeneratorPage() {
  const { options, result, generate, updateOptions } = usePasswordGenerator();
  const [copied, setCopied] = useState(false);

  // Generate initial password
  useEffect(() => {
    generate();
  }, []);

  const handleGenerate = () => {
    generate();
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;

    const copyResult = await copyToClipboard(result.password);
    if (copyResult.success) {
      setCopied(true);
      toast.success('Password copied! Will clear in 15s');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy password');
    }
  };

  const getStrengthColor = () => {
    if (!result) return 'bg-gray-300';
    
    switch (result.strength.label) {
      case 'Very Weak':
        return 'bg-red-500';
      case 'Weak':
        return 'bg-orange-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Strong':
        return 'bg-green-500';
      case 'Very Strong':
        return 'bg-emerald-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthWidth = () => {
    if (!result) return '0%';
    return `${(result.strength.score / 4) * 100}%`;
  };

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

        {/* Generated Password Display */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Generated Password
          </label>
          
          <div className="relative mb-4">
            <input
              type="text"
              value={result?.password || ''}
              readOnly
              className="w-full px-4 py-4 pr-24 bg-gray-50 border-2 border-gray-300 rounded-lg text-lg font-mono text-gray-900 focus:outline-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <button
                onClick={handleCopy}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Copy to clipboard"
              >
                {copied ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleGenerate}
                className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                title="Generate new password"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Strength Indicator */}
          {result && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Password Strength
                </span>
                <span className={`text-sm font-semibold`} style={{ color: result.strength.color }}>
                  {result.strength.label}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStrengthColor()} transition-all duration-500`}
                  style={{ width: getStrengthWidth() }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Entropy: {result.entropy.toFixed(1)} bits
              </div>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Customize Options
          </h2>

          {/* Length Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Password Length
              </label>
              <span className="text-sm font-semibold text-blue-600">
                {options.length} characters
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={options.length}
              onChange={(e) => updateOptions({ length: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>8</span>
              <span>64</span>
            </div>
          </div>

          {/* Character Types */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">
              Include Characters
            </h3>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) => updateOptions({ includeUppercase: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Uppercase Letters <span className="text-gray-500">(A-Z)</span>
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeLowercase}
                onChange={(e) => updateOptions({ includeLowercase: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Lowercase Letters <span className="text-gray-500">(a-z)</span>
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => updateOptions({ includeNumbers: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Numbers <span className="text-gray-500">(0-9)</span>
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => updateOptions({ includeSymbols: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Symbols <span className="text-gray-500">(!@#$%^&*)</span>
              </span>
            </label>
          </div>

          {/* Exclusion Options */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">
              Exclusions
            </h3>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.excludeSimilar}
                onChange={(e) => updateOptions({ excludeSimilar: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Exclude similar characters <span className="text-gray-500">(i, l, 1, L, o, 0, O)</span>
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.excludeAmbiguous}
                onChange={(e) => updateOptions({ excludeAmbiguous: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Exclude ambiguous symbols <span className="text-gray-500">({`{ } [ ] ( ) / \\ ' " ~`})</span>
              </span>
            </label>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Generate New Password
          </button>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">
            🔒 Password Security Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Use at least 12 characters for better security</li>
            <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
            <li>• Never reuse passwords across different accounts</li>
            <li>• Store passwords in your encrypted vault</li>
            <li>• Change passwords regularly, especially for sensitive accounts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}