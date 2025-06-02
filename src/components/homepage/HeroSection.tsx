
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CheckCircle, Star, Trophy, Users, Zap } from "lucide-react";

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section 
      className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white min-h-[700px] flex items-center overflow-hidden"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>
      
      {/* Premium badge floating */}
      <div className="absolute top-8 right-8 z-20">
        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-2 text-sm border-0 shadow-lg">
          <Trophy className="w-4 h-4 mr-1" />
          חשבון פרימיום
        </Badge>
      </div>
      
      {/* Main content */}
      <div 
        className={`container relative z-10 mx-auto px-4 py-24 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Main content */}
          <div className="text-center lg:text-right">
            {/* Premium indicator */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20">
              <Star className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-sm font-medium">הפלטפורמה המובילה להכנה למבחן אמירם</span>
            </div>

            <h1 
              className="text-4xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-l from-white via-blue-100 to-yellow-200 bg-clip-text text-transparent"
              style={{ 
                fontFamily: 'Rubik, sans-serif',
                fontWeight: '700'
              }}
            >
              המסלול המקצועי להצלחה במבחן אמירם
            </h1>
            
            <p 
              className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              style={{ 
                fontFamily: 'Rubik, sans-serif',
                fontWeight: '400',
                lineHeight: '1.6'
              }}
            >
              פלטפורמה מתקדמת עם +1000 שאלות מעודכנות, סימולציות מדויקות ומעקב ביצועים אישי. 
              הכלים המקצועיים שיובילו אתכם להצלחה.
            </p>

            {/* Key features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center text-blue-100">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-sm">+1000 שאלות מעודכנות</span>
              </div>
              <div className="flex items-center text-blue-100">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-sm">סימולציות מדויקות</span>
              </div>
              <div className="flex items-center text-blue-100">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-sm">מעקב ביצועים מתקדם</span>
              </div>
              <div className="flex items-center text-blue-100">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-sm">תמיכה מקצועית 24/7</span>
              </div>
            </div>
              
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/simulations-entry">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  התחל תרגול מתקדם
                </Button>
              </Link>
              
              <Link to="/premium">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  שדרג לפרימיום
                </Button>
              </Link>
            </div>
          </div>

          {/* Right column - Stats */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold text-yellow-400 mb-2">+15,000</div>
                <div className="text-sm text-blue-100">סטודנטים מצליחים</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold text-green-400 mb-2">94%</div>
                <div className="text-sm text-blue-100">שיעור הצלחה</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold text-blue-300 mb-2">1,000+</div>
                <div className="text-sm text-blue-100">שאלות מעודכנות</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold text-purple-300 mb-2">24/7</div>
                <div className="text-sm text-blue-100">תמיכה מקצועית</div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse delay-1000" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
