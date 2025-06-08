
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, BarChart3, Users, Zap, Target, Brain, Clock, Award } from "lucide-react";

const EnhancedFeaturesSection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards(prev => {
              const newVisible = [...prev];
              newVisible[cardIndex] = true;
              return newVisible;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = sectionRef.current?.querySelectorAll('[data-index]');
    cards?.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent, cardIndex: number) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(10px)
      scale(1.02)
    `;
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    const card = e.currentTarget as HTMLElement;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
  };

  const features = [
    {
      icon: BookOpen,
      title: "מאגר שאלות עדכני",
      description: "אלפי שאלות מעודכנות כמו במבחן האמיתי",
      badge: "מעודכן יומית",
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: Target,
      title: "סימולציות מדויקות",
      description: "תרגול בפורמט זהה למבחן הרשמי",
      badge: "דיוק 100%",
      color: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      icon: BarChart3,
      title: "מעקב ביצועים מתקדם",
      description: "ניתוח חכם של החזקות והחולשות שלך",
      badge: "AI מובנה",
      color: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50"
    },
    {
      icon: Brain,
      title: "למידה אדפטיבית",
      description: "המערכת מתאימה את עצמה לרמה שלך",
      badge: "חכם",
      color: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50"
    },
    {
      icon: Clock,
      title: "תזמון מושלם",
      description: "טיימר מתקדם לניהול זמן אפקטיבי",
      badge: "זמן אמת",
      color: "from-indigo-500 to-blue-500",
      bgGradient: "from-indigo-50 to-blue-50"
    },
    {
      icon: Users,
      title: "קהילה פעילה",
      description: "אלפי תלמידים שעוזרים אחד לשני",
      badge: "חיי",
      color: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50"
    },
    {
      icon: Award,
      title: "תעודות הצלחה",
      description: "הכרה רשמית בהישגים שלך",
      badge: "מוכר",
      color: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50"
    },
    {
      icon: Zap,
      title: "עדכונים מיידיים",
      description: "חדשות ושינויים במבחן בזמן אמת",
      badge: "מיידי",
      color: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-50 to-blue-50"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(45deg, #3b82f6 25%, transparent 25%), linear-gradient(-45deg, #3b82f6 25%, transparent 25%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-6 py-2">
            יתרונות מתקדמים
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Rubik, sans-serif' }}>
            למה לבחור ב-AMIRAM Academy?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Rubik, sans-serif' }}>
            פלטפורמה מתקדמת שמשלבת טכנולוגיה חדשנית עם מתודולוגיה מוכחת
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              data-index={index}
              className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                visibleCards[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                background: `linear-gradient(135deg, ${feature.bgGradient.split(' ')[1]}, white 70%)`,
                transformStyle: 'preserve-3d'
              }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={() => setHoveredCard(index)}
            >
              {/* Animated Background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs bg-gradient-to-r ${feature.color} text-white border-0 group-hover:scale-105 transition-transform duration-300`}
                  >
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <CardDescription className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  {feature.description}
                </CardDescription>
              </CardContent>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-6" style={{ fontFamily: 'Rubik, sans-serif' }}>
            כל התכונות האלה וגם מידע נוסף מחכים לך בפלטפורמה
          </p>
          <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full">
            <Zap className="w-5 h-5 text-blue-600 mr-2 animate-pulse" />
            <span className="text-blue-800 font-medium" style={{ fontFamily: 'Rubik, sans-serif' }}>
              הצטרף היום ותתחיל להשתמש מיידית
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedFeaturesSection;
