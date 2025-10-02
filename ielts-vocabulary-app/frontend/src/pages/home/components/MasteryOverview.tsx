import React from 'react';
import { LevelSegment } from '../insights';

interface MasteryOverviewProps {
  distribution: LevelSegment[];
}

const MasteryOverview: React.FC<MasteryOverviewProps> = ({ distribution }) => {
  const totalCount = distribution.reduce((sum, item) => sum + item.count, 0);
  const safeTotal = totalCount || 1;
  const palette = ['#6366F1', '#A855F7', '#F97316', '#0EA5E9', '#22C55E'];
  const segments = distribution.map((segment, index) => ({
    ...segment,
    color: palette[index % palette.length],
    percentage: totalCount ? Math.round((segment.count / safeTotal) * 100) : 0,
  }));
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Mức độ thuần thục</h2>
      <p className="mt-1 text-sm text-slate-500">Theo dõi sự phân bổ từ vựng của bạn theo từng cấp độ ghi nhớ.</p>
      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
          <svg viewBox="0 0 200 200" className="h-full w-full rotate-[-90deg]">
            <circle cx="100" cy="100" r={radius} stroke="#E0E7FF" strokeWidth="20" fill="none" />
            {segments.map((segment) => {
              const value = segment.count / safeTotal;
              const dashArray = `${value * circumference} ${circumference}`;
              const dashOffset = circumference * (1 - cumulative);
              cumulative += value;

              return (
                <circle
                  key={segment.level}
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke={segment.color}
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  fill="none"
                />
              );
            })}
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-semibold text-slate-900">{totalCount}</span>
            <span className="text-xs uppercase tracking-wide text-slate-500">từ đã học</span>
          </div>
        </div>
        <ul className="flex-1 space-y-3">
          {segments.map((segment) => (
            <li
              key={segment.level}
              className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: segment.color }}
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{segment.label}</p>
                  <p className="text-xs text-slate-500">
                    {segment.count} từ • {segment.percentage}%
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-slate-600">{segment.percentage}%</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default MasteryOverview;
