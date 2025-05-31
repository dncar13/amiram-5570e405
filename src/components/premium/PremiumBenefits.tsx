
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Play } from "lucide-react";

const PremiumBenefits = () => {
  return (
    <>
      <div className="mb-6">
        <Badge className="bg-electric-blue/10 text-electric-blue border-0 px-3 py-1.5">
          חשבון פרימיום
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold mt-3 mb-2">גישה מלאה לכל התכנים</h2>
        <p className="text-electric-slate">
          שדרגו עכשיו וקבלו גישה מיידית לכל נושאי הלימוד והסימולציות
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-2 items-start">
          <CheckCircle2 className="h-5 w-5 text-electric-blue mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium">גישה לכל 7 נושאי הסימולציה</p>
            <p className="text-sm text-electric-slate">יותר מ-950 שאלות סימולציה ותרגול</p>
          </div>
        </div>
        
        <div className="flex gap-2 items-start">
          <Play className="h-5 w-5 text-electric-blue mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium">סרטוני הסבר מאת טימור</p>
            <p className="text-sm text-electric-slate">סרטוני הסבר מפורטים לשאלות נבחרות</p>
          </div>
        </div>
        
        <div className="flex gap-2 items-start">
          <CheckCircle2 className="h-5 w-5 text-electric-blue mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium">עדכוני תוכן ושאלות חדשות</p>
            <p className="text-sm text-electric-slate">אנחנו מוסיפים שאלות ועדכונים באופן קבוע</p>
          </div>
        </div>
        
        <div className="flex gap-2 items-start">
          <CheckCircle2 className="h-5 w-5 text-electric-blue mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium">מסלולי למידה מותאמים אישית</p>
            <p className="text-sm text-electric-slate">התקדמו בקצב שלכם עם מסלולים המותאמים לרמתכם</p>
          </div>
        </div>
        
        <div className="flex gap-2 items-start">
          <CheckCircle2 className="h-5 w-5 text-electric-blue mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium">סטטיסטיקות וניתוח ביצועים</p>
            <p className="text-sm text-electric-slate">עקבו אחר ההתקדמות שלכם וזהו תחומים לשיפור</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PremiumBenefits;
