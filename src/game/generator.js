// src/game/generator.js
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

/**
 * Generates a "problem" object the UI can render:
 * { prompt: string, options: string[], answer: string }
 *
 * pack.banks should include:
 *  - vocab: { [theme]: { [difficulty]: [{term, def}, ...] } }
 *  - labs:  { [theme]: [{q, a, d:[..]}, ...] }
 *  - facts: { [theme]: { [difficulty]: [{t, f1, f2}, ...] } }
 */
export function generateProblemFromPack({ pack, mode, theme, difficulty }) {
  const banks = pack?.banks || {};

  // 1) VOCAB: choose the correct term for a definition
  if (mode === 'vocab') {
    const list = banks.vocab?.[theme]?.[difficulty] || [];
    const item = pick(list);
    if (!item) return { prompt: 'No questions loaded.', options: [], answer: '' };

    const correct = (item.term || '').toLowerCase();

    // distractors from same list
    const distractPool = list
      .filter(x => (x.term || '').toLowerCase() !== correct)
      .map(x => (x.term || '').toLowerCase());

    const distractors = shuffle(distractPool).slice(0, 2);
    const options = shuffle([correct, ...distractors]).slice(0, 3);

    return {
      prompt: `Which word matches: “${item.def}”`,
      options,
      answer: correct
    };
  }

  // 2) LABS: fill in the blank
  if (mode === 'labs') {
    const list = banks.labs?.[theme] || [];
    const tpl = pick(list);
    if (!tpl) return { prompt: 'No questions loaded.', options: [], answer: '' };

    const options = shuffle([tpl.a, ...(tpl.d || [])])
      .map(w => (w || '').toLowerCase())
      .slice(0, 3);

    return {
      prompt: (tpl.q || '').replace('{__}', '____'),
      options,
      answer: (tpl.a || '').toLowerCase()
    };
  }

  // 3) FACTS: pick the TRUE statement
  if (mode === 'facts') {
    const list = banks.facts?.[theme]?.[difficulty] || [];
    const item = pick(list);
    if (!item) return { prompt: 'No questions loaded.', options: [], answer: '' };

    const options = shuffle([item.t, item.f1, item.f2])
      .map(s => (s || '').toLowerCase())
      .slice(0, 3);

    return {
      prompt: 'Which statement is TRUE?',
      options,
      answer: (item.t || '').toLowerCase()
    };
  }

  return { prompt: 'Unknown mode.', options: [], answer: '' };
}
