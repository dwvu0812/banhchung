import { useEffect, useState } from 'react';
import { userAPI } from '../../services/api';
import { StudySession } from '../../types';
import { buildStats, emptyStats, DashboardStats } from './utils';

const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [dueVocabulary, setDueVocabulary] = useState<StudySession[]>([]);
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
      } catch (error) {
        console.error('Error loading dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, dueVocabulary, isLoading };
};

export default useDashboardData;
