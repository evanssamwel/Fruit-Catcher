import { Language } from '../types';

export interface TranslationDictionary {
  title: string;
  subtitle: string;
  play: string;
  pause: string;
  resume: string;
  restart: string;
  gameOver: string;
  newHighScore: string;
  score: string;
  highScore: string;
  level: string;
  coins: string;
  combo: string;
  fever: string;
  lives: string;
  fruitsCaught: string;
  bombsDodged: string;
  maxCombo: string;
  shop: string;
  upgrades: string;
  codeReference: string;
  howToPlay: string;
  controlsHelp: string;
  moveKeys: string;
  touchControls: string;
  avoidBombs: string;
  earnPoints: string;
  levelNames: {
    [key: string]: string;
  };
  difficulties: {
    CASUAL: string;
    NORMAL: string;
    ARCADE: string;
  };
  upgradeNames: {
    extraHearts: string;
    magnet: string;
    speed: string;
    shield: string;
  };
  skins: {
    CLASSIC: string;
    GOLDEN: string;
    CYBER: string;
    BAMBOO: string;
  };
  equipped: string;
  equip: string;
  buy: string;
  maxLevelReached: string;
  languageSelect: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    title: 'Fruit Catcher',
    subtitle: 'Arcade Fruit Catching Challenge',
    play: 'Start Game',
    pause: 'Game Paused',
    resume: 'Resume',
    restart: 'Play Again',
    gameOver: 'Game Over',
    newHighScore: 'New High Score!',
    score: 'Score',
    highScore: 'High Score',
    level: 'Level',
    coins: 'Coins',
    combo: 'Combo',
    fever: 'Fever Mode!',
    lives: 'Lives',
    fruitsCaught: 'Fruits Caught',
    bombsDodged: 'Hazards Dodged',
    maxCombo: 'Highest Combo',
    shop: 'Arcade Workshop',
    upgrades: 'Upgrades & Skins',
    codeReference: 'Language Code Guide',
    howToPlay: 'How to Play',
    controlsHelp: 'Move basket with Arrow Keys, A/D, Mouse, or Touch Buttons.',
    moveKeys: 'Move Basket Left / Right',
    touchControls: 'On-screen buttons available on mobile',
    avoidBombs: 'Catch fruits & coins. Dodge bombs, thunder, and poison.',
    earnPoints: 'Build combos for 5x Fever Mode score multiplier!',
    levelNames: {
      orchardDawn: 'Level 1: Orchard Dawn',
      citrusGrove: 'Level 2: Citrus Grove',
      tropicalRush: 'Level 3: Tropical Rush',
      volcanoHarvest: 'Level 4: Volcano Harvest',
      cosmicFrenzy: 'Level 5: Cosmic Fruit Frenzy',
    },
    difficulties: {
      CASUAL: 'Casual (4 Lives)',
      NORMAL: 'Normal (3 Lives)',
      ARCADE: 'Arcade Mania (2 Lives · High Speed)',
    },
    upgradeNames: {
      extraHearts: 'Extra Heart',
      magnet: 'Fruit Magnet',
      speed: 'Basket Velocity',
      shield: 'Bomb Deflector Shield',
    },
    skins: {
      CLASSIC: 'Classic Wicker',
      GOLDEN: 'Golden Harvest',
      CYBER: 'Cyber Catcher',
      BAMBOO: 'Zen Bamboo',
    },
    equipped: 'Equipped',
    equip: 'Equip',
    buy: 'Unlock',
    maxLevelReached: 'Max Level',
    languageSelect: 'Language',
  },
  es: {
    title: 'Atrapa Frutas',
    subtitle: 'Desafío Arcade de Cosecha',
    play: 'Iniciar Juego',
    pause: 'Juego Pausado',
    resume: 'Continuar',
    restart: 'Jugar de Nuevo',
    gameOver: 'Fin de la Partida',
    newHighScore: '¡Nuevo Récord!',
    score: 'Puntos',
    highScore: 'Puntuación Máxima',
    level: 'Nivel',
    coins: 'Monedas',
    combo: 'Combo',
    fever: '¡Modo Fiebre!',
    lives: 'Vidas',
    fruitsCaught: 'Frutas Atrapadas',
    bombsDodged: 'Peligros Esquivados',
    maxCombo: 'Mejor Combo',
    shop: 'Taller Arcade',
    upgrades: 'Mejoras y Cestas',
    codeReference: 'Código en Otros Lenguajes',
    howToPlay: 'Cómo Jugar',
    controlsHelp: 'Mueve la cesta con flechas, teclas A/D, ratón o botones táctiles.',
    moveKeys: 'Mover Cesta Izquierda / Derecha',
    touchControls: 'Controles táctiles disponibles',
    avoidBombs: 'Atrapa frutas y monedas. Evita bombas, rayos y venenos.',
    earnPoints: '¡Consigue combos para activar la bonificación 5x!',
    levelNames: {
      orchardDawn: 'Nivel 1: Huerto del Alba',
      citrusGrove: 'Nivel 2: Bosque Cítrico',
      tropicalRush: 'Nivel 3: Selva Tropical',
      volcanoHarvest: 'Nivel 4: Cosecha Volcánica',
      cosmicFrenzy: 'Nivel 5: Frenesí Cósmico',
    },
    difficulties: {
      CASUAL: 'Relajado (4 Vidas)',
      NORMAL: 'Normal (3 Vidas)',
      ARCADE: 'Arcade Manía (2 Vidas · Alta Velocidad)',
    },
    upgradeNames: {
      extraHearts: 'Corazón Extra',
      magnet: 'Imán de Frutas',
      speed: 'Velocidad de Cesta',
      shield: 'Escudo Antibombas',
    },
    skins: {
      CLASSIC: 'Mimbre Clásico',
      GOLDEN: 'Cosecha Dorada',
      CYBER: 'Ciber Canasta',
      BAMBOO: 'Bambú Zen',
    },
    equipped: 'Equipada',
    equip: 'Equipar',
    buy: 'Desbloquear',
    maxLevelReached: 'Nivel Máximo',
    languageSelect: 'Idioma',
  },
  fr: {
    title: 'Attrape-Fruits',
    subtitle: 'Défi Arcade Fruité',
    play: 'Commencer',
    pause: 'Pause',
    resume: 'Reprendre',
    restart: 'Rejouer',
    gameOver: 'Partie Terminée',
    newHighScore: 'Nouveau Record !',
    score: 'Score',
    highScore: 'Meilleur Score',
    level: 'Niveau',
    coins: 'Pièces',
    combo: 'Combo',
    fever: 'Mode Fièvre !',
    lives: 'Vies',
    fruitsCaught: 'Fruits Attrapés',
    bombsDodged: 'Pièges Évités',
    maxCombo: 'Meilleur Combo',
    shop: 'Atelier Arcade',
    upgrades: 'Améliorations & Paniers',
    codeReference: 'Code en Autres Langages',
    howToPlay: 'Comment Jouer',
    controlsHelp: 'Déplacez le panier avec les flèches, A/D, la souris ou le tactile.',
    moveKeys: 'Déplacer Panier Gauche / Droite',
    touchControls: 'Boutons tactiles sur mobile',
    avoidBombs: 'Attrapez les fruits. Évitez bombes, foudres et poisons.',
    earnPoints: 'Enchaînez les combos pour le multiplicateur 5x !',
    levelNames: {
      orchardDawn: 'Niveau 1 : Aube du Verger',
      citrusGrove: 'Niveau 2 : Bosquet d’Agrumes',
      tropicalRush: 'Niveau 3 : Ruée Tropicale',
      volcanoHarvest: 'Niveau 4 : Récolte Volcanique',
      cosmicFrenzy: 'Niveau 5 : Frénésie Cosmique',
    },
    difficulties: {
      CASUAL: 'Détente (4 Vies)',
      NORMAL: 'Normal (3 Vidas)',
      ARCADE: 'Arcade Mania (2 Vies · Vitesse Max)',
    },
    upgradeNames: {
      extraHearts: 'Cœur Supplémentaire',
      magnet: 'Aimant à Fruits',
      speed: 'Vitesse du Panier',
      shield: 'Bouclier Anti-Bombes',
    },
    skins: {
      CLASSIC: 'Osier Classique',
      GOLDEN: 'Moisson Dorée',
      CYBER: 'Panier Cyber',
      BAMBOO: 'Bambou Zen',
    },
    equipped: 'Équipé',
    equip: 'Équiper',
    buy: 'Débloquer',
    maxLevelReached: 'Niveau Max',
    languageSelect: 'Langue',
  },
  de: {
    title: 'Frucht-Fänger',
    subtitle: 'Arcade Frucht-Fang-Herausforderung',
    play: 'Spiel Starten',
    pause: 'Pausiert',
    resume: 'Fortsetzen',
    restart: 'Nochmal Spielen',
    gameOver: 'Spiel Vorbei',
    newHighScore: 'Neuer Highscore!',
    score: 'Punkte',
    highScore: 'Highscore',
    level: 'Stufe',
    coins: 'Münzen',
    combo: 'Kombo',
    fever: 'Fieber-Modus!',
    lives: 'Leben',
    fruitsCaught: 'Früchte Gefangen',
    bombsDodged: 'Gefahren Ausgewichen',
    maxCombo: 'Höchste Kombo',
    shop: 'Arcade Werkstatt',
    upgrades: 'Upgrades & Körbe',
    codeReference: 'Code in Anderen Sprachen',
    howToPlay: 'Spielanleitung',
    controlsHelp: 'Korb mit Pfeiltasten, A/D, Maus oder Touch steuern.',
    moveKeys: 'Korb Links / Rechts Bewegen',
    touchControls: 'Touch-Tasten für Mobilgeräte',
    avoidBombs: 'Fange Früchte & Münzen. Weiche Bomben und Gift aus.',
    earnPoints: 'Baue Kombos auf für 5x Punkte!',
    levelNames: {
      orchardDawn: 'Stufe 1: Morgenwiese',
      citrusGrove: 'Stufe 2: Zitrushain',
      tropicalRush: 'Stufe 3: Tropenrausch',
      volcanoHarvest: 'Stufe 4: Vulkan-Ernte',
      cosmicFrenzy: 'Stufe 5: Kosmischer Fruchttaumel',
    },
    difficulties: {
      CASUAL: 'Gemütlich (4 Leben)',
      NORMAL: 'Normal (3 Leben)',
      ARCADE: 'Arcade Manie (2 Leben · Hochtempo)',
    },
    upgradeNames: {
      extraHearts: 'Zusatz-Herz',
      magnet: 'Fruchtmagnet',
      speed: 'Korb-Geschwindigkeit',
      shield: 'Bombenschild',
    },
    skins: {
      CLASSIC: 'Klassischer Korb',
      GOLDEN: 'Goldene Ernte',
      CYBER: 'Cyber-Fänger',
      BAMBOO: 'Zen-Bambus',
    },
    equipped: 'Ausrüstet',
    equip: 'Ausrüsten',
    buy: 'Freischalten',
    maxLevelReached: 'Max Stufe',
    languageSelect: 'Sprache',
  },
  ja: {
    title: 'フルーツキャッチャー',
    subtitle: '爽快アーケード・フルーツキャッチ',
    play: 'ゲーム開始',
    pause: '一時停止',
    resume: '再開する',
    restart: 'もう一度プレイ',
    gameOver: 'ゲームオーバー',
    newHighScore: 'ハイスコア更新！',
    score: 'スコア',
    highScore: 'ベストスコア',
    level: 'ステージ',
    coins: 'コイン',
    combo: 'コンボ',
    fever: 'フィーバー突入！',
    lives: 'ライフ',
    fruitsCaught: 'キャッチした果物',
    bombsDodged: '回避した爆弾',
    maxCombo: '最高コンボ',
    shop: 'アーケードショップ',
    upgrades: '強化＆カゴスキン',
    codeReference: '他言語コード解説',
    howToPlay: '遊び方',
    controlsHelp: '矢印キー、A/D、マウスまたはタッチでカゴを左右に移動。',
    moveKeys: 'カゴを左右に移動',
    touchControls: 'スマホ対応タッチボタンあり',
    avoidBombs: '果物とコインを拾い、爆弾や毒を避けましょう。',
    earnPoints: '連続キャッチで5倍フィーバーモード発動！',
    levelNames: {
      orchardDawn: 'ステージ1: 果樹園の夜明け',
      citrusGrove: 'ステージ2: シトラスの森',
      tropicalRush: 'ステージ3: トロピカルラッシュ',
      volcanoHarvest: 'ステージ4: ボルケーノハーベスト',
      cosmicFrenzy: 'ステージ5: コズミック・フルーツ狂乱',
    },
    difficulties: {
      CASUAL: 'イージー (ライフ4)',
      NORMAL: 'ノーマル (ライフ3)',
      ARCADE: 'アーケード (ライフ2・高速)',
    },
    upgradeNames: {
      extraHearts: '最大ライフ増加',
      magnet: 'フルーツマグネット',
      speed: 'カゴの移動速度アップ',
      shield: '爆弾ガードシールド',
    },
    skins: {
      CLASSIC: 'クラシック籠',
      GOLDEN: '黄金の収穫',
      CYBER: 'サイバーネオン',
      BAMBOO: '和風竹籠',
    },
    equipped: '装備中',
    equip: '装備する',
    buy: '解放する',
    maxLevelReached: '最大レベル',
    languageSelect: '言語切替',
  },
  sw: {
    title: 'Mkamata Matunda',
    subtitle: 'Mchezo wa Kusisimua wa Arcade',
    play: 'Anza Mchezo',
    pause: 'Mchezo Umesitishwa',
    resume: 'Endelea',
    restart: 'Cheza Tena',
    gameOver: 'Mchezo Umeisha',
    newHighScore: 'Rekodi Mpya ya Alama!',
    score: 'Alama',
    highScore: 'Alama za Juu',
    level: 'Kiwango',
    coins: 'Sarafu',
    combo: 'Mfululizo',
    fever: 'Hali ya Shauku (Fever)!',
    lives: 'Mioyo',
    fruitsCaught: 'Matunda Yaliyokamatwa',
    bombsDodged: 'Mabomu Yaliyokwepwa',
    maxCombo: 'Mfululizo Mrefu Zaidi',
    shop: 'Duka la Vifaa',
    upgrades: 'Maboresho na Vikapu',
    codeReference: 'Mwongozo wa Lugha Zingine',
    howToPlay: 'Jinsi ya Kucheza',
    controlsHelp: 'Sogeza kikapu kwa vitufe vya mishale, A/D, panya, au mguso wa skrini.',
    moveKeys: 'Sogeza Kikapu Kushoto / Kulia',
    touchControls: 'Vitufe vya skrini kwa simu',
    avoidBombs: 'Kamata matunda na sarafu. Epuka mabomu, radi na sumu.',
    earnPoints: 'Kusanya mfululizo ili kupata alama mara 5!',
    levelNames: {
      orchardDawn: 'Kiwango 1: Alfajiri ya Shambani',
      citrusGrove: 'Kiwango 2: Msitu wa Machungwa',
      tropicalRush: 'Kiwango 3: Mbio za Kitropiki',
      volcanoHarvest: 'Kiwango 4: Mavuno ya Volcano',
      cosmicFrenzy: 'Kiwango 5: Shamrashamra za Angani',
    },
    difficulties: {
      CASUAL: 'Kawaida Polepole (Mioyo 4)',
      NORMAL: 'Wastani (Mioyo 3)',
      ARCADE: 'Kasi ya Juu (Mioyo 2 · Kasi Kubwa)',
    },
    upgradeNames: {
      extraHearts: 'Moyo wa Ziada',
      magnet: 'Sumaku ya Matunda',
      speed: 'Kasi ya Kikapu',
      shield: 'Ngao ya Kuzuia Bomu',
    },
    skins: {
      CLASSIC: 'Kikapu Asilia',
      GOLDEN: 'Mavuno ya Dhahabu',
      CYBER: 'Kikapu cha Kizazi Kipya',
      BAMBOO: 'Kikapu cha Mwanzi',
    },
    equipped: 'Kimevaliwa',
    equip: 'Vaa',
    buy: 'Nunua',
    maxLevelReached: 'Kiwango cha Juu Zaidi',
    languageSelect: 'Lugha',
  },
};
