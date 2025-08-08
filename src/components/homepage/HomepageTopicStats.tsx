import React from 'react';
import { useHomepageStats } from '@/hooks/useHomepageStats';
import { ListChecks } from 'lucide-react';

const HomepageTopicStats: React.FC = () => {
  const { data, loading, error } = useHomepageStats();

  if (error) return null;
  if (!data || loading) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold" style={{ fontFamily: 'Rubik, sans-serif' }}>
            Topics and coverage
          </h3>
          <p className="text-gray-600 mt-2">
            Exact question counts and difficulty levels per topic.
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.topics.map((t) => (
            <div key={t.id} className="rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-600">
                    {t.questions.toLocaleString()} questions • {t.difficulty_levels} difficulty level{t.difficulty_levels === 1 ? '' : 's'}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                  <ListChecks className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageTopicStats;
