const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

/**
 * Factory: creates a problem generator function from a content pack.
 * Returns a function with signature: generateProblem({ mode, theme, difficulty, level })
 * that returns { prompt, options, answer, ... }
 */
export function createGenerator(contentPack) {
  return function generateProblem({ mode, theme, difficulty, level }) {
    const banks = contentPack?.banks || {};

    // Math: procedurally generated problems
    if (contentPack.type === 'math') {
      return generateMathProblem(level, difficulty);
    }

    // Reading: word/sight word/story selection
    if (contentPack.type === 'reading') {
      return generateReadingProblem(mode, theme, difficulty, banks);
    }

    // Science: vocab/labs/facts selection
    if (contentPack.type === 'science') {
      return generateScienceProblem(mode, theme, difficulty, banks);
    }

    return { prompt: 'Unknown content type.', options: [], answer: '' };
  };
}

function generateMathProblem(level, difficulty) {
  let n1, n2, correctAnswer, type = '+';
  let max = 10;

  if (difficulty === 'beginner') max = 5;
  if (difficulty === 'intermediate') max = 15;
  if (difficulty === 'advanced') max = 30;

  if (level === 1) {
    correctAnswer = Math.floor(Math.random() * (max - 1)) + 2;
    n1 = Math.floor(Math.random() * (correctAnswer - 1)) + 1;
    n2 = correctAnswer - n1;
  } else if (level === 2) {
    const levelMax = Math.floor(max * 1.5);
    correctAnswer = Math.floor(Math.random() * (levelMax - 1)) + 2;
    n1 = Math.floor(Math.random() * (correctAnswer - 1)) + 1;
    n2 = correctAnswer - n1;
  } else if (level === 3) {
    type = '-';
    n1 = Math.floor(Math.random() * max) + 5;
    n2 = Math.floor(Math.random() * n1) + 1;
    correctAnswer = n1 - n2;
  } else if (level === 4) {
    type = '-';
    n1 = Math.floor(Math.random() * max);
    n2 = Math.floor(Math.random() * max);
    correctAnswer = n1 - n2;
  } else if (level === 5) {
    type = '×';
    const multMax = difficulty === 'beginner' ? 5 : difficulty === 'intermediate' ? 9 : 12;
    n1 = Math.floor(Math.random() * multMax) + 1;
    n2 = Math.floor(Math.random() * multMax) + 1;
    correctAnswer = n1 * n2;
  } else if (level === 6) {
    const isDiv = Math.random() > 0.5;
    if (isDiv) {
      type = '÷';
      const divMax = difficulty === 'beginner' ? 5 : difficulty === 'intermediate' ? 10 : 12;
      correctAnswer = Math.floor(Math.random() * divMax) + 1;
      n2 = Math.floor(Math.random() * divMax) + 1;
      n1 = correctAnswer * n2;
    } else {
      type = '×';
      const multMax = difficulty === 'beginner' ? 6 : difficulty === 'intermediate' ? 10 : 15;
      n1 = Math.floor(Math.random() * multMax) + 1;
      n2 = Math.floor(Math.random() * multMax) + 1;
      correctAnswer = n1 * n2;
    }
  } else if (level === 7) {
    const isAdd = Math.random() > 0.5;
    type = isAdd ? '+' : '-';
    const mixMax = max * 2;
    if (isAdd) {
      n1 = Math.floor(Math.random() * mixMax) + 1;
      n2 = Math.floor(Math.random() * mixMax) + 1;
      correctAnswer = n1 + n2;
    } else {
      n1 = Math.floor(Math.random() * mixMax) + mixMax;
      n2 = Math.floor(Math.random() * mixMax) + 1;
      correctAnswer = n1 - n2;
    }
  } else if (level === 8) {
    type = '×';
    n1 = difficulty === 'beginner' ? Math.floor(Math.random() * 5) + 5 : Math.floor(Math.random() * 10) + 5;
    n2 = Math.floor(Math.random() * 10) + 1;
    correctAnswer = n1 * n2;
  } else {
    const rand = Math.random();
    if (rand < 0.25) {
      type = '+'; n1 = Math.floor(Math.random() * 50); n2 = Math.floor(Math.random() * 50); correctAnswer = n1 + n2;
    } else if (rand < 0.5) {
      type = '-'; n1 = Math.floor(Math.random() * 100); n2 = Math.floor(Math.random() * 50); correctAnswer = n1 - n2;
    } else if (rand < 0.75) {
      type = '×'; n1 = Math.floor(Math.random() * 12); n2 = Math.floor(Math.random() * 12); correctAnswer = n1 * n2;
    } else {
      type = '÷'; correctAnswer = Math.floor(Math.random() * 12) + 1; n2 = Math.floor(Math.random() * 12) + 1; n1 = correctAnswer * n2;
    }
  }

  const optionsSet = new Set([correctAnswer]);
  while (optionsSet.size < 3) {
    const offset = Math.floor(Math.random() * 11) - 5;
    const fake = correctAnswer + offset;
    if (fake !== correctAnswer) optionsSet.add(fake);
    if (optionsSet.size < 3) optionsSet.add(correctAnswer + (Math.random() > 0.5 ? 10 : -10));
  }
  
  const optionsArray = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  return { num1: n1, num2: n2, answer: correctAnswer, options: optionsArray, type };
}

