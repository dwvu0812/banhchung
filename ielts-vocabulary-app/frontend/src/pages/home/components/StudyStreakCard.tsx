import React from 'react';
import { Flame } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface StudyStreakCardProps {
  currentStreak: number;
  bestStreak: number;
  lastCheckIn: string | null;
  isCheckedInToday: boolean;
  onCheckIn: () => void;
}

const formatDate = (value: string | null) => {
  if (!value) {
    return 'Chưa có';
  }

  try {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, (month ?? 1) - 1, day ?? 1);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Cannot format streak date', error);
    return value;
  }
};

const StudyStreakCard: React.FC<StudyStreakCardProps> = ({
  currentStreak,
  bestStreak,
  lastCheckIn,
  isCheckedInToday,
  onCheckIn,
}) => {
  const message = (() => {
    if (currentStreak === 0) {
      return 'Bắt đầu chuỗi học của bạn bằng một check-in đầu tiên!';
    }
    if (isCheckedInToday) {
      return 'Tuyệt vời! Bạn đã duy trì chuỗi học hôm nay.';
    }
    return 'Đừng bỏ lỡ chuỗi học, check-in ngay để giữ phong độ.';
  })();

  return (
    <article className="flex h-full flex-col justify-between rounded-3xl bg-white p-6 shadow-sm">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-indigo-500">Chuỗi ngày học</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            {currentStreak} ngày liên tiếp
          </h3>
        </div>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
          <Flame className="h-6 w-6 text-orange-500" />
        </span>
      </header>

      <p className="mt-4 text-sm text-slate-600">{message}</p>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Kỷ lục</p>
          <p className="text-lg font-semibold text-slate-900">{bestStreak} ngày</p>
          <p className="mt-1 text-xs text-slate-400">
            Lần check-in gần nhất: {formatDate(lastCheckIn)}
          </p>
        </div>
        <Button onClick={onCheckIn} disabled={isCheckedInToday} className="shrink-0">
          {isCheckedInToday ? 'Đã check-in hôm nay' : 'Check-in hôm nay'}
        </Button>
      </div>
    </article>
  );
};

export default StudyStreakCard;
