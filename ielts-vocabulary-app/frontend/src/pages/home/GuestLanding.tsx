import React from 'react';
import DailyMotivationQuote from '../../components/DailyMotivationQuote';
import HeroSection from './components/HeroSection';
import LearningSteps from './components/LearningSteps';

interface GuestLandingProps {
  onLogin: () => void;
}

const GuestLanding: React.FC<GuestLandingProps> = ({ onLogin }) => (
  <div className="min-h-screen bg-slate-50">
    <HeroSection onLogin={onLogin} />
    <main className="mx-auto max-w-5xl space-y-12 px-6 pb-20">
      <DailyMotivationQuote className="bg-white" />
      <LearningSteps />
    </main>
  </div>
);

export default GuestLanding;
