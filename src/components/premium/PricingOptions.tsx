
import { Badge } from "@/components/ui/badge";

interface PricingOptionsProps {
  selectedPlan: 'monthly' | 'yearly';
  setSelectedPlan: (plan: 'monthly' | 'yearly') => void;
}

const PricingOptions = ({ selectedPlan, setSelectedPlan }: PricingOptionsProps) => {
  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2">בחרו חבילה</h3>
      
      {/* Monthly subscription option */}
      <div 
        className={`bg-white border ${selectedPlan === 'monthly' ? 'border-electric-blue' : 'border-gray-200'} rounded-lg p-4 relative mb-4 cursor-pointer`}
        onClick={() => setSelectedPlan('monthly')}
      >
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-electric-navy">מנוי חודשי</h4>
            <p className="text-sm text-electric-slate">חידוש אוטומטי, ניתן לבטל בכל עת</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-electric-blue">₪99</div>
            <div className="text-sm text-electric-slate">לחודש</div>
          </div>
        </div>
      </div>
      
      {/* Yearly subscription option */}
      <div 
        className={`bg-white border ${selectedPlan === 'yearly' ? 'border-electric-blue' : 'border-gray-200'} rounded-lg p-4 cursor-pointer relative`}
        onClick={() => setSelectedPlan('yearly')}
      >
        <div className="absolute -top-3 -right-1">
          <Badge className="bg-electric-orange text-white border-0">
            המומלץ ביותר
          </Badge>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-electric-navy">מנוי שנתי</h4>
            <p className="text-sm text-electric-slate">חיסכון משמעותי בתשלום שנתי</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-electric-blue">₪799</div>
            <div className="text-sm text-electric-slate">לשנה</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingOptions;
