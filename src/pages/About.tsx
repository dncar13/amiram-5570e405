
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, GraduationCap, Target, BookOpen, Users, Award, Star, Trophy, Zap, CheckCircle } from "lucide-react";
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
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6 text-blue-900">הדרך שלך לציון הגבוה במבחן האמירם!</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              AMIRAM Academy - הפלטפורמה היחידה בישראל שמתמחה בלעדית במבחן האמירם באנגלית. 
              כאן תמצא הכל מה שאתה צריך כדי לעבור את המבחן בהצלחה!
            </p>
          </div>
          
          {/* Main Content */}
          <section className="mb-16 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 shadow-lg mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full opacity-20 -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200 rounded-full opacity-20 -ml-12 -mb-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="text-blue-600 h-8 w-8" />
                  <h2 className="font-bold text-2xl text-blue-900">למה AMIRAM Academy?</h2>
                </div>
                
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                  בזכותנו תעבור את מבחן האמירם! אנחנו לא עוד אתר אנגלית כללי - 
                  אלא הבית שלך להצלחה באמירם. הפלטפורמה שלנו תעזור לך להגיע לציון הגבוה שמגיע לך.
                </p>
              </div>
            </div>
          </section>
          
          {/* What Makes Us Special */}
          <section className="max-w-5xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-12 text-blue-900 text-center">מה מייחד אותנו?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-r-4 border-blue-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Trophy className="text-blue-600 h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-xl text-blue-900">התמחות בלעדית במבחן האמירם</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  אנחנו לא עוד אתר אנגלית כללי – אלא הבית שלך להצלחה באמירם. 
                  כל התכנים, השאלות והסימולציות מותאמים במדויק לפורמט הרשמי ולדרישות המבחן.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-r-4 border-orange-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <BookOpen className="text-orange-600 h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-xl text-blue-900">תוכן איכותי, מעודכן וייחודי</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  כל שאלה ותרגיל באתר נכתבו על-ידי מומחים עם ניסיון רב בהכנה לאמירם. 
                  אנחנו מבטיחים שתמיד תתרגל את החומר הכי רלוונטי – ולא תבזבז זמן על חומר לא עדכני.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-r-4 border-green-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="text-green-600 h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-xl text-blue-900">למידה שמותאמת אליך</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  הפלטפורמה שלנו מזהה את החוזקות והחולשות שלך, בונה עבורך מסלול התקדמות אישי, 
                  ומאפשרת לך לעקוב אחר כל שיפור – עד לציון הגבוה שמגיע לך!
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-r-4 border-purple-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Zap className="text-purple-600 h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-xl text-blue-900">טכנולוגיה שמקדמת אותך</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  למידה מכל מכשיר, ממשק ידידותי, ומשוב מיידי אחרי כל תרגיל – 
                  תוכל להתקדם בכל זמן ומכל מקום. גישה מהמחשב והסמארטפון שלך!
                </p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="max-w-5xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-12 text-blue-900 text-center">איך זה עובד?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-bold text-lg mb-4 text-blue-900">התחל ללמוד</h3>
                <p className="text-gray-600">
                  הירשם לפלטפורמה ובחר את נושאי הלימוד שמתאימים לך
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-orange-600">2</span>
                </div>
                <h3 className="font-bold text-lg mb-4 text-blue-900">תרגל וקבל משוב</h3>
                <p className="text-gray-600">
                  פתור תרגילים מותאמי אמירם וקבל משוב מיידי על הביצועים שלך
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="font-bold text-lg mb-4 text-blue-900">עבור את המבחן!</h3>
                <p className="text-gray-600">
                  הגע למבחן בטוח ומוכן עם כל הכלים שצריך להצלחה
                </p>
              </div>
            </div>
          </section>

          {/* Testimonial */}
          <section className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-8 shadow-lg text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-lg text-gray-700 mb-4 italic">
                "בזכות AMIRAM Academy עברתי את מבחן האמירם עם ציון 134! 
                הסימולציות היו זהות למבחן האמיתי והמעקב האישי עזר לי להתמקד במה שחשוב."
              </p>
              <p className="font-semibold text-blue-900">- רותם כהן, סטודנטית לרפואה</p>
            </div>
          </section>

          {/* Our Promise */}
          <section className="max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <Award className="text-blue-600 h-8 w-8" />
                <h2 className="font-bold text-2xl text-blue-900">ההבטחה שלנו</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 h-6 w-6 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">מותאם לאמירם בלבד - אין תוכן מיותר</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 h-6 w-6 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">מעודכן בהתאם לשינויים במבחן הרשמי</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 h-6 w-6 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">מדדים אישיים וסטטיסטיקות חכמות</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 h-6 w-6 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">תמיכה מקצועית ושירות אישי</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-12 text-white shadow-xl">
              <h2 className="text-3xl font-bold mb-6">מוכן להתחיל?</h2>
              <p className="text-xl mb-8 opacity-90">
                הצטרף לאלפי תלמידים שכבר עברו את מבחן האמירם בהצלחה!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  to="/simulations-entry"
                >
                  נסה סימולציה חינם
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white text-blue-600 border-2 border-white hover:bg-blue-50 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  to="/topics"
                >
                  התחל ללמוד עכשיו
                </Button>
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
