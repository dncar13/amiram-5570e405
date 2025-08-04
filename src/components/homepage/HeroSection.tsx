
import React, { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { CheckCircle, Star, Trophy, Users, Zap, ArrowLeft, Sparkles, Brain, Target, Award, BookOpen, TrendingUp } from "lucide-react";

// Optimized custom hook for animated counter - better performance
const useAnimatedCounter = (end: number, duration: number = 1500, delay: number = 0, suffix: string = '') => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLDivElement>(null);
  const inView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (!inView) return;
    
    const startTime = Date.now() + delay;
    const endValue = parseInt(end.toString());
    
    // Use requestAnimationFrame instead of setInterval for better performance
    let animationId: number;
    
    const animate = () => {
      const now = Date.now();
      const elapsed = Math.max(0, now - startTime);
      const progress = Math.min(elapsed / duration, 1);
      
      // Simpler easing function
      const easeOut = (t: number) => 1 - (1 - t) * (1 - t);
      const currentCount = Math.floor(easeOut(progress) * endValue);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [end, duration, delay, inView]);

  return { count: count + suffix, ref: nodeRef };
};

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const { scrollY } = useScroll();
  
  // Optimized animated counters - faster and lighter
  const studentsCount = useAnimatedCounter(1500, 1200, 300, '+');
  const successRate = useAnimatedCounter(94, 1000, 400, '%');
  const questionsCount = useAnimatedCounter(2000, 1400, 500, '+');
  
   // Optimized parallax effects - reduced complexity for better performance
  const y1 = useTransform(scrollY, [0, 500], [0, -50]);
  const y2 = useTransform(scrollY, [0, 500], [0, -75]);
  const y3 = useTransform(scrollY, [0, 500], [0, 50]);
  
  // Simplified opacity and scale for better performance
  const opacity = useTransform(scrollY, [0, 400], [1, 0.8]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.99]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Simplified floating cards animation - fewer cards for better performance
  const floatingCards = [
    { icon: <Brain className="w-6 h-6" />, color: "from-blue-500 to-indigo-600", delay: 0 },
    { icon: <Target className="w-6 h-6" />, color: "from-emerald-500 to-green-600", delay: 4 },
  ];

  return (
    <section ref={containerRef} className="relative bg-black text-white min-h-screen md:min-h-screen flex items-center overflow-hidden">
      {/* Advanced gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/90 to-purple-950/80" />
        {/* Optimized mesh gradient for better performance */}
        <svg className="absolute inset-0 w-full h-full opacity-15" preserveAspectRatio="none">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad1)" />
        </svg>
        
        {/* Noise texture for depth */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`
        }} />
      </div>      {/* Floating cards in background - Optimized for performance */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingCards.map((card, index) => (
          <motion.div
            key={index}
            className="absolute w-16 h-20 md:w-24 md:h-32"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth * 0.8 : 600),
              y: (typeof window !== 'undefined' ? window.innerHeight : 600) + 100,
              opacity: 0.4
            }}
            animate={{
              y: -150,
              rotateZ: 180
            }}
            transition={{
              duration: 15,
              delay: card.delay,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ 
              left: `${20 + index * 40}%`,
              y: y3,
              willChange: 'transform'
            }}
          >
            <div className={`w-full h-full bg-gradient-to-br ${card.color} rounded-xl shadow-lg bg-opacity-20 flex items-center justify-center text-white/40`}>
              <div className="scale-75">
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Twinkling stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, index) => (
          <motion.div
            key={`star-${index}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Star className="w-1 h-1 md:w-2 md:h-2 text-white/30 fill-current" />
          </motion.div>
        ))}
      </div>      {/* Optimized gradient orbs - reduced complexity */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-[200px] h-[200px] md:w-[400px] md:h-[400px]"
        style={{ y: y1, willChange: 'transform' }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-transparent rounded-full blur-2xl"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-1/4 left-1/4 w-[150px] h-[150px] md:w-[300px] md:h-[300px]"
        style={{ y: y2, willChange: 'transform' }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent rounded-full blur-xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
      
      {/* Main content with enhanced animations */}
      <motion.div 
        className="container relative z-10 mx-auto px-4 py-24"
        style={{ opacity, scale }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Main content */}
          <motion.div className="text-center lg:text-right">
            {/* Premium indicator with advanced animation */}
            <motion.div 
              className="inline-flex items-center bg-white/5 backdrop-blur-2xl rounded-full px-8 py-4 mb-10 border border-white/10 shadow-2xl relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 3
                }}
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-amber-400 mr-3 relative z-10" />
              </motion.div>
              <span className="text-sm font-medium bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent relative z-10">
                הפלטפורמה המובילה להכנה למבחן אמירם
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ 
                fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '800',
                letterSpacing: '-0.02em'
              }}
            >
              <motion.span 
                className="block"
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="bg-gradient-to-l from-white via-blue-100 to-white bg-clip-text text-transparent">
                  המסלול
                </span>
              </motion.span>
              <motion.span 
                className="block"
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="bg-gradient-to-l from-white via-blue-100 to-white bg-clip-text text-transparent">
                  המקצועי
                </span>
              </motion.span>
              <motion.span 
                className="block"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <span className="bg-gradient-to-l from-orange-300 via-amber-300 to-yellow-300 bg-clip-text text-transparent">
                  להצלחה במבחן
                </span>
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl mb-12 text-gray-300 leading-[1.6] max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ 
                fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '400',
                letterSpacing: '-0.01em'
              }}
            >
              פלטפורמה מתקדמת עם <span className="text-white font-medium">למעלה מ-2000 שאלות עדכניות</span>, 
              סימולציות אמיתיות ומעקב ביצועים אישי –
              <span className="text-blue-300"> הדרך שלך להצלחה במבחן אמירנט.</span>
            </motion.p>

            {/* Key features with enhanced animations */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {[
                { text: "+2000 שאלות מעודכנות", icon: <BookOpen className="w-5 h-5" /> },
                { text: "סימולציות מדויקות", icon: <Target className="w-5 h-5" /> },
                { text: "מעקב ביצועים מתקדם", icon: <TrendingUp className="w-5 h-5" /> },
                { text: "תמיכה מקצועית 24/7", icon: <Users className="w-5 h-5" /> }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center text-gray-200 group cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div 
                    className="relative ml-3"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <div className="text-green-400 relative z-10">
                      {feature.icon}
                    </div>
                    <div className="absolute inset-0 bg-green-400 blur-xl opacity-0 group-hover:opacity-60 transition-opacity" />
                  </motion.div>
                  <span className="text-sm font-medium group-hover:text-white transition-colors">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
              
            <motion.div 
              className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link to="/simulations-entry">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
                  <Button
                    size="lg"
                    className="relative bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-lg px-10 py-6 rounded-2xl shadow-2xl border-0 overflow-hidden"
                    style={{ fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif' }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                      style={{ opacity: 0.3 }}
                    />
                    <span className="relative z-10 flex items-center">
                      <Zap className="w-5 h-5 mr-3" />
                      התחל תרגול מתקדם
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: -5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <ArrowLeft className="w-5 h-5 mr-3" />
                      </motion.div>
                    </span>
                  </Button>
                </motion.div>
              </Link>
              
              <Link to="/premium">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white/20 text-white bg-white/5 backdrop-blur-2xl hover:bg-white/10 hover:border-white/30 font-semibold text-lg px-10 py-6 rounded-2xl transition-all duration-300 shadow-xl relative overflow-hidden group"
                    style={{ fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, sans-serif' }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <span className="relative z-10">שדרג לפרימיום</span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right column - Ultra Premium Animated Stats */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              {[
                { 
                  value: studentsCount.count, 
                  ref: studentsCount.ref,
                  label: "סטודנטים מצליחים", 
                  color: "from-yellow-400 to-orange-500", 
                  delay: 0.5,
                  icon: <Users className="w-6 h-6" />
                },
                { 
                  value: successRate.count, 
                  ref: successRate.ref,
                  label: "שיעור הצלחה", 
                  color: "from-green-400 to-emerald-500", 
                  delay: 0.6,
                  icon: <Award className="w-6 h-6" />
                },
                { 
                  value: questionsCount.count, 
                  ref: questionsCount.ref,
                  label: "שאלות מעודכנות", 
                  color: "from-blue-400 to-indigo-500", 
                  delay: 0.7,
                  icon: <BookOpen className="w-6 h-6" />
                },
                { 
                  value: "24/7", 
                  label: "תמיכה מקצועית", 
                  color: "from-purple-400 to-pink-500", 
                  delay: 0.8,
                  icon: <Users className="w-6 h-6" />
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, y: 50, rotateX: -30 }}
                  animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{ 
                    duration: 0.8, 
                    delay: stat.delay, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    rotateX: { duration: 1 }
                  }}
                  whileHover={{ 
                    y: -10,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >                  <motion.div 
                    className="bg-white/5 backdrop-blur-3xl rounded-2xl md:rounded-3xl p-4 md:p-8 border border-white/10 text-center overflow-hidden relative"
                    whileHover={{ 
                      borderColor: "rgba(255,255,255,0.3)",
                      backgroundColor: "rgba(255,255,255,0.08)"
                    }}
                  >
                    {/* Animated background gradient */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                      {/* Icon with animation */}
                    <motion.div 
                      className={`w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-4 bg-gradient-to-br ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center text-white relative z-10`}
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-4 h-4 md:w-6 md:h-6">
                        {stat.icon}
                      </div>
                    </motion.div>
                    
                    {/* Animated number */}
                    <motion.div 
                      className={`text-2xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-3 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent relative z-10`}
                      ref={stat.ref}
                    >
                      {stat.value}
                    </motion.div>
                    
                    <div className="text-xs md:text-sm text-gray-300 font-medium relative z-10">
                      {stat.label}
                    </div>
                    
                    {/* Shine effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
              {/* Central floating element - Simplified */}
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ willChange: 'transform' }}
            >
              <div className="w-full h-full bg-gradient-to-br from-orange-500/10 to-purple-500/10 rounded-full blur-lg" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
