import {
    encrypt,
    decrypt,
    encryptPassword,
    decryptPassword,
  } from '../encryption';
  import { deriveMasterKeyFromCredentials } from '../keyDerivation';
  
  // Test encryption/decryption
  console.log('=== Testing Encryption ===');
  
  const email = 'test@example.com';
  const password = 'Test@1234';
  const masterKey = deriveMasterKeyFromCredentials(email, password);
  
  console.log('Master Key (first 16 chars):', masterKey.substring(0, 16) + '...');
  
  // Test 1: Encrypt and decrypt a password
  const testPassword = 'MySecurePassword123!';
  const encrypted = encryptPassword(testPassword, masterKey);
  console.log('\n1. Original Password:', testPassword);
  console.log('   Encrypted:', encrypted.substring(0, 50) + '...');
  
  const decrypted = decryptPassword(encrypted, masterKey);
  console.log('   Decrypted:', decrypted);
  console.log('   Match:', testPassword === decrypted ? '✅ PASS' : '❌ FAIL');
  
  // Test 2: Different keys should fail
  const wrongKey = deriveMasterKeyFromCredentials('wrong@email.com', 'WrongPass123!');
  try {
    decryptPassword(encrypted, wrongKey);
    console.log('\n2. Wrong Key Test: ❌ FAIL (should have thrown error)');
  } catch (error) {
    console.log('\n2. Wrong Key Test: ✅ PASS (correctly rejected wrong key)');
  }
  
  // Test 3: Empty string
  const emptyEncrypted = encrypt('', masterKey);
  const emptyDecrypted = decrypt(emptyEncrypted, masterKey);
  console.log('\n3. Empty String Test:', emptyDecrypted === '' ? '✅ PASS' : '❌ FAIL');
  
  console.log('\n=== All Tests Complete ===');