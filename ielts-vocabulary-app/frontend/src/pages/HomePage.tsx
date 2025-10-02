import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BookOpen, Brain, Target, TrendingUp, Star, Users, Award } from 'lucide-react';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    authAPI.googleLogin();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-600 p-4 rounded-full">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                IELTS Vocabulary Master
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Học từ vựng IELTS hiệu quả với phương pháp Spaced Repetition. 
                Nâng cao band điểm của bạn một cách khoa học và bền vững.
              </p>
              
              <Button
                onClick={handleGoogleLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Bắt đầu học miễn phí
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                    <Brain className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Spaced Repetition</h3>
                  <p className="text-gray-600">Thuật toán khoa học giúp ghi nhớ từ vựng lâu dài và hiệu quả</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">IELTS Focused</h3>
                  <p className="text-gray-600">Từ vựng được tuyển chọn kỹ lưỡng cho kỳ thi IELTS</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Progress Tracking</h3>
                  <p className="text-gray-600">Theo dõi tiến độ chi tiết và thống kê học tập</p>
                </CardContent>
              </Card>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-yellow-500 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">1000+</span>
                </div>
                <p className="text-gray-600">Từ vựng IELTS</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">5000+</span>
                </div>
                <p className="text-gray-600">Học viên</p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-6 w-6 text-green-500 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">7.5+</span>
                </div>
                <p className="text-gray-600">Band điểm trung bình</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Chào mừng trở lại, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Tiếp tục hành trình học từ vựng IELTS của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Học từ mới
              </CardTitle>
              <CardDescription>
                Khám phá từ vựng IELTS mới và mở rộng vốn từ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => handleNavigate('/study')}
              >
                Bắt đầu học
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-green-600" />
                Ôn tập
              </CardTitle>
              <CardDescription>
                Ôn lại từ vựng đã học với phương pháp Spaced Repetition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleNavigate('/study')}
              >
                Ôn tập ngay
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Thống kê
              </CardTitle>
              <CardDescription>
                Xem tiến độ học tập và phân tích chi tiết
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => handleNavigate('/dashboard')}
              >
                Xem chi tiết
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;