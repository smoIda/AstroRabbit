const BADGE_COLOR_PALETTES = [
  "text-rose-600 bg-rose-500/10",
  "text-indigo-600 bg-indigo-500/10",
  "text-amber-600 bg-amber-500/10",
  "text-emerald-600 bg-emerald-500/10",
  "text-violet-600 bg-violet-500/10",
  "text-sky-600 bg-sky-500/10",
  "text-teal-600 bg-teal-500/10",
  "text-fuchsia-600 bg-fuchsia-500/10",
  "text-orange-600 bg-orange-500/10",
  "text-cyan-600 bg-cyan-500/10",
  "text-lime-600 bg-lime-500/10",
  "text-pink-600 bg-pink-500/10",
  "text-purple-600 bg-purple-500/10",
  "text-yellow-600 bg-yellow-500/10",
  "text-blue-600 bg-blue-500/10",
  "text-slate-600 bg-slate-500/10",
] as const;

export function randomBadgeColor(label: string) {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 2) - hash); // hash << 2 = hash * 2^2
  }
  const index = Math.abs(hash) % BADGE_COLOR_PALETTES.length;
  return BADGE_COLOR_PALETTES[index];
}
