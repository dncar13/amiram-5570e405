
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
  const [selectedPlan, setSelectedPlan] = useState<'daily' | 'monthly' | 'quarterly'>('quarterly');
  
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
      case 'daily':
        return 20;
      case 'monthly':
        return 100;
      case 'quarterly':
      default:
        return 250;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Payment Header */}
        <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">שדרוג לחשבון פרימיום - אמירם</h1>
            <p className="text-lg max-w-2xl mx-auto">
              קבלו גישה בלתי מוגבלת לכל נושאי הסימולציה והכינו את עצמכם בצורה הטובה ביותר למבחן אמירם
            </p>
          </div>
        </section>
        
        {/* Payment Card */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card className="rounded-xl overflow-hidden shadow-lg border-0">
              <div className="grid md:grid-cols-2">
                {/* Left Column (Benefits) */}
                <div className="bg-white p-6 md:p-8">
                  <PremiumBenefits />
                </div>
                
                {/* Right Column (Payment) */}
                <div className="bg-muted/30 p-6 md:p-8 flex flex-col">
                  <PricingOptions selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} />
                  
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-4 bg-primary/5 p-3 rounded-lg">
                      <ShieldCheck className="h-5 w-5 text-primary" />
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
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>לשאלות או תמיכה ניתן לפנות למוקד השירות</p>
              <p className="mt-1">או במייל לתמיכה טכנית</p>
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
