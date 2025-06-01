
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import CardcomPaymentForm from "@/components/payment/CardcomPaymentForm";
import PremiumBenefits from "@/components/premium/PremiumBenefits";
import PricingOptions from "@/components/premium/PricingOptions";
import SuccessDialog from "@/components/premium/SuccessDialog";

const Premium = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  
  // Function to handle successful payment
  const handlePaymentSuccess = () => {
    // Store premium status in localStorage
    localStorage.setItem("isPremiumUser", "true");
    setIsProcessing(false);
    setIsDialogOpen(true);
  };
  
  // Function to handle payment cancellation
  const handlePaymentCancel = () => {
    setIsProcessing(false);
  };
  
  // Navigate to simulations entry page after successful payment
  const handleSuccessfulPayment = () => {
    setIsDialogOpen(false);
    navigate("/simulations-entry");
  };

  // Get amount based on selected plan
  const getAmount = () => {
    switch (selectedPlan) {
      case 'monthly':
        return 99;
      case 'yearly':
      default:
        return 799;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Payment Header */}
        <section className="electric-gradient text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">שדרוג לחשבון פרימיום</h1>
            <p className="text-lg max-w-2xl mx-auto">
              קבלו גישה בלתי מוגבלת לכל נושאי הסימולציה שלנו וקחו את הלמידה שלכם לרמה הבאה
            </p>
          </div>
        </section>
        
        {/* Payment Card */}
        <section className="py-12 bg-electric-gray">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="rounded-xl overflow-hidden shadow-lg border-0">
              <div className="grid md:grid-cols-2">
                {/* Left Column (Benefits) */}
                <div className="bg-white p-6 md:p-8">
                  <PremiumBenefits />
                </div>
                
                {/* Right Column (Payment) */}
                <div className="bg-electric-gray/30 p-6 md:p-8 flex flex-col">
                  <PricingOptions selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} />
                  
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-4 bg-electric-blue/5 p-3 rounded-lg">
                      <ShieldCheck className="h-5 w-5 text-electric-blue" />
                      <p className="text-sm">תשלום מאובטח באמצעות Cardcom</p>
                    </div>
                    
                    <CardcomPaymentForm
                      amount={getAmount()}
                      onSuccess={handlePaymentSuccess}
                      onCancel={handlePaymentCancel}
                    />
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="mt-8 text-center text-sm text-electric-slate">
              <p>לשאלות או תמיכה ניתן לפנות למוקד השירות בטלפון 03-1234567</p>
              <p className="mt-1">או במייל support@electricsim.co.il</p>
            </div>
          </div>
        </section>
      </main>
      
      {/* Success Dialog */}
      <SuccessDialog 
        isOpen={isDialogOpen} 
        setIsOpen={setIsDialogOpen} 
        onSuccess={handleSuccessfulPayment} 
      />
      
      <Footer />
    </div>
  );
};

export default Premium;
