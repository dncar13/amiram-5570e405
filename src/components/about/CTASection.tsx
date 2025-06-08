
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="max-w-4xl mx-auto text-center">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-12 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-6">מוכן להתחיל?</h2>
        <p className="text-xl mb-8 opacity-90">
          הצטרף עכשיו לאלפי תלמידים שכבר עברו את מבחן האמירם בהצלחה!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button 
            size="lg" 
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            to="/topics"
          >
            התחל ללמוד עכשיו
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white text-blue-600 border-2 border-white hover:bg-blue-50 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            to="/simulations-entry"
          >
            נסה סימולציה חינם
          </Button>
        </div>
        <div className="text-sm opacity-75 flex items-center justify-center gap-2">
          <Lock className="h-4 w-4" />
          <span>אין צורך בכרטיס אשראי • אפשר לבטל בכל רגע • תמיכה אנושית 24/7</span>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
