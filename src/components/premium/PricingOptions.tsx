
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PricingOptionsProps {
  selectedPlan: 'daily' | 'monthly' | 'quarterly';
  setSelectedPlan: (plan: 'daily' | 'monthly' | 'quarterly') => void;
}

const PricingOptions = ({ selectedPlan, setSelectedPlan }: PricingOptionsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-white text-xl font-semibold mb-6">בחרו חבילה</h3>
      
      {/* Daily Plan */}
      <div 
        className={`relative bg-slate-800/50 backdrop-blur-sm border ${
          selectedPlan === 'daily' 
            ? 'border-blue-400/50 ring-2 ring-blue-400/30' 
            : 'border-slate-700/50 hover:border-slate-600/50'
        } rounded-xl p-6 cursor-pointer transition-all duration-300 hover:bg-slate-800/70 group`}
        onClick={() => setSelectedPlan('daily')}
      >
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-white text-lg font-semibold mb-2">גישה יומית</h4>
            <p className="text-slate-300 text-sm">גישה מלאה ליום אחד</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white mb-1">₪20</div>
            <div className="text-slate-400 text-sm">חד פעמי</div>
          </div>
        </div>
        
        {selectedPlan === 'daily' && (
          <div className="absolute top-4 left-4">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Monthly Plan */}
      <div 
        className={`relative bg-slate-800/50 backdrop-blur-sm border ${
          selectedPlan === 'monthly' 
            ? 'border-blue-400/50 ring-2 ring-blue-400/30' 
            : 'border-slate-700/50 hover:border-slate-600/50'
        } rounded-xl p-6 cursor-pointer transition-all duration-300 hover:bg-slate-800/70 group`}
        onClick={() => setSelectedPlan('monthly')}
      >
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-white text-lg font-semibold mb-2">מנוי חודשי</h4>
            <p className="text-slate-300 text-sm">חידוש אוטומטי, ניתן לבטל בכל עת</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white mb-1">₪100</div>
            <div className="text-slate-400 text-sm">לחודש</div>
          </div>
        </div>
        
        {selectedPlan === 'monthly' && (
          <div className="absolute top-4 left-4">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </div>
      
      {/* Quarterly Plan - Recommended */}
      <div 
        className={`relative bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm border ${
          selectedPlan === 'quarterly' 
            ? 'border-blue-400/50 ring-2 ring-blue-400/30' 
            : 'border-blue-500/30 hover:border-blue-400/50'
        } rounded-xl p-6 cursor-pointer transition-all duration-300 hover:from-blue-900/40 hover:to-purple-900/40 group`}
        onClick={() => setSelectedPlan('quarterly')}
      >
        <div className="absolute -top-3 right-4">
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg">
            המומלץ ביותר
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-white text-lg font-semibold mb-2">מנוי לשלושה חודשים</h4>
            <p className="text-slate-300 text-sm">חיסכון משמעותי במנוי הארוך</p>
            <div className="mt-2 text-green-400 text-sm font-medium">
              חיסכון של ₪50 לעומת תשלום חודשי
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white mb-1">₪250</div>
            <div className="text-slate-400 text-sm">ל-3 חודשים</div>
          </div>
        </div>
        
        {selectedPlan === 'quarterly' && (
          <div className="absolute top-4 left-4">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingOptions;
