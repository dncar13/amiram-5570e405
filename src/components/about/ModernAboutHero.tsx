
import { ChevronDown, Check, Clock, HelpCircle } from "lucide-react";

const ModernAboutHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-blue-800/10"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="space-y-12 animate-fade-in">
          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent block mb-4">
              אנגלית פסיכומטרי
            </span>
            <span className="text-5xl md:text-6xl lg:text-7xl">
              שמתאימה לכל תלמיד
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl md:text-3xl lg:text-4xl text-gray-700 font-light max-w-4xl mx-auto leading-relaxed">
            מהבית שלכם, במחיר שכל סטודנט יכול להרשות לעצמו
          </p>
          
          {/* Arrow with margin */}
          <div className="py-8">
            <ChevronDown className="w-8 h-8 md:w-10 md:h-10 text-gray-400 mx-auto animate-bounce" />
          </div>
          
          {/* Feature list with icons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>בלי התחייבות</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <span>גישה מיידית</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <span>מעל 100 שאלות לתרגול</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernAboutHero;
