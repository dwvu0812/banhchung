import React from 'react';
import { Button } from '../../../components/ui/button';

interface HeroSectionProps {
  onLogin: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onLogin }) => (
  <section className="bg-white">
    <div className="mx-auto max-w-5xl px-6 py-16 text-slate-900">
      <p className="text-sm font-semibold text-indigo-600">Học từ vựng IELTS chủ động</p>
      <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
        Tập trung ghi nhớ từ vựng trọng tâm mỗi ngày
      </h1>
      <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
        Nắm chắc nghĩa, ví dụ và cách dùng của từng từ với lộ trình ôn luyện thông minh.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="rounded-full px-6" onClick={onLogin}>
          Bắt đầu học với Google
        </Button>
        <span className="text-sm text-slate-500 sm:self-center">
          Hoàn toàn miễn phí, đồng bộ trên mọi thiết bị.
        </span>
      </div>
    </div>
  </section>
);

export default HeroSection;
