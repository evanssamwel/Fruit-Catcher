import React, { useEffect, useRef, useState } from 'react';
import { GameItem, Particle, FloatingText, BasketSkin, PlayerUpgrades, Difficulty } from '../types';
import { FRUIT_CATALOG, HAZARDS, COLLECTIBLES, GAME_LEVELS } from '../utils/gameData';
import { sound } from '../utils/audio';

interface ArcadeCanvasProps {
  isPlaying: boolean;
  isPaused: boolean;
  difficulty: Difficulty;
  upgrades: PlayerUpgrades;
  level: number;
  combo: number;
  isFever: boolean;
  onCatchFruit: (points: number, fruitName: string, x: number, y: number) => void;
  onCollectCoin: (coins: number, points: number, x: number, y: number) => void;
  onHitHazard: (type: 'BOMB' | 'THUNDER' | 'POISON', x: number, y: number) => void;
  onHealLife: () => void;
  onMissFruit: () => void;
  touchMoveDir: number; // -1 = left, 1 = right, 0 = none
}

export const ArcadeCanvas: React.FC<ArcadeCanvasProps> = ({
  isPlaying,
  isPaused,
  difficulty,
  upgrades,
  level,
  combo,
  isFever,
  onCatchFruit,
  onCollectCoin,
  onHitHazard,
  onHealLife,
  onMissFruit,
  touchMoveDir,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Basket physics state
  const basketX = useRef<number>(250);
  const targetBasketX = useRef<number>(250);
  const basketVx = useRef<number>(0);
  const basketSquash = useRef<number>(1);
  const isShocked = useRef<number>(0); // shock countdown timer

  // Game entities
  const items = useRef<GameItem[]>([]);
  const particles = useRef<Particle[]>([]);
  const floatingTexts = useRef<FloatingText[]>([]);
  const nextItemId = useRef<number>(1);
  const lastSpawnTime = useRef<number>(0);
  const screenShake = useRef<{ time: number; magnitude: number }>({ time: 0, magnitude: 0 });

  // Key tracking
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Canvas dimensions
  const [dimensions, setDimensions] = useState({ width: 600, height: 720 });

  // Adjust canvas size for screen
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = Math.min(window.innerWidth - 32, 640);
      const containerHeight = Math.min(window.innerHeight - 150, 780);
      const width = Math.max(containerWidth, 340);
      const height = Math.max(containerHeight, 520);
      setDimensions({ width, height });
      if (basketX.current > width - 50) {
        basketX.current = width / 2;
        targetBasketX.current = width / 2;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      if (['arrowleft', 'arrowright', 'a', 'd', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Pointer / Mouse / Touch move listeners on canvas
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPlaying || isPaused) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const clientX = (e.clientX - rect.left) * scaleX;
    targetBasketX.current = Math.max(45, Math.min(canvas.width - 45, clientX));
  };

  // Trigger floating score text
  const addFloatingText = (text: string, x: number, y: number, color: string, scale: number = 1) => {
    floatingTexts.current.push({
      id: Math.random(),
      x,
      y,
      text,
      color,
      alpha: 1,
      vy: -1.6,
      scale,
    });
  };

  // Trigger splash particles
  const addParticles = (
    x: number,
    y: number,
    color: string,
    count: number = 10,
    type: 'slice' | 'spark' | 'smoke' | 'circle' = 'circle'
  ) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      particles.current.push({
        id: Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        color,
        radius: Math.random() * 4 + 2,
        alpha: 1,
        decay: Math.random() * 0.025 + 0.02,
        shape: type,
        rotation: Math.random() * Math.PI * 2,
      });
    }
  };

  // Main game loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const currentLevelConfig = GAME_LEVELS[Math.min(level - 1, GAME_LEVELS.length - 1)];

    // Difficulty multipliers
    const diffSpeedMultiplier = difficulty === 'CASUAL' ? 0.85 : difficulty === 'ARCADE' ? 1.25 : 1.0;
    const effectiveSpeed = currentLevelConfig.speedMultiplier * diffSpeedMultiplier * (isFever ? 1.2 : 1.0);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const width = canvas.width;
      const height = canvas.height;
      const basketY = height - 55;
      const basketWidth = 92;
      const basketHeight = 44;

      if (isPlaying && !isPaused) {
        // --- 1. Basket Movement & Controls ---
        let moveInput = 0;
        if (keysPressed.current['arrowleft'] || keysPressed.current['a']) moveInput -= 1;
        if (keysPressed.current['arrowright'] || keysPressed.current['d']) moveInput += 1;
        if (touchMoveDir !== 0) moveInput += touchMoveDir;

        // Shock status countdown (from electric thunder)
        if (isShocked.current > 0) {
          isShocked.current -= dt;
        }

        const speedStat = 520 + upgrades.speedLevel * 75;
        const speed = isShocked.current > 0 ? speedStat * 0.55 : speedStat;

        if (moveInput !== 0) {
          targetBasketX.current += moveInput * speed * dt;
          targetBasketX.current = Math.max(basketWidth / 2, Math.min(width - basketWidth / 2, targetBasketX.current));
        }

        // Smooth spring towards target
        const dx = targetBasketX.current - basketX.current;
        basketVx.current = dx * 14;
        basketX.current += dx * Math.min(dt * 18, 1);
        basketX.current = Math.max(basketWidth / 2, Math.min(width - basketWidth / 2, basketX.current));

        // Return squash to normal
        basketSquash.current += (1 - basketSquash.current) * Math.min(dt * 12, 1);

        // --- 2. Item Spawning ---
        const spawnInterval = (currentLevelConfig.spawnInterval / diffSpeedMultiplier) * (isFever ? 0.75 : 1.0);
        if (currentTime - lastSpawnTime.current > spawnInterval) {
          lastSpawnTime.current = currentTime;

          // Determine item category
          const roll = Math.random();
          const hazardRoll = currentLevelConfig.hazardChance;
          const bonusRoll = currentLevelConfig.bonusChance;

          let newItem: GameItem;

          if (roll < hazardRoll) {
            // Spawn hazard
            const hazardDef = HAZARDS[Math.floor(Math.random() * HAZARDS.length)];
            newItem = {
              id: nextItemId.current++,
              x: Math.random() * (width - 80) + 40,
              y: -30,
              vx: (Math.random() - 0.5) * 40,
              vy: (180 + Math.random() * 50) * effectiveSpeed,
              radius: hazardDef.radius,
              type: hazardDef.type,
              category: 'HAZARD',
              points: 0,
              coinValue: 0,
              rotation: 0,
              rotSpeed: (Math.random() - 0.5) * 3,
              color: hazardDef.color,
              name: hazardDef.name,
            };
          } else if (roll < hazardRoll + bonusRoll) {
            // Spawn collectible (Coin, Gem, or rare Heart)
            const collectibleDef =
              Math.random() < 0.2
                ? COLLECTIBLES[2] // Heart
                : Math.random() < 0.35
                ? COLLECTIBLES[1] // Gem
                : COLLECTIBLES[0]; // Coin

            newItem = {
              id: nextItemId.current++,
              x: Math.random() * (width - 80) + 40,
              y: -30,
              vx: (Math.random() - 0.5) * 30,
              vy: (190 + Math.random() * 40) * effectiveSpeed,
              radius: collectibleDef.radius,
              type: collectibleDef.type,
              category: 'COLLECTIBLE',
              points: collectibleDef.points,
              coinValue: collectibleDef.coinValue,
              rotation: 0,
              rotSpeed: (Math.random() - 0.5) * 4,
              color: collectibleDef.color,
              name: collectibleDef.name,
            };
          } else {
            // Spawn Fruit
            const availableFruits = FRUIT_CATALOG.filter((f) => f.minLevel <= level);
            const totalWeight = availableFruits.reduce((acc, f) => acc + f.weight, 0);
            let fruitRoll = Math.random() * totalWeight;
            let selectedFruit = availableFruits[0];

            for (const f of availableFruits) {
              if (fruitRoll <= f.weight) {
                selectedFruit = f;
                break;
              }
              fruitRoll -= f.weight;
            }

            newItem = {
              id: nextItemId.current++,
              x: Math.random() * (width - 80) + 40,
              y: -30,
              vx: (Math.random() - 0.5) * 40,
              vy: (200 + Math.random() * 60) * effectiveSpeed,
              radius: selectedFruit.radius,
              type: selectedFruit.type,
              category: 'FRUIT',
              points: selectedFruit.points,
              coinValue: 0,
              rotation: 0,
              rotSpeed: (Math.random() - 0.5) * 4,
              color: selectedFruit.color,
              name: selectedFruit.name,
            };
          }

          items.current.push(newItem);
        }

        // --- 3. Update & Collide Items ---
        const magnetPower = upgrades.magnetLevel * 45; // pixel pull range
        const remainingItems: GameItem[] = [];

        for (const item of items.current) {
          item.y += item.vy * dt;
          item.x += item.vx * dt;
          item.rotation += item.rotSpeed * dt;

          // Magnet charm pulls fruits and coins towards basket
          if (magnetPower > 0 && item.category !== 'HAZARD') {
            const distToBasketX = basketX.current - item.x;
            const distToBasketY = basketY - item.y;
            const dist = Math.hypot(distToBasketX, distToBasketY);
            if (dist < 150 + magnetPower && distToBasketY > 0) {
              item.x += (distToBasketX / dist) * magnetPower * 2.5 * dt;
            }
          }

          // Bounce off left/right walls slightly
          if (item.x < item.radius || item.x > width - item.radius) {
            item.vx *= -0.7;
            item.x = Math.max(item.radius, Math.min(width - item.radius, item.x));
          }

          // Catch collision with basket
          // Basket bounding box around the opening
          const basketCatchY = basketY - 10;
          const isNearY = Math.abs(item.y - basketCatchY) < item.radius + 18;
          const isNearX = Math.abs(item.x - basketX.current) < basketWidth / 2 + item.radius * 0.4;

          if (isNearY && isNearX) {
            // Item caught by basket!
            basketSquash.current = 1.35; // bounce stretch

            if (item.category === 'FRUIT') {
              const comboBonus = isFever ? 5 : Math.min(combo + 1, 5);
              const pointsEarned = item.points * comboBonus;
              onCatchFruit(pointsEarned, item.name, item.x, item.y);
              sound.playFruitCatch(combo);
              addFloatingText(`+${pointsEarned}`, item.x, item.y - 10, item.color, 1.15);
              addParticles(item.x, item.y, item.color, 12, 'slice');
            } else if (item.category === 'COLLECTIBLE') {
              if (item.type === 'COIN') {
                sound.playCoin();
                onCollectCoin(1, item.points, item.x, item.y);
                addFloatingText(`+${item.points} 🪙`, item.x, item.y - 10, '#FBBF24', 1.2);
                addParticles(item.x, item.y, '#FBBF24', 14, 'spark');
              } else if (item.type === 'GEM') {
                sound.playGem();
                onCollectCoin(3, item.points, item.x, item.y);
                addFloatingText(`+${item.points} 💎`, item.x, item.y - 10, '#38BDF8', 1.3);
                addParticles(item.x, item.y, '#38BDF8', 16, 'spark');
              } else if (item.type === 'HEART') {
                sound.playHeart();
                onHealLife();
                addFloatingText('+1 ❤️', item.x, item.y - 10, '#F43F5E', 1.3);
                addParticles(item.x, item.y, '#F43F5E', 14, 'circle');
              }
            } else if (item.category === 'HAZARD') {
              if (item.type === 'BOMB') {
                sound.playBomb();
                screenShake.current = { time: 0.35, magnitude: 12 };
                addParticles(item.x, item.y, '#EF4444', 25, 'smoke');
                addParticles(item.x, item.y, '#F97316', 20, 'spark');
                addFloatingText('BOOM! 💥', item.x, item.y - 15, '#EF4444', 1.4);
                onHitHazard('BOMB', item.x, item.y);
              } else if (item.type === 'THUNDER') {
                sound.playThunder();
                isShocked.current = 3.0; // 3 seconds slowed down
                addParticles(item.x, item.y, '#38BDF8', 18, 'spark');
                addFloatingText('ZAPPED! ⚡', item.x, item.y - 15, '#38BDF8', 1.25);
                onHitHazard('THUNDER', item.x, item.y);
              } else if (item.type === 'POISON') {
                sound.playPoison();
                addParticles(item.x, item.y, '#A855F7', 15, 'smoke');
                addFloatingText('-25 ☠️', item.x, item.y - 15, '#A855F7', 1.2);
                onHitHazard('POISON', item.x, item.y);
              }
            }

            continue; // Do not keep this item
          }

          // Check if item dropped off screen
          if (item.y > height + 25) {
            if (item.category === 'FRUIT') {
              onMissFruit();
              // Small sad drop splat at the bottom
              addParticles(item.x, height - 10, item.color, 4, 'circle');
            }
            continue; // Item dropped
          }

          remainingItems.push(item);
        }

        items.current = remainingItems;

        // --- 4. Update Screen Shake ---
        if (screenShake.current.time > 0) {
          screenShake.current.time -= dt;
        }

        // --- 5. Update Particles ---
        const remainingParticles: Particle[] = [];
        for (const p of particles.current) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.12; // gravity
          p.alpha -= p.decay;
          p.rotation += 0.1;
          if (p.alpha > 0) {
            remainingParticles.push(p);
          }
        }
        particles.current = remainingParticles;

        // --- 6. Update Floating Text ---
        const remainingTexts: FloatingText[] = [];
        for (const ft of floatingTexts.current) {
          ft.y += ft.vy;
          ft.alpha -= 0.02;
          if (ft.alpha > 0) {
            remainingTexts.push(ft);
          }
        }
        floatingTexts.current = remainingTexts;
      }

      // ==========================================
      // RENDERING PIPELINE
      // ==========================================

      ctx.save();

      // Screen shake translation
      if (screenShake.current.time > 0) {
        const sx = (Math.random() - 0.5) * screenShake.current.magnitude;
        const sy = (Math.random() - 0.5) * screenShake.current.magnitude;
        ctx.translate(sx, sy);
      }

      // Draw background gradient for current level
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, currentLevelConfig.bgGradientTop);
      bgGrad.addColorStop(1, currentLevelConfig.bgGradientBottom);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle background grid/ambient arcade stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      for (let i = 0; i < width; i += 40) {
        ctx.fillRect(i, 0, 1, height);
      }
      for (let j = 0; j < height; j += 40) {
        ctx.fillRect(0, j, width, 1);
      }

      // Fever mode golden border pulse
      if (isFever) {
        ctx.strokeStyle = `rgba(250, 204, 21, ${0.4 + Math.sin(currentTime * 0.008) * 0.3})`;
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, width - 6, height - 6);
      }

      // Ground grass / baseline
      const groundGrad = ctx.createLinearGradient(0, height - 16, 0, height);
      groundGrad.addColorStop(0, 'rgba(34, 197, 94, 0.2)');
      groundGrad.addColorStop(1, 'rgba(20, 83, 45, 0.6)');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, height - 16, width, 16);

      // Draw items
      for (const item of items.current) {
        drawGameItem(ctx, item);
      }

      // Draw particles
      for (const p of particles.current) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === 'spark') {
          // 4-pointed star spark
          ctx.beginPath();
          ctx.moveTo(0, -p.radius * 1.5);
          ctx.lineTo(p.radius * 0.4, -p.radius * 0.4);
          ctx.lineTo(p.radius * 1.5, 0);
          ctx.lineTo(p.radius * 0.4, p.radius * 0.4);
          ctx.lineTo(0, p.radius * 1.5);
          ctx.lineTo(-p.radius * 0.4, p.radius * 0.4);
          ctx.lineTo(-p.radius * 1.5, 0);
          ctx.lineTo(-p.radius * 0.4, -p.radius * 0.4);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'slice') {
          // Half circle fruit slice
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw Basket
      drawBasket(
        ctx,
        basketX.current,
        basketY,
        basketWidth,
        basketHeight,
        basketVx.current,
        basketSquash.current,
        upgrades.equippedSkin,
        upgrades.shieldActive,
        isShocked.current > 0
      );

      // Draw floating score numbers
      for (const ft of floatingTexts.current) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.font = `bold ${Math.round(18 * ft.scale)}px 'Outfit', sans-serif`;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 4;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, isPaused, difficulty, upgrades, level, combo, isFever, touchMoveDir]);

  return (
    <div className="relative flex justify-center items-center w-full max-w-full overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onPointerMove={handlePointerMove}
        className="rounded-xl shadow-2xl border border-slate-800 touch-none bg-slate-950 cursor-ew-resize"
      />
    </div>
  );
};

