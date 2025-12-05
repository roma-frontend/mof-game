'use client';

import React, { useState } from 'react';
import { X, Check, HelpCircle, RefreshCw, Clock } from 'lucide-react';
import { useSound } from '@/lib/sounds/soundManager';

interface PuzzlePanelProps {
  puzzleName: string;
  onSolved: (points: number) => void;
  onSkip: () => void;
}

const puzzles: Record<string, any> = {
  'calendar': {
    title: '📅 Օրացույցի Գաղտնագիրը',
    description: 'Հունվարից սկսած՝ յուրաքանչյուր ամսվա անվան առաջին տառի համարի գումարը:',
    question: 'Գումարեք ամիսների առաջին տառերի համարները հայերեն այբուբենում:',
    solution: '123',
    hints: [
      'Հունվար - Հ տառը 24-րդն է',
      'Փետրվար - Փ տառը 35-րդն է',
      'Մարտ - Մ տառը 20-րդն է'
    ]
  },
  'computer': {
    title: '💻 Համակարգչի Պարոլը',
    description: 'Համակարգչի էկրանին գրված է «Ամանոր Նոր Տարի Հաջողություն»:',
    question: 'Օգտագործեք բառերի առաջին տառերը և ստացեք կոդը:',
    solution: 'ԱՆՀ',
    hints: [
      'Առաջին բառը՝ Ամանոր',
      'Երկրորդ բառը՝ Նոր',
      'Երրորդ բառը՝ Հաջողություն'
    ]
  },
  'safe': {
    title: '🔒 Գաղտնարանի Կոդը',
    description: 'Գաղտնարանը բացվում է նոր տարվա թվով:',
    question: 'Ո՞րն է գալիք տարվա թիվը:',
    solution: '2024',
    hints: [
      'Դա չորս թվանշան է',
      'Կապված է տարվա հետ',
      'Նոր տարին է'
    ]
  }
};

export const PuzzlePanel: React.FC<PuzzlePanelProps> = ({ puzzleName, onSolved, onSkip }) => {
  const [answer, setAnswer] = useState('');
  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const sound = useSound();
  const puzzle = puzzles[puzzleName] || puzzles.calendar;

  const handleSubmit = () => {
    if (answer.trim().toUpperCase() === puzzle.solution.toUpperCase()) {
      const points = 100 - (attempts * 10);
      sound.playPuzzleSolved();
      onSolved(Math.max(points, 50));
    } else {
      setAttempts(prev => prev + 1);
      sound.playError();
      alert('Սխալ պատասխան: Փորձեք կրկին');
    }
  };

  const handleShowHint = () => {
    if (hintIndex < puzzle.hints.length) {
      setShowHint(true);
      setHintIndex(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setAnswer('');
    setShowHint(false);
    setAttempts(0);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl p-8 max-w-2xl w-full border-2 border-white/20 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{puzzle.title}</h2>
            <p className="text-white/60">{puzzle.description}</p>
          </div>
          <button
            onClick={onSkip}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg"
          >
            <X className="w-6 h-6 text-red-400" />
          </button>
        </div>

        {/* Հարց */}
        <div className="bg-white/10 rounded-xl p-6 mb-6">
          <div className="text-white text-lg mb-4">{puzzle.question}</div>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Clock className="w-4 h-4" />
            <span>Մոտավոր ժամանակ: 3 րոպե</span>
          </div>
        </div>

        {/* Պատասխանի դաշտ */}
        <div className="mb-6">
          <label className="block text-white/80 text-sm mb-2">Ձեր Պատասխանը</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-6 py-4 text-white text-xl focus:outline-none focus:border-blue-500"
            placeholder="Մուտքագրեք պատասխանը..."
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        {/* Հուշում */}
        {showHint && (
          <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 rounded-xl p-4 mb-6 border border-yellow-500/30">
            <div className="flex items-center gap-2 text-yellow-300 mb-2">
              <HelpCircle className="w-5 h-5" />
              <span className="font-bold">Հուշում #{hintIndex}</span>
            </div>
            <div className="text-white/80">{puzzle.hints[hintIndex - 1]}</div>
          </div>
        )}

        {/* Վիճակագրություն */}
        <div className="flex items-center justify-between text-white/60 text-sm mb-6">
          <div>Փորձեր: <span className="text-white">{attempts}</span></div>
          <div>Հուշումներ: <span className="text-white">{hintIndex}/{puzzle.hints.length}</span></div>
          <div>Միավորներ: <span className="text-yellow-400">{100 - (attempts * 10)}</span></div>
        </div>

        {/* Գործողությունների կոճակներ */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={handleReset}
            className="py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Ջնջել
          </button>
          
          <button
            onClick={handleShowHint}
            disabled={hintIndex >= puzzle.hints.length}
            className={`py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              hintIndex >= puzzle.hints.length
                ? 'bg-gray-700/30 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            Հուշում ({hintIndex}/{puzzle.hints.length})
          </button>
          
          <button
            onClick={handleSubmit}
            className="py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Ստուգել
          </button>
        </div>

        {/* Հուշումներ */}
        <div className="mt-6 text-center text-white/40 text-sm">
          💡 Ամեն ճիշտ պատասխանից ստանում եք 100 միավոր, ամեն սխալ պատասխանից հանվում է 10 միավոր
        </div>
      </div>
    </div>
  );
};