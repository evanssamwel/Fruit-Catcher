import { FruitType, HazardType, CollectibleType, LevelConfig, ShopUpgrade } from '../types';

export interface FruitDefinition {
  type: FruitType;
  name: string;
  points: number;
  color: string;
  juiceColor: string;
  radius: number;
  weight: number; // spawn probability weight
  minLevel: number;
}

export const FRUIT_CATALOG: FruitDefinition[] = [
  {
    type: 'APPLE',
    name: 'Apple',
    points: 10,
    color: '#EF4444',
    juiceColor: '#F87171',
    radius: 20,
    weight: 35,
    minLevel: 1,
  },
  {
    type: 'BANANA',
    name: 'Banana',
    points: 15,
    color: '#FACC15',
    juiceColor: '#FEF08A',
    radius: 21,
    weight: 30,
    minLevel: 1,
  },
  {
    type: 'ORANGE',
    name: 'Orange',
    points: 20,
    color: '#F97316',
    juiceColor: '#FED7AA',
    radius: 22,
    weight: 25,
    minLevel: 1,
  },
  {
    type: 'STRAWBERRY',
    name: 'Strawberry',
    points: 25,
    color: '#E11D48',
    juiceColor: '#FDA4AF',
    radius: 19,
    weight: 20,
    minLevel: 2,
  },
  {
    type: 'WATERMELON',
    name: 'Watermelon',
    points: 35,
    color: '#059669',
    juiceColor: '#FB7185',
    radius: 26,
    weight: 18,
    minLevel: 2,
  },
  {
    type: 'GRAPES',
    name: 'Grapes',
    points: 40,
    color: '#7C3AED',
    juiceColor: '#C4B5FD',
    radius: 22,
    weight: 15,
    minLevel: 3,
  },
  {
    type: 'PINEAPPLE',
    name: 'Pineapple',
    points: 50,
    color: '#D97706',
    juiceColor: '#FDE68A',
    radius: 25,
    weight: 12,
    minLevel: 3,
  },
  {
    type: 'STARFRUIT',
    name: 'Star Fruit',
    points: 100,
    color: '#EAB308',
    juiceColor: '#FEF9C3',
    radius: 24,
    weight: 6,
    minLevel: 4,
  },
];

export interface HazardDefinition {
  type: HazardType;
  name: string;
  color: string;
  radius: number;
}

export const HAZARDS: HazardDefinition[] = [
  { type: 'BOMB', name: 'Bomb', color: '#1E293B', radius: 22 },
  { type: 'THUNDER', name: 'Thunder Cloud', color: '#0284C7', radius: 23 },
  { type: 'POISON', name: 'Poison Potion', color: '#7E22CE', radius: 20 },
];

export interface CollectibleDefinition {
  type: CollectibleType;
  name: string;
  points: number;
  coinValue: number;
  color: string;
  radius: number;
}

export const COLLECTIBLES: CollectibleDefinition[] = [
  { type: 'COIN', name: 'Gold Coin', points: 50, coinValue: 1, color: '#FBBF24', radius: 18 },
  { type: 'GEM', name: 'Arcade Gem', points: 150, coinValue: 3, color: '#38BDF8', radius: 18 },
  { type: 'HEART', name: 'Heart', points: 20, coinValue: 0, color: '#F43F5E', radius: 20 },
];

export const GAME_LEVELS: LevelConfig[] = [
  {
    level: 1,
    nameKey: 'orchardDawn',
    requiredScore: 0,
    speedMultiplier: 1.0,
    spawnInterval: 1050,
    hazardChance: 0.12,
    bonusChance: 0.12,
    bgGradientTop: '#0F172A',
    bgGradientBottom: '#14532D',
  },
  {
    level: 2,
    nameKey: 'citrusGrove',
    requiredScore: 350,
    speedMultiplier: 1.25,
    spawnInterval: 920,
    hazardChance: 0.18,
    bonusChance: 0.14,
    bgGradientTop: '#0F172A',
    bgGradientBottom: '#78350F',
  },
  {
    level: 3,
    nameKey: 'tropicalRush',
    requiredScore: 900,
    speedMultiplier: 1.55,
    spawnInterval: 800,
    hazardChance: 0.23,
    bonusChance: 0.16,
    bgGradientTop: '#0F172A',
    bgGradientBottom: '#1E3A8A',
  },
  {
    level: 4,
    nameKey: 'volcanoHarvest',
    requiredScore: 1800,
    speedMultiplier: 1.9,
    spawnInterval: 680,
    hazardChance: 0.28,
    bonusChance: 0.18,
    bgGradientTop: '#18181B',
    bgGradientBottom: '#7F1D1D',
  },
  {
    level: 5,
    nameKey: 'cosmicFrenzy',
    requiredScore: 3200,
    speedMultiplier: 2.3,
    spawnInterval: 540,
    hazardChance: 0.33,
    bonusChance: 0.22,
    bgGradientTop: '#09090B',
    bgGradientBottom: '#4C1D95',
  },
];

export const SHOP_UPGRADES: ShopUpgrade[] = [
  {
    id: 'extraHearts',
    nameKey: 'extraHearts',
    descKey: 'extraHearts',
    icon: '❤️',
    cost: 15,
    level: 0,
    maxLevel: 2,
  },
  {
    id: 'magnet',
    nameKey: 'magnet',
    descKey: 'magnet',
    icon: '🧲',
    cost: 20,
    level: 0,
    maxLevel: 3,
  },
  {
    id: 'speed',
    nameKey: 'speed',
    descKey: 'speed',
    icon: '⚡',
    cost: 12,
    level: 0,
    maxLevel: 3,
  },
  {
    id: 'shield',
    nameKey: 'shield',
    descKey: 'shield',
    icon: '🛡️',
    cost: 25,
    level: 0,
    maxLevel: 1,
  },
];

export const BASKET_SKINS = [
  { id: 'CLASSIC', nameKey: 'CLASSIC', cost: 0, description: 'Handcrafted woven wicker basket' },
  { id: 'GOLDEN', nameKey: 'GOLDEN', cost: 30, description: 'Gleaming 24k harvest basket with radiant shine' },
  { id: 'CYBER', nameKey: 'CYBER', cost: 50, description: 'Neon grid collector with pulse edges' },
  { id: 'BAMBOO', nameKey: 'BAMBOO', cost: 40, description: 'Smooth polished organic zen bamboo wood' },
] as const;
