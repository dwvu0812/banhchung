import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';
import GuestLanding from './home/GuestLanding';
import LearningDashboard from './home/LearningDashboard';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return <GuestLanding onLogin={authAPI.googleLogin} />;
  }

  return (
    <LearningDashboard
      user={user}
      onStartStudy={() => navigate('/study')}
      onExploreVocabulary={() => navigate('/ielts-vocabulary')}
      onLogout={handleLogout}
    />
  );
};

export default HomePage;
