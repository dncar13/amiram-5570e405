
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CheckCircle, Star, Trophy, Users, Zap, ArrowDown } from "lucide-react";

const EnhancedHeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const progress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />
      
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Dynamic Background */}
        <div 
          className="absolute inset-0 opacity-30 transition-all duration-1000"
          style={{
            background: `
              radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, 
                rgba(168, 85, 247, 0.1) 0%, transparent 50%)
            `
          }}
        />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float"
            style={{ 
              top: '20%', 
              right: '10%',
              animationDelay: '0s',
              animationDuration: '15s'
            }}
          />
          <div 
            className="absolute w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float"
            style={{ 
              bottom: '10%', 
              left: '5%',
              animationDelay: '5s',
              animationDuration: '20s'
            }}
          />
          <div 
            className="absolute w-48 h-48 bg-orange-400/10 rounded-full blur-3xl animate-float"
            style={{ 
              top: '50%', 
              right: '20%',
              animationDelay: '10s',
              animationDuration: '18s'
            }}
          />
        </div>

        {/* Main Content */}
        <div className="container relative z-10 mx-auto px-4 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="text-center lg:text-right">
              {/* Premium Badge with Animation */}
              <div 
                className={`inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-6 py-3 rounded-full mb-6 shadow-lg transition-all duration-1000 hover:scale-105 hover:shadow-xl ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ animationDelay: '0.2s' }}
              >
                <Star className="w-5 h-5 mr-2 animate-pulse" />
                <span style={{ fontFamily: 'Rubik, sans-serif' }}>
                  הפלטפורמה המובילה להכנה למבחן אמירם
                </span>
              </div>

              {/* Main Headline with Gradient Animation */}
              <h1 
                className={`text-4xl md:text-6xl font-bold leading-tight mb-6 transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  fontFamily: 'Rubik, sans-serif',
                  fontWeight: '700',
                  animationDelay: '0.4s',
                  background: 'linear-gradient(-45deg, #1e40af, #3b82f6, #1d4ed8, #2563eb)',
                  backgroundSize: '400% 400%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradient-shift 6s ease infinite'
                }}
              >
                המסלול המקצועי להצלחה במבחן אמירם
              </h1>
              
              {/* Subtitle with Typewriter Effect */}
              <p 
                className={`text-xl md:text-2xl mb-8 text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  fontFamily: 'Rubik, sans-serif',
                  animationDelay: '0.6s'
                }}
              >
                פלטפורמה מתקדמת עם +1000 שאלות מעודכנות, סימולציות מדויקות ומעקב ביצועים אישי
              </p>

              {/* Feature List with Staggered Animation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-lg mx-auto lg:mx-0">
                {[
                  { icon: CheckCircle, text: "+1000 שאלות מעודכנות", delay: "0.8s" },
                  { icon: CheckCircle, text: "סימולציות מדויקות", delay: "0.9s" },
                  { icon: CheckCircle, text: "מעקב ביצועים מתקדם", delay: "1.0s" },
                  { icon: CheckCircle, text: "תמיכה מקצועית 24/7", delay: "1.1s" }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className={`flex items-center text-gray-700 transition-all duration-1000 hover:text-blue-600 ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                    style={{ animationDelay: item.delay }}
                  >
                    <item.icon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/simulations-entry">
                  <Button
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                    style={{ fontFamily: 'Rubik, sans-serif' }}
                  >
                    <span className="relative z-10 flex items-center">
                      <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                      התחל תרגול מתקדם
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Button>
                </Link>
                
                <Link to="/premium">
                  <Button
                    variant="outline"
                    size="lg"
                    className="group relative overflow-hidden border-2 border-blue-300 text-blue-600 bg-white/80 backdrop-blur-sm hover:bg-blue-50 font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:border-blue-400 hover:shadow-lg"
                    style={{ fontFamily: 'Rubik, sans-serif' }}
                  >
                    <span className="relative z-10">שדרג לפרימיום</span>
                    <div className="absolute inset-0 bg-blue-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Enhanced Stats */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "+15,000", label: "סטודנטים מצליחים", color: "from-yellow-400 to-orange-500", delay: "1.2s" },
                  { value: "94%", label: "שיעור הצלחה", color: "from-green-400 to-emerald-500", delay: "1.3s" },
                  { value: "1,000+", label: "שאלות מעודכנות", color: "from-blue-400 to-blue-500", delay: "1.4s" },
                  { value: "24/7", label: "תמיכה מקצועית", color: "from-purple-400 to-purple-500", delay: "1.5s" }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-500 hover:shadow-xl cursor-pointer ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ animationDelay: stat.delay }}
                  >
                    <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:animate-pulse`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                  </div>
                ))}
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>
    </>
  );
};

export default EnhancedHeroSection;
