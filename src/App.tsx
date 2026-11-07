import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Difficulty, Language, GameStats, PlayerUpgrades, BasketSkin } from './types';
import { translations } from './utils/translations';
import { ArcadeCanvas } from './components/ArcadeCanvas';
import { HUD } from './components/HUD';
import { MenuOverlays } from './components/MenuOverlays';
import { ShopModal } from './components/ShopModal';
import { CodeLanguageModal } from './components/CodeLanguageModal';
import { GAME_LEVELS } from './utils/gameData';
import { sound } from './utils/audio';
import { ShoppingBag, Code, HelpCircle, Trophy } from 'lucide-react';

const STORAGE_KEY_HIGH_SCORE = 'fruit_catcher_high_score_v1';
const STORAGE_KEY_COINS = 'fruit_catcher_coins_v1';
const STORAGE_KEY_UPGRADES = 'fruit_catcher_upgrades_v1';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [difficulty, setDifficulty] = useState<Difficulty>('NORMAL');
  const [language, setLanguage] = useState<Language>('en');

  // Modals
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  // Level Up Toast
  const [levelUpToast, setLevelUpToast] = useState<string | null>(null);

  // Mobile Touch Direction: -1 left, 1 right, 0 none
  const [touchDir, setTouchDir] = useState<number>(0);

  // Persistent upgrades state
  const [upgrades, setUpgrades] = useState<PlayerUpgrades>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UPGRADES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      extraHearts: 0,
      magnetLevel: 0,
      speedLevel: 0,
      shieldActive: false,
      equippedSkin: 'CLASSIC',
      unlockedSkins: ['CLASSIC'],
    };
  });

  // Game stats
  const [stats, setStats] = useState<GameStats>(() => {
    const savedHighScore = parseInt(localStorage.getItem(STORAGE_KEY_HIGH_SCORE) || '0', 10);
    const savedCoins = parseInt(localStorage.getItem(STORAGE_KEY_COINS) || '0', 10);
    return {
      score: 0,
      highScore: isNaN(savedHighScore) ? 0 : savedHighScore,
      coins: isNaN(savedCoins) ? 0 : savedCoins,
      coinsRun: 0,
      lives: 3,
      maxLives: 3,
      level: 1,
      combo: 0,
      maxCombo: 0,
      feverTimeLeft: 0,
      fruitsCaught: 0,
      bombsDodged: 0,
      hazardHits: 0,
      shieldRemaining: 0,
    };
  });

  // Save upgrades and coins to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_UPGRADES, JSON.stringify(upgrades));
    } catch {
      // ignore
    }
  }, [upgrades]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COINS, stats.coins.toString());
    } catch {
      // ignore
    }
  }, [stats.coins]);

  // Fever Mode countdown timer
  useEffect(() => {
    if (stats.feverTimeLeft <= 0 || gameState !== 'PLAYING') return;
    const timer = setInterval(() => {
      setStats((prev) => {
        const nextTime = Math.max(0, prev.feverTimeLeft - 0.2);
        return { ...prev, feverTimeLeft: nextTime };
      });
    }, 200);
    return () => clearInterval(timer);
  }, [stats.feverTimeLeft, gameState]);

  // Start or restart game
  const handleStartGame = useCallback(() => {
    const baseLives = difficulty === 'CASUAL' ? 4 : difficulty === 'ARCADE' ? 2 : 3;
    const totalLives = baseLives + upgrades.extraHearts;

    setStats((prev) => ({
      ...prev,
      score: 0,
      coinsRun: 0,
      lives: totalLives,
      maxLives: totalLives,
      level: 1,
      combo: 0,
      maxCombo: 0,
      feverTimeLeft: 0,
      fruitsCaught: 0,
      bombsDodged: 0,
      hazardHits: 0,
      shieldRemaining: upgrades.shieldActive ? 1 : 0,
    }));

    setLevelUpToast(null);
    setGameState('PLAYING');
  }, [difficulty, upgrades]);

  const handleResumeGame = useCallback(() => {
    setGameState('PLAYING');
  }, []);

  const handleTogglePause = useCallback(() => {
    if (gameState === 'PLAYING') {
      setGameState('PAUSED');
    } else if (gameState === 'PAUSED') {
      setGameState('PLAYING');
    }
  }, [gameState]);

  // Keyboard shortcut for pause / resume
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        if (gameState === 'PLAYING' || gameState === 'PAUSED') {
          handleTogglePause();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleTogglePause]);

  // Catch fruit handler
  const handleCatchFruit = useCallback((points: number) => {
    setStats((prev) => {
      const newScore = prev.score + points;
      const newCombo = prev.combo + 1;
      const newMaxCombo = Math.max(prev.maxCombo, newCombo);
      const newFruitsCaught = prev.fruitsCaught + 1;

      // Check for Fever Mode activation at combo 5
      let feverTime = prev.feverTimeLeft;
      if (newCombo >= 5 && feverTime <= 0) {
        feverTime = 6.0; // 6 seconds of fever mode
        sound.playFever();
      }

      // Check for level advancement
      let currentLevel = prev.level;
      if (currentLevel < GAME_LEVELS.length) {
        const nextLevelConfig = GAME_LEVELS[currentLevel];
        if (newScore >= nextLevelConfig.requiredScore) {
          currentLevel += 1;
          sound.playLevelUp();
          const levelName = translations[language].levelNames[nextLevelConfig.nameKey] || `Level ${currentLevel}`;
          setLevelUpToast(levelName);
          setTimeout(() => setLevelUpToast(null), 3500);
        }
      }

      // High Score update
      let newHighScore = prev.highScore;
      if (newScore > newHighScore) {
        newHighScore = newScore;
        try {
          localStorage.setItem(STORAGE_KEY_HIGH_SCORE, newHighScore.toString());
        } catch {
          // ignore
        }
      }

      return {
        ...prev,
        score: newScore,
        highScore: newHighScore,
        combo: newCombo,
        maxCombo: newMaxCombo,
        fruitsCaught: newFruitsCaught,
        level: currentLevel,
        feverTimeLeft: feverTime,
      };
    });
  }, [language]);

  // Collect coin handler
  const handleCollectCoin = useCallback((coinsAmount: number, points: number) => {
    setStats((prev) => {
      const newScore = prev.score + points;
      const newCoins = prev.coins + coinsAmount;
      const newCoinsRun = prev.coinsRun + coinsAmount;

      let newHighScore = prev.highScore;
      if (newScore > newHighScore) {
        newHighScore = newScore;
        try {
          localStorage.setItem(STORAGE_KEY_HIGH_SCORE, newHighScore.toString());
        } catch {
          // ignore
        }
      }

      return {
        ...prev,
        score: newScore,
        highScore: newHighScore,
        coins: newCoins,
        coinsRun: newCoinsRun,
      };
    });
  }, []);

  // Hit hazard handler
  const handleHitHazard = useCallback((type: 'BOMB' | 'THUNDER' | 'POISON') => {
    setStats((prev) => {
      // Break combo
      const newCombo = 0;
      const newHazardHits = prev.hazardHits + 1;

      if (type === 'BOMB') {
        // Check if player has deflector shield
        if (prev.shieldRemaining > 0) {
          // Shield absorbs the bomb!
          return {
            ...prev,
            shieldRemaining: 0,
            combo: 0,
            bombsDodged: prev.bombsDodged + 1,
          };
        }

        const newLives = prev.lives - 1;
        if (newLives <= 0) {
          sound.playGameOver();
          setGameState('GAMEOVER');
          return {
            ...prev,
            lives: 0,
            combo: 0,
            hazardHits: newHazardHits,
          };
        }

        return {
          ...prev,
          lives: newLives,
          combo: 0,
          hazardHits: newHazardHits,
        };
      }

      if (type === 'POISON') {
        const newScore = Math.max(0, prev.score - 25);
        return {
          ...prev,
          score: newScore,
          combo: 0,
          hazardHits: newHazardHits,
        };
      }

      // THUNDER: shock slowing is handled in canvas physics
      return {
        ...prev,
        combo: 0,
        hazardHits: newHazardHits,
      };
    });
  }, []);

  // Heal life handler
  const handleHealLife = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      lives: Math.min(prev.maxLives, prev.lives + 1),
    }));
  }, []);

  // Miss fruit handler
  const onMissFruit = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      combo: 0, // miss resets combo
    }));
  }, []);

  // Shop upgrade purchase
  const handleBuyUpgrade = (upgradeId: string, cost: number) => {
    setStats((prev) => ({ ...prev, coins: prev.coins - cost }));
    setUpgrades((prev) => {
      if (upgradeId === 'extraHearts') {
        return { ...prev, extraHearts: prev.extraHearts + 1 };
      }
      if (upgradeId === 'magnet') {
        return { ...prev, magnetLevel: prev.magnetLevel + 1 };
      }
      if (upgradeId === 'speed') {
        return { ...prev, speedLevel: prev.speedLevel + 1 };
      }
      if (upgradeId === 'shield') {
        return { ...prev, shieldActive: true };
      }
      return prev;
    });
  };

  const handleUnlockSkin = (skinId: BasketSkin, cost: number) => {
    setStats((prev) => ({ ...prev, coins: prev.coins - cost }));
    setUpgrades((prev) => ({
      ...prev,
      unlockedSkins: [...prev.unlockedSkins, skinId],
      equippedSkin: skinId,
    }));
  };

  const handleEquipSkin = (skinId: BasketSkin) => {
    setUpgrades((prev) => ({ ...prev, equippedSkin: skinId }));
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* ============================================================== */}
      {/* TOP BAR CONTRACT: Brand Wordmark — 3 Clean Nav Links — 1 Action */}
      {/* ============================================================== */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => setGameState('MENU')}
          className="text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 font-display flex items-center gap-2"
        >
          <span>🍎</span>
          <span>Fruit Catcher Arcade</span>
        </button>

        {/* Zone 2: 3 Concise Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button
            onClick={() => setIsShopOpen(true)}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.shop}</span>
          </button>
          <button
            onClick={() => setIsCodeModalOpen(true)}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Code className="w-3.5 h-3.5 text-emerald-400" />
            <span>Python & JS Code</span>
          </button>
          <button
            onClick={() => setIsHowToPlayOpen(true)}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>{t.howToPlay}</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-amber-400 font-mono tabular-nums text-xs">
            <Trophy className="w-3.5 h-3.5" />
            <span>{stats.highScore.toLocaleString()}</span>
          </div>

          {gameState === 'PLAYING' ? (
            <button
              onClick={handleTogglePause}
              className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {t.pause}
            </button>
          ) : (
            <button
              onClick={handleStartGame}
              className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {gameState === 'GAMEOVER' ? t.restart : t.play}
            </button>
          )}
        </div>
      </header>

      {/* Main Playing Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-3 sm:p-5 max-w-4xl mx-auto w-full relative">
        {/* Level Up Celebratory Toast */}
        {levelUpToast && (
          <div className="absolute top-16 z-30 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm rounded-full shadow-xl animate-bounce tracking-wide flex items-center gap-2">
            <span>✨</span>
            <span>{levelUpToast.toUpperCase()}! SPEED INCREASED!</span>
            <span>🚀</span>
          </div>
        )}

        {/* In-Game Heads-Up Display */}
        <HUD
          stats={stats}
          isPaused={gameState === 'PAUSED'}
          isPlaying={gameState === 'PLAYING'}
          language={language}
          onTogglePause={handleTogglePause}
          onOpenShop={() => setIsShopOpen(true)}
          onTouchMove={(dir) => setTouchDir(dir)}
        />

        {/* HTML5 Canvas Game Frame */}
        <div className="relative mt-2 w-full flex justify-center">
          <ArcadeCanvas
            isPlaying={gameState === 'PLAYING'}
            isPaused={gameState === 'PAUSED'}
            difficulty={difficulty}
            upgrades={upgrades}
            level={stats.level}
            combo={stats.combo}
            isFever={stats.feverTimeLeft > 0}
            onCatchFruit={handleCatchFruit}
            onCollectCoin={handleCollectCoin}
            onHitHazard={handleHitHazard}
            onHealLife={handleHealLife}
            onMissFruit={onMissFruit}
            touchMoveDir={touchDir}
          />

          {/* Menus and Overlays */}
          <MenuOverlays
            gameState={gameState}
            difficulty={difficulty}
            language={language}
            stats={stats}
            upgrades={upgrades}
            onStartGame={handleStartGame}
            onResumeGame={handleResumeGame}
            onRestartGame={handleStartGame}
            onSetDifficulty={setDifficulty}
            onSetLanguage={setLanguage}
            onOpenShop={() => setIsShopOpen(true)}
            onOpenCodeGuide={() => setIsCodeModalOpen(true)}
          />
        </div>

        {/* Clean Unboxed Footer Metadata with Typographic Separators */}
        <footer className="w-full mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 px-2 py-3 border-t border-slate-900">
          <div className="flex items-center gap-2">
            <span>Arrow Keys / A & D to Move</span>
            <span aria-hidden="true">·</span>
            <span>Space / P to Pause</span>
            <span aria-hidden="true">·</span>
            <span>Mouse Drag Supported</span>
          </div>

          <div className="flex items-center gap-2">
            <span>60 FPS Canvas Engine</span>
            <span aria-hidden="true">·</span>
            <span>Web Audio Synthesizer</span>
          </div>
        </footer>
      </main>

      {/* Shop Modal */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        coins={stats.coins}
        upgrades={upgrades}
        language={language}
        onBuyUpgrade={handleBuyUpgrade}
        onUnlockSkin={handleUnlockSkin}
        onEquipSkin={handleEquipSkin}
      />

      {/* Alternative Languages Code Modal */}
      <CodeLanguageModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      {/* How To Play Modal */}
      {isHowToPlayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <h2 className="text-lg font-bold text-white tracking-tight">{t.howToPlay}</h2>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-emerald-400 block mb-1">🧺 Basket Controls:</strong>
                Use <strong>Left / Right Arrow keys</strong>, <strong>A / D keys</strong>, move your
                mouse cursor over the canvas, or press the on-screen touch buttons on mobile.
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-amber-400 block mb-1">🍎 Catch Fruits & Coins:</strong>
                Apples (+10), Bananas (+15), Oranges (+20), Strawberries (+25), Watermelons (+35),
                Grapes (+40), Pineapples (+50), Star Fruits (+100). Coins (+50 pts & +1 🪙).
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-rose-400 block mb-1">💣 Danger & Hazards:</strong>
                Avoid black bombs (-1 life), thunder clouds (slows down basket speed for 3 seconds),
                and poison potions (-25 points and breaks combo streak).
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-yellow-400 block mb-1">🔥 Fever Mode:</strong>
                Catch 5 consecutive fruits without missing to activate 5x Fever Mode score multiplier!
              </div>
            </div>

            <button
              onClick={() => setIsHowToPlayOpen(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors"
            >
              Got it, let's play!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
