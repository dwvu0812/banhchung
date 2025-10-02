import { UserProgress } from '../../types';

export interface DashboardStats {
  totalLearned: number;
  dueToday: number;
  accuracy: number;
}

export const emptyStats: DashboardStats = {
  totalLearned: 0,
  dueToday: 0,
  accuracy: 0,
};

export const buildStats = (
  progress: UserProgress[],
  dueCount: number,
): DashboardStats => {
  const totals = progress.reduce(
    (acc, item) => ({
      correct: acc.correct + item.correctCount,
      incorrect: acc.incorrect + item.incorrectCount,
    }),
    { correct: 0, incorrect: 0 },
  );

  const attempts = totals.correct + totals.incorrect;
  const accuracy = attempts === 0 ? 0 : Math.round((totals.correct / attempts) * 100);

  return { totalLearned: progress.length, dueToday: dueCount, accuracy };
};
