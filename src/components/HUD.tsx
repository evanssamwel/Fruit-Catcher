import React from 'react';
import { GameStats, Language } from '../types';
import { translations } from '../utils/translations';
import { Heart, Pause, Play, Volume2, VolumeX, Flame } from 'lucide-react';
import { sound } from '../utils/audio';

interface HUDProps {
  stats: GameStats;
  isPaused: boolean;
  isPlaying: boolean;
  language: Language;
  onTogglePause: () => void;
  onOpenShop: () => void;
  onTouchMove: (dir: number) => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  isPaused,
  isPlaying,
  language,
  onTogglePause,
  onTouchMove,
}) => {
  const t = translations[language];
  const [isMuted, setIsMuted] = React.useState(sound.getMuted());

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  if (!isPlaying) return null;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-2.5 px-2">
      {/* Top Main Arcade Stats Bar */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 text-sm">
        {/* Lives / Hearts */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">{t.lives}:</span>
          {Array.from({ length: stats.maxLives }).map((_, idx) => (
            <Heart
              key={idx}
              className={`w-5 h-5 transition-transform ${
                idx < stats.lives
                  ? 'text-rose-500 fill-rose-500 scale-100'
                  : 'text-slate-700 fill-transparent scale-90'
              }`}
            />
          ))}
          {stats.shieldRemaining > 0 && (
            <span className="text-xs text-sky-400 font-medium ml-1">🛡️</span>
          )}
        </div>

        {/* Level & Combo & Fever */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="font-medium text-slate-200">
            {t.level} <span className="font-mono tabular-nums text-emerald-400">{stats.level}</span>
          </span>
          <span aria-hidden="true" className="text-slate-700">·</span>

          {/* Combo Badge */}
          <div className="flex items-center gap-1">
            <Flame className={`w-3.5 h-3.5 ${stats.combo > 1 ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`} />
            <span className={`font-mono tabular-nums ${stats.combo > 1 ? 'text-amber-300 font-bold' : 'text-slate-500'}`}>
              x{Math.max(1, stats.combo)}
            </span>
            {stats.feverTimeLeft > 0 && (
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider ml-1 animate-pulse">
                {t.fever}
              </span>
            )}
          </div>
        </div>

        {/* Score & Coins */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1 text-amber-400 font-mono tabular-nums text-xs font-semibold">
            <span>🪙</span>
            <span>{stats.coins}</span>
          </div>

          <div className="flex items-center gap-1.5 text-right">
            <span className="text-xs text-slate-400 hidden sm:inline">{t.score}:</span>
            <span className="font-mono tabular-nums text-lg font-bold text-white tracking-tight">
              {stats.score.toLocaleString()}
            </span>
          </div>

          {/* Controls: Pause & Audio */}
          <div className="flex items-center gap-1 border-l border-slate-800 pl-3">
            <button
              onClick={handleToggleSound}
              aria-label="Toggle sound"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onTogglePause}
              aria-label={isPaused ? t.resume : t.pause}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* On-screen touch controls for tablets and smartphones */}
      <div className="flex sm:hidden items-center justify-between gap-4 px-2 pt-1">
        <button
          onTouchStart={() => onTouchMove(-1)}
          onTouchEnd={() => onTouchMove(0)}
          onMouseDown={() => onTouchMove(-1)}
          onMouseUp={() => onTouchMove(0)}
          className="flex-1 py-3 bg-slate-800/80 active:bg-slate-700 rounded-xl text-center font-bold text-slate-300 text-lg border border-slate-700/60 active:scale-98 transition-all touch-none select-none"
        >
          ◀ LEFT
        </button>
        <button
          onTouchStart={() => onTouchMove(1)}
          onTouchEnd={() => onTouchMove(0)}
          onMouseDown={() => onTouchMove(1)}
          onMouseUp={() => onTouchMove(0)}
          className="flex-1 py-3 bg-slate-800/80 active:bg-slate-700 rounded-xl text-center font-bold text-slate-300 text-lg border border-slate-700/60 active:scale-98 transition-all touch-none select-none"
        >
          RIGHT ▶
        </button>
      </div>
    </div>
  );
};
