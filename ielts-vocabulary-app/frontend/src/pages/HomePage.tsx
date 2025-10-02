import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI, userAPI } from '../services/api';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarCheck,
  Compass,
  Feather,
  Heart,
  Layers,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { UserProgress } from '../types';

const featureCards: Array<{
  icon: React.ElementType;
  title: string;
  description: string;
}> = [
  {
    icon: Sparkles,
    title: 'Lộ trình thông minh',
    description:
      'Hệ thống đề xuất nội dung dựa trên tiến độ giúp bạn học đều đặn mỗi ngày.',
  },
  {
    icon: Brain,
    title: 'Spaced Repetition',
    description:
      'Cơ chế nhắc ôn tập tối ưu để ghi nhớ từ vựng lâu dài, giảm quên lãng.',
  },
  {
    icon: Compass,
    title: 'Định hướng theo band điểm',
    description:
      'Học theo mục tiêu band với các chủ đề được tuyển chọn kỹ lưỡng.',
  },
  {
    icon: Heart,
    title: 'Trải nghiệm đáng yêu',
    description:
      'Giao diện pastel nhẹ nhàng giúp việc học trở nên thư thái hơn mỗi ngày.',
  },
];

const journeySteps: Array<{
  title: string;
  description: string;
}> = [
  {
    title: 'Khởi động',
    description:
      'Đánh giá nhanh vốn từ của bạn và nhận bộ từ vựng khởi động phù hợp.',
  },
  {
    title: 'Học chủ động',
    description:
      'Tập trung vào ý nghĩa, phát âm và ví dụ thực tế cho từng từ vựng.',
  },
  {
    title: 'Ôn luyện nhịp nhàng',
    description:
      'Nhận nhắc nhở thông minh dựa trên khoảng thời gian tối ưu để ôn tập.',
  },
  {
    title: 'Bứt tốc band điểm',
    description:
      'Theo dõi tiến bộ và chinh phục các band điểm IELTS mong muốn.',
  },
];

