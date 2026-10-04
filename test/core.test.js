import { test } from 'node:test';
import assert from 'node:assert/strict';

import { soundex } from '../src/index.js';

test('classic NARA reference names', () => {
  assert.equal(soundex('Robert'), 'R163');
  assert.equal(soundex('Rupert'), 'R163');
  assert.equal(soundex('Ashcraft'), 'A261');
  assert.equal(soundex('Tymczak'), 'T522');
  assert.equal(soundex('Pfister'), 'P236');
  assert.equal(soundex('Honeyman'), 'H555');
});

test('names that collapse to the same code sound alike', () => {
  assert.equal(soundex('Jackson'), 'J250');
  assert.equal(soundex('Jaxen'), 'J250');
});

test('first letter is preserved even when it is a coded consonant', () => {
  assert.equal(soundex('Bbbb'), 'B000');
  assert.equal(soundex('Cccc'), 'C000');
});

test('adjacent same-digit consonants encode once', () => {
  assert.equal(soundex('Jackson'), 'J250');
  assert.equal(soundex('Tymczak'), 'T522');
});

test('H and W do not break adjacency', () => {
  // "SH" — H is transparent, so S does not repeat.
  assert.equal(soundex('Shaw'), 'S000');
  // "PH" — H transparent, P encodes once (and first letter is P).
  assert.equal(soundex('Phister'), 'P236');
});

test('vowels reset the adjacency window so repeats across a vowel code twice', () => {
  // B...B separated by O: two distinct digits expected.
  assert.equal(soundex('Bob'), 'B100');
});

test('short words are zero-padded to four characters', () => {
  assert.equal(soundex('Lee'), 'L000');
  assert.equal(soundex('A'), 'A000');
  assert.equal(soundex('B'), 'B000');
});

test('long words are truncated to four characters', () => {
  assert.equal(soundex('Ashcraft'), 'A261');
});

test('empty and whitespace-only input yield 0000', () => {
  assert.equal(soundex(''), '0000');
  assert.equal(soundex('   '), '0000');
  assert.equal(soundex('\t\n'), '0000');
});

test('non-alphabetic characters are stripped before coding', () => {
  assert.equal(soundex('O\'Brien'), 'O165');
  assert.equal(soundex('Van der Berg'), 'V536');
  assert.equal(soundex('123 Main!'), 'M500');
});

test('mixed case is normalized', () => {
  assert.equal(soundex('RoBeRt'), 'R163');
  assert.equal(soundex('PFISTER'), 'P236');
});

test('non-string input is coerced to string then coded', () => {
  assert.equal(soundex(null), '0000');
  assert.equal(soundex(undefined), '0000');
  assert.equal(soundex(42), '0000');
});
