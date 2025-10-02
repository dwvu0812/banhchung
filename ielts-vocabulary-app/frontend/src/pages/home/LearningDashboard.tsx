import React from 'react';
import { User } from '../../types';
import DashboardHeader from './components/DashboardHeader';
import LearningSummary from './components/LearningSummary';
import UpcomingReviews from './components/UpcomingReviews';
import useDashboardData from './useDashboardData';

interface LearningDashboardProps {
  user: User;
  onStartStudy: () => void;
  onExploreVocabulary: () => void;
  onLogout: () => void;
}

const LearningDashboard: React.FC<LearningDashboardProps> = ({
  user,
  onStartStudy,
  onExploreVocabulary,
  onLogout,
}) => {
  const { stats, dueVocabulary, isLoading } = useDashboardData();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <DashboardHeader user={user} onStartStudy={onStartStudy} onLogout={onLogout} />
        <LearningSummary stats={stats} />
        <UpcomingReviews
          dueVocabulary={dueVocabulary}
          onExploreVocabulary={onExploreVocabulary}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default LearningDashboard;
