import React from 'react';
import DailyMotivationQuote from '../../components/DailyMotivationQuote';
import { User } from '../../types';
import DashboardHeader from './components/DashboardHeader';
import LearningSummary from './components/LearningSummary';
import UpcomingReviews from './components/UpcomingReviews';
import MasteryOverview from './components/MasteryOverview';
import StudyPlanCard from './components/StudyPlanCard';
import StudyStreakCard from './components/StudyStreakCard';
import useDashboardData from './useDashboardData';
import useStudyStreak from './useStudyStreak';

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
  const { stats, dueVocabulary, levelDistribution, studyPlan, isLoading } = useDashboardData();
  const { currentStreak, bestStreak, lastCheckIn, isCheckedInToday, checkIn } = useStudyStreak();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <DashboardHeader user={user} onStartStudy={onStartStudy} onLogout={onLogout} />
        <DailyMotivationQuote className="border-0 bg-gradient-to-r from-indigo-500/90 to-sky-500/90 text-white shadow-lg shadow-indigo-200/40" />
        <LearningSummary stats={stats} />
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StudyPlanCard plan={studyPlan} />
          <MasteryOverview distribution={levelDistribution} />
          <StudyStreakCard
            currentStreak={currentStreak}
            bestStreak={bestStreak}
            lastCheckIn={lastCheckIn}
            isCheckedInToday={isCheckedInToday}
            onCheckIn={checkIn}
          />
        </section>
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
