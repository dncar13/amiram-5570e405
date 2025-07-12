
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Play, Quote, Shield, Clock, Users } from "lucide-react";

const ModernCTASection = () => {
  return (
    <section 
      className="py-20 md:py-32 relative overflow-hidden"
      style={{
        background: "linear-gradient(rgba(36,91,219,0.8), rgba(36,91,219,0.8)), url('https://i.postimg.cc/vTR3Kk4q/good.jpg') center center/cover no-repeat"
      }}
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-500/20 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-orange-300/10 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        {/* Testimonial highlight */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-3 space-x-reverse bg-white/10 rounded-full px-6 py-3 backdrop-blur-sm">
            <Quote className="w-5 h-5 text-white/80 flex-shrink-0" />
            <div className="flex space-x-1 space-x-reverse">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-white/90 text-sm font-medium">
              "יעל שיפרה מ-85 ל-115 בזכות השיטה שלכם!"
            </span>
          </div>
        </div>

        {/* Main CTA content */}
        <div className="space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            מוכנים להתחיל?
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 font-light max-w-3xl mx-auto">
            הצטרפו לתלמידים שכבר שיפרו את הציונים שלהם
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
              to="/simulations-entry"
            >
              <Play className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              התחילו לימודים חינם
            </Button>
            
            <Button 
              size="lg" 
              className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-2xl text-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              to="/topics"
            >
              לפרטים נוספים
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-8 text-blue-200 text-sm flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <span className="flex items-center space-x-2 space-x-reverse">
              <Clock className="w-4 h-4 text-green-400" />
              <span>ניסיון חינם ל-7 ימים</span>
            </span>
            <span className="flex items-center space-x-2 space-x-reverse">
              <Shield className="w-4 h-4 text-green-400" />
              <span>ביטול בכל עת</span>
            </span>
            <span className="flex items-center space-x-2 space-x-reverse">
              <Users className="w-4 h-4 text-green-400" />
              <span>תמיכה אישית</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernCTASection;
