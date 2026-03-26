import { formatPercent, getRarityFromPercent } from '@/lib/utils';

const BAR_COLORS: Record<string, string> = {
  common: 'bg-green-400',
  uncommon: 'bg-blue-400',
  rare: 'bg-purple-500',
  'very-rare': 'bg-orange-500',
  legendary: 'bg-yellow-500',
};

export function PercentBar({ percent }: { percent: number }) {
  const rarity = getRarityFromPercent(percent);
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="pct-bar flex-1">
        <div className={`pct-bar-fill ${BAR_COLORS[rarity]}`} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
      <span className="text-xs font-mono font-medium tabular-nums w-10 text-right">{formatPercent(percent)}</span>
    </div>
  );
}
