
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { RTLWrapper } from "@/components/ui/rtl-wrapper";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useEffect } from "react";

const Simulations = () => {
  const navigate = useNavigate();
  
  // Redirect to new simulations entry page
  useEffect(() => {
    navigate('/simulations-entry');
  }, [navigate]);

  // This component is now a redirect, but keeping the old structure as fallback
  return (
    <RTLWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              דף הסימולציות עודכן!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              אנו מעבירים אותך לדף הכניסה החדש...
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/simulations-entry')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-lg"
              >
                <PlayCircle className="w-5 h-5 ml-2" />
                עבור לדף הכניסה החדש
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="px-8 py-3 rounded-xl font-semibold text-lg"
              >
                <ArrowRight className="w-5 h-5 ml-2" />
                חזור לדף הבית
              </Button>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </RTLWrapper>
  );
};

export default Simulations;
