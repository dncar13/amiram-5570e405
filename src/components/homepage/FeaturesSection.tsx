
import React, { useEffect, useState } from 'react';
import { Shield, Clock, BarChart, Brain, Target, Award, Users, Zap, BookOpen } from "lucide-react";

const FeaturesSection: React.FC = () => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('features-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const mainFeatures = [
    {
      icon: Brain,
      title: 'הכנה מותאמת אישית',
      description: 'תכנית לימודים חכמה המתאימה עצמה לרמת האנגלית שלכם ולקצב ההתקדמות האישי',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      icon: Target,
      title: 'סימולציות מדויקות',
      description: 'סביבת תרגול זהה למבחן האמיתי עם שעון עצר, ממשק מדויק ותנאים אותנטיים',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100'
    },
    {
      icon: BarChart,
      title: 'מעקב ביצועים מתקדם',
      description: 'ניתוח מפורט של התקדמות, זיהוי נקודות חולשה וחיזוק יעדים אישיים',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    }
  ];

  const additionalFeatures = [
    {
      icon: Award,
      title: 'בנק שאלות מעודכן',
      description: 'למעלה מ-1000 שאלות מעודכנות בכל נושאי המבחן'
    },
    {
      icon: Users,
      title: 'קהילת לומדים',
      description: 'חברות בקהילה של אלפי סטודנטים ושיתוף ידע'
    },
    {
      icon: Clock,
      title: 'זמינות 24/7',
      description: 'גישה לפלטפורמה ותמיכה בכל שעות היום'
    },
    {
      icon: BookOpen,
      title: 'חומרי לימוד מקיפים',
      description: 'מדריכים, טיפים ואסטרטגיות למבחן'
    },
    {
      icon: Zap,
      title: 'ביצועים מהירים',
      description: 'פלטפורמה מהירה ויציבה לחוויית תרגול חלקה'
    },
    {
      icon: Shield,
      title: 'אבטחת מידע',
      description: 'הגנה מלאה על המידע האישי והביצועים שלכם'
    }
  ];

  return (
    <section id="features-section" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className={`text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-1000 ${
              inView ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
            }`}
            style={{ fontFamily: 'Rubik, sans-serif' }}
          >
            למה אנחנו הפלטפורמה המובילה?
          </h2>
          <p 
            className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${
              inView ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
            }`}
            style={{ fontFamily: 'Rubik, sans-serif' }}
          >
            טכנולוגיה מתקדמת, תוכן איכותי ותמיכה מקצועית - הכל במקום אחד
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`group relative bg-gradient-to-br ${feature.bgGradient} rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: inView ? 'fadeInUp 0.8s ease-out forwards' : 'none'
                }}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                
                <h3 
                  className="text-2xl font-bold mb-4 text-gray-800 text-center"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  {feature.title}
                </h3>
                
                <p 
                  className="text-gray-600 leading-relaxed text-center"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {additionalFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:bg-white hover:shadow-lg transition-all duration-300 group ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{
                  animationDelay: `${(index + 3) * 100}ms`,
                  animation: inView ? 'fadeInUp 0.6s ease-out forwards' : 'none'
                }}
              >
                <div className="flex items-start space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 
                      className="text-lg font-semibold mb-2 text-gray-800"
                      style={{ fontFamily: 'Rubik, sans-serif' }}
                    >
                      {feature.title}
                    </h4>
                    <p 
                      className="text-gray-600 text-sm leading-relaxed"
                      style={{ fontFamily: 'Rubik, sans-serif' }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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

export default FeaturesSection;
