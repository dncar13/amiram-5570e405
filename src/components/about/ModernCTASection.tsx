
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";

const ModernCTASection = () => {
  return (
    <section className="py-32 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-500/20 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-orange-300/10 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        {/* Testimonial highlight */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 space-x-reverse bg-white/10 rounded-full px-6 py-3 backdrop-blur-sm">
            <div className="flex space-x-1 space-x-reverse">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-white/90 text-sm font-medium">
              "בזכות AMIRAM Academy עברתי עם 134!"
            </span>
          </div>
        </div>

        {/* Main CTA content */}
        <div className="space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            בוא תנסה סימולציה אחת
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 font-light max-w-3xl mx-auto">
            תבין מיד למה תלמידים נשארים איתנו עד יום הבחינה
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
              to="/simulations-entry"
            >
              נסה סימולציה חינם
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/30 text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-2xl text-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              to="/topics"
            >
              התחל ללמוד עכשיו
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-8 text-blue-200 text-sm flex items-center justify-center space-x-6 space-x-reverse">
            <span className="flex items-center space-x-2 space-x-reverse">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>אין צורך בכרטיס אשראי</span>
            </span>
            <span className="flex items-center space-x-2 space-x-reverse">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>תמיכה 24/7</span>
            </span>
            <span className="flex items-center space-x-2 space-x-reverse">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>אפשר לבטל בכל רגע</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernCTASection;