function generateReadingProblem(mode, theme, difficulty, banks) {
  const diffKey = difficulty === 'beginner' ? 'beginner' : difficulty === 'advanced' ? 'advanced' : 'intermediate';
  const THEME_WORDS = banks.words || {};
  const SIGHT_WORDS = banks.sightwords || {};
  const STORY_TEMPLATES = banks.stories || {};
  const themeWords = THEME_WORDS[theme]?.[diffKey] || [];

  if (mode === 'phonics') {
    let correctWord = pick(themeWords);
    if (!correctWord) return { prompt: 'No words loaded.', options: [], answer: '' };
    
    let letter = correctWord[0].toUpperCase();
    const poolSame = themeWords.filter(w => w !== correctWord && w[0].toUpperCase() !== letter);
    const distractPool = poolSame.length ? poolSame : themeWords.filter(w => w !== correctWord && w[0].toUpperCase() !== letter);
    
    const dCandidates = shuffle(distractPool).slice(0, 2);
    while (dCandidates.length < 2) {
      const fallback = pick((THEME_WORDS[theme]?.['beginner'] || []).filter(w => w !== correctWord && w[0].toUpperCase() !== letter));
      if (!fallback || dCandidates.includes(fallback)) break;
      dCandidates.push(fallback);
    }

    const options = shuffle([correctWord, ...dCandidates]).map(w => w.toLowerCase());
    return {
      prompt: `Which word starts with "${letter}"?`,
      options,
      answer: correctWord.toLowerCase()
    };
  }

  if (mode === 'sight') {
    const sightWordsForDiff = SIGHT_WORDS[diffKey] || [];
    const target = pick(sightWordsForDiff)?.toLowerCase() || '';
    if (!target) return { prompt: 'No sight words loaded.', options: [], answer: '' };
    
    const samePool = sightWordsForDiff.filter(w => w.toLowerCase() !== target).map(w => w.toLowerCase());
    const neighbourPool = (diffKey === 'advanced' ? SIGHT_WORDS['intermediate'] : SIGHT_WORDS['beginner']) || [];
    const pool = shuffle([...samePool, ...neighbourPool.map(w => w.toLowerCase())]).filter(w => w !== target);
    
    const candidates = [...new Set(pool)];
    const options = shuffle([target, candidates[0] || pick(sightWordsForDiff), candidates[1] || pick(sightWordsForDiff)].map(w => (w || '').toLowerCase())).slice(0, 3);
    
    return {
      prompt: `Tap the sight word: "${target}"`,
      options,
      answer: target
    };
  }

  if (mode === 'story') {
    const stories = STORY_TEMPLATES[theme] || [];
    const tpl = pick(stories);
    if (!tpl) return { prompt: 'No stories loaded.', options: [], answer: '' };

    const options = shuffle([tpl.a, ...tpl.d]).map(w => w.toLowerCase());
    return {
      prompt: tpl.t.replace('{__}', '____'),
      options,
      answer: tpl.a.toLowerCase()
    };
  }

  return { prompt: 'Unknown reading mode.', options: [], answer: '' };
}

function generateScienceProblem(mode, theme, difficulty, banks) {
  if (mode === 'vocab') {
    const vocab = banks.vocab?.[theme]?.[difficulty] || [];
    const item = pick(vocab);
    if (!item) return { prompt: 'No questions loaded.', options: [], answer: '' };
    
    const correct = (item.term || '').toLowerCase();
    const distractPool = vocab
      .filter(x => (x.term || '').toLowerCase() !== correct)
      .map(x => (x.term || '').toLowerCase());

    const distractors = shuffle(distractPool).slice(0, 2);
    const options = shuffle([correct, ...distractors]).slice(0, 3);

    return {
      prompt: `Which word matches: "${item.def}"`,
      options,
      answer: correct
    };
  }

  if (mode === 'labs') {
    const labs = banks.labs?.[theme] || [];
    const tpl = pick(labs);
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

  if (mode === 'facts') {
    const facts = banks.facts?.[theme]?.[difficulty] || [];
    const item = pick(facts);
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

  return { prompt: 'Unknown science mode.', options: [], answer: '' };
}
