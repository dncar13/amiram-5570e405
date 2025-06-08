
import React, { useEffect, useState, useRef } from 'react';
import { Users, TrendingUp, Award, Clock } from 'lucide-react';

const EnhancedStatsSection: React.FC = () => {
  const [counters, setCounters] = useState({
    students: 0,
    successRate: 0,
    questions: 0,
    support: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCounters = () => {
    const duration = 2000;
    const targets = {
      students: 15000,
      successRate: 94,
      questions: 1000,
      support: 24
    };

    const startTime = Date.now();
    
    const updateCounters = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCounters({
        students: Math.floor(targets.students * easeOutQuart),
        successRate: Math.floor(targets.successRate * easeOutQuart),
        questions: Math.floor(targets.questions * easeOutQuart),
        support: Math.floor(targets.support * easeOutQuart)
      });

      if (progress < 1) {
        requestAnimationFrame(updateCounters);
      }
    };

    requestAnimationFrame(updateCounters);
  };

  const stats = [
    {
      icon: Users,
      value: `+${counters.students.toLocaleString()}`,
      label: "סטודנטים מצליחים",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      icon: TrendingUp,
      value: `${counters.successRate}%`,
      label: "שיעור הצלחה",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      icon: Award,
      value: `${counters.questions}+`,
      label: "שאלות מעודכנות",
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50"
    },
    {
      icon: Clock,
      value: `${counters.support}/7`,
      label: "תמיכה מקצועית",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Rubik, sans-serif' }}>
            המספרים מדברים בעד עצמם
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Rubik, sans-serif' }}>
            אלפי סטודנטים כבר השיגו את החלום שלהם עם AMIRAM Academy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                background: `linear-gradient(135deg, ${stat.bgColor.split(' ')[1]}, white 50%)`
              }}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>

              {/* Value */}
              <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ fontFamily: 'Rubik, sans-serif' }}>
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-gray-600 font-medium" style={{ fontFamily: 'Rubik, sans-serif' }}>
                {stat.label}
              </div>

              {/* Hover effect overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
            </div>
          ))}
        </div>

        {/* Live Activity Indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full font-medium">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
            <span style={{ fontFamily: 'Rubik, sans-serif' }}>
              {Math.floor(Math.random() * 20) + 15} סטודנטים פעילים כרגע
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedStatsSection;
