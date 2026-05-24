export const XP_PER_LEVEL = 300;

export function getCurrentLevel(xpTotal: number, xpPerLevel = XP_PER_LEVEL) {
  return Math.floor(xpTotal / xpPerLevel) + 1;
}

export function getXpInLevel(xpTotal: number, xpPerLevel = XP_PER_LEVEL) {
  return xpTotal % xpPerLevel;
}

export function getXpProgressPercent(xpTotal: number, xpPerLevel = XP_PER_LEVEL) {
  const xpInLevel = getXpInLevel(xpTotal, xpPerLevel);
  return Math.min((xpInLevel / xpPerLevel) * 100, 100);
}
