import React, { useEffect, useState } from 'react';

export default function HelpModal({ onClose }) {
  const [tab, setTab] = useState('parents');

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose && onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-stone-900/40" onClick={() => onClose && onClose()} />
      <div className="relative z-10 w-[92%] max-w-2xl bg-white rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-black">Help</h3>
          <button onClick={() => onClose && onClose()} className="w-9 h-9 bg-stone-100 rounded-full flex items-center justify-center font-black text-stone-500">✕</button>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('parents')} className={`px-3 py-1 rounded-full font-black ${tab === 'parents' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>For Parents</button>
          <button onClick={() => setTab('kids')} className={`px-3 py-1 rounded-full font-black ${tab === 'kids' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>For Kids</button>
        </div>

        <div className="text-stone-700 leading-relaxed text-[15px]">
          {tab === 'parents' ? (
            <div className="space-y-3">
              <h4 className="font-bold text-lg">What Science Sprouts is</h4>
              <p>Quick, playful reading practice that builds confidence — one tiny win at a time.</p>

              <h4 className="font-bold">How to run a session</h4>
              <ul className="list-disc ml-5">
                <li>Pick a game (Science Vocab, Mini Labs, or Discovery Garden).</li>
                <li>Choose a difficulty. Start easier than you think — momentum beats struggle.</li>
                <li>Optional: set a timer, then press Start.</li>
              </ul>

              <h4 className="font-bold">Difficulty tips</h4>
              <ul className="list-disc ml-5">
                <li><b>Beginner</b>: simple words + high success.</li>
                <li><b>Intermediate</b>: longer words + trickier choices.</li>
                <li><b>Advanced</b>: big words + tougher distractors.</li>
              </ul>

              <h4 className="font-bold">Support tips</h4>
              <ul className="list-disc ml-5">
                <li>Read the prompt out loud if your child is still decoding.</li>
                <li>Ask: “How did you know?” to build reasoning (not just guessing).</li>
                <li>If frustration rises: shorten the session and celebrate finishing.</li>
              </ul>

              <h4 className="font-bold">Motivation</h4>
              <ul className="list-disc ml-5">
                <li>Praise consistency over score.</li>
                <li>Stop while it’s still fun — leave them wanting one more.</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-3 text-[16px]">
              <h4 className="font-bold">What to do</h4>
              <ul className="list-disc ml-5">
                <li>Pick a game, try your best, and tap the answer that matches.</li>
              </ul>

              <h4 className="font-bold">It’s okay to be wrong</h4>
              <ul className="list-disc ml-5">
                <li>Mistakes help your brain grow.</li>
              </ul>

              <h4 className="font-bold">Quick tips</h4>
              <ul className="list-disc ml-5">
                <li>Take your time — sound it out slowly if you want.</li>
                <li>If it feels hard, ask a grown-up for help.</li>
              </ul>

              <h4 className="font-bold">Encouragement</h4>
              <p>Every day you practice, you get stronger at reading.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
