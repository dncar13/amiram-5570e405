
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, GraduationCap, Target, BookOpen, Users, Award, Star, Trophy, Zap, CheckCircle, Smartphone, MessageCircle, TrendingUp, Heart, Lock } from "lucide-react";
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
            <h1 className="text-4xl font-bold mb-6 text-blue-900">AMIRAM Academy – הדרך שלך לציון הגבוה במבחן האמירם מתחילה כאן</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              הפלטפורמה היחידה בישראל שמתמחה בלעדית במבחן האמירם באנגלית.
              <br />
              כאן תמצא כל מה שאתה צריך כדי לעבור את המבחן בהצלחה – במקום אחד.
            </p>
          </div>
          
          {/* Why Choose AMIRAM Academy */}
          <section className="mb-16 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-12 shadow-lg mb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full opacity-20 -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200 rounded-full opacity-20 -ml-12 -mb-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8 justify-center">
                  <Target className="text-blue-600 h-8 w-8" />
                  <h2 className="font-bold text-3xl text-blue-900 text-center">למה לבחור ב-AMIRAM Academy?</h2>
                </div>
                
                <div className="text-center mb-8">
                  <p className="text-2xl font-semibold text-blue-800 mb-4">המסלול הבטוח שלך להצלחה במבחן האמירם!</p>
                  <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
                    אנחנו כאן כדי להפוך את הלמידה שלך לממוקדת, מדויקת ואפקטיבית.
                    במקום לבזבז זמן על חומר לא רלוונטי, אצלנו תמצא כלים שמכוונים בדיוק אל מה שנדרש במבחן – 
                    עם תרגולים עדכניים, הסברים בעברית, ומעקב אישי אחרי כל התקדמות.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-md border-r-4 border-blue-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Target className="text-blue-600 h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-lg text-blue-900">התמחות בלעדית</h3>
                    </div>
                    <p className="text-gray-700">אנחנו עוסקים רק בהכנה לאמירם – לא עוד אתר כללי.</p>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-md border-r-4 border-green-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <BookOpen className="text-green-600 h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-lg text-blue-900">מאגר שאלות רשמי ומעודכן</h3>
                    </div>
                    <p className="text-gray-700">תרגולים בפורמט האמיתי של המבחן, כולל שאלות ממועדי עבר, בדיוק כמו שתפגוש בבחינה.</p>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-md border-r-4 border-orange-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="text-orange-600 h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-lg text-blue-900">פידבק מיידי</h3>
                    </div>
                    <p className="text-gray-700">כל שאלה מלווה בהסבר מקצועי, ודוח התקדמות שמבליט עבורך נקודות לשיפור.</p>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-md border-r-4 border-purple-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="text-purple-600 h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-lg text-blue-900">התאמה אישית</h3>
                    </div>
                    <p className="text-gray-700">המערכת שלנו בונה עבורך מסלול למידה חכם, שמותאם במיוחד לחלשים ולחזקים שלך.</p>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-md border-r-4 border-indigo-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Smartphone className="text-indigo-600 h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-lg text-blue-900">נוחות מקסימלית</h3>
                    </div>
                    <p className="text-gray-700">אפשר לתרגל מכל מקום, בכל זמן, מכל מכשיר, בלי להסתבך.</p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-xl font-semibold text-blue-800">
                    עם AMIRAM Academy, אתה לא לומד לבד –<br />
                    אתה מקבל את כל הכלים כדי להגיע לציון הגבוה ביותר שלך.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="max-w-5xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-12 text-blue-900 text-center">איך זה עובד בפועל?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="font-bold text-xl mb-4 text-blue-900">נרשמים ומתחילים לתרגל</h3>
                <p className="text-gray-600">
                  פותחים חשבון, בוחרים נושא או רמת קושי, ומתחילים לתרגל עם שאלות מותאמות בדיוק למבחן.
                </p>
              </div>
              
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="font-bold text-xl mb-4 text-blue-900">מקבלים פידבק מיידי והסברים</h3>
                <p className="text-gray-600">
                  כל שאלה מקבלת הסבר מפורט בעברית ודוח התקדמות אחרי כל סימולציה.
                </p>
              </div>
              
              <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="font-bold text-xl mb-4 text-blue-900">משפרים ומתקדמים</h3>
                <p className="text-gray-600">
                  המערכת ממליצה לך במה להתמקד, מציעה חידוד לנקודות חלשות, ונותנת לך תחושת ביטחון אמיתית עד למבחן.
                </p>
              </div>
            </div>
          </section>

          {/* What Makes Us Special */}
          <section className="max-w-5xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-12 text-blue-900 text-center">מה מייחד אותנו באמת?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-100">
                <div className="flex items-center gap-3 mb-6 justify-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="text-blue-600 h-8 w-8" />
                  </div>
                </div>
                <h3 className="font-bold text-xl text-blue-900 text-center mb-4">תוכן עדכני בלבד</h3>
                <p className="text-gray-700 text-center">
                  כל שאלה באתר עברה בקרת איכות מקצועית, נבדקה מול מבחני אמירם רשמיים ומעודכנת באופן קבוע.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-green-100">
                <div className="flex items-center gap-3 mb-6 justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="text-green-600 h-8 w-8" />
                  </div>
                </div>
                <h3 className="font-bold text-xl text-blue-900 text-center mb-4">מערכת מותאמת אישית</h3>
                <p className="text-gray-700 text-center">
                  תרגול שמגיב לרמה שלך, המלצות ללמידה ממוקדת, דוחות התקדמות וניתוח טעויות בזמן אמת.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-orange-100">
                <div className="flex items-center gap-3 mb-6 justify-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="text-orange-600 h-8 w-8" />
                  </div>
                </div>
                <h3 className="font-bold text-xl text-blue-900 text-center mb-4">תמיכה מקצועית</h3>
                <p className="text-gray-700 text-center">
                  צוות מנוסה שזמין לענות על שאלות, להסביר ולסייע – ממש כמו מורה פרטי, אבל אונליין.
                </p>
              </div>
            </div>
          </section>

          {/* Testimonial */}
          <section className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-8 shadow-lg text-center border-2 border-blue-100">
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
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-10 shadow-lg border-2 border-green-200">
              <div className="flex items-center gap-3 mb-8 justify-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="text-green-600 h-6 w-6" />
                </div>
                <h2 className="font-bold text-2xl text-blue-900">ההתחייבות שלנו אליך</h2>
              </div>
              
              <div className="text-center mb-8">
                <p className="text-xl font-semibold text-blue-800 mb-4">
                  אתה מקבל את כל הכלים להצלחה – ואם תתמיד, תראה תוצאות.
                </p>
                <p className="text-lg text-gray-700">המערכת שלנו מבטיחה:</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 h-6 w-6 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 font-medium">התאמה מושלמת לפורמט האמיתי</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 h-6 w-6 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 font-medium">מאגר שאלות שמתעדכן כל הזמן</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 h-6 w-6 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 font-medium">מעקב אחר כל תרגול</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 h-6 w-6 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 font-medium">מענה מהיר לכל שאלה</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-12 text-white shadow-xl">
              <h2 className="text-3xl font-bold mb-6">מוכן להתחיל?</h2>
              <p className="text-xl mb-8 opacity-90">
                הצטרף עכשיו לאלפי תלמידים שכבר עברו את מבחן האמירם בהצלחה!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button 
                  size="lg" 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  to="/topics"
                >
                  התחל ללמוד עכשיו
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white text-blue-600 border-2 border-white hover:bg-blue-50 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  to="/simulations-entry"
                >
                  נסה סימולציה חינם
                </Button>
              </div>
              <div className="text-sm opacity-75 flex items-center justify-center gap-2">
                <Lock className="h-4 w-4" />
                <span>אין צורך בכרטיס אשראי • אפשר לבטל בכל רגע • תמיכה אנושית 24/7</span>
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
