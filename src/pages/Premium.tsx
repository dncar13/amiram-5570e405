import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Sparkles } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <main className="flex-1 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-blue-800/10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
        
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">Premium Experience</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              שדרוג לחשבון פרימיום
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              קבלו גישה בלתי מוגבלת לכל נושאי הסימולציה והכינו את עצמכם בצורה הטובה ביותר למבחן אמירם
            </p>
          </div>
        </section>
        
        {/* Premium Card */}
        <section className="pb-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-2xl shadow-blue-500/10 overflow-hidden">
              <div className="grid lg:grid-cols-2">
                {/* Left Column - Benefits */}
                <div className="p-8 lg:p-12 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm">
                  <PremiumBenefits />
                </div>
                
                {/* Right Column - Pricing & Payment */}
                <div className="p-8 lg:p-12 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-r border-slate-700/30">
                  <div className="space-y-8">
                    <PricingOptions selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} />
                    
                    {/* Security Badge */}
                    <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">תשלום מאובטח</p>
                        <p className="text-slate-400 text-sm">מוגן באמצעות Cardcom</p>
                      </div>
                    </div>
                    
                    {/* Payment Form */}
                    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                      <CardcomPaymentForm
                        amount={getAmount()}
                        onSuccess={handlePaymentSuccess}
                        onCancel={handlePaymentCancel}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Support Info */}
            <div className="mt-12 text-center">
              <div className="inline-flex flex-col items-center gap-2 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-6 py-4">
                <p className="text-slate-300 text-sm">לשאלות או תמיכה ניתן לפנות למוקד השירות</p>
                <p className="text-slate-400 text-xs">או במייל לתמיכה טכנית</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
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
