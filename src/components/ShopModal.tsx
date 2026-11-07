import React from 'react';
import { PlayerUpgrades, Language, BasketSkin } from '../types';
import { translations } from '../utils/translations';
import { SHOP_UPGRADES, BASKET_SKINS } from '../utils/gameData';
import { sound } from '../utils/audio';
import { X, Check } from 'lucide-react';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  upgrades: PlayerUpgrades;
  language: Language;
  onBuyUpgrade: (upgradeId: string, cost: number) => void;
  onUnlockSkin: (skinId: BasketSkin, cost: number) => void;
  onEquipSkin: (skinId: BasketSkin) => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  coins,
  upgrades,
  language,
  onBuyUpgrade,
  onUnlockSkin,
  onEquipSkin,
}) => {
  const t = translations[language];

  if (!isOpen) return null;

  const getUpgradeLevel = (id: string) => {
    switch (id) {
      case 'extraHearts':
        return upgrades.extraHearts;
      case 'magnet':
        return upgrades.magnetLevel;
      case 'speed':
        return upgrades.speedLevel;
      case 'shield':
        return upgrades.shieldActive ? 1 : 0;
      default:
        return 0;
    }
  };

  const handlePurchase = (id: string, cost: number) => {
    if (coins >= cost) {
      sound.playCoin();
      onBuyUpgrade(id, cost);
    }
  };

  const handleSkinAction = (skinId: BasketSkin, cost: number, isUnlocked: boolean) => {
    if (isUnlocked) {
      sound.playHeart();
      onEquipSkin(skinId);
    } else if (coins >= cost) {
      sound.playCoin();
      onUnlockSkin(skinId, cost);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{t.shop}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{t.upgrades}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 font-mono tabular-nums text-sm font-bold">
              <span>🪙</span>
              <span>{coins}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upgrades Section */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
            {t.upgrades}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SHOP_UPGRADES.map((item) => {
              const currentLvl = getUpgradeLevel(item.id);
              const isMax = currentLvl >= item.maxLevel;
              const nextCost = Math.round(item.cost * (1 + currentLvl * 0.6));
              const canAfford = coins >= nextCost && !isMax;

              const name = t.upgradeNames[item.id as keyof typeof t.upgradeNames] || item.id;

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-slate-200">{name}</div>
                        <div className="text-xs text-slate-500">
                          Level {currentLvl} / {item.maxLevel}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-xs text-slate-400">
                      {isMax ? (
                        <span className="text-emerald-400 font-medium">{t.maxLevelReached}</span>
                      ) : (
                        <span className="font-mono tabular-nums text-amber-400 font-semibold">
                          🪙 {nextCost}
                        </span>
                      )}
                    </span>

                    {!isMax && (
                      <button
                        onClick={() => handlePurchase(item.id, nextCost)}
                        disabled={!canAfford}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {t.buy}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Basket Skins Section */}
        <div>
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Basket Customization
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BASKET_SKINS.map((skin) => {
              const isUnlocked = upgrades.unlockedSkins.includes(skin.id as BasketSkin);
              const isEquipped = upgrades.equippedSkin === skin.id;
              const skinName = t.skins[skin.id as keyof typeof t.skins] || skin.id;
              const canAfford = coins >= skin.cost && !isUnlocked;

              return (
                <div
                  key={skin.id}
                  className={`p-3.5 rounded-xl border transition-colors flex flex-col justify-between ${
                    isEquipped
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-200">{skinName}</span>
                      {isEquipped && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                          <Check className="w-3.5 h-3.5" /> {t.equipped}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{skin.description}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-xs font-mono tabular-nums text-slate-400">
                      {isUnlocked ? (
                        <span className="text-slate-500">Unlocked</span>
                      ) : (
                        <span className="text-amber-400 font-semibold">🪙 {skin.cost}</span>
                      )}
                    </span>

                    {!isEquipped && (
                      <button
                        onClick={() => handleSkinAction(skin.id as BasketSkin, skin.cost, isUnlocked)}
                        disabled={!isUnlocked && !canAfford}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                          isUnlocked
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                            : canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {isUnlocked ? t.equip : t.buy}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm rounded-xl transition-colors"
          >
            Back to Arcade
          </button>
        </div>
      </div>
    </div>
  );
};
