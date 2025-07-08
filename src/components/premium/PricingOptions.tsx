
import { Badge } from "@/components/ui/badge";

interface PricingOptionsProps {
  selectedPlan: 'daily' | 'monthly' | 'quarterly';
  setSelectedPlan: (plan: 'daily' | 'monthly' | 'quarterly') => void;
}

const PricingOptions = ({ selectedPlan, setSelectedPlan }: PricingOptionsProps) => {
  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2">בחרו חבילה</h3>
      
      {/* Daily subscription option */}
      <div 
        className={`bg-white border ${selectedPlan === 'daily' ? 'border-primary' : 'border-gray-200'} rounded-lg p-4 relative mb-4 cursor-pointer`}
        onClick={() => setSelectedPlan('daily')}
      >
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-foreground">גישה יומית</h4>
            <p className="text-sm text-muted-foreground">גישה מלאה ליום אחד</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">₪20</div>
            <div className="text-sm text-muted-foreground">ליום</div>
          </div>
        </div>
      </div>

      {/* Monthly subscription option */}
      <div 
        className={`bg-white border ${selectedPlan === 'monthly' ? 'border-primary' : 'border-gray-200'} rounded-lg p-4 relative mb-4 cursor-pointer`}
        onClick={() => setSelectedPlan('monthly')}
      >
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-foreground">מנוי חודשי</h4>
            <p className="text-sm text-muted-foreground">חידוש אוטומטי, ניתן לבטל בכל עת</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">₪100</div>
            <div className="text-sm text-muted-foreground">לחודש</div>
          </div>
        </div>
      </div>
      
      {/* Quarterly subscription option */}
      <div 
        className={`bg-white border ${selectedPlan === 'quarterly' ? 'border-primary' : 'border-gray-200'} rounded-lg p-4 cursor-pointer relative`}
        onClick={() => setSelectedPlan('quarterly')}
      >
        <div className="absolute -top-3 -right-1">
          <Badge className="bg-orange-500 text-white border-0">
            המומלץ ביותר
          </Badge>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-foreground">מנוי לשלושה חודשים</h4>
            <p className="text-sm text-muted-foreground">חיסכון משמעותי במנוי הארוך</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">₪250</div>
            <div className="text-sm text-muted-foreground">ל-3 חודשים</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingOptions;
