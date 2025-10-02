import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BookOpen, Brain, Target, TrendingUp } from 'lucide-react';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const handleGoogleLogin = () => {
    authAPI.googleLogin();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              IELTS Vocabulary Master
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Học từ vựng IELTS hiệu quả với phương pháp Spaced Repetition
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center p-4">
                <Brain className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-semibold">Spaced Repetition</h3>
                  <p className="text-sm text-gray-600">Ghi nhớ lâu dài</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-4">
                <Target className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h3 className="font-semibold">IELTS Focused</h3>
                  <p className="text-sm text-gray-600">Từ vựng chuyên biệt</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-4">
                <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h3 className="font-semibold">Progress Tracking</h3>
                  <p className="text-sm text-gray-600">Theo dõi tiến độ</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            size="lg"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
            Đăng nhập với Google
          </Button>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Học từ mới
              </CardTitle>
              <CardDescription>
                Khám phá từ vựng IELTS mới
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Bắt đầu học</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-green-600" />
                Ôn tập
              </CardTitle>
              <CardDescription>
                Ôn lại từ vựng đã học
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Ôn tập ngay</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Thống kê
              </CardTitle>
              <CardDescription>
                Xem tiến độ học tập
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full">Xem chi tiết</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;