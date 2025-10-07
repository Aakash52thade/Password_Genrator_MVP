export interface PasswordOptions {
    length: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
    excludeSimilar: boolean; // Exclude look-alikes (0/O, 1/l/I, etc.)
    excludeAmbiguous: boolean; // Exclude {}[]()/\'"~,;:.<>
  }
  
  export interface PasswordStrength {
    score: number; // 0-4 (0=weak, 4=very strong)
    label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
    feedback: string[];
    color: string;
  }
  
  export interface GeneratorResult {
    password: string;
    strength: PasswordStrength;
    entropy: number; // Bits of entropy
  }