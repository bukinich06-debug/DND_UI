export const abilityMod = (score: number): number => Math.floor((score - 10) / 2);

export const formatBonus = (value: number): string => (value >= 0 ? `+${value}` : `${value}`);
