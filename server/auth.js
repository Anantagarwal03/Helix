/* global Buffer */
import { promisify } from 'util';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'crypto';

const scrypt = promisify(scryptCallback);
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export function validateCredentials(email, password) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return 'Enter a valid email address.';
  if (typeof password !== 'string' || password.length < 12 || Buffer.byteLength(password, 'utf8') > 128) return 'Password must be at least 12 characters and no more than 128 bytes.';
  return null;
}

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const cost = 32768;
  const key = await scrypt(password, salt, 64, { N: cost, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `scrypt$${cost}$8$1$${salt.toString('hex')}$${key.toString('hex')}`;
}

export async function verifyPassword(password, encoded) {
  const [algorithm, costValue, blockValue, parallelValue, saltHex, keyHex] = String(encoded || '').split('$');
  if (algorithm !== 'scrypt' || !/^\d+$/.test(costValue) || !/^\d+$/.test(blockValue) || !/^\d+$/.test(parallelValue)
    || !/^[a-f0-9]{32}$/i.test(saltHex) || !/^[a-f0-9]{128}$/i.test(keyHex)) return false;
  const expected = Buffer.from(keyHex, 'hex');
  const actual = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length, {
    N: Number(costValue), r: Number(blockValue), p: Number(parallelValue), maxmem: 64 * 1024 * 1024,
  });
  return timingSafeEqual(actual, expected);
}

export function createSessionToken() {
  return randomBytes(32).toString('hex');
}

export function hashSessionToken(token) {
  return createHash('sha256').update(token).digest('hex');
}
