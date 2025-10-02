import React from 'react';
import { stepsIllustration } from '../../../assets';
import { learningSteps } from '../constants';

const LearningSteps: React.FC = () => (
  <section className="rounded-3xl border border-slate-100 bg-white p-8">
    <div className="flex flex-col gap-6 md:flex-row md:items-center">
      <div className="mx-auto max-w-xs md:mx-0 md:w-2/5">
        <img
          src={stepsIllustration}
          alt="Biểu đồ lộ trình học từng bước"
          className="w-full"
          loading="lazy"
        />
      </div>
      <div className="md:flex-1">
        <h2 className="text-2xl font-semibold text-slate-900">Lộ trình học 4 bước</h2>
        <p className="mt-2 text-sm text-slate-500">
          Bắt đầu nhẹ nhàng và theo dõi tiến bộ rõ ràng với từng bước học được minh hoạ trực quan.
        </p>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {learningSteps.map((step, index) => (
            <li key={step.title} className="relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                {index + 1}
              </span>
              <h3 className="mt-3 text-lg font-medium text-slate-900">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{step.description}</p>
              <span className="pointer-events-none absolute -right-10 -top-10 h-20 w-20 rounded-full bg-indigo-200/50" />
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

export default LearningSteps;
