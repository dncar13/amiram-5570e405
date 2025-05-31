import React, { useEffect, useState } from 'react';

const Button = ({ children, to, className }) => {
  return (
    <a href={to} className="inline-block">
      <button className={`transition duration-300 rounded-md ${className}`}>
        {children}
      </button>
    </a>
  );
};

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // הפעלת אנימציה עם טעינת הדף
    setIsVisible(true);
  }, []);

  return (
    <section 
      className="relative bg-cover bg-center text-white min-h-[600px] flex items-center"
      style={{ 
        backgroundImage:  "url('/lovable-uploads/hero-study.jpg')", 
        backgroundPosition: "center", 
        backgroundSize: "cover" 
      }}
    >
      {/* שכבת רקע כחולה כהה אחידה */}
      <div className="absolute inset-0 bg-blue-900/70 z-0" />
      
      {/* תוכן ה-Hero עם אנימציה */}
      <div 
        className={`container relative z-10 mx-auto px-4 py-24 text-center transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}
      >
        <h1 className="text-3xl md:text-5xl font-bold leading-snug text-white drop-shadow-2xl mb-6 transition-all duration-500 delay-150">
          הפלטפורמה המובילה בישראל ללימודי חשמל – לומדים מהבית, ניגשים לבחינה עם ביטחון
        </h1>
        
        <p className="text-lg md:text-xl mt-6 text-white drop-shadow-md max-w-3xl mx-auto mb-10 transition-all duration-500 delay-300">
          מאגר סימולציות חכם, שאלות מעודכנות, ליווי אישי והסברים מקצועיים – הדרך שלך לרישיון חשמלאי מתחילה כאן
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center mt-8 transition-all duration-500 delay-500">
          <Button 
            to="/topics" 
            className="bg-white text-blue-900 hover:bg-gray-100 py-4 px-8 font-bold shadow-lg hover:shadow-xl"
          >
            התחל ללמוד בחינם
          </Button>
          
          <Button 
            to="/premium" 
            className="bg-orange-500 text-white hover:bg-orange-600 py-4 px-8 font-bold shadow-lg hover:shadow-xl"
          >
            לרכישת גישה מלאה
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;