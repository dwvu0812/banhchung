import React from 'react';
import { keyFeatures } from '../constants';

const HighlightsGrid: React.FC = () => (
  <section className="rounded-3xl bg-white p-8 shadow-sm">
    <h2 className="text-2xl font-semibold text-slate-900">Những điểm mạnh chính</h2>
    <div className="mt-6 grid gap-6 sm:grid-cols-2">
      {keyFeatures.map(({ icon: Icon, title, description }) => (
        <article key={title} className="flex gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default HighlightsGrid;
