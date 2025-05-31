
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ZapIcon } from "lucide-react";

const ThankYou = () => {
  const navigate = useNavigate();
  
  // Ensure the user is redirected here only after payment
  useEffect(() => {
    const isPremium = localStorage.getItem("isPremiumUser") === "true";
    if (!isPremium) {
      navigate("/premium");
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-electric-navy">
            תודה על הרכישה!
          </h1>
          
          <p className="text-xl text-electric-slate mb-8">
            רכשת בהצלחה גישה מלאה לכל התכנים של סימולצית החשמל שלנו.
          </p>
          
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">מה עכשיו?</h2>
            
            <div className="grid md:grid-cols-3 gap-6 text-right">
              <div className="flex flex-col items-start">
                <div className="bg-electric-blue/10 p-3 rounded-full mb-3">
                  <ZapIcon className="h-6 w-6 text-electric-blue" />
                </div>
                <h3 className="font-bold mb-1">הנושאים נפתחו</h3>
                <p className="text-sm text-electric-slate">כל נושאי הלימוד והתרגול פתוחים עבורך</p>
              </div>
              
              <div className="flex flex-col items-start">
                <div className="bg-electric-blue/10 p-3 rounded-full mb-3">
                  <ZapIcon className="h-6 w-6 text-electric-blue" />
                </div>
                <h3 className="font-bold mb-1">תעקבו אחרי הביצועים</h3>
                <p className="text-sm text-electric-slate">ראה את הסטטיסטיקות האישיות שלך</p>
              </div>
              
              <div className="flex flex-col items-start">
                <div className="bg-electric-blue/10 p-3 rounded-full mb-3">
                  <ZapIcon className="h-6 w-6 text-electric-blue" />
                </div>
                <h3 className="font-bold mb-1">שפר את הציונים</h3>
                <p className="text-sm text-electric-slate">תרגול בנושאים הקשים ביותר</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button 
              className="bg-electric-blue hover:bg-blue-600 py-6 px-8 text-lg" 
              onClick={() => navigate("/topics")}
            >
              התחל ללמוד עכשיו
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ThankYou;
