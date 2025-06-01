
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section 
      className="relative bg-cover bg-center text-gray-800 min-h-[600px] flex items-center"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')", 
        backgroundPosition: "center", 
        backgroundSize: "cover" 
      }}
    >
      {/* רקע לבן עדין */}
      <div className="absolute inset-0 bg-white/80 z-0" />
      
      {/* תוכן ה-Hero עם אנימציה */}
      <div 
        className={`container relative z-10 mx-auto px-4 py-24 text-center transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}
      >
        <h1 
          className="text-4xl md:text-6xl font-bold leading-tight mb-6 transition-all duration-500 delay-150"
          style={{ 
            color: '#0056b3',
            fontFamily: 'Rubik, sans-serif',
            fontWeight: '700'
          }}
        >
          הדרך הבטוחה להצלחה במבחן אמירם – תרגול, בטחון והצלחה
        </h1>
        
        <p 
          className="text-xl md:text-2xl mt-6 max-w-4xl mx-auto mb-10 transition-all duration-500 delay-300"
          style={{ 
            color: '#333333',
            fontFamily: 'Rubik, sans-serif',
            fontWeight: '400',
            lineHeight: '1.6'
          }}
        >
          סימולציות מדויקות, מעקב ביצועים אישי ומשוב מפורט – כל הכלים להצלחה שלכם במבחן אמירם במקום אחד.
        </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12 transition-all duration-500 delay-500">
          <Link to="/simulations-entry">
            <Button
              className="text-white font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              style={{ 
                backgroundColor: '#ff7f0e',
                fontFamily: 'Rubik, sans-serif',
                borderRadius: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e96e06';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ff7f0e';
              }}
            >
              התחילו לתרגל עכשיו
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
