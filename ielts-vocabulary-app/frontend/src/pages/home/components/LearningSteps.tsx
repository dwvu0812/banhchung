import React from 'react';
import { stepsIllustration } from '../../../assets';
import { learningSteps } from '../constants';

const LearningSteps: React.FC = () => (
  <section className="rounded-3xl border border-slate-200 bg-white px-8 py-10">
    <div className="flex flex-col gap-8 md:flex-row md:items-center">
      <div className="mx-auto w-full max-w-xs md:mx-0 md:w-2/5">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <img
            src={stepsIllustration}
            alt="Biểu đồ lộ trình học từng bước"
            className="w-full"
            loading="lazy"
          />
        </div>
      </div>
      <div className="md:flex-1">
        <h2 className="text-2xl font-semibold text-slate-900">Lộ trình học 4 bước</h2>
        <p className="mt-3 text-sm text-slate-500">
          Mỗi bước tập trung vào một nhiệm vụ rõ ràng để bạn dễ dàng hoàn thành trong khoảng thời gian ngắn.
        </p>
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {learningSteps.map((step, index) => (
            <li
              key={step.title}
              className="group relative flex flex-col gap-2 rounded-2xl border border-slate-100 p-5 transition hover:border-slate-200"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
              <p className="text-sm text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);

export default LearningSteps;
