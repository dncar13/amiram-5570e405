import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Headphones, Mic, Clock, FileText, BookOpen, Lock, Play } from "lucide-react";

const ListeningQuestions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="relative py-16 sm:py-20 text-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-4">
                <Headphones className="w-4 h-4" />
                <span className="text-sm">חדש</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">שאלות שמע (Listening) לאמיר״ם/אמירנט</h1>
              <p className="text-white/90 max-w-2xl mx-auto">
                כאן ירוכז כל מה שקשור לקטעי שמע במבחן אמירנט. הדף יתעדכן בהדרגה עם דוגמאות, תרגולים וסימולציות מותאמות.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-10 bg-gradient-to-b from-slate-900/40 to-slate-900">
          <div className="container mx-auto px-4 max-w-6xl grid gap-6 md:gap-8">
            {/* Type 1 */}
            <Card className="bg-slate-800/80 border-slate-700/60 shadow-xl p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">שאלות על הרצאה או שיחה (Lecture / Conversation and Questions)</h2>
                    <Badge className="bg-blue-600 text-white border-0">פרק ~7 דקות</Badge>
                  </div>
                  <p className="text-slate-300 mb-3">
                    פרק הכולל 3 קטעי שמע מסוג הרצאה, שיחה או דיון. אחרי כל קטע יופיעו שאלות הבנה.
                  </p>
                  <ul className="list-disc pr-5 space-y-1 text-slate-300">
                    <li>קטע קצר (~30 שניות) — שאלה אחת</li>
                    <li>קטע בינוני (~60 שניות) — שתי שאלות</li>
                    <li>קטע ארוך (~90 שניות) — שתי שאלות</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Type 2 */}
            <Card className="bg-slate-800/80 border-slate-700/60 shadow-xl p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">השלמת קטע שמע (Listening Text Continuation)</h2>
                    <Badge className="bg-purple-600 text-white border-0">4 קטעים ~20 שניות</Badge>
                  </div>
                  <p className="text-slate-300 mb-4">
                    בכל קטע יושמע משפט/רצף קצר שיינתק, ותתבקשו לבחור את ההמשך המתאים ביותר מתוך ארבע אפשרויות.
                  </p>

                  {/* CTA button to Sets page */}
                  <div className="mt-2">
                    <Button asChild className="bg-purple-600 hover:bg-purple-700">
                      <Link to="/listening/continuation" className="inline-flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        סטים
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Type 3 */}
            <Card className="bg-slate-800/80 border-slate-700/60 shadow-xl p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center">
                  <Mic className="w-6 h-6 text-emerald-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">יצירת מילה (Word Formation)</h2>
                    <Badge className="bg-emerald-600 text-white border-0">עד ~3 דקות</Badge>
                  </div>
                  <p className="text-slate-300">
                    משפט עם מילה חסרה — עליכם לבחור את הצורה הדקדוקית הנכונה (הטיה/סיומת/תחילית) מתוך ארבע אפשרויות.
                  </p>
                </div>
              </div>
            </Card>

            {/* Type 4 */}
            <Card className="bg-slate-800/80 border-slate-700/60 shadow-xl p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-600/30 border border-orange-500/40 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">דקדוק בהקשר (Grammar in Context)</h2>
                    <Badge className="bg-orange-600 text-white border-0">רב-ברירה</Badge>
                  </div>
                  <p className="text-slate-300">
                    משפט עם חלק חסר — יש לבחור את האפשרות הדקדוקית המתאימה ביותר מתוך ארבע.
                  </p>
                </div>
              </div>
            </Card>

            {/* Coming soon */}
            <Card className="bg-slate-900/60 border-slate-700/50 shadow-xl p-6 text-white text-center">
              <p className="text-slate-300">
                דוגמאות, תרגולים וסימולציות קטעי שמע — בקרוב.
              </p>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ListeningQuestions;
