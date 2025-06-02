
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, ArrowLeft, Star, Shield } from "lucide-react";

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Floating shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Premium badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-6 py-3 rounded-full mb-8 shadow-lg">
            <Star className="w-5 h-5 mr-2" />
            <span style={{ fontFamily: 'Rubik, sans-serif' }}>עכשיו זה הזמן להתחיל!</span>
          </div>

          <h2 
            className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight"
            style={{ fontFamily: 'Rubik, sans-serif' }}
          >
            מוכנים להצליח במבחן אמירם?
          </h2>
          
          <p 
            className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed max-w-3xl mx-auto"
            style={{ fontFamily: 'Rubik, sans-serif' }}
          >
            הצטרפו עכשיו לאלפי הסטודנטים שכבר השיגו הצלחה עם הפלטפורמה המובילה להכנה למבחן אמירם
          </p>

          {/* Benefits list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-center text-blue-100">
              <Shield className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
              <span className="text-lg font-medium" style={{ fontFamily: 'Rubik, sans-serif' }}>
                גישה מיידית לכל התכנים
              </span>
            </div>
            <div className="flex items-center justify-center text-blue-100">
              <Shield className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
              <span className="text-lg font-medium" style={{ fontFamily: 'Rubik, sans-serif' }}>
                ללא התחייבות ארוכת טווח
              </span>
            </div>
            <div className="flex items-center justify-center text-blue-100">
              <Shield className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
              <span className="text-lg font-medium" style={{ fontFamily: 'Rubik, sans-serif' }}>
                תמיכה מקצועית 24/7
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/simulations-entry">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl border-0 transform hover:scale-105 transition-all duration-300 group"
                style={{ fontFamily: 'Rubik, sans-serif' }}
              >
                <Zap className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                התחל עכשיו בחינם
                <ArrowLeft className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link to="/premium">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 font-bold text-xl px-12 py-6 rounded-2xl transition-all duration-300 hover:border-white/60"
                style={{ fontFamily: 'Rubik, sans-serif' }}
              >
                שדרג לפרימיום
              </Button>
            </Link>
          </div>

          {/* Urgency element */}
          <div className="mt-12">
            <div className="inline-flex items-center bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-200 px-6 py-3 rounded-full">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse mr-3"></div>
              <span className="font-medium" style={{ fontFamily: 'Rubik, sans-serif' }}>
                מעל 500 סטודנטים נרשמו השבוע האחרון
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