const highlightMetrics = [
  { label: 'Từ vựng chuyên sâu', value: '3.000+' },
  { label: 'Lộ trình luyện tập', value: '30+' },
  { label: 'Tỉ lệ nhớ lâu', value: '92%' },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [stats, setStats] = useState({
    totalLearned: 0,
    dueToday: 0,
    accuracy: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadDashboardData = async () => {
      try {
        const [progressData, dueData] = await Promise.all([
          userAPI.getProgress(),
          userAPI.getDueVocabulary(),
        ]);

        setProgress(progressData);

        const totalLearned = progressData.length;
        const dueToday = dueData.length;
        const totalCorrect = progressData.reduce(
          (sum, item) => sum + item.correctCount,
          0,
        );
        const totalIncorrect = progressData.reduce(
          (sum, item) => sum + item.incorrectCount,
          0,
        );

        const accuracy =
          totalCorrect + totalIncorrect > 0
            ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
            : 0;

        setStats({
          totalLearned,
          dueToday,
          accuracy,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [isAuthenticated]);

  const handleGoogleLogin = () => {
    authAPI.googleLogin();
  };

  const handleStartStudy = () => {
    navigate('/study');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fff4f7] via-[#f5f7ff] to-[#eefcff]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-[#ffd6e8]/60 blur-3xl" />
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#d8f4ff]/70 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#f9f0ff]/80 blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="px-6 py-6 sm:px-10">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
              <div className="flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                <span>IELTS Vocabulary Master</span>
              </div>
              <span className="hidden text-sm text-slate-500 sm:inline-flex">
                Luyện tập mỗi ngày để đạt band điểm mơ ước ✨
              </span>
            </div>
          </header>

          <main className="flex-1 px-6 pb-16 sm:px-10">
            <div className="mx-auto flex max-w-6xl flex-col gap-16">
              <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-500 shadow-sm backdrop-blur">
                    <Sparkles className="h-4 w-4" />
                    Lộ trình IELTS cá nhân hóa
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                      Biến việc học từ vựng thành trải nghiệm đáng yêu mỗi ngày
                    </h1>
                    <p className="mt-5 max-w-xl text-base text-slate-600 sm:text-lg">
                      IELTS Vocabulary Master kết hợp phương pháp Spaced Repetition với giao diện pastel lấy cảm hứng từ MochiMochi để giúp bạn học tập nhẹ nhàng mà vẫn hiệu quả.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                      onClick={handleGoogleLogin}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-6 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl hover:shadow-indigo-200 sm:w-auto"
                      size="lg"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.66-2.84-.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Đăng nhập với Google
                    </Button>
                    <div className="flex w-full items-center justify-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-5 py-3 text-sm text-slate-600 shadow-sm backdrop-blur sm:w-auto">
                      <CalendarCheck className="h-4 w-4 text-indigo-500" />
                      <span>Học chỉ 15 phút mỗi ngày</span>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {highlightMetrics.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-white/60 bg-white/70 p-5 text-center shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        <p className="text-2xl font-semibold text-indigo-500">{item.value}</p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <Card className="border-none bg-white/80 shadow-xl backdrop-blur">
                  <CardHeader className="space-y-6 pb-0">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-indigo-100 p-2 text-indigo-600">
                        <Layers className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500">
                          Lộ trình hôm nay
                        </p>
                        <CardTitle className="text-2xl font-semibold text-slate-900">
                          12 từ cần ôn tập
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-base text-slate-500">
                      Nhận gợi ý học tập cân bằng giữa từ mới và ôn tập để tối ưu ghi nhớ.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white shadow-lg">
                        <p className="text-sm font-medium">Band mục tiêu</p>
                        <p className="mt-2 text-3xl font-semibold">7.5+</p>
                        <p className="mt-1 text-xs text-white/80">
                          Cá nhân hóa theo trình độ hiện tại
                        </p>
                      </div>
                      <div className="rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 p-4 text-white shadow-lg">
                        <p className="text-sm font-medium">Chuỗi học</p>
                        <p className="mt-2 text-3xl font-semibold">12 ngày</p>
                        <p className="mt-1 text-xs text-white/80">
                          Duy trì streak để mở khóa quà tặng
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4 rounded-2xl border border-dashed border-indigo-100 bg-indigo-50/60 p-4">
                      <div className="flex items-start gap-3">
                        <Feather className="h-5 w-5 text-indigo-500" />
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Bộ đề hôm nay
                          </p>
                          <p className="text-sm text-slate-500">
                            Collocations &amp; Academic phrases với ví dụ chuẩn xác.
                          </p>
                        </div>
                      </div>
                      <Button className="w-full rounded-full bg-indigo-500 text-white hover:bg-indigo-600">
                        Xem thử trải nghiệm
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section className="space-y-8">
                <div className="flex flex-col gap-3 text-center">
                  <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                    Vì sao học viên yêu thích IELTS Vocabulary Master?
                  </h2>
                  <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base">
                    Từng chi tiết được chăm chút theo phong cách MochiMochi: pastel nhẹ nhàng, icon đáng yêu và trải nghiệm học tập đầy cảm hứng.
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {featureCards.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <Card
                        key={feature.title}
                        className="border-none bg-white/80 p-6 shadow-lg shadow-indigo-50 transition hover:-translate-y-1 hover:shadow-xl backdrop-blur"
                      >
                        <div className="flex items-start gap-4">
                          <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-500">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                            <p className="text-sm text-slate-600">{feature.description}</p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </section>

              <section className="grid gap-10 rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">
                    <Heart className="h-4 w-4" />
                    Lộ trình pastel
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900">
                    Lộ trình học tập từng bước nhẹ nhàng mà hiệu quả
                  </h3>
                  <p className="text-sm text-slate-600 sm:text-base">
                    Chúng tôi kết hợp phương pháp học khoa học với cách trình bày trực quan, giúp bạn luôn cảm thấy được dẫn dắt và có động lực đồng hành.
                  </p>
                  <div className="flex flex-col gap-3 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-indigo-400" />
                      Nhắc học theo lịch cá nhân hoá dựa trên hiệu suất gần đây.
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-pink-400" />
                      Mini game và sticker pastel mở khóa khi duy trì streak.
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-400" />
                      Theo dõi band mục tiêu với biểu đồ đơn giản, dễ hiểu.
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-indigo-200 via-pink-200 to-purple-200" />
                  <div className="space-y-6">
                    {journeySteps.map((step, index) => (
                      <div
                        key={step.title}
                        className="relative rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="absolute -left-7 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-lg font-bold text-white shadow-lg">
                          {index + 1}
                        </div>
                        <h4 className="text-lg font-semibold text-slate-900">{step.title}</h4>
                        <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-10 text-center text-white shadow-2xl">
                <h3 className="text-2xl font-semibold sm:text-3xl">
                  Sẵn sàng biến việc học từ vựng thành niềm vui?
                </h3>
                <p className="mt-3 text-sm text-white/80 sm:text-base">
                  Hàng nghìn học viên đã cải thiện band điểm IELTS với hành trình pastel cùng chúng tôi.
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                  <Button
                    onClick={handleGoogleLogin}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-600 hover:bg-white/90"
                  >
                    Bắt đầu miễn phí
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <span className="text-xs uppercase tracking-wide text-white/80">
                    Không cần thẻ tín dụng
                  </span>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fff9f4] via-[#f5f7ff] to-[#edfaff]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-24 h-64 w-64 rounded-full bg-[#ffe2d5]/70 blur-3xl" />
        <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-[#d9f3ff]/70 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#f0e9ff]/80 blur-3xl" />
      </div>

      <div className="relative z-10 pb-16">
        <header className="px-4 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-indigo-100 p-2 text-indigo-500">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">
                  IELTS Vocabulary Master
                </span>
                <span className="text-xs text-slate-500">Lộ trình pastel mỗi ngày</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
                />
              )}
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
                <p className="text-xs text-slate-500">Luôn giữ streak nhé!</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-full">
                Đăng xuất
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto mt-10 flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-none bg-white/80 shadow-xl backdrop-blur">
              <CardHeader className="space-y-4 p-8 pb-4">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-500">
                  Xin chào trở lại
                </span>
                <CardTitle className="text-3xl font-semibold text-slate-900">
                  Chào mừng trở lại, {user?.name}!
                </CardTitle>
                <CardDescription className="text-base text-slate-600">
                  Tiếp tục hành trình học IELTS với các hoạt động gợi ý dưới đây. Mỗi bước nhỏ đều giúp bạn tiến gần hơn tới band điểm mơ ước.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8 pt-0">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Button
                    onClick={handleStartStudy}
                    className="h-auto rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-4 text-left text-base font-semibold text-white shadow-lg shadow-indigo-200 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Ôn tập hôm nay</p>
                        <p className="mt-1 text-xs font-normal text-white/80">
                          {stats.dueToday > 0
                            ? `Có ${stats.dueToday} từ đang chờ bạn`
                            : 'Không có từ đến hạn - khám phá thêm!'}
                        </p>
                      </div>
                      <Brain className="h-6 w-6" />
                    </div>
                  </Button>
                  <Button
                    onClick={() => navigate('/ielts-vocabulary')}
                    variant="secondary"
                    className="h-auto rounded-2xl border border-indigo-100 bg-white px-4 py-4 text-left text-base font-semibold text-indigo-600 shadow-sm hover:border-indigo-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Bộ từ IELTS</p>
                        <p className="mt-1 text-xs font-normal text-slate-500">
                          Khám phá chủ đề theo band điểm
                        </p>
                      </div>
                      <Target className="h-6 w-6 text-indigo-400" />
                    </div>
                  </Button>
                  <Button
                    onClick={() => navigate('/study')}
                    variant="outline"
                    className="h-auto rounded-2xl border border-pink-200/80 bg-pink-50/60 px-4 py-4 text-left text-base font-semibold text-pink-600 shadow-sm hover:bg-pink-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Học từ mới</p>
                        <p className="mt-1 text-xs font-normal text-pink-500/80">
                          Bổ sung vốn từ nâng cao
                        </p>
                      </div>
                      <Sparkles className="h-6 w-6" />
                    </div>
                  </Button>
                  <Button
                    onClick={() => navigate('/dashboard')}
                    variant="ghost"
                    className="h-auto rounded-2xl border border-transparent bg-indigo-50/70 px-4 py-4 text-left text-base font-semibold text-indigo-600 hover:bg-indigo-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Thống kê chi tiết</p>
                        <p className="mt-1 text-xs font-normal text-indigo-500/80">
                          Theo dõi tiến độ từng ngày
                        </p>
                      </div>
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-white/80 shadow-xl backdrop-blur">
              <CardHeader className="space-y-4 p-8 pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 p-2 text-purple-500">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-purple-500">
                      Nhịp học hiện tại
                    </p>
                    <CardTitle className="text-2xl font-semibold text-slate-900">
                      Tổng quan tiến độ
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-8 pt-0">
                <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-5 text-white shadow-lg">
                  <p className="text-sm">Chuỗi học liên tục</p>
                  <p className="mt-2 text-3xl font-semibold">
                    {stats.dueToday > 0 ? 'Đừng bỏ lỡ hôm nay!' : 'Bạn đang dẫn trước nhịp!'}
                  </p>
                  <p className="mt-1 text-xs text-white/80">
                    Hoàn thành phiên học hôm nay để nhận sticker pastel mới.
                  </p>
                </div>
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-white/80 px-4 py-3">
                    <span className="font-medium text-slate-700">Từ đã học</span>
                    <span className="text-lg font-semibold text-indigo-500">{stats.totalLearned}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-pink-100 bg-white/80 px-4 py-3">
                    <span className="font-medium text-slate-700">Cần ôn hôm nay</span>
                    <span className="text-lg font-semibold text-pink-500">{stats.dueToday}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-purple-100 bg-white/80 px-4 py-3">
                    <span className="font-medium text-slate-700">Độ chính xác</span>
                    <span className="text-lg font-semibold text-purple-500">{stats.accuracy}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <Card className="border-none bg-white/75 shadow-lg backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Từ đã học
                </CardTitle>
                <BookOpen className="h-4 w-4 text-indigo-400" />
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="text-3xl font-semibold text-indigo-500">{stats.totalLearned}</div>
                <p className="mt-2 text-xs text-slate-500">
                  Tổng số từ vựng bạn đã ghi nhớ.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-white/75 shadow-lg backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Cần ôn tập
                </CardTitle>
                <Brain className="h-4 w-4 text-pink-400" />
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="text-3xl font-semibold text-pink-500">{stats.dueToday}</div>
                <p className="mt-2 text-xs text-slate-500">
                  Số lượng từ nên ôn lại ngay hôm nay.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-white/75 shadow-lg backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Độ chính xác
                </CardTitle>
                <Target className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="text-3xl font-semibold text-purple-500">{stats.accuracy}%</div>
                <p className="mt-2 text-xs text-slate-500">
                  Tỷ lệ trả lời đúng trong các phiên gần đây.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="border-none bg-white/80 shadow-xl backdrop-blur">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-semibold text-slate-900">
                  Tiến độ học tập
                </CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  Theo dõi quá trình học và độ chính xác của bạn.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8 pt-0">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                    <span>Từ vựng đã thuộc</span>
                    <span>
                      {progress.filter((p) => p.level >= 3).length}/{stats.totalLearned}
                    </span>
                  </div>
                  <Progress
                    value={
                      stats.totalLearned > 0
                        ? (progress.filter((p) => p.level >= 3).length / stats.totalLearned) * 100
                        : 0
                    }
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                    <span>Độ chính xác</span>
                    <span>{stats.accuracy}%</span>
                  </div>
                  <Progress value={stats.accuracy} />
                </div>
                <div className="rounded-2xl border border-dashed border-indigo-100 bg-indigo-50/60 p-5 text-sm text-slate-600">
                  <p>
                    Tip pastel hôm nay: Hãy thử viết lại 3 câu mới với từ vừa học để tăng khả năng ghi nhớ ngữ cảnh.
                  </p>
                </div>
              </CardContent>
            </Card>

            {progress.length > 0 && (
              <Card className="border-none bg-white/80 shadow-xl backdrop-blur">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-semibold text-slate-900">
                    Tiến độ gần đây
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    Các từ vựng bạn đã tương tác trong thời gian gần đây.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-8 pt-0">
                  {progress.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-2xl border border-indigo-50 bg-white/70 px-4 py-3 shadow-sm"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          Từ vựng #{item.vocabularyId.slice(-6)}
                        </p>
                        <p className="text-xs text-slate-500">
                          Level {item.level} • {item.correctCount} đúng, {item.incorrectCount} sai
                        </p>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(item.updatedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
