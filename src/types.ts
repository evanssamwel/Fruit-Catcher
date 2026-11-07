export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

export type Difficulty = 'CASUAL' | 'NORMAL' | 'ARCADE';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'sw';

export type FruitType = 
  | 'APPLE' 
  | 'BANANA' 
  | 'ORANGE' 
  | 'STRAWBERRY' 
  | 'WATERMELON' 
  | 'PINEAPPLE' 
  | 'GRAPES' 
  | 'STARFRUIT';

export type HazardType = 'BOMB' | 'THUNDER' | 'POISON';

export type CollectibleType = 'COIN' | 'GEM' | 'HEART';

export type ItemType = FruitType | HazardType | CollectibleType;

export type BasketSkin = 'CLASSIC' | 'GOLDEN' | 'CYBER' | 'BAMBOO';

export interface GameItem {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: ItemType;
  category: 'FRUIT' | 'HAZARD' | 'COLLECTIBLE';
  points: number;
  coinValue: number;
  rotation: number;
  rotSpeed: number;
  color: string;
  name: string;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  alpha: number;
  decay: number;
  shape: 'circle' | 'spark' | 'smoke' | 'slice' | 'star';
  rotation: number;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
  scale: number;
}

export interface LevelConfig {
  level: number;
  nameKey: string;
  requiredScore: number;
  speedMultiplier: number;
  spawnInterval: number; // ms between spawns
  hazardChance: number; // 0.0 to 1.0
  bonusChance: number;
  bgGradientTop: string;
  bgGradientBottom: string;
}

export interface ShopUpgrade {
  id: string;
  nameKey: string;
  descKey: string;
  icon: string;
  cost: number;
  level: number;
  maxLevel: number;
}

export interface PlayerUpgrades {
  extraHearts: number;
  magnetLevel: number;
  speedLevel: number;
  shieldActive: boolean;
  equippedSkin: BasketSkin;
  unlockedSkins: BasketSkin[];
}

export interface GameStats {
  score: number;
  highScore: number;
  coins: number;
  coinsRun: number;
  lives: number;
  maxLives: number;
  level: number;
  combo: number;
  maxCombo: number;
  feverTimeLeft: number; // seconds
  fruitsCaught: number;
  bombsDodged: number;
  hazardHits: number;
  shieldRemaining: number;
}
