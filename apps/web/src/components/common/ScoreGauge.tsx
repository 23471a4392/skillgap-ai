import React from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  sublabel?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 'md',
  showLabel = true,
  sublabel,
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Dimensions
  const dims = {
    sm: { width: 70, stroke: 6, text: 'text-base font-bold' },
    md: { width: 120, stroke: 10, text: 'text-2xl font-bold' },
    lg: { width: 170, stroke: 14, text: 'text-4xl font-extrabold' },
  }[size];

  const radius = (dims.width - dims.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let colorClass = 'stroke-rose-500 text-rose-600';
  let bgFill = 'stroke-rose-100 dark:stroke-rose-950/40';

  if (clampedScore >= 80) {
    colorClass = 'stroke-emerald-500 text-emerald-600 dark:text-emerald-400';
    bgFill = 'stroke-emerald-100 dark:stroke-emerald-950/40';
  } else if (clampedScore >= 65) {
    colorClass = 'stroke-brand-600 text-brand-600 dark:text-brand-400';
    bgFill = 'stroke-brand-100 dark:stroke-brand-950/40';
  } else if (clampedScore >= 50) {
    colorClass = 'stroke-amber-500 text-amber-600 dark:text-amber-400';
    bgFill = 'stroke-amber-100 dark:stroke-amber-950/40';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: dims.width, height: dims.width }}>
        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${dims.width} ${dims.width}`}>
          <circle
            cx={dims.width / 2}
            cy={dims.width / 2}
            r={radius}
            className={bgFill}
            strokeWidth={dims.stroke}
            fill="transparent"
          />
          <circle
            cx={dims.width / 2}
            cy={dims.width / 2}
            r={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth={dims.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`${dims.text} ${colorClass} tracking-tight`}>{clampedScore}%</span>
        </div>
      </div>
      {showLabel && (
        <div className="mt-2 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {sublabel || (clampedScore >= 80 ? 'Interview Ready' : clampedScore >= 65 ? 'Competitive' : 'Gap Closing')}
          </div>
        </div>
      )}
    </div>
  );
};
