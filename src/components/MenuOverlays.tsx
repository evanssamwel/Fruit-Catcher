import React from 'react';
import { GameState, Difficulty, Language, GameStats, PlayerUpgrades } from '../types';
import { translations } from '../utils/translations';
import { Play, RotateCcw, ShoppingBag, Code, Trophy, Sparkles } from 'lucide-react';
import { BASKET_SKINS } from '../utils/gameData';

interface MenuOverlaysProps {
  gameState: GameState;
  difficulty: Difficulty;
  language: Language;
  stats: GameStats;
  upgrades: PlayerUpgrades;
  onStartGame: () => void;
  onResumeGame: () => void;
  onRestartGame: () => void;
  onSetDifficulty: (diff: Difficulty) => void;
  onSetLanguage: (lang: Language) => void;
  onOpenShop: () => void;
  onOpenCodeGuide: () => void;
}

export const MenuOverlays: React.FC<MenuOverlaysProps> = ({
  gameState,
  difficulty,
  language,
  stats,
  upgrades,
  onStartGame,
  onResumeGame,
  onRestartGame,
  onSetDifficulty,
  onSetLanguage,
  onOpenShop,
  onOpenCodeGuide,
}) => {
  const t = translations[language];

  // ==========================================
  // TITLE / MAIN MENU SCREEN
  // ==========================================
  if (gameState === 'MENU') {
    const isNewHighScore = stats.score > 0 && stats.score >= stats.highScore;
    const currentSkin = BASKET_SKINS.find((s) => s.id === upgrades.equippedSkin);

    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-5 text-center">
          {/* Logo Title */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ARCADE EDITION</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              FRUIT CATCHER
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">{t.subtitle}</p>
          </div>

          {/* High Score Banner */}
          <div className="flex items-center justify-center gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800/80">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">{t.highScore}</div>
              <div className="font-mono tabular-nums text-lg font-bold text-amber-400">
                {stats.highScore.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs text-slate-400 font-medium">Difficulty Mode</label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              {(['CASUAL', 'NORMAL', 'ARCADE'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => onSetDifficulty(d)}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
                    difficulty === d
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Rules Overview */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-xs text-slate-400 space-y-1 text-left">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <span>🍎 Catch fruits for points & combos</span>
            </div>
            <div className="flex items-center gap-2 text-rose-300 font-medium">
              <span>💣 Dodge bombs, thunder & poison</span>
            </div>
            <div className="flex items-center gap-2 text-amber-300 font-medium">
              <span>🪙 Collect coins to buy upgrades</span>
            </div>
          </div>

          {/* Primary Action: Start Game */}
          <button
            onClick={onStartGame}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-98 text-slate-950 font-extrabold text-base rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            {t.play}
          </button>

          {/* Secondary Actions: Shop & Language & Alternative Code */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
            <button
              onClick={onOpenShop}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>{t.shop}</span>
            </button>

            <button
              onClick={onOpenCodeGuide}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
            >
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Python / JS Code</span>
            </button>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <span>{t.languageSelect}:</span>
            <select
              value={language}
              onChange={(e) => onSetLanguage(e.target.value as Language)}
              aria-label="Language selector"
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAUSE SCREEN OVERLAY
  // ==========================================
  if (gameState === 'PAUSED') {
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight">{t.pause}</h2>
          <p className="text-xs text-slate-400">Press P or Esc to resume</p>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={onResumeGame}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              {t.resume}
            </button>

            <button
              onClick={onRestartGame}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t.restart}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>{t.languageSelect}</span>
            <select
              value={language}
              onChange={(e) => onSetLanguage(e.target.value as Language)}
              aria-label="Language selector"
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // GAME OVER SCREEN OVERLAY
  // ==========================================
  if (gameState === 'GAMEOVER') {
    const isNewHighScore = stats.score > 0 && stats.score >= stats.highScore;

    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-5 text-center">
          {/* Header */}
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-rose-500 font-display tracking-tight">
              {t.gameOver}
            </div>
            {isNewHighScore && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold animate-bounce">
                <Trophy className="w-3.5 h-3.5" />
                <span>{t.newHighScore}</span>
              </div>
            )}
          </div>

          {/* Primary Final Score Display */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 uppercase tracking-wider">{t.score}</div>
            <div className="font-mono tabular-nums text-4xl font-black text-white tracking-tight my-1">
              {stats.score.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">
              {t.highScore}:{' '}
              <span className="font-mono tabular-nums text-slate-300 font-semibold">
                {stats.highScore.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <div className="text-[11px] text-slate-500">{t.level} Reached</div>
              <div className="font-mono tabular-nums text-base font-bold text-slate-200">
                {stats.level}
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <div className="text-[11px] text-slate-500">{t.maxCombo}</div>
              <div className="font-mono tabular-nums text-base font-bold text-amber-400">
                {stats.maxCombo}x
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <div className="text-[11px] text-slate-500">{t.fruitsCaught}</div>
              <div className="font-mono tabular-nums text-base font-bold text-emerald-400">
                {stats.fruitsCaught}
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
              <div className="text-[11px] text-slate-500">Coins Earned</div>
              <div className="font-mono tabular-nums text-base font-bold text-amber-400">
                +{stats.coinsRun} 🪙
              </div>
            </div>
          </div>

          {/* Primary Restart Action */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={onRestartGame}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-98 text-slate-950 font-bold text-base rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              {t.restart}
            </button>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={onOpenShop}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>{t.shop}</span>
              </button>

              <button
                onClick={onOpenCodeGuide}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Code className="w-4 h-4 text-emerald-400" />
                <span>Other Languages</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
