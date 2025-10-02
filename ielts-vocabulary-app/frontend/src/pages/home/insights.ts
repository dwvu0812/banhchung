import { UserProgress } from '../../types';

export interface LevelSegment {
  level: number;
  label: string;
  count: number;
}

export interface StudyPlan {
  target: number;
  dueCount: number;
  newWords: number;
  focusMessage: string;
  nextReviewMessage: string;
}

const levelLabels: Record<number, string> = {
  0: 'Mới bắt đầu (Lv 0)',
  1: 'Đang làm quen (Lv 1)',
  2: 'Cần củng cố (Lv 2)',
  3: 'Tiến bộ tốt (Lv 3)',
  4: 'Gần thành thạo (Lv 4)',
  5: 'Đã thành thạo (Lv 5)',
};

export const emptyDistribution: LevelSegment[] = Object.keys(levelLabels).map((key) => ({
  level: Number(key),
  label: levelLabels[Number(key)],
  count: 0,
}));

export const defaultStudyPlan: StudyPlan = {
  target: 15,
  dueCount: 0,
  newWords: 5,
  focusMessage: 'Hoàn thiện lịch học với các từ mới phù hợp.',
  nextReviewMessage: 'Chưa có lịch ôn tiếp theo.',
};

export const buildLevelDistribution = (progress: UserProgress[]): LevelSegment[] => {
  const counts = new Map<number, number>();
  progress.forEach((item) => {
    counts.set(item.level, (counts.get(item.level) || 0) + 1);
  });

  return emptyDistribution.map((segment) => ({
    ...segment,
    count: counts.get(segment.level) || 0,
  }));
};

const formatRelativeDate = (date: Date) => {
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((date.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) / msPerDay);

  if (diffDays <= 0) return 'Hôm nay';
  if (diffDays === 1) return 'Ngày mai';
  if (diffDays <= 7) return `Trong ${diffDays} ngày tới`;
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
};

const resolveNextReviewMessage = (progress: UserProgress[]) => {
  const upcoming = progress
    .map((item) => new Date(item.nextReviewDate))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  if (upcoming.length === 0) {
    return 'Chưa có lịch ôn tiếp theo.';
  }

  return `Ôn tiếp vào ${formatRelativeDate(upcoming[0])}`;
};

export const buildStudyPlan = (progress: UserProgress[], dueCount: number): StudyPlan => {
  const target = 15;
  const remainingCapacity = Math.max(target - dueCount, 0);
  const newWords = remainingCapacity === 0 ? 0 : Math.max(3, remainingCapacity);
  const focusMessage =
    dueCount === 0
      ? `Bắt đầu chu kỳ mới với ${newWords} từ mới.`
      : dueCount >= target
      ? `Ưu tiên hoàn tất ${dueCount} lượt ôn đến hạn.`
      : `Hoàn tất ${dueCount} lượt ôn và thêm ${newWords} từ mới.`;

  return {
    target,
    dueCount,
    newWords,
    focusMessage,
    nextReviewMessage: resolveNextReviewMessage(progress),
  };
};
