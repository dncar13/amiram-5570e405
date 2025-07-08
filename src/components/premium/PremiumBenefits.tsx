
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, BookOpen, Target, BarChart3, Clock } from "lucide-react";

const PremiumBenefits = () => {
  return (
    <>
      <div className="mb-6">
        <Badge className="bg-primary/10 text-primary border-0 px-3 py-1.5">
          חשבון פרימיום
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold mt-3 mb-2">גישה מלאה לכל התכנים</h2>
        <p className="text-muted-foreground">
          שדרגו עכשיו וקבלו גישה מיידית לכל נושאי הלימוד ומאגר השאלות המלא למבחן אמירם
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-2 items-start">
          <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium">גישה לכל נושאי הסימולציה</p>
            <p className="text-sm text-muted-foreground">מאגר שאלות מלא בכל התחומים הנדרשים למבחן</p>
          </div>
        </div>
        
        <div className="flex gap-2 items-start">
          <BookOpen className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium">קטעי קריאה ותרגול מקיף</p>
            <p className="text-sm text-muted-foreground">קטעי קריאה מגוונים עם שאלות הבנה ופירוש</p>
          </div>
        </div>
        
        <div className="flex gap-2 items-start">
          <Target className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium">סימולציות אמיתיות</p>
            <p className="text-sm text-muted-foreground">תנאי מבחן אמיתיים עם מגבלת זמן ומבנה זהה למבחן</p>
          </div>
        </div>
        
        <div className="flex gap-2 items-start">
          <BarChart3 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium">מעקב אחר התקדמות</p>
            <p className="text-sm text-muted-foreground">סטטיסטיקות מפורטות וניתוח ביצועים אישיים</p>
          </div>
        </div>
        
        <div className="flex gap-2 items-start">
          <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium">תרגול בהתאמה אישית</p>
            <p className="text-sm text-muted-foreground">יכולת לתרגל נושאים ספציפיים לפי הצורך האישי</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PremiumBenefits;
