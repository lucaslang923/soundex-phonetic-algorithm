const EMPTY_CODE = '0000';

// Standard American Soundex digit table. B/F/P/V share 1 because they are
// labials that blur together in casual speech; M/N similarly collapse to 5;
// the unvoiced/voiced sibilant pair S/Z shares 2. Grouping by place of
// articulation is the whole point of the algorithm.
const DIGIT_FOR = {
  b: '1', f: '1', p: '1', v: '1',
  c: '2', g: '2', j: '2', k: '2', q: '2', s: '2', x: '2', z: '2',
  d: '3', t: '3',
  l: '4',
  m: '5', n: '5',
  r: '6',
};

/**
 * Compute the four-character American Soundex code for an English word.
 *
 * Rules implemented (the 1918 NARA/ANSI variant):
 *   1. Keep the first letter verbatim (upper-cased).
 *   2. Replace every other consonant with its digit from the table above.
 *   3. Two adjacent letters with the same digit encode once (H and W, which
 *      carry no digit of their own, do not break adjacency — so "SH" codes
 *      as a single S, and "PF" as a single P).
 *   4. Vowels and H/W/Y are dropped entirely once the first letter is fixed.
 *   5. Pad with zeros to four characters; truncate to four if longer.
 *
 * Non-letters are stripped before coding. The empty input returns "0000".
 *
 * @param {string} input
 * @returns {string}
 */
export function soundex(input) {
  const word = String(input == null ? '' : input)
    .toLowerCase()
    .replace(/[^a-z]/g, '');

  if (word.length === 0) return EMPTY_CODE;

  const letters = [...word];
  const first = letters[0].toUpperCase();

  // Drop the first letter from the stream so its own digit (if any) does not
  // re-appear as the second code character. Soundex keeps the *letter*, not
  // the digit, for position 1.
  const tail = letters.slice(1);

  const digits = [];
  let prev = DIGIT_FOR[letters[0]] ?? null;

  for (const ch of tail) {
    const d = DIGIT_FOR[ch] ?? null;

    if (d === null) {
      // A vowel or H/W. Vowels reset the "previous digit" window so that a
      // repeated consonant across a vowel ("BOb's B") codes twice; H and W do
      // not, per the NARA rule that they are transparent to adjacency.
      if (ch === 'h' || ch === 'w') {
        // keep prev unchanged
      } else {
        prev = null;
      }
      continue;
    }

    if (d !== prev) {
      digits.push(d);
      prev = d;
    }
  }

  let code = first + digits.join('');
  if (code.length < 4) code += '0'.repeat(4 - code.length);
  return code.slice(0, 4);
}
