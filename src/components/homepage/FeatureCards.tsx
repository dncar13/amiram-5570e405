import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Brain, 
  Target, 
  ChartBar, 
  Clock, 
  Shield, 
  Zap,
  Sparkles,
  TrendingUp,
  Award,
  BookOpen,
  Users,
  Rocket
} from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}

const FeatureCards: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const features: Feature[] = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'למידה מבוססת AI',
      description: 'אלגוריתמים מתקדמים שמתאימים את רמת הקושי אישית לכל תלמיד',
      gradient: 'from-blue-500 to-indigo-600',
      delay: 0.1
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'תרגול ממוקד',
      description: 'זיהוי נקודות חולשה ומיקוד בשיפור היכן שצריך',
      gradient: 'from-emerald-500 to-green-600',
      delay: 0.2
    },
    {
      icon: <ChartBar className="w-8 h-8" />,
      title: 'ניתוח ביצועים מתקדם',
      description: 'דוחות מפורטים על התקדמות ומעקב אחר שיפור לאורך זמן',
      gradient: 'from-purple-500 to-pink-600',
      delay: 0.3
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'סימולציות בזמן אמת',
      description: 'תרגול בתנאי מבחן אמיתיים עם טיימר ולחץ זמן',
      gradient: 'from-orange-500 to-red-600',
      delay: 0.4
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'מאגר שאלות ענק',
      description: 'מעל 1000 שאלות מעודכנות מכל הקטגוריות',
      gradient: 'from-cyan-500 to-blue-600',
      delay: 0.5
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'משוב מיידי',
      description: 'הסברים מפורטים לכל תשובה והמלצות לשיפור',
      gradient: 'from-amber-500 to-yellow-600',
      delay: 0.6
    }
  ];

  return (
    <section className="relative pt-8 pb-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl transform -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl transform -translate-y-1/2" />
      </div>

      <div ref={containerRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
              style={{ 
                fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '800',
                letterSpacing: '-0.02em'
              }}>
            <span className="block">יכולות מתקדמות</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              לתוצאות מקסימליות
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto"
             style={{ 
               fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
               fontWeight: '400'
             }}>
            הפלטפורמה שלנו משלבת טכנולוגיות מתקדמות עם ניסיון פדגוגי מוכח
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: feature.delay,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <motion.div
                className="relative h-full"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Card */}
                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 h-full overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}
                    whileHover={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: 1.1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3"
                      style={{ 
                        fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                        fontWeight: '700'
                      }}>
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed"
                     style={{ 
                       fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                       fontWeight: '400'
                     }}>
                    {feature.description}
                  </p>
                  
                  {/* Learn more link */}
                  <motion.div
                    className="mt-6 flex items-center text-transparent bg-clip-text bg-gradient-to-r"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${feature.gradient.split(' ')[1]}, ${feature.gradient.split(' ')[3]})`
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ x: 5 }}
                  >
                    <span className="font-semibold">למד עוד</span>
                    <motion.svg 
                      className="w-5 h-5 mr-2" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      animate={{ x: 0 }}
                      whileHover={{ x: 5 }}
                    >
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </motion.svg>
                  </motion.div>
                  
                  {/* Decorative element */}
                  <motion.div
                    className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full opacity-10"
                    style={{
                      background: `linear-gradient(135deg, ${feature.gradient.split(' ')[1]}, ${feature.gradient.split(' ')[3]})`
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 90, 0]
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            style={{ fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            <Rocket className="w-5 h-5 ml-3" />
            גלה את כל היכולות
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureCards;