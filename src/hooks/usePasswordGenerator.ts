'use client';

import { useState, useCallback } from 'react';
import {
  generatePassword,
  getDefaultOptions,
  validateOptions,
} from '@/lib/utils/passwordGenerator';
import { PasswordOptions, GeneratorResult } from '@/types/generator.types';

export function usePasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>(getDefaultOptions());
  const [result, setResult] = useState<GeneratorResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(() => {
    setIsGenerating(true);

    // Validate options
    const validation = validateOptions(options);
    if (!validation.isValid) {
      console.error('Invalid options:', validation.error);
      setIsGenerating(false);
      return null;
    }

    // Generate password
    const generatedResult = generatePassword(options);
    setResult(generatedResult);
    setIsGenerating(false);

    return generatedResult;
  }, [options]);

  const updateOptions = useCallback((newOptions: Partial<PasswordOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  const resetOptions = useCallback(() => {
    setOptions(getDefaultOptions());
    setResult(null);
  }, []);

  return {
    options,
    result,
    isGenerating,
    generate,
    updateOptions,
    resetOptions,
  };
}