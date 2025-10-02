import React from 'react';
import { Progress } from '../../../components/ui/progress';
import { LevelSegment } from '../insights';

interface MasteryOverviewProps {
  distribution: LevelSegment[];
}

const MasteryOverview: React.FC<MasteryOverviewProps> = ({ distribution }) => {
  const total = distribution.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Mức độ thuần thục</h2>
      <ul className="mt-4 space-y-3">
        {distribution.map((segment) => (
          <li key={segment.level}>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>{segment.label}</span>
              <span>{segment.count}</span>
            </div>
            <Progress value={(segment.count / total) * 100} className="mt-2 h-2" />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MasteryOverview;
