
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Zap, BarChart3, VideoIcon, BookOpen, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const PremiumShowcase = () => {
  const premiumFeatures = [
    {
      icon: <Crown className="h-8 w-8 text-yellow-500" />,
      title: "גישה בלתי מוגבלת",
      description: "גישה מלאה לכל 1000+ השאלות ו-7 נושאי הלימוד",
      highlight: true
    },
    {
      icon: <VideoIcon className="h-8 w-8 text-blue-600" />,
      title: "סרטוני הסבר מקצועיים",
      description: "סרטוני הסבר מפורטים מאת מומחים לכל נושא",
      highlight: false
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      title: "ניתוח ביצועים מתקדם",
      description: "מעקב מפורט אחר ההתקדמות והישגים אישיים",
      highlight: false
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      title: "סימולציות אמיתיות",
      description: "תרגול בסביבה זהה למבחן האמיתי",
      highlight: false
    },
    {
      icon: <BookOpen className="h-8 w-8 text-orange-600" />,
      title: "חומרי עזר מקצועיים",
      description: "מדריכים, טיפים ואסטרטגיות מומחים",
      highlight: false
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-red-600" />,
      title: "מסלולי למידה מותאמים",
      description: "תכנית אישית מותאמת לרמת הידע שלך",
      highlight: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-6 py-3 text-lg border-0 mb-6">
            <Crown className="w-5 h-5 mr-2" />
            חבילת פרימיום
          </Badge>
          
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent"
            style={{ fontFamily: 'Rubik, sans-serif' }}
          >
            הפתרון המקצועי המושלם
          </h2>
          
          <p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Rubik, sans-serif' }}
          >
            חבילת הפרימיום שלנו מעניקה לך את כל הכלים המתקדמים להצלחה מושלמת במבחן אמירם
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {premiumFeatures.map((feature, index) => (
            <Card 
              key={index}
              className={`p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 ${
                feature.highlight 
                  ? 'bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 ring-2 ring-yellow-400/30' 
                  : 'bg-white shadow-lg'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-4 rounded-2xl mb-6 ${
                  feature.highlight 
                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100' 
                    : 'bg-gray-50'
                }`}>
                  {feature.icon}
                </div>
                
                <h3 
                  className="text-xl font-bold mb-4 text-gray-900"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  {feature.title}
                </h3>
                
                <p 
                  className="text-gray-600 leading-relaxed"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Premium CTA */}
        <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
          </div>
          
          <div className="relative z-10">
            <h3 
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ fontFamily: 'Rubik, sans-serif' }}
            >
              מוכן להתחיל את המסע להצלחה?
            </h3>
            
            <p 
              className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto"
              style={{ fontFamily: 'Rubik, sans-serif' }}
            >
              הצטרף ל-15,000+ סטודנטים שכבר משתמשים בפלטפורמה המתקדמת שלנו
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/premium">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg px-10 py-4 rounded-xl shadow-2xl border-0 transform hover:scale-105 transition-all duration-300"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  שדרג לפרימיום עכשיו
                </Button>
              </Link>
              
              <Link to="/simulations-entry">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300"
                  style={{ fontFamily: 'Rubik, sans-serif' }}
                >
                  התחל תרגול חינם
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumShowcase;
