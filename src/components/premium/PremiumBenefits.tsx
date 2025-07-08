
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, BookOpen, Target, BarChart3, Clock, Zap } from "lucide-react";

const PremiumBenefits = () => {
  return (
    <>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 mb-4">
          <Zap className="h-4 w-4 text-blue-400" />
          <span className="text-blue-300 text-sm font-medium">Premium</span>
        </div>
        
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
          גישה מלאה לכל התכנים
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed">
          שדרגו עכשיו וקבלו גישה מיידית לכל נושאי הלימוד ומאגר השאלות המלא למבחן אמירם
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="flex gap-4 items-start group">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
            <CheckCircle2 className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">גישה לכל נושאי הסימולציה</h3>
            <p className="text-slate-300">מאגר שאלות מלא בכל התחומים הנדרשים למבחן</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-start group">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
            <BookOpen className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">קטעי קריאה ותרגול מקיף</h3>
            <p className="text-slate-300">קטעי קריאה מגוונים עם שאלות הבנה ופירוש</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-start group">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
            <Target className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">סימולציות אמיתיות</h3>
            <p className="text-slate-300">תנאי מבחן אמיתיים עם מגבלת זמן ומבנה זהה למבחן</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-start group">
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
            <BarChart3 className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">מעקב אחר התקדמות</h3>
            <p className="text-slate-300">סטטיסטיקות מפורטות וניתוח ביצועים אישיים</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-start group">
          <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
            <Clock className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">תרגול בהתאמה אישית</h3>
            <p className="text-slate-300">יכולת לתרגל נושאים ספציפיים לפי הצורך האישי</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PremiumBenefits;
