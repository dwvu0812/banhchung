import { useEffect, useState } from 'react';
import { userAPI } from '../../services/api';
import { StudySession } from '../../types';
import { buildStats, emptyStats, DashboardStats } from './utils';
import {
  buildLevelDistribution,
  buildStudyPlan,
  defaultStudyPlan,
  emptyDistribution,
  LevelSegment,
  StudyPlan,
} from './insights';

const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [dueVocabulary, setDueVocabulary] = useState<StudySession[]>([]);
  const [levelDistribution, setLevelDistribution] = useState<LevelSegment[]>(emptyDistribution);
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(defaultStudyPlan);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressData, dueData] = await Promise.all([
          userAPI.getProgress(),
          userAPI.getDueVocabulary(),
        ]);
        setStats(buildStats(progressData, dueData.length));
        setDueVocabulary(dueData);
        setLevelDistribution(buildLevelDistribution(progressData));
        setStudyPlan(buildStudyPlan(progressData, dueData.length));
      } catch (error) {
        console.error('Error loading dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, dueVocabulary, levelDistribution, studyPlan, isLoading };
};

export default useDashboardData;
