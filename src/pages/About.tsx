import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, GraduationCap, Wrench, BookOpen, Youtube, Heart, Code } from "lucide-react";
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
          <h1 className="text-3xl font-bold mb-6 text-electric-navy text-center">אודות</h1>
          
          <section className="mb-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-electric-navy text-center">אודות המייסדים</h2>
            
            <div className="mb-12">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="rounded-lg overflow-hidden border-4 border-electric-blue shadow-lg">
                    <img 
                      src="/lovable-uploads/85cd6447-e0b8-41a0-ac5f-9a9f04089033.png" 
                      alt="תמונה של טימור טורשחוייב" 
                      className="w-full h-auto"
                    />
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <a href="https://www.youtube.com/@---Timur" target="_blank" rel="noopener noreferrer">
                      <Button className="bg-red-600 hover:bg-red-700 flex items-center gap-2">
                        <Youtube className="h-5 w-5" />
                        לערוץ היוטיוב
                      </Button>
                    </a>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-4 text-electric-navy">טימור טורשחוייב</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="text-electric-blue h-5 w-5" />
                        <h4 className="font-semibold text-lg">על טימור</h4>
                      </div>
                      <p className="text-electric-slate">
                        טימור טורשחוייב הוא מומחה בתחום החשמל, עם תואר שני בהנדסת חשמל וניסיון רב של יותר מ-20 שנים כחשמלאי שטח. 
                        הוא נחשב למומחה בפתרון בעיות חשמליות ולאורך השנים צבר ידע רב במגוון תחומים בעולם החשמל.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Wrench className="text-electric-blue h-5 w-5" />
                        <h4 className="font-semibold text-lg">התמחות ושירותים</h4>
                      </div>
                      <ul className="list-disc list-inside text-electric-slate mr-4 space-y-2">
                        <li>פתרון בעיות חשמליות מכל סוג</li>
                        <li>הדרכות וסדנאות לחשמלאים מתחילים</li>
                        <li>ניהול של עמוד יוטיוב מוביל שמלמד חשמלאים</li>
                      </ul>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="text-electric-blue h-5 w-5" />
                        <h4 className="font-semibold text-lg">השכלה והסמכות</h4>
                      </div>
                      <ul className="list-disc list-inside text-electric-slate mr-4 space-y-2">
                        <li>תואר שני בהנדסת חשמל</li>
                        <li>בודק חשמל מוסמך סוג 3</li>
                        <li>מעל 20 שנות ניסיון בשטח</li>
                      </ul>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="text-electric-blue h-5 w-5" />
                        <h4 className="font-semibold text-lg">פילוסופיית עבודה</h4>
                      </div>
                      <p className="text-electric-slate">
                        טימור מחזיק מאמונה עמוקה בחשיבות העברת הידע לדור הצעיר ומשקיע רבות בחינוך ובהכשרה של חשמלאים חדשים. 
                        הוא מאמין כי כל אחד יכול להיות מומחה בתחום עם ההדרכה הנכונה והתמדה.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="rounded-lg overflow-hidden border-4 border-electric-blue shadow-lg">
                    <img 
                      src="/lovable-uploads/9399b7ef-51b5-4fc6-8adc-09c084de0b2c.png" 
                      alt="תמונה של דניאל פוגודין" 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-4 text-electric-navy">דניאל פוגודין</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="text-electric-blue h-5 w-5" />
                        <h4 className="font-semibold text-lg">אודות דניאל</h4>
                      </div>
                      <p className="text-electric-slate">
                        מייסד-שותף ומפתח הפלטפורמה. לפני כמה שנים עבדתי כמנהל פרויקטים בתחום האנרגיה, והתמודדתי עם אתגרים מקצועיים שדרשו הבנה עמוקה בתקנות החשמל.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Wrench className="text-electric-blue h-5 w-5" />
                        <h4 className="font-semibold text-lg">הדרך שלי</h4>
                      </div>
                      <p className="text-electric-slate">
                        בכל פעם שחיפשתי תשובה – נתקלתי בבלבול. לא באינטרנט, לא בספר, ולא באף AI – אף אחד לא הצליח להסביר לי באמת מאיפה נובעת התשובה. אז פניתי לטימור.
                        טימור לא רק ענה לי – הוא דייק, הסביר, הראה לי איפה זה כתוב בספר חוק החשמל. בזכותו הצלחתי לעבור משלב של חוסר ביטחון למהנדס שיודע מה הוא שווה.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="text-electric-blue h-5 w-5" />
                        <h4 className="font-semibold text-lg">תפקידי בפלטפורמה</h4>
                      </div>
                      <p className="text-electric-slate">
                        אני מביא את הצד הטכנולוגי – פיתוח האתר, בניית הסימולציות, ממשק ידידותי.
                        יחד עם טימור, שמביא את הניסיון, הדיוק, והתשובות שאי אפשר למצוא בגוגל, הקמנו את הפלטפורמה הזו.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <Separator className="my-10" />
          
          <section className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-electric-navy text-center">אודות האתר</h2>
            
            <div className="bg-electric-gray/30 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="text-electric-blue h-6 w-6" />
                <h3 className="font-semibold text-lg">המטרה שלנו</h3>
              </div>
              
              <p className="text-electric-slate mb-6">
                TD-Academy הוקם מתוך רצון להנגיש ידע מקצועי בתחום החשמל לכל דורש. המטרה שלנו היא לסייע לחשמלאים מתחילים ומנוסים לשפר את הידע שלהם, 
                להתכונן למבחנים ולהישאר מעודכנים בחידושים האחרונים בתחום.
              </p>
              
              <div className="flex items-center gap-2 mb-4">
                <Youtube className="text-red-600 h-6 w-6" />
                <h3 className="font-semibold text-lg">ערוץ היוטיוב שלנו</h3>
              </div>
              
              <p className="text-electric-slate mb-4">
                לצד האתר, אנו מנהלים ערוץ יוטיוב פעיל עם אלפי עוקבים, שם אנו מעלים תכנים מעשיים בנושאי חשמל, טיפים מקצועיים והדרכות מפורטות.
              </p>
              
              <div className="flex justify-center mt-6">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-red-600 hover:bg-red-700 flex items-center gap-2">
                    <Youtube className="h-5 w-5" />
                    לצפייה בערוץ היוטיוב
                  </Button>
                </a>
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
