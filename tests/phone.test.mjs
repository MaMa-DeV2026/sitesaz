import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeIranianPhone } from '../src/lib/phone.ts';

test('normalizeIranianPhone converts standard 09xx number', () => {
  assert.equal(normalizeIranianPhone('09123456789'), '09123456789');
});

test('normalizeIranianPhone converts +98 prefix to 0', () => {
  assert.equal(normalizeIranianPhone('+989123456789'), '09123456789');
});

test('normalizeIranianPhone converts 0098 prefix to 0', () => {
  assert.equal(normalizeIranianPhone('00989123456789'), '09123456789');
});

test('normalizeIranianPhone strips spaces, dashes and parentheses', () => {
  assert.equal(normalizeIranianPhone('0912-345-6789'), '09123456789');
  assert.equal(normalizeIranianPhone('0912 345 6789'), '09123456789');
  assert.equal(normalizeIranianPhone('(0912) 345 6789'), '09123456789');
  assert.equal(normalizeIranianPhone('+98 912-345-6789'), '09123456789');
});

test('normalizeIranianPhone translates Persian and Arabic numerals to English', () => {
  assert.equal(normalizeIranianPhone('۰۹۱۲۳۴۵۶۷۸۹'), '09123456789');
  assert.equal(normalizeIranianPhone('٠٩١٢٣٤٥٦٧٨٩'), '09123456789');
  assert.equal(normalizeIranianPhone('+۹۸ ۹۱۲ ۳۴۵ ۶۷۸۹'), '09123456789');
});
