import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode } from 'lucide-react';

interface CodeLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeLanguageModal: React.FC<CodeLanguageModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'python' | 'vanilla_js'>('python');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pythonCode = `# ==============================================================
# Fruit Catcher - Arcade Game in Python (Pygame)
# Requirements: pip install pygame
# ==============================================================
import pygame
import random
import sys

pygame.init()
WIDTH, HEIGHT = 600, 700
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Fruit Catcher - Arcade")
clock = pygame.time.Clock()
font = pygame.font.SysFont("Arial", 26)

# Colors
DARK_BLUE = (15, 23, 42)
BASKET_BROWN = (217, 119, 6)
RED = (239, 68, 68)
YELLOW = (250, 204, 21)
GREEN = (34, 197, 94)
BLACK = (20, 20, 20)
WHITE = (255, 255, 255)

class Basket:
    def __init__(self):
        self.width = 90
        self.height = 36
        self.x = WIDTH // 2 - self.width // 2
        self.y = HEIGHT - 60
        self.speed = 9

    def move(self, keys):
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            self.x -= self.speed
        if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            self.x += self.speed
        self.x = max(0, min(WIDTH - self.width, self.x))

    def draw(self, surf):
        pygame.draw.rect(surf, BASKET_BROWN, (self.x, self.y, self.width, self.height), border_radius=8)

class FallingItem:
    def __init__(self):
        self.x = random.randint(30, WIDTH - 30)
        self.y = -30
        self.is_bomb = random.random() < 0.22
        self.radius = 18
        self.speed = random.uniform(3.5, 6.0)
        self.color = BLACK if self.is_bomb else random.choice([RED, YELLOW, GREEN])

    def update(self):
        self.y += self.speed

    def draw(self, surf):
        pygame.draw.circle(surf, self.color, (int(self.x), int(self.y)), self.radius)

def main():
    basket = Basket()
    items = []
    score = 0
    lives = 3
    level = 1
    spawn_timer = 0

    running = True
    while running:
        clock.tick(60)
        keys = pygame.key.get_pressed()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        if lives > 0:
            basket.move(keys)

            # Spawn items
            spawn_timer += 1
            if spawn_timer > max(25, 60 - level * 6):
                spawn_timer = 0
                items.append(FallingItem())

            for item in items[:]:
                item.update()
                # Catch collision
                if (basket.y < item.y + item.radius < basket.y + basket.height and 
                    basket.x < item.x < basket.x + basket.width):
                    items.remove(item)
                    if item.is_bomb:
                        lives -= 1
                    else:
                        score += 15
                        if score >= level * 120:
                            level += 1
                elif item.y > HEIGHT + 30:
                    items.remove(item)

        # Drawing
        screen.fill(DARK_BLUE)
        basket.draw(screen)
        for item in items:
            item.draw(screen)

        # UI Score and Lives
        score_surf = font.render(f"Score: {score}  Lives: {'<3 ' * lives}  Level: {level}", True, WHITE)
        screen.blit(score_surf, (20, 20))

        if lives <= 0:
            over_surf = font.render("GAME OVER - Press R to Restart", True, RED)
            screen.blit(over_surf, (WIDTH // 2 - 160, HEIGHT // 2))
            if keys[pygame.K_r]:
                lives = 3
                score = 0
                items.clear()
                level = 1

        pygame.display.flip()

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()`;

  const vanillaJsCode = `// ==============================================================
// Fruit Catcher - Arcade Game in Vanilla JavaScript (HTML5 Canvas)
// Can be saved in index.html with a simple <canvas id="game"></canvas>
// ==============================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 700;

let score = 0;
let lives = 3;
let level = 1;
let items = [];

const basket = {
  x: canvas.width / 2 - 45,
  y: canvas.height - 60,
  width: 90,
  height: 36,
  speed: 8
};

const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function spawnItem() {
  const isBomb = Math.random() < 0.22;
  items.push({
    x: Math.random() * (canvas.width - 60) + 30,
    y: -20,
    radius: 18,
    isBomb: isBomb,
    color: isBomb ? "#0F172A" : ["#EF4444", "#FACC15", "#10B981"][Math.floor(Math.random() * 3)],
    speed: 3.5 + Math.random() * 2 + level * 0.4
  });
}

let spawnCounter = 0;

function gameLoop() {
  // Move Basket
  if (keys["ArrowLeft"] || keys["a"]) basket.x -= basket.speed;
  if (keys["ArrowRight"] || keys["d"]) basket.x += basket.speed;
  basket.x = Math.max(0, Math.min(canvas.width - basket.width, basket.x));

  // Spawn Items
  spawnCounter++;
  if (spawnCounter > Math.max(25, 60 - level * 5)) {
    spawnCounter = 0;
    spawnItem();
  }

  // Clear Canvas
  ctx.fillStyle = "#0F172A";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update & Draw Items
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    item.y += item.speed;

    // Check collision with basket
    if (
      item.y + item.radius >= basket.y &&
      item.y - item.radius <= basket.y + basket.height &&
      item.x >= basket.x &&
      item.x <= basket.x + basket.width
    ) {
      if (item.isBomb) {
        lives--;
      } else {
        score += 15;
        if (score >= level * 100) level++;
      }
      items.splice(i, 1);
      continue;
    }

    if (item.y > canvas.height + 30) {
      items.splice(i, 1);
      continue;
    }

    // Draw item
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
    ctx.fillStyle = item.color;
    ctx.fill();
  }

  // Draw Basket
  ctx.fillStyle = "#D97706";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

  // Draw UI
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText("Score: " + score + "   Lives: " + "❤️".repeat(lives) + "   Level: " + level, 20, 35);

  if (lives > 0) {
    requestAnimationFrame(gameLoop);
  } else {
    ctx.fillStyle = "#EF4444";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }
}

gameLoop();`;

  const currentCode = activeTab === 'python' ? pythonCode : vanillaJsCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Language Architecture & Alternatives
              </h2>
              <p className="text-xs text-slate-400">
                How Fruit Catcher runs across Python and JavaScript
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Note */}
        <div className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800 leading-relaxed">
          <p>
            <strong className="text-emerald-400">In Web Browsers:</strong> Browsers execute{' '}
            <strong>JavaScript</strong> natively. In this applet, TypeScript is used strictly as a
            type-safety layer that compiles directly into standard, high-performance browser
            JavaScript. Below you can inspect and copy the game rewritten in standalone{' '}
            <strong>Python (Pygame)</strong> or <strong>Vanilla JavaScript</strong>.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('python')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'python'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Python (Pygame)
            </button>
            <button
              onClick={() => setActiveTab('vanilla_js')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'vanilla_js'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Vanilla JavaScript
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Viewer */}
        <div className="relative flex-1 overflow-auto rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed max-h-[380px]">
          <pre>{currentCode}</pre>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
