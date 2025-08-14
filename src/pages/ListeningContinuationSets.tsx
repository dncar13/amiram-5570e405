import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, ArrowRight, Headphones, Lock, Play } from "lucide-react";

const ListeningContinuationSets = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Header />

      <main className="flex-grow">
        {/* Header */}
        <section className="py-10 border-b border-slate-700/40">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-3">
                  <Headphones className="w-4 h-4" />
                  <span className="text-sm">Listening</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">השלמת קטע שמע — סטים</h1>
                <p className="text-slate-300">4 קטעים ~20 שניות בכל סט. בחירה של המשך מתאים מתוך 4 אפשרויות.</p>
              </div>
              <div className="hidden sm:block">
                <Link to="/listening" className="text-slate-300 hover:text-blue-300 inline-flex items-center gap-2">
                  חזרה ל"שאלות שמע"
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Sets grid */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Set 1 - Active */}
              <Link to="/listening/continuation/1" className="group">
                <Card className="h-full bg-slate-800/80 border-purple-500/40 hover:border-purple-400/60 hover:bg-purple-900/20 transition-colors p-6">
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-600/40 border border-purple-500/40 flex items-center justify-center">
                          <Play className="w-5 h-5 text-purple-200" />
                        </div>
                        <div>
                          <div className="text-white font-bold">סט 1</div>
                          <Badge className="bg-purple-600 text-white border-0 text-xs">זמין</Badge>
                        </div>
                      </div>
                      <div className="text-slate-300 text-sm mb-3">4 קטעים • ~20ש׳ כל אחד</div>
                    </div>
                    <div className="mt-4 inline-flex items-center justify-center px-3 py-2 rounded-md bg-purple-600 text-white text-sm group-hover:bg-purple-700 transition-colors">
                      התחל סימולציה
                    </div>
                  </div>
                </Card>
              </Link>

              {/* Smoke Test Set - Available */}
              <Link to="/listening/continuation/smoketest" className="group">
                <Card className="h-full bg-slate-800/80 border-green-500/40 hover:border-green-400/60 hover:bg-green-900/20 transition-colors p-6">
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-green-600/40 border border-green-500/40 flex items-center justify-center">
                          <Play className="w-5 h-5 text-green-200" />
                        </div>
                        <div>
                          <div className="text-white font-bold">Smoke Test</div>
                          <Badge className="bg-green-600 text-white border-0 text-xs">זמין</Badge>
                        </div>
                      </div>
                      <div className="text-slate-300 text-sm mb-3">5 קטעים • TTS Audio</div>
                    </div>
                    <div className="mt-4 inline-flex items-center justify-center px-3 py-2 rounded-md bg-green-600 text-white text-sm group-hover:bg-green-700 transition-colors">
                      בדיקת מערכת
                    </div>
                  </div>
                </Card>
              </Link>

              {/* Sets 3-5 - Locked */}
              {[3,4,5].map((n) => (
                <Card key={n} className="h-full bg-slate-800/60 border-slate-700/60 p-6 opacity-70">
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-700/60 border border-slate-600/60 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-slate-300" />
                        </div>
                        <div>
                          <div className="text-white font-bold">סט {n}</div>
                          <Badge className="bg-slate-600 text-white border-0 text-xs">בקרוב</Badge>
                        </div>
                      </div>
                      <div className="text-slate-400 text-sm mb-3">לא נגיש כרגע</div>
                    </div>
                    <Button className="mt-4" size="sm" disabled>
                      נעול
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Back button for mobile */}
            <div className="mt-8 sm:hidden text-center">
              <Link to="/listening" className="text-slate-300 hover:text-blue-300 inline-flex items-center gap-2">
                חזרה ל"שאלות שמע"
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ListeningContinuationSets;
