import React from 'react';
import { Brain, CalendarCheck, CheckCircle } from 'lucide-react';
import { DashboardStats } from '../utils';

interface LearningSummaryProps {
  stats: DashboardStats;
}

const LearningSummary: React.FC<LearningSummaryProps> = ({ stats }) => {
  const items = [
    { label: 'Từ đã thuộc', value: stats.totalLearned, Icon: Brain },
    { label: 'Cần ôn hôm nay', value: stats.dueToday, Icon: CalendarCheck },
    { label: 'Độ chính xác', value: `${stats.accuracy}%`, Icon: CheckCircle },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {items.map(({ label, value, Icon }) => (
        <article key={label} className="rounded-3xl bg-white p-6 shadow-sm">
          <Icon className="h-6 w-6 text-indigo-500" />
          <p className="mt-3 text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-semibold text-slate-900">{value}</p>
        </article>
      ))}
    </section>
  );
};

export default LearningSummary;
