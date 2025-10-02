import React from 'react';
import { Progress } from '../../../components/ui/progress';
import { StudyPlan } from '../insights';

interface StudyPlanCardProps {
  plan: StudyPlan;
}

const StudyPlanCard: React.FC<StudyPlanCardProps> = ({ plan }) => {
  const completion = Math.min((plan.dueCount / plan.target) * 100, 100);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Kế hoạch hôm nay</h2>
      <p className="mt-2 text-sm text-slate-500">{plan.focusMessage}</p>
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Lượt ôn đến hạn</span>
          <span>
            {plan.dueCount}/{plan.target}
          </span>
        </div>
        <Progress value={completion} className="mt-2 h-2" />
      </div>
      <div className="mt-4 rounded-2xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
        <p>
          <span className="font-semibold">Từ mới gợi ý:</span> {plan.newWords}
        </p>
        <p className="mt-1">{plan.nextReviewMessage}</p>
      </div>
    </section>
  );
};

export default StudyPlanCard;
