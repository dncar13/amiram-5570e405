import React from 'react';
import { Link } from 'react-router-dom';
import {
  Headphones,
  Quote,
  Puzzle,
  BookOpenText,
  ChevronRight
} from 'lucide-react';
import { buildListeningUrl, getSavedSelection } from '@/utils/listening';
import { DEFAULTS } from '@/constants/listening';

type Topic = {
  id: 'comprehension' | 'continuation' | 'word-formation' | 'grammar-context';
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
  gradient: string;
};

export default function TopicsGrid() {
  // Get saved level/mode settings
  const saved = getSavedSelection() ?? DEFAULTS;
  const { level, mode } = saved;

  const topics: Topic[] = [
    {
      id: 'comprehension',
      title: 'שאלות על הרצאה או שיחה',
      description: '3 קטעי שמע עם שאלות הבנה',
      icon: Headphones,
      to: '/listening/comprehension',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'continuation',
      title: 'השלמת קטע שמע',
      description: '4 קטעי שמע של 20 שניות',
      icon: Quote,
      to: '/listening/continuation/smoketest',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'word-formation',
      title: 'יצירת מילה',
      description: '10 שאלות השלמת מילה',
      icon: Puzzle,
      to: '/listening/word-formation',
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      id: 'grammar-context',
      title: 'דקדוק בהקשר',
      description: '10 שאלות מבנים דקדוקיים',
      icon: BookOpenText,
      to: '/listening/grammar-context',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Optional small heading */}
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          סוגי הפרקים החדשים
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          בחרו את סוג התרגול שאתם רוצים לתרגל
        </p>
      </div>

      {/* Grid of 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {topics.map((topic) => {
          const IconComponent = topic.icon;
          const { title, description, to, gradient } = topic;

          return (
            <div
              key={topic.id}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Gradient background accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
              
              {/* Card content */}
              <div className="p-6 md:p-8">
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                      {title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>

                {/* Single CTA – "Learn & Practice" removed */}
                <div className="mt-5 flex justify-end">
                  <Link
                    to={buildListeningUrl(to, level, mode)}
                    className={`inline-flex items-center gap-1 rounded-xl border border-transparent bg-gradient-to-r ${gradient} px-4 py-2 text-white font-semibold transition-all duration-300 hover:brightness-110`}
                    aria-label={`Open ${title}`}
                  >
                    סימולציה
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
