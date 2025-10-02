import React from 'react';
import { keyFeatures } from '../constants';

const HighlightsGrid: React.FC = () => (
  <section className="rounded-3xl border border-slate-200 bg-white px-8 py-10">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <h2 className="text-2xl font-semibold text-slate-900">Những điểm mạnh chính</h2>
      <p className="max-w-md text-sm text-slate-500">
        Lựa chọn các tính năng cần thiết giúp bạn tập trung học từng ngày mà không bị choáng ngợp.
      </p>
    </div>
    <div className="mt-8 grid gap-6 sm:grid-cols-2">
      {keyFeatures.map(({ icon: Icon, title, description }) => (
        <article key={title} className="flex gap-4 rounded-2xl border border-slate-100 p-5 transition hover:border-slate-200">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Icon className="h-5 w-5" />
          </span>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default HighlightsGrid;
