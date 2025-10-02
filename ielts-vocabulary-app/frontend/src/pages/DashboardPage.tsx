import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { useAuth } from '../hooks/useAuth';
import { userAPI, vocabularyAPI } from '../services/api';
import { UserProgress, StudySession } from '../types';
import { BookOpen, Brain, Target, TrendingUp, LogOut, Play, Library } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [dueVocabulary, setDueVocabulary] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLearned: 0,
    dueToday: 0,
    accuracy: 0,
  });

  useEffect(() => {
    loadDashboardData();
    initializeSampleData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [progressData, dueData] = await Promise.all([
        userAPI.getProgress(),
        userAPI.getDueVocabulary(),
      ]);

      setProgress(progressData);
      setDueVocabulary(dueData);

      // Calculate stats
      const totalLearned = progressData.length;
      const dueToday = dueData.length;
      const totalCorrect = progressData.reduce((sum, p) => sum + p.correctCount, 0);
      const totalIncorrect = progressData.reduce((sum, p) => sum + p.incorrectCount, 0);
      const accuracy = totalCorrect + totalIncorrect > 0 
        ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
        : 0;

      setStats({
        totalLearned,
        dueToday,
        accuracy,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSampleData = async () => {
    try {
      await vocabularyAPI.initializeSampleData();
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  };

  const handleStartStudy = () => {
    navigate('/study');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">IELTS Vocabulary Master</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {user?.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full mr-2"
                  />
                )}
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Chào mừng trở lại, {user?.name}!
          </h2>
          <p className="text-gray-600 mt-2">
            Tiếp tục hành trình học từ vựng IELTS của bạn
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Từ đã học</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLearned}</div>
              <p className="text-xs text-muted-foreground">
                Tổng số từ vựng đã học
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cần ôn tập</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.dueToday}</div>
              <p className="text-xs text-muted-foreground">
                Từ vựng cần ôn hôm nay
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Độ chính xác</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div>
              <p className="text-xs text-muted-foreground">
                Tỷ lệ trả lời đúng
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Study Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2 text-blue-600" />
                Bắt đầu học
              </CardTitle>
              <CardDescription>
                {stats.dueToday > 0 
                  ? `Có ${stats.dueToday} từ vựng cần ôn tập hôm nay`
                  : 'Học từ vựng mới hoặc ôn tập'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleStartStudy} 
                className="w-full"
                disabled={stats.dueToday === 0}
              >
                {stats.dueToday > 0 ? 'Ôn tập ngay' : 'Học từ mới'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Library className="h-5 w-5 mr-2 text-purple-600" />
                Gói từ vựng IELTS
              </CardTitle>
              <CardDescription>
                Khám phá từ vựng theo chủ đề và cấp độ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/ielts-vocabulary')} 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Xem gói từ vựng
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Tiến độ học tập
              </CardTitle>
              <CardDescription>
                Theo dõi quá trình học của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Từ vựng đã thuộc</span>
                    <span>{progress.filter(p => p.level >= 3).length}/{stats.totalLearned}</span>
                  </div>
                  <Progress 
                    value={stats.totalLearned > 0 ? (progress.filter(p => p.level >= 3).length / stats.totalLearned) * 100 : 0} 
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Độ chính xác</span>
                    <span>{stats.accuracy}%</span>
                  </div>
                  <Progress value={stats.accuracy} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Progress */}
        {progress.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Tiến độ gần đây</CardTitle>
              <CardDescription>
                Các từ vựng bạn đã học gần đây
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {progress.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <span className="font-medium">Từ vựng #{item.vocabularyId.slice(-6)}</span>
                      <div className="text-sm text-gray-500">
                        Level {item.level} • {item.correctCount} đúng, {item.incorrectCount} sai
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {new Date(item.updatedAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;