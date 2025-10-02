import React from 'react';
import { heroIllustration } from '../../../assets';
import { Button } from '../../../components/ui/button';

interface HeroSectionProps {
  onLogin: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onLogin }) => (
  <section className="relative overflow-hidden bg-white">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_60%)]" />
    <div className="relative mx-auto flex max-w-6xl flex-col-reverse items-center gap-16 px-6 py-20 md:flex-row md:gap-20">
      <div className="flex w-full max-w-xl flex-col items-center text-center md:items-start md:text-left">
        <span className="inline-flex items-center rounded-full border border-slate-200 px-4 py-1 text-xs font-medium tracking-widest text-slate-500">
          Lộ trình học tinh gọn
        </span>
        <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
          Ghi nhớ từ vựng IELTS với giao diện tối giản, không xao nhãng
        </h1>
        <p className="mt-4 text-base text-slate-600 sm:text-lg">
          Tập trung vào những từ quan trọng nhất mỗi ngày cùng thẻ học trực quan, thống kê tối giản và nhắc học thông minh.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-slate-600">
          {[
            'Theo dõi tiến độ rõ ràng trên một bảng điều khiển duy nhất',
            'Cấu trúc bài học ngắn gọn, phù hợp cho 15 phút mỗi ngày',
            'Đồng bộ trên mọi thiết bị với tài khoản Google của bạn',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            size="lg"
            className="h-12 w-full rounded-full bg-slate-900 text-base font-semibold text-white hover:bg-slate-900/90 sm:w-auto sm:px-8"
            onClick={onLogin}
          >
            Bắt đầu học miễn phí
          </Button>
          <Button
            variant="ghost"
            className="text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            onClick={onLogin}
          >
            Xem trải nghiệm mẫu
          </Button>
        </div>
      </div>
      <div className="relative flex w-full max-w-md justify-center">
        <div className="absolute -top-12 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-slate-200/60 blur-2xl" />
        <div className="absolute -bottom-10 right-4 h-20 w-20 rounded-full bg-slate-100" />
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <img
            src={heroIllustration}
            alt="Học từ vựng IELTS với biểu đồ và thẻ ghi nhớ"
            className="w-full"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
