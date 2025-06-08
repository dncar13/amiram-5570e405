
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, GraduationCap, Target, BookOpen, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pb-16">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-6 text-blue-900 text-center">אודות</h1>
          
          <section className="mb-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-blue-900 text-center">אודות TD-ACADEMY</h2>
            
            <div className="bg-blue-50 rounded-lg p-8 shadow-sm mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Target className="text-blue-600 h-6 w-6" />
                <h3 className="font-semibold text-xl">המטרה שלנו</h3>
              </div>
              
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                TD-ACADEMY הוקמה במטרה להיות הכתובת המובילה בישראל להכנה למבחני האמירם באנגלית. 
                אנו מתמחים בפיתוח כלי לימוד מתקדמים, סימולציות מדויקות ותוכן איכותי שמכין את הסטודנטים 
                בצורה הטובה ביותר למבחן האמירם.
              </p>
              
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="text-blue-600 h-6 w-6" />
                <h3 className="font-semibold text-xl">התמחות שלנו</h3>
              </div>
              
              <ul className="list-disc list-inside text-gray-700 mr-4 space-y-2 mb-6">
                <li>הבנת הנקרא (Reading Comprehension) - טקסטים קצרים ומורכבים</li>
                <li>השלמת משפטים (Sentence Completion)</li>
                <li>ניסוח מחדש (Restatement)</li>
                <li>אוצר מילים (Vocabulary)</li>
                <li>סימולציות מלאות במבנה המבחן הרשמי</li>
              </ul>
              
              <div className="flex items-center gap-2 mb-4">
                <Users className="text-blue-600 h-6 w-6" />
                <h3 className="font-semibold text-xl">הגישה שלנו</h3>
              </div>
              
              <p className="text-gray-700 mb-6">
                אנו מאמינים שהצלחה במבחן האמירם מתחילה בהבנה עמוקה של המבנה והדרישות. 
                הפלטפורמה שלנו מספקת חוויית לימוד אינטראקטיבית עם משוב מיידי, טיפים מקצועיים 
                ומעקב אחר התקדמות אישית.
              </p>
              
              <div className="flex items-center gap-2 mb-4">
                <Award className="text-blue-600 h-6 w-6" />
                <h3 className="font-semibold text-xl">ההבטחה שלנו</h3>
              </div>
              
              <p className="text-gray-700">
                אנו מתחייבים לספק את הכלים הטובים ביותר להכנה למבחן האמירם. 
                הפלטפורמה שלנו מעודכנת בהתאם לשינויים במבחן הרשמי ומותאמת לצרכים 
                הייחודיים של הסטודנטים הישראלים.
              </p>
            </div>
          </section>
          
          <Separator className="my-10" />
          
          <section className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-blue-900 text-center">מה מייחד אותנו</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="text-blue-600 h-6 w-6" />
                  <h3 className="font-semibold text-lg">התמחות במבחן האמירם</h3>
                </div>
                <p className="text-gray-700">
                  אנו מתמחים אך ורק במבחן האמירם באנגלית. כל התוכן, השאלות והסימולציות 
                  מותאמים במדויק לפורמט ולדרישות המבחן הרשמי.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="text-blue-600 h-6 w-6" />
                  <h3 className="font-semibold text-lg">תוכן איכותי ומעודכן</h3>
                </div>
                <p className="text-gray-700">
                  כל השאלות והתרגילים נכתבו על ידי מומחים בתחום ומעודכנים באופן שוטף 
                  כדי להבטיח התאמה מלאה למבחן הרשמי.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="text-blue-600 h-6 w-6" />
                  <h3 className="font-semibold text-lg">חוויית משתמש אישית</h3>
                </div>
                <p className="text-gray-700">
                  הפלטפורמה מתאימה את עצמה לרמה ולצרכים של כל משתמש, עם מעקב אישי 
                  אחר התקדמות ואזורים לשיפור.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="text-blue-600 h-6 w-6" />
                  <h3 className="font-semibold text-lg">טכנולוגיה מתקדמת</h3>
                </div>
                <p className="text-gray-700">
                  אנו משתמשים בטכנולוגיות חדישות כדי לספק חוויית לימוד אופטימלית 
                  עם ממשק ידידותי וזמינות מכל מכשיר.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
