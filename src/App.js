import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadProgress, recordAnswer, recordSessionStart, recordSessionEnd } from './lib/progress';
import { loadParentSettings, saveParentSettings } from './lib/parentSettings';
import { useSessionTimer } from './hooks/useSessionTimer';
import { generateProblem } from './game/generator';
import SplashScreen from './components/SplashScreen';
import HelpModal from './components/HelpModal';
import { pack } from './content/science';

/**
 * Module-level constants for reading content
 */
/**
 * Module-level constants for science content
 * (Keep structure predictable so assets and UI stay consistent with other Sprouts apps.)
 */
/**
 * Parent Panel Components
 */

const PINPad = ({ correctPin, onAuthenticated, onSetPin }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (digit) => {
    if (input.length < 4) {
      const newVal = input + digit;
      setInput(newVal);
      if (newVal.length === 4) {
        if (!correctPin || newVal === correctPin) {
          if (!correctPin) onSetPin(newVal);
          onAuthenticated();
        } else {
          setError(true);
          setTimeout(() => { setError(false); setInput(''); }, 600);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-stone-600 font-black mb-4 uppercase tracking-widest text-xs">
        {correctPin ? 'Enter Parent PIN' : 'Set Parent PIN'}
      </p>
      <div className="flex gap-2 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full border-2 transition-all ${input.length > i ? 'bg-stone-800 border-stone-800' : 'border-stone-300'} ${error ? 'bg-rose-500 border-rose-500 animate-shake' : ''}`} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '⌫'].map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === 'C') setInput('');
              else if (btn === '⌫') setInput(input.slice(0, -1));
              else handleDigit(btn);
            }}
            className="w-12 h-12 rounded-full bg-stone-100 font-black text-stone-700 active:bg-stone-200 shadow-sm border-b-2 border-stone-300"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

const ParentSummary = ({ stats }) => {
  const accuracy = stats.totalQuestionsAnswered > 0 
    ? Math.round((stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100) 
    : 0;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-stone-50 p-3 rounded-2xl border-b-2 border-stone-200">
          <p className="text-[10px] font-black text-stone-400 uppercase">Accuracy</p>
          <p className="text-xl font-black text-green-600">{accuracy}%</p>
        </div>
        <div className="bg-stone-50 p-3 rounded-2xl border-b-2 border-stone-200">
          <p className="text-[10px] font-black text-stone-400 uppercase">Streak</p>
          <p className="text-xl font-black text-orange-500">{stats.streakBest}</p>
        </div>
        <div className="bg-stone-50 p-3 rounded-2xl border-b-2 border-stone-200">
          <p className="text-[10px] font-black text-stone-400 uppercase">Questions</p>
          <p className="text-xl font-black text-stone-700">{stats.totalQuestionsAnswered}</p>
        </div>
        <div className="bg-stone-50 p-3 rounded-2xl border-b-2 border-stone-200">
          <p className="text-[10px] font-black text-stone-400 uppercase">Play Time</p>
          <p className="text-[13px] font-black text-stone-700">{formatTime(stats.totalPlayTimeSeconds)}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 text-[9px] font-black uppercase text-stone-400">
              <th className="p-2">Difficulty</th>
              <th className="p-2 text-right">Done</th>
              <th className="p-2 text-right">Correct</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-bold text-stone-600">
            {Object.entries(stats.perDifficultyStats).map(([diff, data]) => (
              <tr key={diff} className="border-t border-stone-50">
                <td className="p-2 capitalize">{diff}</td>
                <td className="p-2 text-right">{data.answered}</td>
                <td className="p-2 text-right">{data.correct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ParentSettingsPanel = ({ settings, onUpdate }) => {
  const toggleLock = (key) => {
    onUpdate({ ...settings, locks: { ...settings.locks, [key]: !settings.locks[key] } });
  };

  const toggleArray = (key, value) => {
    const arr = settings[key];
    const newArr = arr.includes(value) 
      ? arr.length > 1 ? arr.filter(v => v !== value) : arr 
      : [...arr, value];
    onUpdate({ ...settings, [key]: newArr });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-black text-stone-400 uppercase mb-2">Session Limit</p>
        <div className="flex flex-wrap gap-2">
          {[0, 5, 10, 15, 20, 30].map(mins => (
            <button
              key={mins}
              onClick={() => onUpdate({ ...settings, sessionTimeLimit: mins })}
              className={`px-3 py-1.5 rounded-full text-[10px] font-black border-b-2 transition-all ${settings.sessionTimeLimit === mins ? 'bg-stone-800 text-white border-stone-900' : 'bg-stone-100 text-stone-500 border-stone-200'}`}
            >
              {mins === 0 ? 'None' : `${mins}m`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-stone-50 p-3 rounded-2xl flex items-center justify-between border-b-2 border-stone-200">
        <div>
          <p className="text-[11px] font-black text-stone-700">Gentle Stop</p>
          <p className="text-[9px] text-stone-400 font-bold">Finish current question before break</p>
        </div>
        <button 
          onClick={() => onUpdate({ ...settings, stopAfterCurrentQuestion: !settings.stopAfterCurrentQuestion })}
          className={`w-10 h-5 rounded-full relative transition-colors ${settings.stopAfterCurrentQuestion ? 'bg-green-500' : 'bg-stone-300'}`}
        >
          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${settings.stopAfterCurrentQuestion ? 'left-5.5' : 'left-0.5'}`} />
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-black text-stone-400 uppercase">Lock Settings</p>
        {Object.entries({ theme: 'Theme', difficulty: 'Difficulty', gameMode: 'Game Mode' }).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-600">{label}</span>
            <button 
              onClick={() => toggleLock(key)}
              className={`p-1.5 rounded-lg transition-colors ${settings.locks[key] ? 'text-rose-500 bg-rose-50' : 'text-stone-300 hover:bg-stone-50'}`}
            >
              {settings.locks[key] ? '🔒' : '🔓'}
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-2 border-t border-stone-100">
        <p className="text-[10px] font-black text-stone-400 uppercase">Allowed Themes</p>
        <div className="flex gap-2">
          {['garden', 'ocean', 'space'].map(t => (
            <button key={t} onClick={() => toggleArray('allowedThemes', t)} className={`px-2 py-1 rounded-lg text-[9px] font-black capitalize border-b-2 transition-all ${settings.allowedThemes.includes(t) ? 'bg-green-100 text-green-700 border-green-200' : 'bg-stone-50 text-stone-300 border-stone-100'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Main App Component
 */
function App() {
  // Global Game State
  const [gameMode, setGameMode] = useState('vocab'); 
  const [difficulty, setDifficulty] = useState('intermediate'); 
  const [theme, setTheme] = useState('garden'); 
  const [problem, setProblem] = useState({ prompt: '', options: [], answer: '' });
  const [seeds, setSeeds] = useState(0); 
  const [level, setLevel] = useState(1);
  const [garden, setGarden] = useState([]); 
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const feedbackTimeoutRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTargetPlant, setCurrentTargetPlant] = useState('/assets/garden/collectible-1.png');
  const [showResetModal, setShowResetModal] = useState(false);
  const recentProblemKeysRef = useRef([]);
  const [showSplash, setShowSplash] = useState(() => sessionStorage.getItem('science_sprouts_seen_splash') !== '1');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [hintedOptionIndex, setHintedOptionIndex] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Parent Controls State
  const [parentSettings, setParentSettings] = useState(loadParentSettings());
  const [stats, setStats] = useState(loadProgress());
  const [showParentModal, setShowParentModal] = useState(false);
  const [isParentAuthenticated, setIsParentAuthenticated] = useState(false);
  const [parentActiveTab, setParentActiveTab] = useState('stats');
  const [showSessionEnd, setShowSessionEnd] = useState(false);
  const [pendingSessionEnd, setPendingSessionEnd] = useState(false);

  // Customization Assets
  const plantAssets = {
    garden: [
      '/assets/garden/collectible-1.png', '/assets/garden/collectible-2.png', '/assets/garden/collectible-3.png', '/assets/garden/collectible-4.png',
      '/assets/garden/collectible-5.png', '/assets/garden/collectible-6.png', '/assets/garden/collectible-7.png', '/assets/garden/collectible-8.png'
    ],
    ocean: [
      '/assets/ocean/collectible-1.png', '/assets/ocean/collectible-2.png', '/assets/ocean/collectible-3.png', '/assets/ocean/collectible-4.png',
      '/assets/ocean/collectible-5.png', '/assets/ocean/collectible-6.png', '/assets/ocean/collectible-7.png', '/assets/ocean/collectible-8.png'
    ],
    space: [
      '/assets/space/collectible-1.png', '/assets/space/collectible-2.png', '/assets/space/collectible-3.png', '/assets/space/collectible-4.png',
      '/assets/space/collectible-5.png', '/assets/space/collectible-6.png', '/assets/space/collectible-7.png', '/assets/space/collectible-8.png'
    ]
  };

  const plantAssetsRef = useRef(plantAssets);

  const themeConfig = {
    garden: {
      bg: 'bg-green-50',
      accent: 'text-green-700',
      headerBg: 'bg-yellow-200',
      headerBorder: 'border-yellow-400',
      problemBorder: 'border-green-200',
      btnColors: ['bg-rose-400 border-rose-600', 'bg-sky-400 border-sky-600', 'bg-amber-400 border-amber-600'],
      progressGradient: 'from-green-400 to-yellow-400',
      mascot: '/assets/mascot-garden.png',
      helper: '/assets/helper-bee.png',
      themeColor: 'bg-green-500',
      seedName: 'Sprout',
      bud: '/assets/garden/collectible-1.png',
      balanceAsset: '/assets/balance-seed.png'
    },
    ocean: {
      bg: 'bg-cyan-50',
      accent: 'text-cyan-700',
      headerBg: 'bg-blue-200',
      headerBorder: 'border-blue-400',
      problemBorder: 'border-cyan-200',
      btnColors: ['bg-teal-400 border-teal-600', 'bg-blue-400 border-blue-600', 'bg-indigo-400 border-indigo-600'],
      progressGradient: 'from-cyan-400 to-blue-400',
      mascot: '/assets/mascot-ocean.png',
      helper: '/assets/helper-fish.png',
      themeColor: 'bg-blue-500',
      seedName: 'Whale',
      bud: '/assets/ocean/collectible-1.png',
      balanceAsset: '/assets/balance-whale.png'
    },
    space: {
      bg: 'bg-slate-900',
      accent: 'text-purple-400',
      headerBg: 'bg-purple-900',
      headerBorder: 'border-purple-500',
      problemBorder: 'border-purple-800',
      btnColors: ['bg-fuchsia-500 border-fuchsia-700', 'bg-violet-500 border-violet-700', 'bg-pink-500 border-pink-700'],
      progressGradient: 'from-purple-500 to-pink-500',
      textColor: 'text-slate-200',
      mascot: '/assets/mascot-space.png',
      helper: '/assets/helper-stars.png',
      themeColor: 'bg-purple-500',
      seedName: 'Asteroid',
      bud: '/assets/space/collectible-1.png',
      balanceAsset: '/assets/balance-asteroid.png'
    }
  };

  const currentTheme = themeConfig[theme];

  // Session Timer Hook
  const handleTimeUp = useCallback(() => {
    if (parentSettings.stopAfterCurrentQuestion) {
      setPendingSessionEnd(true);
    } else {
      setShowSessionEnd(true);
    }
  }, [parentSettings.stopAfterCurrentQuestion]);

  const { elapsedSeconds } = useSessionTimer(parentSettings.sessionTimeLimit, handleTimeUp);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--app-vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', setVh);
    }

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', setVh);
      }
    };
  }, []);

  // Initialize data on mount
  useEffect(() => {
    try {
      recordSessionStart();
      const loadedSettings = loadParentSettings();
      setParentSettings(loadedSettings);
      // Ensure initial settings respect locks using functional updates
      if (loadedSettings.allowedThemes.length > 0) {
        setTheme(prev => loadedSettings.allowedThemes.includes(prev) ? prev : loadedSettings.allowedThemes[0]);
      }
      if (loadedSettings.allowedDifficulties.length > 0) {
        setDifficulty(prev => loadedSettings.allowedDifficulties.includes(prev) ? prev : loadedSettings.allowedDifficulties[0]);
      }
      if (loadedSettings.allowedModes.length > 0) {
        setGameMode(prev => loadedSettings.allowedModes.includes(prev) ? prev : loadedSettings.allowedModes[0]);
      }

      // PWA Install Prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallBanner(true);
      });

      window.addEventListener('appinstalled', () => {
        setDeferredPrompt(null);
        setShowInstallBanner(false);
        console.log('Science Sprouts was installed');
      });

      // Check if it's iOS and not already installed
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const isStandaloneMq = typeof window.matchMedia === 'function' ? window.matchMedia('(display-mode: standalone)').matches : false;
      const isStandalone = isStandaloneMq || window.navigator.standalone;
      if (isIOS && !isStandalone) {
        setShowInstallBanner(true);
      }
    } catch (err) {
      // Log initialization errors for tests
      console.error('App init error', err);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  // Ensure any feedback timeout is cleared on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  // Update Settings
  const updateSettings = (newSettings) => {
    setParentSettings(newSettings);
    saveParentSettings(newSettings);
  };

  // Generate a new problem based on level and difficulty
  const difficultyKey = (d) => (d === 'beginner' ? 'beginner' : d === 'advanced' ? 'advanced' : 'intermediate');
  const generateNewProblem = useCallback(() => {
    const diffKey = difficultyKey(difficulty);

    const recent = recentProblemKeysRef.current;
    const recentSet = new Set(recent);

    // Generate one candidate problem using the shared generator
    let candidate = generateProblem({
      mode: gameMode,
      theme,
      difficulty: diffKey
    });

    // Avoid immediate repeats (helps the app feel fair + varied)
    let key = `${gameMode}|${difficulty}|${theme}|${candidate.prompt}|${candidate.answer}`;

    for (let tries = 0; tries < 25 && recentSet.has(key); tries++) {
      candidate = generateProblem({
        mode: gameMode,
        theme,
        difficulty: diffKey
      });
      key = `${gameMode}|${difficulty}|${theme}|${candidate.prompt}|${candidate.answer}`;
    }

    // Record key (keep last 12)
    recent.push(key);
    while (recent.length > 12) recent.shift();
    recentProblemKeysRef.current = recent;

    setProblem(candidate);
    setHintedOptionIndex(null);
  }, [difficulty, theme, gameMode]);

useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem]);

  useEffect(() => {
    setCurrentTargetPlant(plantAssetsRef.current[theme][Math.floor(Math.random() * plantAssetsRef.current[theme].length)]);
  }, [theme]);

  const handleAnswer = (selected) => {
    const isCorrect = selected === problem.answer;
    
    // Record Progress
    const updatedStats = recordAnswer({ 
      correct: isCorrect, 
      difficulty, 
      mode: gameMode 
    });
    setStats(updatedStats);

    if (isCorrect) {
      // Show success and auto-clear after a short delay
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      setFeedback({ message: 'Correct!', type: 'success' });
      feedbackTimeoutRef.current = setTimeout(() => setFeedback({ message: '', type: '' }), 1200);
      setIsAnimating(true);
      const newSeeds = seeds + 1;
      
      if (newSeeds >= 10) {
        window.confetti({ 
          particleCount: 200, 
          spread: 90, 
          origin: { y: 0.6 },
          colors: level === 1 ? ['#FDE047'] : level === 2 ? ['#FB923C'] : level === 3 ? ['#4ADE80'] : level === 4 ? ['#F43F5E'] : level === 5 ? ['#3B82F6'] : ['#A855F7']
        });
        setSeeds(10);
        setTimeout(() => {
          if (pendingSessionEnd) {
            setShowSessionEnd(true);
            return;
          }
          setGarden(prev => [...prev, currentTargetPlant]);
          const nextLevel = Math.min(level + 1, 9);
          setLevel(nextLevel);
          setSeeds(0);
          setCurrentTargetPlant(plantAssetsRef.current[theme][Math.floor(Math.random() * plantAssetsRef.current[theme].length)]);
          setIsAnimating(false);
          generateNewProblem();
        }, 2000);
      } else {
        setSeeds(newSeeds);
        setTimeout(() => { 
          if (pendingSessionEnd) {
            setShowSessionEnd(true);
            return;
          }
          setIsAnimating(false); 
          generateNewProblem(); 
        }, 1000);
      }
    } else {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      setFeedback({ message: 'Try again!', type: 'error' });
      feedbackTimeoutRef.current = setTimeout(() => setFeedback({ message: '', type: '' }), 1000);
    }
  };

  const handleHint = () => {
    if (hintedOptionIndex !== null) return;
    const incorrectIndices = problem.options
      .map((option, index) => (option !== problem.answer ? index : null))
      .filter((index) => index !== null);
    const randomIndex = incorrectIndices[Math.floor(Math.random() * incorrectIndices.length)];
    setHintedOptionIndex(randomIndex);
  };

  const confirmReset = () => {
    setLevel(1);
    setSeeds(0);
    setGarden([]);
    setShowResetModal(false);
    generateNewProblem();
  };

  const tiltAngle = 15 - (seeds * 3);

  // Fallback theme in case currentTheme is undefined
  const safeTheme = currentTheme || themeConfig.garden;

  return (
    <div className={`${safeTheme.bg} flex flex-col items-center p-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-[calc(env(safe-area-inset-bottom)+0.75rem)] font-sans ${safeTheme.textColor || 'text-stone-800'} overflow-hidden relative transition-colors duration-500`} style={{ minHeight: 'calc(var(--app-vh, 1vh) * 100)' }}>
      {showSplash && (
        <SplashScreen onFinish={() => { sessionStorage.setItem('science_sprouts_seen_splash', '1'); setShowSplash(false); }} />
      )}
      
      {/* Parent Access Button */}
      <button 
        onClick={() => { setShowParentModal(true); setIsParentAuthenticated(false); }}
        className="fixed left-2 top-[calc(env(safe-area-inset-top)+0.5rem)] z-40 bg-white/40 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white/60 transition-all border border-white/20"
      >
        <span className="text-sm">⚙️</span>
      </button>

      {/* Difficulty Sidebar */}
      <div className="fixed left-2 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1.5 items-center">
        <span className="text-[8px] font-black uppercase tracking-widest text-stone-500 bg-white/70 px-1.5 py-0.5 rounded-full border border-stone-200">
          Difficulty
        </span>
        {['beginner', 'intermediate', 'advanced'].map((d) => (
          <button
            key={d}
            disabled={parentSettings.locks.difficulty || !parentSettings.allowedDifficulties.includes(d)}
            onClick={() => setDifficulty(d)}
            className={`w-8 h-8 rounded-full text-[9px] font-black transition-all border ${difficulty === d ? 'bg-stone-900 text-white border-stone-900' : 'bg-white/70 text-stone-600 border-stone-200'} ${!parentSettings.allowedDifficulties.includes(d) ? 'hidden' : ''}`}
          >
            {d === 'beginner' ? 'B' : d === 'intermediate' ? 'I' : 'A'}
          </button>
        ))}
      </div>

      {/* Theme Sidebar */}
      <div className="fixed right-2 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1.5 items-center">
        <span className="text-[8px] font-black uppercase tracking-widest text-stone-500 bg-white/70 px-1.5 py-0.5 rounded-full border border-stone-200">
          Theme
        </span>
        {['garden', 'ocean', 'space'].map((t) => (
          <button
            key={t}
            disabled={parentSettings.locks.theme || !parentSettings.allowedThemes.includes(t)}
            onClick={() => setTheme(t)}
            className={`w-8 h-8 rounded-full transition-all ${theme === t ? `${themeConfig[t].themeColor} scale-110 shadow-md` : 'bg-stone-300 opacity-40 scale-90'} ${!parentSettings.allowedThemes.includes(t) ? 'hidden' : ''}`}
          />
        ))}
      </div>
      
      {/* Compact Header */}
      <header className="w-full max-w-md shrink-0 mb-1">
        <div className="flex items-center justify-between gap-2 bg-white/50 rounded-xl p-1.5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 ${safeTheme.headerBg} rounded-full flex items-center justify-center shadow-inner border-2 ${safeTheme.headerBorder} overflow-hidden`}>
              <img src={safeTheme.mascot} alt="mascot" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className={`text-sm font-black ${safeTheme.accent} leading-none`} style={{ fontFamily: '"Bubblegum Sans", cursive' }}>Science Sprouts</h1>
              <div className="flex flex-col gap-0.5 mt-0.5">
                <span className="text-[7px] font-bold text-stone-500 uppercase tracking-wide">Game Mode</span>
                <div className="flex gap-1">
                  {pack.modes.map(({ key: m, label }) => (
                    <button 
                      key={m}
                      disabled={parentSettings.locks.gameMode || !parentSettings.allowedModes.includes(m)}
                      onClick={() => setGameMode(m)}
                      className={`min-w-[60px] px-2 py-1 rounded-full text-[8px] font-bold transition-all ${gameMode === m ? 'bg-green-500 text-white shadow-sm' : 'bg-white/70 text-stone-600'} ${!parentSettings.allowedModes.includes(m) ? 'hidden' : ''}`}
                    >
                      {label || m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-[9px] font-black text-white ${level <= 3 ? 'bg-yellow-500' : level <= 6 ? 'bg-orange-500' : 'bg-rose-600'}`}>
            Lv {level}
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-center w-full max-w-md gap-3 py-1 overflow-hidden">
        
        {/* Compact Question Card */}
        <div className={`bg-white rounded-xl p-2 shadow-md border-b-2 ${safeTheme.problemBorder} w-full shrink-0 transition-transform ${feedback.type === 'error' ? 'animate-shake' : ''}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-stone-700 flex-1 text-center leading-tight">
              {problem.prompt}
            </h2>
            {feedback.message && (
              <div className="flex items-center gap-1">
                <img src={feedback.type === 'success' ? '/assets/feedback-success.png' : '/assets/feedback-error.png'} alt={feedback.type} className="w-6 h-6" />
              </div>
            )}
          </div>
        </div>

        {/* Answer Buttons */}
        <div className="flex gap-2 shrink-0">{problem.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={isAnimating}
              className={`rounded-full text-[14px] font-bold text-white shadow-md transform transition-all duration-500 ease-in-out active:scale-95 flex items-center justify-center overflow-hidden ${safeTheme.btnColors[index]} ${hintedOptionIndex === index ? 'opacity-0 scale-0 w-0 h-0 m-0 pointer-events-none p-0 border-0' : 'w-full max-w-full h-14'}`}
            >
              <span className="line-clamp-2 px-2 text-center leading-tight">
                {hintedOptionIndex === index ? null : option}
              </span>
            </button>
          ))}
          <button 
            onClick={handleHint}
            disabled={hintedOptionIndex !== null || isAnimating}
            className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-all ${hintedOptionIndex !== null ? 'bg-stone-200 text-stone-400' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
          >
            <span className="text-base">{hintedOptionIndex !== null ? '✨' : '💡'}</span>
          </button>
        </div>

        <div className="w-full flex-1 flex items-center justify-center min-h-0">
          {gameMode === 'vocab' && (
            <div className="w-full relative h-56 flex flex-col items-center justify-end z-10 overflow-hidden pt-6">
              <div className={`absolute bottom-0 w-12 h-12 bg-blue-100 border-2 border-blue-200 rounded-full shadow-inner overflow-hidden transition-all duration-500 ${isAnimating ? 'animate-water-wobble' : ''}`}>
                <div className="absolute bottom-0 w-full h-1/2 bg-blue-300/30 blur-[1px]"></div>
              </div>
              <div className="absolute bottom-[35px] w-full max-w-[280px] h-4 bg-yellow-100 border-2 border-yellow-200 rounded-full transition-transform duration-700 ease-in-out origin-center flex items-center justify-between px-2 shadow-sm z-[60]" style={{ transform: `rotate(${tiltAngle}deg)` }}>
                <div className="relative w-28 h-32 -mt-32 -ml-8 flex flex-wrap-reverse gap-0 items-end justify-center pb-1">
                  {[...Array(seeds)].map((_, i) => {
                    const row = Math.floor((Math.sqrt(1 + 8 * (seeds - i)) - 1) / 2);
                    const posInRow = i - (seeds - ((row + 1) * (row + 2)) / 2);
                    const rowWidth = row + 1;
                    return (
                      <div 
                        key={i} 
                        className="absolute"
                        style={{
                          bottom: `${row * 8}px`,
                          left: `50%`,
                          transform: `translateX(${(posInRow - rowWidth / 2 + 0.5) * 42}px) rotate(${-tiltAngle}deg)`,
                        }}
                      >
                        <img 
                          src={safeTheme.balanceAsset} 
                          alt="seed" 
                          className={`w-10 h-10 relative z-20 ${i === seeds - 1 && isAnimating ? 'animate-fall-lightly' : 'animate-bounce-light'}`} 
                          style={{ 
                            animationDelay: i === seeds - 1 && isAnimating ? '0s' : `${i * 0.1}s`, 
                          }} 
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="relative w-20 h-20 -mt-20 -mr-4 flex flex-col items-center justify-end pb-1">
                  <img src={currentTargetPlant} alt="target" className="w-16 h-16 object-contain drop-shadow-md transform transition-transform duration-500" style={{ transform: `rotate(${-tiltAngle}deg)` }} />
                </div>
              </div>
              <p className="absolute bottom-[-15px] text-[7px] font-black text-green-600 bg-white/80 px-2 py-0.5 rounded-full border border-green-100 uppercase tracking-widest">
                {seeds} {safeTheme.seedName}{seeds !== 1 ? 's' : ''} Balanced
              </p>
            </div>
          )}

          {gameMode === 'labs' && (
            <div className="relative flex flex-col items-center">
              <div className="transition-all duration-1000 ease-out transform origin-bottom" style={{ transform: `scale(${0.8 + seeds * 0.12})`, filter: isAnimating ? 'brightness(1.1)' : 'none' }}>
                <img src={currentTargetPlant} alt="growing plant" className="w-24 h-24 object-contain drop-shadow-lg" />
              </div>
              <div className="w-32 h-4 bg-stone-200 rounded-full mt-2 shadow-inner border-2 border-stone-300"></div>
              <p className="text-stone-400 text-[8px] font-black mt-1 uppercase tracking-widest">Collectible Growing...</p>
            </div>
          )}

          {gameMode === 'facts' && (
            <div className="relative w-full h-48 flex flex-col items-center justify-center">
              <div className="relative z-0">
                <div className={`transition-all duration-1000 ${seeds >= 10 ? 'scale-110' : 'scale-100'}`}>
                  <div className="relative flex items-center justify-center">
                    {seeds < 10 && <div className="absolute inset-0 flex items-center justify-center animate-pulse opacity-30"><div className="w-24 h-24 bg-rose-100 rounded-full blur-lg"></div></div>}
                    <img 
                      src={currentTargetPlant} 
                      alt="pollinator plant" 
                      style={{ 
                        filter: `saturate(${0.2 + (seeds * 0.08)}) brightness(${0.8 + (seeds * 0.04)})`,
                        transform: `scale(${0.75 + (seeds * 0.025)})`
                      }}
                      className={`w-24 h-24 object-contain drop-shadow-lg transition-all duration-1000`}
                    />
                  </div>
                </div>
                {isAnimating && <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"><div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div></div>}
              </div>
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(seeds)].map((_, i) => (
                    <div key={i} className="absolute w-full h-full animate-bee-circle" style={{ animationDuration: `${3 + (i % 2)}s`, animationDelay: `${-i * 0.5}s`, zIndex: 60 }}>
                    <div className="absolute left-1/2 top-0" style={{ transform: 'translateX(-50%)' }}>
                      <img src={safeTheme.helper} alt="helper" className={`object-contain ${theme === 'space' ? 'w-10 h-10' : 'w-8 h-8'}`} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 bg-white/60 px-2 py-0.5 rounded-full border border-yellow-100 text-[7px] font-black text-yellow-700 uppercase tracking-widest">Discovery Growth: {seeds} Helper{seeds !== 1 ? 's' : ''} Visiting</p>
            </div>
          )}
        </div>
      </main>

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl p-3 mb-2 border-2 border-green-200 shadow-lg flex items-center justify-between animate-bubble-pop z-[60]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center border-2 border-green-200 shrink-0">
              <img src="/logo192.png" alt="logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <p className="text-[11px] font-black text-stone-700">Install Science Sprouts</p>
              <p className="text-[9px] text-stone-500 font-bold">
                {deferredPrompt ? 'Add to home screen for offline play!' : 'Tap Share then "Add to Home Screen"'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {deferredPrompt && (
              <button 
                onClick={handleInstallClick}
                className="bg-green-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm border-b-2 border-green-600 active:scale-95"
              >
                Install
              </button>
            )}
            <button 
              onClick={() => setShowInstallBanner(false)}
              className="text-stone-400 p-1 hover:bg-stone-50 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Compact Footer: Collection + Progress */}
      <footer className="w-full max-w-md shrink-0">
        {/* Progress Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-t-xl px-2 py-1 shadow-md">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
              <div className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${safeTheme.progressGradient}`} style={{ width: `${seeds * 10}%` }}></div>
            </div>
            <span className="text-[9px] font-black text-stone-600">{seeds * 10}%</span>
          </div>
        </div>
        
        {/* Mini Collection */}
        {garden.length > 0 && (
          <div className="bg-stone-100/90 rounded-b-xl px-2 py-1 border-t border-stone-200">
            <div className="flex items-center gap-1 overflow-x-auto">
              <span className="text-[7px] font-black text-stone-400 uppercase shrink-0">Collection:</span>
              {garden.slice(-8).map((plantImg, i) => (
                <div key={i} className="w-5 h-5 shrink-0">
                  <img src={plantImg} alt="item" className="w-full h-full object-contain" />
                </div>
              ))}
              {garden.length > 8 && <span className="text-[7px] text-stone-400 shrink-0">+{garden.length - 8}</span>}
            </div>
            <button onClick={() => setShowResetModal(true)} className="text-[6px] font-bold text-stone-300 hover:text-stone-500 uppercase float-right">Reset</button>
          </div>
        )}
      </footer>

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-stone-800/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[30px] p-6 max-w-[240px] w-full shadow-2xl border-b-4 border-rose-100 animate-bubble-pop text-center">
            <p className="text-xl font-black text-stone-700 mb-4 leading-tight">Go back to level 1?</p>
            <div className="flex gap-3">
              <button onClick={confirmReset} className="flex-1 bg-rose-400 text-white font-black py-2 rounded-xl shadow-md border-b-4 border-rose-600 active:scale-95">Yes!</button>
              <button onClick={() => setShowResetModal(false)} className="flex-1 bg-stone-100 text-stone-500 font-black py-2 rounded-xl shadow-md border-b-4 border-stone-300 active:scale-95">No</button>
            </div>
          </div>
        </div>
      )}

      {/* Parent Modal */}
      {showParentModal && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden animate-bubble-pop flex flex-col max-h-[90vh]">
            <header className="p-6 pb-2 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-stone-800 tracking-tight">Parent Controls</h2>
                {isParentAuthenticated && (
                  <div className="flex gap-4 mt-2 items-center">
                    <button onClick={() => setParentActiveTab('stats')} className={`text-[10px] font-black uppercase tracking-widest ${parentActiveTab === 'stats' ? 'text-green-600' : 'text-stone-400'}`}>Stats</button>
                    <button onClick={() => setParentActiveTab('settings')} className={`text-[10px] font-black uppercase tracking-widest ${parentActiveTab === 'settings' ? 'text-green-600' : 'text-stone-400'}`}>Settings</button>
                    {parentActiveTab === 'settings' && (
                      <button onClick={() => setShowHelpModal(true)} className="ml-2 w-7 h-7 bg-stone-100 rounded-full flex items-center justify-center font-black text-stone-500">?</button>
                    )}
                  </div>
                )}
              </div>
              <button onClick={() => setShowParentModal(false)} className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center font-black text-stone-400">✕</button>
            </header>

            <div className="flex-1 p-6 pt-2 overflow-y-auto">
              {!isParentAuthenticated ? (
                <PINPad 
                  correctPin={parentSettings.pin} 
                  onAuthenticated={() => setIsParentAuthenticated(true)}
                  onSetPin={(pin) => updateSettings({ ...parentSettings, pin })}
                />
              ) : (
                <div>
                  {parentActiveTab === 'stats' ? (
                    <ParentSummary stats={stats} />
                  ) : (
                    <ParentSettingsPanel 
                      settings={parentSettings} 
                      onUpdate={updateSettings}
                    />
                  )}
                  <div className="mt-8 pt-4 border-t border-stone-100 flex justify-center">
                    <button 
                      onClick={() => {
                        const newPin = prompt('Enter new 4-digit PIN:');
                        if (newPin && newPin.length === 4) updateSettings({ ...parentSettings, pin: newPin });
                      }}
                      className="text-[9px] font-black text-stone-300 uppercase tracking-widest hover:text-stone-500"
                    >
                      Change PIN
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}

      {/* Session End Overlay */}
      {showSessionEnd && (
        <div className="fixed inset-0 bg-green-500 z-[200] flex flex-col items-center justify-center p-8 text-center animate-bubble-pop">
          <div className={`w-40 h-40 ${safeTheme.headerBg} rounded-full flex items-center justify-center mb-6 shadow-2xl border-4 ${safeTheme.headerBorder}`}>
            <img src={safeTheme.mascot} alt="mascot" className="w-32 h-32 object-contain" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight" style={{ fontFamily: '"Bubblegum Sans", cursive' }}>Great job!<br/>Time for a break 🌱</h2>
          <p className="text-green-100 font-bold mb-8 opacity-80">You've reached your daily reading goal. See you next time!</p>
          <button 
            onClick={() => { recordSessionEnd(elapsedSeconds); setShowSessionEnd(false); setPendingSessionEnd(false); }}
            className="bg-white text-green-600 font-black px-8 py-3 rounded-2xl shadow-xl border-b-4 border-green-100 active:scale-95 transition-all"
          >
            I'm Done
          </button>
        </div>
      )}

      <style>{`
        @keyframes water-wobble { 0%, 100% { transform: scale(1, 1) translateY(0); } 25% { transform: scale(1.1, 0.9) translateY(1px); } 50% { transform: scale(0.9, 1.1) translateY(-1px); } 75% { transform: scale(1.05, 0.95) translateY(0.5px); } }
        .animate-water-wobble { animation: water-wobble 0.8s ease-in-out; }
        @keyframes bee-circle { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-bee-circle { animation: bee-circle linear infinite; }
        @keyframes bubble-pop { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        .animate-bubble-pop { animation: bubble-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }

        @keyframes fall-lightly {
          0% { transform: translateY(-80px); opacity: 0; }
          60% { transform: translateY(3px); opacity: 1; }
          80% { transform: translateY(-1px); }
          100% { transform: translateY(0); }
        }
        .animate-fall-lightly { animation: fall-lightly 0.8s ease-out forwards; }
        
        @keyframes bounce-light {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-bounce-light { animation: bounce-light 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
}

export default App;
