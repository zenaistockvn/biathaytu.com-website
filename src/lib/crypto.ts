/**
 * Token Encryption Utility — AES-256-GCM
 *
 * Encrypts/decrypts OAuth access tokens before storing in the database.
 * Uses AES-256-GCM for authenticated encryption (confidentiality + integrity).
 *
 * Environment: TOKEN_ENCRYPTION_KEY (64 hex chars = 32 bytes)
 * Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;       // 96-bit IV recommended for GCM
const AUTH_TAG_LENGTH = 16;  // 128-bit auth tag
const ENCODING = 'hex';

function getEncryptionKey(): Buffer {
  const keyHex = process.env.TOKEN_ENCRYPTION_KEY;
  if (!keyHex || keyHex.length !== 64) {
    throw new Error(
      'TOKEN_ENCRYPTION_KEY must be 64 hex characters (32 bytes). ' +
      'Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
    );
  }
  return Buffer.from(keyHex, 'hex');
}

/**
 * Encrypt a plaintext token.
 * Output format: iv:authTag:ciphertext (all hex-encoded)
 */
export function encryptToken(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });

  let encrypted = cipher.update(plaintext, 'utf8', ENCODING);
  encrypted += cipher.final(ENCODING);
  const authTag = cipher.getAuthTag().toString(ENCODING);

  return `${iv.toString(ENCODING)}:${authTag}:${encrypted}`;
}

/**
 * Decrypt an encrypted token string.
 * Expects format: iv:authTag:ciphertext (all hex-encoded)
 *
 * If the input does NOT look like an encrypted token (no colons),
 * it returns the input unchanged — backward-compatible with
 * pre-encryption plain-text tokens already in the DB.
 */
export function decryptToken(encryptedStr: string): string {
  // Backward compatibility: if not in encrypted format, return as-is
  if (!encryptedStr.includes(':')) {
    return encryptedStr;
  }

  const parts = encryptedStr.split(':');
  if (parts.length !== 3) {
    // Not our format, return as-is (could be a legacy token with colons)
    return encryptedStr;
  }

  try {
    const key = getEncryptionKey();
    const [ivHex, authTagHex, ciphertext] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, ENCODING, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    // If decryption fails, the value is probably a plain-text legacy token
    return encryptedStr;
  }
}
