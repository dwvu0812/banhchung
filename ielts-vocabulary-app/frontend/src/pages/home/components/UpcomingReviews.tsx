import React from 'react';
import { Button } from '../../../components/ui/button';
import { StudySession } from '../../../types';

interface UpcomingReviewsProps {
  dueVocabulary: StudySession[];
  onExploreVocabulary: () => void;
  isLoading: boolean;
}

const UpcomingReviews: React.FC<UpcomingReviewsProps> = ({
  dueVocabulary,
  onExploreVocabulary,
  isLoading,
}) => {
  const items = dueVocabulary.slice(0, 4);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Từ cần ôn tiếp theo</h2>
        <Button variant="link" className="px-0" onClick={onExploreVocabulary}>
          Mở thư viện
        </Button>
      </div>
      <ul className="mt-4 space-y-3 text-slate-700">
        {isLoading && <li className="text-sm text-slate-500">Đang tải dữ liệu...</li>}
        {!isLoading && items.length === 0 && (
          <li className="text-sm text-slate-500">Chưa có từ nào cần ôn hôm nay.</li>
        )}
        {!isLoading &&
          items.map((item) => (
            <li key={item.vocabulary._id} className="rounded-2xl border border-slate-100 px-4 py-3">
              <p className="text-base font-semibold text-slate-900">{item.vocabulary.word}</p>
              <p className="text-sm text-slate-500">{item.vocabulary.definition}</p>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default UpcomingReviews;
