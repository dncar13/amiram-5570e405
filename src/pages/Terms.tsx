import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, Calendar, Shield, AlertTriangle, Phone, Mail } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ScrollText className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                תקנון האתר
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              תנאי שימוש ומדיניות פרטיות לאתר AMIRAM.NET - פלטפורמת הלמידה לבחינות אמיר"ם ואמירנט
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="bg-blue-50 border-b">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-xl text-blue-900">
                  תקנון ותנאי שימוש
                </CardTitle>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <Calendar className="h-4 w-4" />
                <span>עודכן לאחרונה: יולי 2025</span>
              </div>
            </CardHeader>
            
            <CardContent className="prose prose-lg max-w-none p-8 text-right" dir="rtl">
              <div className="space-y-8">
                {/* Navigation */}
                <div className="bg-gray-50 p-6 rounded-lg border-r-4 border-blue-500">
                  <h3 className="text-blue-600 mb-4 text-lg font-semibold">תוכן עניינים</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#section1" className="text-gray-600 hover:text-blue-600 transition-colors">1. הקדמה והגדרות</a></li>
                    <li><a href="#section2" className="text-gray-600 hover:text-blue-600 transition-colors">2. אופי השירותים, אחריות האתר, והתנהלות משתמשים</a></li>
                    <li><a href="#section3" className="text-gray-600 hover:text-blue-600 transition-colors">3. פרטיות, איסוף מידע, והגנה על נתונים</a></li>
                    <li><a href="#section4" className="text-gray-600 hover:text-blue-600 transition-colors">4. תשלומים, מנויים ומדיניות ביטולים</a></li>
                    <li><a href="#section5" className="text-gray-600 hover:text-blue-600 transition-colors">5. קניין רוחני ותוכן משתמשים</a></li>
                  </ul>
                </div>

                {/* Section 1 */}
                <section id="section1" className="border-b border-gray-200 pb-8">
                  <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
                    1. הקדמה והגדרות
                  </h2>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">1.1. הקדמה</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    ברוכים הבאים לאתר AMIRAM.NET (להלן: "האתר"), המופעל ומנוהל על ידי 
                    חברת AMIRAM.NET (להלן: "החברה", "הנהלת האתר" או "מפעילי האתר").
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    הגלישה באתר, הרישום אליו, וכל שימוש בשירותים ובתכנים הנמצאים בו, 
                    כפופים לתקנון זה ולהוראות כל דין.
                  </p>

                  <div className="bg-blue-50 border-r-4 border-blue-400 p-4 my-6 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-blue-800">אנא קרא תקנון זה בעיון.</strong>
                        <span className="text-blue-700"> עצם הכניסה לאתר או שימוש בשירותים בו מהווים הסכמה בלתי חוזרת לכל תנאיו.</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">1.2. עדיפות התקנון</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    בכל מקרה של סתירה בין הוראות תקנון זה לבין מידע אחר המפורסם באתר, 
                    יגברו הוראות תקנון זה.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">1.3. שינויים בתקנון</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    החברה שומרת לעצמה את הזכות לעדכן, לתקן או לשנות תקנון זה בכל עת, לפי 
                    שיקול דעתה הבלעדי וללא הודעה מוקדמת. תוקף השינוי יחול ממועד פרסומו 
                    באתר, אלא אם צוין אחרת.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">המשתמש נדרש להתעדכן בתקנון בכל כניסה לאתר.</p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">1.4. לשון התקנון</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    התקנון מנוסח בלשון זכר מטעמי נוחות בלבד, אך הוא מתייחס לנשים ולגברים כאחד.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">כל האמור בלשון יחיד – אף בלשון רבים במשמע, וכן להיפך.</p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">1.5. הגדרות</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">לצורך תקנון זה יהיו למונחים הבאים הפירושים שלצידם:</p>
                  <ul className="text-gray-700 space-y-3 mr-6">
                    <li><strong>"האתר"</strong> – כלל הדפים, התכנים, השירותים והמערכות המוצעים תחת הדומיין www.amiram.net ובכל תת-דומיין הקשור אליו.</li>
                    <li><strong>"החברה" / "הנהלת האתר" / "מפעילי האתר"</strong> – חברת AMIRAM.NET, לרבות בעלי המניות, המנהלים, העובדים, ונציגיהם.</li>
                    <li><strong>"משתמש" / "גולש"</strong> – כל אדם, תאגיד או ישות משפטית אחרת, הגולש לאתר ו/או עושה שימוש, ישיר או עקיף, בכל אחד מהשירותים או התכנים שבו.</li>
                    <li><strong>"שירותים"</strong> – כל שירות, תכונה, סימולציה, כלי דיגיטלי, או מוצר מקוון, חינמי או בתשלום, המסופק על ידי האתר, לרבות אך לא רק: תרגול שאלות, סימולציות, הצגת תוצאות, תמיכה וכדומה.</li>
                    <li><strong>"תוכן"</strong> – כל מידע, טקסט, תמונה, וידאו, קובץ שמע, תוכנה, נתון, או חומר אחר, בין אם הועלה או נוצר על ידי החברה ובין אם על ידי משתמשי האתר.</li>
                    <li><strong>"חשבון משתמש"</strong> – הרשאה שניתנה למשתמש לצורך שימוש מורחב או אישי בשירותי האתר, על פי פרטי זיהוי (כגון דוא"ל וסיסמה).</li>
                  </ul>
                </section>

                {/* Section 2 */}
                <section id="section2" className="border-b border-gray-200 pb-8">
                  <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
                    2. אופי השירותים, אחריות האתר, והתנהלות משתמשים
                  </h2>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">2.1. אופי השירותים</h3>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">2.1.1.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    האתר AMIRAM.NET הינו פלטפורמה דיגיטלית ללימוד, תרגול והכנה למבחני 
                    אמיר"ם ואמירנט, באמצעות סימולציות ממוחשבות, מאגרי שאלות, כלי תרגול, 
                    טיפים, ניתוח ביצועים ושירותים דיגיטליים נוספים.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">2.1.2.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    החברה שומרת לעצמה את הזכות לקבוע אילו תכנים ושירותים יוצגו באתר, 
                    משך הצגתם, מבנה האתר, עיצובו וכל היבט אחר הנוגע לשירותים.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">2.1.3.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    החברה רשאית לעדכן, להרחיב, לצמצם, להפסיק או לשנות כל שירות, תכונה או תוכן, בכל עת, על פי שיקול דעתה הבלעדי.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">2.1.4.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    השירותים ניתנים "כמות שהם" (AS IS) והחברה אינה מתחייבת להתאמתם לצרכי כל משתמש.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">2.2. אחריות האתר</h3>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">2.2.1.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    החברה אינה אחראית לכל נזק, ישיר או עקיף, כספי או אחר, שייגרם למשתמש או לצד שלישי כלשהו כתוצאה מהשימוש באתר, הסתמכות על תכניו, או אי-זמינות השירותים.
                  </p>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">2.2.2.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    תכני האתר, ההסברים, השאלות והסימולציות מבוססים על ניסיון מקצועי ונועדו לסייע בלבד. אין לראות בהם ייעוץ מקצועי, תחליף להכוונה או אישור רשמי של כל גורם סטטוטורי (כגון המרכז הארצי לבחינות והערכה).
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">2.2.3.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    החברה לא מתחייבת כי תוצאות תרגול, ציונים או נתונים שיוצגו באתר אכן ישקפו את תוצאות המשתמש במבחני אמת.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">2.2.4.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    החברה לא תישא באחריות לתוכן שמקורו בצדדים שלישיים, או לתוכן שהועלה על ידי משתמשים, לרבות נכונות, עדכניות, מהימנות או חוקיות של מידע זה.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">2.2.5.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    החברה תנקוט באמצעים סבירים לשמירה על תקינות וזמינות האתר, אך אינה מתחייבת כי השירותים יינתנו כסדרם וללא הפסקות, תקלות, הפרעות או גישה בלתי מורשית.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">2.3. התנהלות המשתמשים – שימוש מותר ואסור</h3>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">2.3.1.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    המשתמש מתחייב לעשות שימוש באתר ובשירותיו בהתאם להוראות התקנון, ההוראות באתר, והוראות כל דין.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">2.3.2.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">חל איסור על המשתמשים:</p>
                  <ul className="text-gray-700 space-y-2 mr-6">
                    <li>לעשות שימוש בלתי חוקי או מזיק באתר, בתכניו או בשירותיו.</li>
                    <li>להפר זכויות קניין רוחני של החברה או צדדים שלישיים.</li>
                    <li>להעלות, לפרסם או להעביר לאתר תכנים פוגעניים, מאיימים, מטעים, שקריים, או בלתי חוקיים.</li>
                    <li>לנסות לחדור למערכות האתר, לשבש פעילותו, להפעיל רובוטים, תוכנות עוינות, או כל יישום מזיק.</li>
                    <li>לבצע כל פעולה שמטרתה להטעות, לפגוע, להטריד, להעליב או להשיג טובת הנאה לא חוקית.</li>
                    <li>לבצע כל שימוש מסחרי באתר או בתכניו, לרבות מכירה, הפצה, השכרה, או מתן רישיון משנה, ללא אישור בכתב מהחברה.</li>
                    <li>להתחזות לכל אדם או גורם אחר, או למסור פרטים כוזבים.</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">2.3.3.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    החברה רשאית לחסום, לבטל או להגביל גישה של משתמש שיפר את הוראות התקנון, לפי שיקול דעתה הבלעדי, ללא צורך בהודעה מוקדמת וללא החזר תשלום.
                  </p>
                </section>

                {/* Section 3 */}
                <section id="section3" className="border-b border-gray-200 pb-8">
                  <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
                    3. פרטיות, איסוף מידע, והגנה על נתונים
                  </h2>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">3.1. איסוף ושימוש במידע</h3>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">3.1.1.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">החברה אוספת מידע מהמשתמשים במסגרת פעילות האתר, ובכלל זה:</p>
                  <ul className="text-gray-700 space-y-2 mr-6">
                    <li>מידע שנמסר במעמד ההרשמה (למשל: שם, דוא"ל, טלפון).</li>
                    <li>נתוני שימוש וגלישה באתר (לרבות Cookies, כתובת IP, מידע טכני).</li>
                    <li>נתונים הנאספים בעת השימוש בשירותים הדיגיטליים (כגון תוצאות תרגול, התקדמות, בחירות בתרגילים, זמני שימוש).</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">3.1.2.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">החברה משתמשת במידע שנאסף, בין השאר, למטרות:</p>
                  <ul className="text-gray-700 space-y-2 mr-6">
                    <li>תפעול שוטף, אספקת השירותים ותמיכה טכנית.</li>
                    <li>שיפור, פיתוח והתאמת השירותים לצרכי המשתמשים.</li>
                    <li>שליחת עדכונים, הודעות, מידע תפעולי ושיווקי, בכפוף להוראות הדין.</li>
                    <li>קיום הוראות הדין והגנה על זכויות החברה.</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">3.1.3.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    החברה רשאית לעשות שימוש במידע סטטיסטי, מצרפי ואנונימי לצורך שיפור השירותים ו/או מסירתו לצדדים שלישיים, ובלבד שמידע זה אינו מזהה את המשתמשים באופן אישי.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">3.2. הגנה על מידע אישי</h3>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">3.2.1.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    החברה פועלת לפי נהלי אבטחה מחמירים ואמצעים מתקדמים לשמירה על סודיות, פרטיות ושלמות המידע האישי של המשתמשים.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">3.2.2.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">החברה לא תעביר מידע אישי של משתמש לצד שלישי, אלא במקרים הבאים:</p>
                  <ul className="text-gray-700 space-y-2 mr-6">
                    <li>נדרש לצורך אספקת השירותים ו/או תפעול האתר (כגון: ספקי שירות טכני, שירותי סליקה).</li>
                    <li>נדרש מכוח צו שיפוטי ו/או הוראה של רשות מוסמכת.</li>
                    <li>כאשר המשתמש הפר את הוראות התקנון או את הוראות הדין, לרבות לצורך הגנה על זכויות החברה, המשתמשים או צדדים שלישיים.</li>
                    <li>בהעברת פעילות האתר, בשל מיזוג או מכירת פעילות, ובלבד שהצד המקבל יתחייב לשמור על פרטיות המשתמשים בהתאם להוראות התקנון.</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">3.2.3.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    על אף האמור לעיל, החברה אינה אחראית למידע שנמסר במישרין על ידי המשתמש בפורומים, בצ'אט או בתגובות פומביות באתר – והמשתמש עושה זאת על אחריותו בלבד.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">3.3. זכויות המשתמש במידע</h3>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">3.3.1.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    המשתמש רשאי לפנות לחברה בכל עת ולבקש לעיין, לתקן, או למחוק מידע אישי השייך לו, בכפוף לדין ולהוראות החברה.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">3.3.2.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    המשתמש רשאי לבקש להפסיק קבלת דיוור שיווקי בכל עת, באמצעות קישור להסרה או פנייה לשירות הלקוחות.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">3.4. Cookies וטכנולוגיות דומות</h3>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">3.4.1.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    האתר עושה שימוש ב-Cookies וטכנולוגיות דומות לצורך תפעולו השוטף, אבטחת מידע, ניתוח נתוני שימוש, ושיפור חוויית המשתמש.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">3.4.2.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    המשתמש רשאי לחסום או למחוק קבצי Cookies דרך הגדרות הדפדפן, אולם פעולה זו עלולה למנוע שימוש מלא בכל שירותי האתר.
                  </p>
                </section>

                {/* Section 4 */}
                <section id="section4" className="border-b border-gray-200 pb-8">
                  <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
                    4. תשלומים, מנויים ומדיניות ביטולים
                  </h2>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">4.1. רכישת מנויים ושירותים בתשלום</h3>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">4.1.1.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    הגישה לחלק מהשירותים והתכנים באתר מותנית בתשלום וביצירת מנוי, כמפורט באתר.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">4.1.2.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    החברה שומרת לעצמה את הזכות לעדכן, להוסיף או לשנות את תעריפי השירותים, מסלולי המנוי, תקופות המנוי והתנאים החלים – בכל עת, לפי שיקול דעתה הבלעדי.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">4.1.3.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    המחירים המפורסמים באתר כוללים מע"מ כדין, אלא אם צוין במפורש אחרת.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">4.2. אמצעי תשלום וביצוע עסקה</h3>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">4.2.1.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    התשלום עבור השירותים יתבצע באמצעות אמצעי התשלום הקיימים והמפורטים 
                    באתר, לרבות כרטיסי אשראי, העברה בנקאית, או אמצעים דיגיטליים מאושרים.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">4.2.2.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    במעמד הרכישה, המשתמש נדרש למסור פרטים מלאים, נכונים ועדכניים. מסירת פרטים כוזבים או חלקיים עלולה למנוע אספקת השירותים ולהוביל לביטול הרכישה.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">4.2.3.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    השלמת העסקה מותנית באישור חברת האשראי או הספק הרלוונטי, ובהתקיימות כל יתר תנאי השימוש.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">4.2.4.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    במקרה של סירוב עסקה על ידי חברת האשראי, לא יינתן למשתמש גישה לשירותים בתשלום, והחברה לא תישא באחריות לכך.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">4.3. אספקת השירותים</h3>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">4.3.1.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    לאחר השלמת העסקה, תינתן למשתמש גישה לשירותים ולתכנים הנרכשים, 
                    באמצעות חשבון המשתמש באתר, בהתאם לתנאים שנקבעו ברכישה.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">4.3.2.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    החברה רשאית לשדרג, לעדכן או להפסיק שירותים מסוימים, וכן להציע שירותים חלופיים לפי שיקול דעתה.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">4.3.3.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    החברה לא תישא באחריות לאיחור, שיבוש או הפרעה במתן השירותים, הנובעים מנסיבות שאינן בשליטתה, לרבות תקלות טכניות ברשת האינטרנט או בשרתים.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">4.4. ביטולים והחזרים</h3>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">4.4.1.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    מדיניות הביטולים וההחזרים של האתר פועלת בהתאם לחוק הגנת הצרכן, התשמ"א-1981, ולתקנותיו.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">4.4.2.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    המשתמש רשאי לבטל עסקה בהתאם להוראות החוק, על ידי פנייה בכתב לשירות הלקוחות של האתר, בציון פרטי העסקה והסיבה לביטול.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">4.4.3.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    ביטול מנוי לאחר שהשימוש בשירות החל יזכה את המשתמש בהחזר כספי יחסי, עבור התקופה שבה לא נעשה שימוש בפועל, בהתאם ליתרת התקופה שנותרה עד תום המנוי, ובכפוף לכך שהחברה רשאית לנכות דמי ביטול בגובה 5% ממחיר העסקה או 100 ש"ח – לפי הנמוך מביניהם, כפי שמותר בחוק.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">4.4.4.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    החזר כספי יבוצע לאמצעי התשלום שבו בוצעה העסקה ובאותה שיטת תשלום, אלא אם המשתמש ביקש אחרת במפורש ובכתב. החברה תפעל להשלים את ההחזר בתוך 14 ימי עסקים ממועד קבלת הבקשה וכל המידע הדרוש לביצוע ההחזר.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">4.4.5.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    ביטול עסקה אינו מקנה למשתמש זכות לקבלת פיצוי כלשהו מעבר להחזר הסכום ששולם בפועל, למעט אם נקבע אחרת בדין.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">4.4.6.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    במקרה של ביטול מנוי, תיפסק הגישה לשירותים בתשלום בהתאם לתאריך הביטול, למעט אם צוין אחרת בתקנון או במפורש באתר.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">4.5. יצירת קשר ושירות לקוחות</h3>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">4.5.1.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    לבירורים, בקשות ביטול, או שאלות בנוגע לתשלומים ומנויים, ניתן לפנות לשירות הלקוחות של האתר בכתובת הדוא"ל support@amiram.net או באמצעות טופס "צור קשר" באתר.
                  </p>
                  
                  <div className="bg-green-50 border-r-4 border-green-400 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-lg font-semibold text-green-800 mb-2">פרטי התקשרות</h4>
                        <p className="text-green-700">
                          <strong>support@amiram.net</strong> 
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5 */}
                <section id="section5">
                  <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b-2 border-blue-200 pb-2">
                    5. קניין רוחני ותוכן משתמשים
                  </h2>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">5.1. זכויות יוצרים וקניין רוחני באתר</h3>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">5.1.1.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    כל זכויות היוצרים והקניין הרוחני באתר AMIRAM.NET, לרבות עיצוב האתר, 
                    מבנהו, סימני המסחר, הלוגו, מאגרי השאלות, הקוד, קבצי המדיה, טקסטים, 
                    תוכן לימודי, תמונות, קטעי וידאו, תוכנות, מאגרי מידע וכל חומר אחר 
                    הכלול בו – בין אם פותח על ידי החברה ובין אם על ידי צד שלישי מטעמה – שייכים לחברה בלבד, או לצדדים שלישיים שהעניקו לה רישיון שימוש כדין.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">5.1.2.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    אין להעתיק, לשכפל, לשדר, להפיץ, למכור, להעמיד לרשות הציבור, למסור, לבצע בפומבי, לפרסם, לתרגם, או לעשות כל שימוש מסחרי או לא מסחרי אחר בכל תוכן מהאתר או מחלק ממנו, אלא באישור מראש ובכתב מהחברה.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">5.1.3.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    אין לבצע כל הנדסה חוזרת, פירוק, שידור, גזירה, או הפקה מחדש של כל תוכנה, כלי דיגיטלי, או קוד המצוי באתר.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">5.2. העלאת תוכן משתמשים</h3>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">5.2.1.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    האתר עשוי לאפשר למשתמשים להעלות, לפרסם, לשלוח, או לשתף תוכן (כגון תגובות, שאלות, תמונות, קבצים).
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">5.2.2.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    המשתמש המעלה תוכן לאתר מצהיר ומתחייב כי התוכן הוא בבעלותו המלאה, או שהוא מחזיק בכל הזכויות הדרושות לפרסומו ולשימוש בו, וכי העלאתו לאתר אינה מפרה זכויות של צד שלישי, לרבות זכויות יוצרים, סימני מסחר, פרטיות, או כל זכות אחרת.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">5.2.3.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    המשתמש מעניק לחברה רישיון בלתי מוגבל בזמן, בלתי חוזר, כלל עולמי, ללא תמורה, לעשות בתוכן כל שימוש, לרבות הפצה, פרסום, שיפור, שימור, עיבוד, תרגום, העתקה, או הצגה – בכל מדיה או פלטפורמה, לפי שיקול דעתה.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">5.2.4.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    החברה רשאית לסרב לפרסם או להסיר כל תוכן שהועלה לאתר על ידי משתמש, על פי שיקול דעתה הבלעדי, בין אם נמצא שהתוכן מפר את התקנון ובין אם מכל סיבה אחרת.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">5.3. אחריות על תוכן משתמשים</h3>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">5.3.1.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    האחריות המלאה והבלעדית לתוכן שמעלה המשתמש לאתר חלה עליו בלבד, והחברה אינה אחראית בכל דרך שהיא לתוכן זה, לרבות לדיוקו, מהימנותו, חוקיותו, עדכניותו או שלמותו.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">5.3.2.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    החברה לא תישא בכל אחריות לנזקים שייגרמו למשתמש או לצד שלישי כתוצאה מהעלאה, הפצה, הצגה או שימוש בתוכן שהועלה לאתר על ידי משתמשים.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-700 mb-3">5.3.3.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    המשתמש מתחייב לשפות את החברה בגין כל נזק, תשלום או הוצאה שייגרמו לה עקב הפרת סעיף זה.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">5.4. דיווח על הפרת זכויות</h3>
                  
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">5.4.1.</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    אם משתמש או צד שלישי סבור כי פורסם באתר תוכן המפר את זכויותיו, עליו לפנות לחברה ללא דיחוי בדוא"ל: support@amiram.net עם פרטי ההפרה, והחברה תפעל לבדוק את הפנייה ולפעול בהתאם להוראות הדין.
                  </p>
                  
                  <div className="bg-red-50 border-r-4 border-red-400 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-lg font-semibold text-red-800 mb-2">דיווח על הפרות</h4>
                        <p className="text-red-700">
                          <strong>support@amiram.net</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;