import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import DashboardPage from './pages/DashboardPage';
import StudyPage from './pages/StudyPage';
import IeltsVocabularyPage from './pages/IeltsVocabularyPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/study"
              element={
                <ProtectedRoute>
                  <StudyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ielts-vocabulary"
              element={
                <ProtectedRoute>
                  <IeltsVocabularyPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
