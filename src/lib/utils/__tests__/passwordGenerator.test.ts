import { generatePassword, calculateStrength, getDefaultOptions } from '../passwordGenerator';

// Test 1: Generate with default options
console.log('Test 1: Default options');
const result1 = generatePassword(getDefaultOptions());
console.log('Password:', result1.password);
console.log('Length:', result1.password.length);
console.log('Strength:', result1.strength.label);
console.log('Entropy:', result1.entropy.toFixed(2), 'bits');
console.log('---');

// Test 2: Only numbers
console.log('Test 2: Only numbers');
const result2 = generatePassword({
  length: 12,
  includeUppercase: false,
  includeLowercase: false,
  includeNumbers: true,
  includeSymbols: false,
  excludeSimilar: false,
  excludeAmbiguous: false,
});
console.log('Password:', result2.password);
console.log('Has only numbers:', /^[0-9]+$/.test(result2.password));
console.log('---');

// Test 3: Exclude similar characters
console.log('Test 3: Exclude similar');
const result3 = generatePassword({
  length: 20,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: false,
  excludeSimilar: true,
  excludeAmbiguous: false,
});
console.log('Password:', result3.password);
console.log('Contains similar chars:', /[il1Lo0O]/.test(result3.password) ? 'YES (FAIL)' : 'NO (PASS)');