// ==========================================
// DETAILED VECTOR CANVAS DRAWING FUNCTIONS
// ==========================================

function drawBasket(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  vx: number,
  squash: number,
  skin: BasketSkin,
  hasShield: boolean,
  isShocked: boolean
) {
  ctx.save();
  ctx.translate(x, y);

  // Subtle tilt with movement
  const tilt = Math.max(-0.25, Math.min(0.25, vx * 0.0008));
  ctx.rotate(tilt);

  // Squash & stretch on item catch
  const sx = 1 + (squash - 1) * 0.4;
  const sy = 1 / (1 + (squash - 1) * 0.3);
  ctx.scale(sx, sy);

  // Electric shock aura if zapped
  if (isShocked) {
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#38BDF8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.ellipse(0, 0, width / 2 + 10, height / 2 + 12, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Deflector shield dome if active
  if (hasShield) {
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, -8, width / 2 + 8, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Shadow under basket
  ctx.beginPath();
  ctx.ellipse(0, height / 2 + 8, width * 0.45, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fill();

  const halfW = width / 2;
  const halfH = height / 2;

  if (skin === 'GOLDEN') {
    // 24k Golden Harvest Skin
    const goldGrad = ctx.createLinearGradient(0, -halfH, 0, halfH);
    goldGrad.addColorStop(0, '#FEF08A');
    goldGrad.addColorStop(0.3, '#EAB308');
    goldGrad.addColorStop(0.7, '#CA8A04');
    goldGrad.addColorStop(1, '#854D0E');

    // Basket body
    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.moveTo(-halfW, -halfH);
    ctx.lineTo(halfW, -halfH);
    ctx.quadraticCurveTo(halfW * 0.85, halfH, halfW * 0.65, halfH);
    ctx.lineTo(-halfW * 0.65, halfH);
    ctx.quadraticCurveTo(-halfW * 0.85, halfH, -halfW, -halfH);
    ctx.closePath();
    ctx.fill();

    // Golden rim
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.ellipse(0, -halfH, halfW + 4, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Shimmer highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(-12, -halfH + 2, halfW * 0.5, 4, 0, Math.PI * 0.8, Math.PI * 1.4);
    ctx.stroke();
  } else if (skin === 'CYBER') {
    // Cyber Catcher Skin
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.moveTo(-halfW, -halfH);
    ctx.lineTo(halfW, -halfH);
    ctx.lineTo(halfW * 0.7, halfH);
    ctx.lineTo(-halfW * 0.7, halfH);
    ctx.closePath();
    ctx.fill();

    // Neon cyan edges
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#06B6D4';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Grid lines
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 1;
    for (let lx = -halfW * 0.6; lx <= halfW * 0.6; lx += 14) {
      ctx.beginPath();
      ctx.moveTo(lx, -halfH + 6);
      ctx.lineTo(lx * 0.8, halfH - 4);
      ctx.stroke();
    }

    // Top rim
    ctx.fillStyle = '#0891B2';
    ctx.fillRect(-halfW - 3, -halfH - 4, width + 6, 6);
  } else if (skin === 'BAMBOO') {
    // Zen Bamboo Skin
    const bambooGrad = ctx.createLinearGradient(0, -halfH, 0, halfH);
    bambooGrad.addColorStop(0, '#84CC16');
    bambooGrad.addColorStop(0.5, '#65A30D');
    bambooGrad.addColorStop(1, '#4D7C0F');

    ctx.fillStyle = bambooGrad;
    ctx.beginPath();
    ctx.moveTo(-halfW, -halfH);
    ctx.lineTo(halfW, -halfH);
    ctx.quadraticCurveTo(halfW * 0.8, halfH, halfW * 0.6, halfH);
    ctx.lineTo(-halfW * 0.6, halfH);
    ctx.quadraticCurveTo(-halfW * 0.8, halfH, -halfW, -halfH);
    ctx.closePath();
    ctx.fill();

    // Bamboo slats
    ctx.strokeStyle = '#365314';
    ctx.lineWidth = 1.5;
    for (let bx = -halfW + 12; bx < halfW; bx += 10) {
      ctx.beginPath();
      ctx.moveTo(bx, -halfH);
      ctx.lineTo(bx * 0.7, halfH);
      ctx.stroke();
    }

    // Bamboo rim
    ctx.fillStyle = '#A3E635';
    ctx.beginPath();
    ctx.ellipse(0, -halfH, halfW + 3, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#4D7C0F';
    ctx.stroke();
  } else {
    // Classic Handcrafted Woven Wicker Basket
    const wickerGrad = ctx.createLinearGradient(0, -halfH, 0, halfH);
    wickerGrad.addColorStop(0, '#D97706');
    wickerGrad.addColorStop(0.4, '#B45309');
    wickerGrad.addColorStop(1, '#78350F');

    ctx.fillStyle = wickerGrad;
    ctx.beginPath();
    ctx.moveTo(-halfW, -halfH);
    ctx.lineTo(halfW, -halfH);
    ctx.quadraticCurveTo(halfW * 0.85, halfH, halfW * 0.65, halfH);
    ctx.lineTo(-halfW * 0.65, halfH);
    ctx.quadraticCurveTo(-halfW * 0.85, halfH, -halfW, -halfH);
    ctx.closePath();
    ctx.fill();

    // Wicker weave pattern
    ctx.strokeStyle = 'rgba(120, 53, 15, 0.45)';
    ctx.lineWidth = 2;
    for (let xOff = -halfW; xOff <= halfW; xOff += 12) {
      ctx.beginPath();
      ctx.moveTo(xOff, -halfH);
      ctx.lineTo(xOff * 0.7, halfH);
      ctx.stroke();
    }
    for (let yOff = -halfH + 8; yOff < halfH; yOff += 10) {
      ctx.beginPath();
      ctx.moveTo(-halfW * 0.9, yOff);
      ctx.lineTo(halfW * 0.9, yOff);
      ctx.stroke();
    }

    // Top woven rim
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.ellipse(0, -halfH, halfW + 4, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#92400E';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Handle arch
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, -halfH, halfW * 0.75, Math.PI, 0);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGameItem(ctx: CanvasRenderingContext2D, item: GameItem) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.rotation);

  const r = item.radius;

  switch (item.type) {
    case 'APPLE': {
      // Glossy Apple
      const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.2, 0, 0, r);
      grad.addColorStop(0, '#F87171');
      grad.addColorStop(0.7, '#DC2626');
      grad.addColorStop(1, '#991B1B');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(-r * 0.3, 0, r * 0.7, 0, Math.PI * 2);
      ctx.arc(r * 0.3, 0, r * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Stem
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.6);
      ctx.quadraticCurveTo(r * 0.3, -r * 1.1, r * 0.2, -r * 1.2);
      ctx.stroke();

      // Leaf
      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.ellipse(r * 0.4, -r * 0.9, 6, 3, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Specular shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.arc(-r * 0.35, -r * 0.35, r * 0.22, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'BANANA': {
      // Curved Banana
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.arc(0, -r * 0.5, r * 1.2, 0.3, Math.PI - 0.3);
      ctx.quadraticCurveTo(0, r * 0.8, 0, -r * 0.5);
      ctx.fill();

      // Tip & Stem
      ctx.fillStyle = '#84CC16';
      ctx.fillRect(-r * 0.9, -r * 0.2, 5, 5);
      ctx.fillStyle = '#78350F';
      ctx.fillRect(r * 0.8, -r * 0.2, 5, 5);
      break;
    }

    case 'ORANGE': {
      // Juicy Orange
      const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 2, 0, 0, r);
      grad.addColorStop(0, '#FB923C');
      grad.addColorStop(1, '#EA580C');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // Leaf on top
      ctx.fillStyle = '#16A34A';
      ctx.beginPath();
      ctx.ellipse(0, -r, 6, 3, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'STRAWBERRY': {
      // Conical Strawberry
      ctx.fillStyle = '#E11D48';
      ctx.beginPath();
      ctx.moveTo(-r * 0.7, -r * 0.4);
      ctx.quadraticCurveTo(-r * 0.8, r * 0.4, 0, r);
      ctx.quadraticCurveTo(r * 0.8, r * 0.4, r * 0.7, -r * 0.4);
      ctx.quadraticCurveTo(0, -r * 0.7, -r * 0.7, -r * 0.4);
      ctx.fill();

      // Yellow seeds
      ctx.fillStyle = '#FEF08A';
      const seeds = [
        [-r * 0.3, 0],
        [r * 0.3, 0],
        [0, r * 0.4],
        [0, -r * 0.2],
        [-r * 0.2, r * 0.3],
        [r * 0.2, r * 0.3],
      ];
      for (const [sx, sy] of seeds) {
        ctx.beginPath();
        ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Green Crown
      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.arc(0, -r * 0.5, 6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'WATERMELON': {
      // Watermelon Slice
      ctx.fillStyle = '#059669'; // rind
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI);
      ctx.fill();

      ctx.fillStyle = '#F43F5E'; // red interior
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.82, 0, Math.PI);
      ctx.fill();

      // Black seeds
      ctx.fillStyle = '#0F172A';
      const seeds = [
        [-r * 0.4, r * 0.4],
        [0, r * 0.55],
        [r * 0.4, r * 0.4],
      ];
      for (const [sx, sy] of seeds) {
        ctx.beginPath();
        ctx.arc(sx, sy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'PINEAPPLE': {
      // Pineapple Body
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.ellipse(0, 3, r * 0.7, r * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();

      // Spiky crown
      ctx.fillStyle = '#16A34A';
      ctx.beginPath();
      ctx.moveTo(-8, -r * 0.6);
      ctx.lineTo(0, -r * 1.3);
      ctx.lineTo(8, -r * 0.6);
      ctx.fill();
      break;
    }

    case 'GRAPES': {
      // Royal Grape Cluster
      ctx.fillStyle = '#7C3AED';
      const grapes = [
        [0, -8],
        [-6, -2],
        [6, -2],
        [-4, 5],
        [4, 5],
        [0, 10],
      ];
      for (const [gx, gy] of grapes) {
        ctx.beginPath();
        ctx.arc(gx, gy, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'STARFRUIT': {
      // 5-pointed glowing Star Fruit
      ctx.fillStyle = '#EAB308';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const innerAngle = outerAngle + (2 * Math.PI) / 10;
        const ox = Math.cos(outerAngle) * r;
        const oy = Math.sin(outerAngle) * r;
        const ix = Math.cos(innerAngle) * (r * 0.5);
        const iy = Math.sin(innerAngle) * (r * 0.5);
        if (i === 0) ctx.moveTo(ox, oy);
        else ctx.lineTo(ox, oy);
        ctx.lineTo(ix, iy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
    }

    case 'BOMB': {
      // Arcade Bomb
      const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 2, 0, 0, r);
      grad.addColorStop(0, '#475569');
      grad.addColorStop(1, '#090D16');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 3, r * 0.85, 0, Math.PI * 2);
      ctx.fill();

      // Metal neck
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(-4, -r + 2, 8, 4);

      // Fuse
      ctx.strokeStyle = '#CA8A04';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -r + 2);
      ctx.quadraticCurveTo(6, -r - 4, 3, -r - 8);
      ctx.stroke();

      // Spark on fuse tip
      ctx.fillStyle = '#F97316';
      ctx.beginPath();
      ctx.arc(3, -r - 8, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(3, -r - 8, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'THUNDER': {
      // Thunder Cloud
      ctx.fillStyle = '#64748B';
      ctx.beginPath();
      ctx.arc(-6, -2, r * 0.5, 0, Math.PI * 2);
      ctx.arc(6, -2, r * 0.5, 0, Math.PI * 2);
      ctx.arc(0, -7, r * 0.55, 0, Math.PI * 2);
      ctx.fill();

      // Lightning bolt
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.moveTo(-2, 0);
      ctx.lineTo(4, 0);
      ctx.lineTo(0, 7);
      ctx.lineTo(5, 7);
      ctx.lineTo(-4, 16);
      ctx.lineTo(-1, 8);
      ctx.lineTo(-5, 8);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'POISON': {
      // Poison Flask
      ctx.fillStyle = '#7E22CE';
      ctx.beginPath();
      ctx.moveTo(-4, -r * 0.7);
      ctx.lineTo(4, -r * 0.7);
      ctx.lineTo(4, -2);
      ctx.lineTo(r * 0.7, r * 0.6);
      ctx.quadraticCurveTo(0, r * 0.9, -r * 0.7, r * 0.6);
      ctx.lineTo(-4, -2);
      ctx.closePath();
      ctx.fill();

      // Cork
      ctx.fillStyle = '#B45309';
      ctx.fillRect(-3, -r * 0.9, 6, 4);

      // Bubbles
      ctx.fillStyle = '#A855F7';
      ctx.beginPath();
      ctx.arc(0, 3, 3, 0, Math.PI * 2);
      ctx.arc(4, 7, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'COIN': {
      // Gold Coin
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#B45309';
      ctx.font = `bold ${Math.round(r * 0.9)}px 'Outfit', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 0, 1);
      break;
    }

    case 'GEM': {
      // Diamond Gem
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r, -r * 0.3);
      ctx.lineTo(0, r);
      ctx.lineTo(-r, -r * 0.3);
      ctx.closePath();
      ctx.fill();

      // Highlights
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.5, -r * 0.3);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'HEART': {
      // Floating Heart
      ctx.fillStyle = '#F43F5E';
      ctx.beginPath();
      ctx.arc(-r * 0.35, -r * 0.3, r * 0.4, Math.PI, 0);
      ctx.arc(r * 0.35, -r * 0.3, r * 0.4, Math.PI, 0);
      ctx.lineTo(0, r * 0.75);
      ctx.closePath();
      ctx.fill();
      break;
    }
  }

  ctx.restore();
}
