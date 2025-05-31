import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LightbulbIcon, Monitor, Shield } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">הדרך הקצרה לרישיון חשמלאי</h2>
        <p className="text-center mb-12 text-sm text-gray-600 max-w-3xl mx-auto">
          במקום לשנן – תתמקד במה שחשוב באמת. טכנולוגיה, תרגול חכם וליווי אישי – כל מה שצריך כדי לעבור את הבחינה בפעם הראשונה.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <LightbulbIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">לומדים פחות – מצליחים יותר</h3>
            <p className="text-sm text-gray-600 mb-4">
              המערכת החכמה שלנו מזהה את הנושאים שדורשים חיזוק וממקדת אותך רק במה שצריך – חוסכת עד 40% מהזמן.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Monitor className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">תרגול מדויק כמו במבחן</h3>
            <p className="text-sm text-gray-600 mb-4">
              כל השאלות הכי עדכניות ממבחני הרישוי האמיתיים – עם סימולציות, ניתוח ביצועים ומעקב אחרי התקדמות אישית.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">אתם לא לבד בדרך</h3>
            <p className="text-sm text-gray-600 mb-4">
              ליווי של מרצים מנוסים, שיעורים מוקלטים, קהילה פעילה, ומענה מהיר לשאלות – כל מה שצריך כדי ללמוד בראש שקט.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <Button to="/topics" className="bg-orange-500 text-white hover:bg-orange-600">
            גלה את הנושאים שמחכים לך
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;