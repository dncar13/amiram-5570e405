import { Button } from "@/components/ui/button";
import { Shield, Book, Youtube, GraduationCap, Wrench, Code, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const FounderSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">מי עומד מאחורי הפלטפורמה?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            שני מהנדסי חשמל עם משימה אחת: להפוך את הלמידה לחוויה מהנה ומוצלחת
          </p>
        </div>
        
        <div className="flex flex-col gap-16 max-w-5xl mx-auto">
          {/* Timor's section */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3">
              <div className="rounded-lg overflow-hidden border-4 border-electric-blue shadow-lg transform transition-transform hover:scale-[1.02]">
                <img 
                  src="/lovable-uploads/85cd6447-e0b8-41a0-ac5f-9a9f04089033.png" 
                  alt="תמונה של טימור טורשחוייב" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h3 className="text-xl font-bold mb-3 text-electric-navy">טימור טורשחוייב - החשמלאי של החשמלאים</h3>
              <div className="flex flex-col gap-4">
                <p className="text-gray-700 leading-relaxed">
                  אחרי 20 שנה בשטח, ראיתי מאות חשמלאים מתחילים שנאבקים עם אותן בעיות. 
                  החלטתי שהגיע הזמן לשנות את הגישה ללמידה בתחום שלנו - פחות שינון, יותר הבנה מעשית.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Shield className="text-electric-blue h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-700">רישיון בודק סוג 3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="text-electric-blue h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-700">תואר שני בהנדסת חשמל</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wrench className="text-electric-blue h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-700">מעל 20 שנות ניסיון בשטח</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Youtube className="text-red-600 h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-700">ערוץ יוטיוב עם אלפי עוקבים</span>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href="https://www.youtube.com/@---Timur" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-red-600 hover:bg-red-700 flex items-center gap-2">
                      <Youtube className="h-5 w-5" />
                      לערוץ היוטיוב שלי
                    </Button>
                  </a>
                  <Link to="/about">
                    <Button variant="outline" className="border-electric-blue text-electric-blue hover:bg-electric-blue/10">
                      הסיפור האישי שלי
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center">
            <div className="h-px bg-gray-300 flex-grow max-w-[100px]"></div>
            <div className="px-4 text-gray-400">+</div>
            <div className="h-px bg-gray-300 flex-grow max-w-[100px]"></div>
          </div>

          {/* Daniel's section */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 md:order-2">
              <div className="rounded-lg overflow-hidden border-4 border-electric-blue shadow-lg transform transition-transform hover:scale-[1.02]">
                <img 
                  src="/lovable-uploads/9399b7ef-51b5-4fc6-8adc-09c084de0b2c.png" 
                  alt="תמונה של דניאל פוגודין" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            <div className="md:w-2/3 md:order-1">
              <h3 className="text-xl font-bold mb-3 text-electric-navy">דניאל פוגודין - המוח הטכנולוגי</h3>
              <div className="flex flex-col gap-4">
                <p className="text-gray-700 leading-relaxed">
                  כשטימור סיפר לי על החזון שלו, ידעתי שזו ההזדמנות שלי לשלב בין האהבה לחשמל לבין הפיתוח הטכנולוגי.
                  המטרה שלי? להפוך כל סימולציה לחוויה שמרגישה כמו עבודה בשטח האמיתי.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="text-electric-blue h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-700">מהנדס חשמל מ-HIT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="text-electric-blue h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-700">מפתח ומייסד-שותף הפלטפורמה</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wrench className="text-electric-blue h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-700">ניסיון בניהול פרויקטים בתחום האנרגיה</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="text-electric-blue h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-700">מאמין גדול בלמידה מהנה</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link to="/about">
                    <Button variant="outline" className="border-electric-blue text-electric-blue hover:bg-electric-blue/10">
                      הסיפור האישי שלי
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mission statement */}
          <div className="mt-12 bg-blue-50 rounded-xl p-8 text-center border border-blue-100">
            <h3 className="text-lg font-semibold mb-3 text-electric-navy">המשימה המשותפת שלנו</h3>
            <p className="text-gray-700 max-w-3xl mx-auto">
              שנינו מאמינים שלימודי חשמל לא צריכים להיות מלחיצים או משעממים. 
              יצרנו פלטפורמה שמשלבת את הניסיון המעשי של טימור עם הטכנולוגיה המתקדמת של דניאל,
              כדי לתת לכם את הכלים הטובים ביותר להצלחה.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;