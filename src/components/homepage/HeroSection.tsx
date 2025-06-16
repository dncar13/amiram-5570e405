import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Trophy, Users, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-electric-blue via-blue-600 to-electric-navy text-white py-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            הכנה מושלמת ל
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent block mt-2">
              מבחן האמי"ר
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 leading-relaxed text-blue-100">
            אלפי שאלות מותאמות, סימולציות מדויקות ומערכת מעקב מתקדמת
            <br />
            שתעזור לך להצליח במבחן בביטחון מלא
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/simulation/full/preparation">
              <Button size="lg" className="bg-white text-electric-blue hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Trophy className="ml-2 h-6 w-6" />
                התחל סימולציה מלאה
              </Button>
            </Link>
            
            <Link to="/topics">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-electric-blue text-lg px-8 py-6 rounded-full transition-all duration-300">
                <BookOpen className="ml-2 h-6 w-6" />
                תרגול לפי נושאים
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300 mb-2">1000+</div>
              <div className="text-blue-100">שאלות מעודכנות</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300 mb-2">95%</div>
              <div className="text-blue-100">שיעור הצלחה</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-300 mb-2">10K+</div>
              <div className="text-blue-100">סטודנטים מרוצים</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
