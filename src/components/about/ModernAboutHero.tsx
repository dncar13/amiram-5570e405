
import { ArrowDown } from "lucide-react";

const ModernAboutHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-blue-800/10"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="space-y-8 animate-fade-in">
          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
            נמאס לך מלימוד
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              שלא באמת מכין אותך
            </span>
            <br />
            לאמירם?
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-gray-600 font-light max-w-4xl mx-auto">
            כאן זה נגמר.
          </p>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Amiram Academy מעניקה לך תרגול אמיתי למבחן האמירם – 
            עם סימולציות, שאלות והסברים שנכתבו במיוחד בשבילך, 
            כדי שביום המבחן הכל ירגיש מוכר.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </section>
  );
};

export default ModernAboutHero;
