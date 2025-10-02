import React from 'react';
import { heroIllustration } from '../../../assets';
import { Button } from '../../../components/ui/button';

interface HeroSectionProps {
  onLogin: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onLogin }) => (
  <section className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-slate-100">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.18),transparent_60%)]" />
    <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-16 text-slate-900 md:flex-row md:gap-16">
      <div className="max-w-xl text-center md:text-left">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Học từ vựng IELTS chủ động</p>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
          Tập trung ghi nhớ từ vựng trọng tâm mỗi ngày
        </h1>
        <p className="mt-4 text-base text-slate-600 sm:text-lg">
          Nắm chắc nghĩa, ví dụ và cách dùng của từng từ với lộ trình ôn luyện thông minh cùng biểu đồ tiến bộ trực quan.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:items-start">
          <Button size="lg" className="rounded-full px-6" onClick={onLogin}>
            Bắt đầu học với Google
          </Button>
          <span className="text-sm text-slate-500 sm:self-center md:self-start">
            Hoàn toàn miễn phí, đồng bộ trên mọi thiết bị.
          </span>
        </div>
      </div>
      <div className="relative w-full max-w-md">
        <div className="absolute -left-6 -top-6 h-16 w-16 rounded-3xl bg-indigo-200/40 blur-2xl" />
        <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-violet-200/50 blur-3xl" />
        <img
          src={heroIllustration}
          alt="Học từ vựng IELTS với biểu đồ và thẻ ghi nhớ"
          className="relative w-full drop-shadow-2xl"
          loading="lazy"
        />
      </div>
    </div>
  </section>
);

export default HeroSection;
