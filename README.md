# Soundex Phonetic Algorithm

A small, zero-dependency TypeScript-free JavaScript library that computes the
four-character American Soundex code for an English word, so that
similar-sounding names (\"Robert\" / \"Rupert\", \"Jackson\" / \"Jaxen\") collapse
to the same key.

## Usage

```js
import { soundex } from './src/index.js';

soundex('Robert');    // 'R163'
soundex('Rupert');    // 'R163'
soundex('Ashcraft');  // 'A261'
soundex('Tymczak');   // 'T522'
soundex('Pfister');   // 'P236'
soundex('');          // '0000'
```

Exports a single function, `soundex(input: string): string`.

## Why this exists

Soundex is a century-old indexing trick for matching names when you only have
a rough phonetic idea of the spelling. It is deliberately lossy: every word is
hammered into one letter plus three digits, so \"Robert\" and \"Rupert\" share
the code `R163` and can be grouped in a name lookup. The trade-off is precision
— plenty of genuinely different names collide on the same code, so Soundex is
a pre-filter for humans or a fuzzy-join key, not a final answer.

## Edge cases worth knowing

This implements the **NARA / ANSI variant** with the following deliberate
decisions, each tested:

- **H and W are transparent to adjacency.** `"SH"` codes as a single S, and
  `"PH"` as a single P, because H neither contributes a digit nor breaks the
  chain of identical-digit consonants around it.
- **Vowels reset the adjacency window.** A consonant repeated across a vowel
  (\"Bob\") codes twice (`B100`), unlike the same consonant repeated directly
  (\"Bbb\" → `B000`).
- **The first letter is kept verbatim and never contributes its own digit** as
  the second code character. `"Pfister"` is `P236`, not `P123`.
- **Non-letters are stripped** before coding: `"O'Brien"` → `O165`, `"Van der
  Berg"` → `V536`.
- **Empty or non-alphabetic input returns `\"0000\"`.**

## Running the tests

```
node --test
```
