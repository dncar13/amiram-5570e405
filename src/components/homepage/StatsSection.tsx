import React, { useEffect, useState } from 'react';
import { Users, Trophy, BookOpen, Clock } from 'lucide-react';

const targetCounts = {
  students: 1500,
  successRate: 94,
  questions: 1000,
  hours: 24
};

const StatsSection: React.FC = () => {
  const [inView, setInView] = useState(false);
  const [counts, setCounts] = useState({
    students: 0,
    successRate: 0,
    questions: 0,
    hours: 0
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('stats-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      const timer = setInterval(() => {
        setCounts(prevCounts => ({
          students: Math.min(prevCounts.students + Math.ceil(targetCounts.students / steps), targetCounts.students),
          successRate: Math.min(prevCounts.successRate + Math.ceil(targetCounts.successRate / steps), targetCounts.successRate),
          questions: Math.min(prevCounts.questions + Math.ceil(targetCounts.questions / steps), targetCounts.questions),
          hours: Math.min(prevCounts.hours + Math.ceil(targetCounts.hours / steps), targetCounts.hours)
        }));
      }, interval);

      return () => clearInterval(timer);
    }
  }, [inView]);

  const stats = [
    {
      icon: Users,
      count: counts.students,
      suffix: '+',
      label: 'סטודנטים מצליחים',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Trophy,
      count: counts.successRate,
      suffix: '%',
      label: 'שיעור הצלחה',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: BookOpen,
      count: counts.questions,
      suffix: '+',
      label: 'שאלות מעודכנות',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Clock,
      count: counts.hours,
      suffix: '/7',
      label: 'תמיכה מקצועית',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <section 
      id="stats-section"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent"
            style={{ fontFamily: 'Rubik, sans-serif' }}
          >
            המספרים מדברים בעד עצמם
          </h2>
          <p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Rubik, sans-serif' }}
          >
            אלפי סטודנטים כבר השתמשו בפלטפורמה שלנו והשיגו תוצאות מצוינות במבחן אמירם
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-xl border border-white/50`}
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: inView ? 'fadeInUp 0.8s ease-out forwards' : 'none'
                }}
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <div 
                  className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  {stat.count.toLocaleString()}{stat.suffix}
                </div>
                
                <div 
                  className="text-gray-600 font-medium text-lg"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200/50 shadow-lg">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  +
                </div>
              </div>
              <span className="text-gray-700 font-medium mr-3" style={{ fontFamily: 'Rubik, sans-serif' }}>
                מצטרפים אלינו מדי יום
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default StatsSection;
