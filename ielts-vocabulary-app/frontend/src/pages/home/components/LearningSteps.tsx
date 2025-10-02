import React from 'react';
import { learningSteps } from '../constants';

const LearningSteps: React.FC = () => (
  <section className="rounded-3xl border border-slate-100 bg-white p-8">
    <h2 className="text-2xl font-semibold text-slate-900">Lộ trình học 4 bước</h2>
    <ol className="mt-6 grid gap-4 sm:grid-cols-2">
      {learningSteps.map((step, index) => (
        <li key={step.title} className="rounded-2xl bg-slate-50 p-4">
          <span className="text-sm font-semibold text-indigo-600">Bước {index + 1}</span>
          <h3 className="mt-2 text-lg font-medium text-slate-900">{step.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{step.description}</p>
        </li>
      ))}
    </ol>
  </section>
);

export default LearningSteps;
