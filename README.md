# 🍎 Fruit Catcher Arcade

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Web Audio API](https://img.shields.io/badge/Audio-Web_Audio_API-F59E0B)](#-synthesized-audio-engine)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

A high-speed, 60 FPS retro-modern arcade fruit catcher built for the web. Steer your harvest basket, catch delicious falling fruits, build combo multipliers, dodge dangerous bombs and thunderclouds, collect gold coins, and unlock powerful upgrades and custom basket skins across 5 escalating levels.

---

## 🎮 Live Preview & Play

- **Move Basket**: Arrow Keys (<kbd>←</kbd> <kbd>→</kbd>) or <kbd>A</kbd> / <kbd>D</kbd>
- **Mouse / Trackpad**: Move or drag your cursor anywhere across the canvas
- **Mobile & Tablet**: Responsive on-screen **◀ LEFT** and **RIGHT ▶** touch buttons
- **Pause / Resume**: Press <kbd>P</kbd> or <kbd>Space</kbd>

---

## ✨ Features

- **⚡ 60 FPS Canvas Physics Engine**: Built with native HTML5 Canvas and `requestAnimationFrame` for buttery-smooth fruit physics, spring-based basket tilting, and dynamic squash & stretch catch animations.
- **🍎 8 Distinct Fruits**: Apples, Bananas, Oranges, Strawberries, Watermelons, Grapes, Pineapples, and glowing 5-pointed Star Fruits with custom vector rendering and colorful splash particles.
- **💣 Dangerous Hazards**:
  - **Bombs 💣**: Blast casing with sparking fuses; causes screen shake and loses a life.
  - **Thunder Clouds ⚡**: Shocks the basket and temporarily cuts movement speed in half for 3 seconds.
  - **Poison Potions ☠️**: Toxic brew that deducts 25 points and breaks your combo streak.
- **🔥 Fever Mode & Combos**: Chain 5 consecutive fruit catches to trigger 5× Fever Mode with a radiant golden aura, bonus points, and celebratory particle sparks.
- **🪙 Arcade Workshop & Economy**: Collect gold coins and gems during gameplay to purchase persistent upgrades:
  - **Extra Hearts**: Increase maximum health capacity.
  - **Fruit Magnet**: Pulls falling fruits towards the basket.
  - **Basket Velocity Boost**: Accelerates basket movement.
  - **Deflector Shield**: Absorbs a bomb explosion safely.
- **🧺 4 Custom Basket Skins**:
  - **Classic Wicker**: Handcrafted woven basket with warm wood trim.
  - **Golden Harvest**: Shimmering 24k metallic basket with specular highlights.
  - **Cyber Catcher**: Futuristic dark chassis with glowing cyan neon edges and gridlines.
  - **Zen Bamboo**: Organic bamboo slats with joint rings and green leaf accents.
- **📈 5 Escalating Levels**:
  1. *Level 1: Orchard Dawn* (Gentle speed, basic fruits)
  2. *Level 2: Citrus Grove* (Speed +25%, strawberries & thunder)
  3. *Level 3: Tropical Rush* (Speed +55%, pineapples & watermelons)
  4. *Level 4: Volcano Harvest* (Speed +90%, intense hazards & star fruits)
  5. *Level 5: Cosmic Fruit Frenzy* (Maximum adrenaline speed)
- **🔊 Procedural Web Audio API**: Zero external audio files required. All sound effects—melodic combo chimes, coin clinks, explosive booms, and level-up fanfares—are synthesized dynamically in the browser.
- **🌍 International Localization (i18n)**: Fully translated user interface supporting English, Spanish (*Español*), French (*Français*), German (*Deutsch*), Japanese (*日本語*), and Swahili (*Kiswahili*).
- **🐍 Multi-Language Code Reference**: Includes complete, runnable source code implementations in both **Python (Pygame)** and **Vanilla JavaScript** directly accessible in-game.

---

## 📊 Fruits & Hazard Table

| Item | Type | Points | Coin Value | Special Effect |
| :--- | :--- | :---: | :---: | :--- |
| 🍎 **Apple** | Fruit | `+10` | — | Basic orchard fruit |
| 🍌 **Banana** | Fruit | `+15` | — | Curved golden fruit |
| 🍊 **Orange** | Fruit | `+20` | — | Citrus delight |
| 🍓 **Strawberry** | Fruit | `+25` | — | Unlocked at Level 2 |
| 🍉 **Watermelon** | Fruit | `+35` | — | Unlocked at Level 2 |
| 🍇 **Grapes** | Fruit | `+40` | — | Unlocked at Level 3 |
| 🍍 **Pineapple** | Fruit | `+50` | — | Unlocked at Level 3 |
| ⭐ **Star Fruit** | Rare Fruit | `+100` | — | Unlocked at Level 4; rare high-score drop |
| 🪙 **Gold Coin** | Currency | `+50` | `+1` | Currency for Arcade Workshop upgrades |
| 💎 **Arcade Gem** | Currency | `+150` | `+3` | Premium currency |
| ❤️ **Heart** | Restorative | `+20` | — | Restores 1 lost health point |
| 💣 **Bomb** | Hazard | `0` | — | Deducts 1 Life; triggers screen shake |
| ⚡ **Thunder** | Hazard | `0` | — | Slows basket speed by 45% for 3 seconds |
| ☠️ **Poison** | Hazard | `-25` | — | Deducts points & breaks combo meter |

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Rendering**: HTML5 2D Canvas Context (`CanvasRenderingContext2D`)
- **Audio Engine**: Web Audio API (`AudioContext`, `OscillatorNode`, `BiquadFilterNode`, `GainNode`)
- **State Storage**: LocalStorage for persistent high scores, coin wallets, and workshop unlocks

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- `npm` or `pnpm` / `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/fruit-catcher-arcade.git
   cd fruit-catcher-arcade
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in your browser**:
   Navigate to `http://localhost:3000` to play!

### Build for Production

```bash
npm run build
```
The compiled static assets will be output to the `dist/` directory, ready to deploy to Vercel, Netlify, Cloud Run, or GitHub Pages.

---

## 📂 Project Directory Structure

```text
├── index.html                   # HTML entry point with meta tags and Google Fonts
├── metadata.json                # Project configuration and capabilities
├── package.json                 # Dependencies and build scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS plugin
└── src/
    ├── App.tsx                  # Main game manager, top bar, modals & state machine
    ├── main.tsx                 # React DOM root entry point
    ├── index.css                # Global styles and typography directives
    ├── types.ts                 # TypeScript interfaces, entity models, and unions
    ├── components/
    │   ├── ArcadeCanvas.tsx     # 60 FPS HTML5 Canvas engine, physics & vector renderers
    │   ├── HUD.tsx              # Tabular score bar, hearts, combo meter & mobile pads
    │   ├── MenuOverlays.tsx     # Title screen, pause menu, and game-over summary
    │   ├── ShopModal.tsx        # Arcade Workshop for upgrades and basket skin customizer
    │   └── CodeLanguageModal.tsx# Code viewer with Python (Pygame) and Vanilla JS ports
    └── utils/
        ├── audio.ts             # Self-contained Web Audio API synthesizer
        ├── gameData.ts          # Level configs, fruits catalog, hazards & shop items
        └── translations.ts      # Multi-language dictionary (EN, ES, FR, DE, JA, SW)
```

---

## 🐍 Code Alternatives (Python & Vanilla JS)

Fruit Catcher includes built-in reference implementations in other programming languages! You can inspect or copy them inside the game via the **"Python & JS Code"** button.

### Python (Pygame) Quick Snippet
```python
import pygame, random

pygame.init()
screen = pygame.display.set_mode((600, 700))
basket = pygame.Rect(260, 640, 80, 30)
items = []

# Game loop
while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT: exit()
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]: basket.x -= 8
    if keys[pygame.K_RIGHT]: basket.x += 8
    # Update items & collision detection...
```

---

## 🤝 Contributing

Contributions, feedback, and pull requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the Apache-2.0 License. See `LICENSE` for more information.
