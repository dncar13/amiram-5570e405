
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Target, Trophy } from "lucide-react";
import { PLAN_PRICES } from "@/config/pricing";

interface PricingOptionsProps {
  selectedPlan: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  setSelectedPlan: (plan: 'daily' | 'weekly' | 'monthly' | 'quarterly') => void;
}

const PricingOptions = ({ selectedPlan, setSelectedPlan }: PricingOptionsProps) => {
  const plans = [
    {
      id: 'daily',
      name: 'גישה ליום',
      price: PLAN_PRICES.daily,
      period: '24 שעות',
      description: 'לתלמידים במבחן מחר',
      subtitle: 'נסיון אינטנסיבי לפני המבחן',
      icon: Clock,
      features: 'גישה לסימולציות נבחרות'
    },
    {
      id: 'weekly',
      name: 'גישה לשבוע',
      price: PLAN_PRICES.weekly,
      period: '7 ימים',
      description: 'לחיזוק מיומנויות',
      subtitle: 'תרגול בקצב שלכם',
      icon: Calendar,
      features: 'גישה מלאה לכל התכנים'
    },
    {
      id: 'monthly',
      name: 'גישה לחודש',
      price: PLAN_PRICES.monthly,
      period: '30 ימים',
      description: 'ההמלצה שלנו!',
      subtitle: 'הכנה יסודית לפטור',
      icon: Target,
      features: 'יותר מ-50 קטעי קריאה, מעל 1,000 שאלות',
      recommended: true
    },
    {
      id: 'quarterly',
      name: 'גישה ל-3 חודשים',
      price: PLAN_PRICES.quarterly,
      period: '90 ימים',
      description: 'לשיפור מעמיק',
      subtitle: 'הכי משתלם למתכוננים מוקדם',
      icon: Trophy,
      features: 'כל התכנים + זמן לשיפור אמיתי'
    }
  ];

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-4">בחרו חבילה</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          return (
            <div 
              key={plan.id}
              className={`bg-white border ${selectedPlan === plan.id ? 'border-electric-blue ring-2 ring-electric-blue/20' : 'border-gray-200'} rounded-lg p-4 cursor-pointer relative hover:shadow-md transition-all`}
              onClick={() => setSelectedPlan(plan.id as 'daily' | 'weekly' | 'monthly' | 'quarterly')}
            >
              {plan.recommended && (
                <div className="absolute -top-3 -right-1">
                  <Badge className="bg-electric-orange text-white border-0">
                    המומלץ ביותר
                  </Badge>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <IconComponent className="w-5 h-5 text-electric-blue" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-electric-navy">{plan.name}</h4>
                    <div className="text-right">
                      <div className="text-xl font-bold text-electric-blue">₪{plan.price}</div>
                      <div className="text-xs text-electric-slate">{plan.period}</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-electric-slate mb-1">{plan.description}</p>
                  <p className="text-xs text-gray-500">{plan.subtitle}</p>
                  <p className="text-xs text-gray-600 mt-1">{plan.features}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* No auto-renewal disclaimer */}
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>שקיפות מלאה:</strong> כל התוכניות הן תשלום חד-פעמי בלבד. 
          אין חידוש אוטומטי. לא מרוצים? צרו קשר עם הוכחה וקבלו הנחה משמעותית לרכישה הבאה.
        </p>
      </div>
    </div>
  );
};

export default PricingOptions;
