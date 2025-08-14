import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Headphones, FileText, Play, Lock } from "lucide-react";

const ListeningContinuation = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Header />

      <main className="flex-grow">
        {/* Header */}
        <section className="py-10 border-b border-slate-700/40">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-right">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-3">
                <Headphones className="w-4 h-4" />
                <span className="text-sm">Listening</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">השלמת קטע שמע (Listening Text Continuation)</h1>
              <p className="text-slate-300">4 קטעים ~20 שניות בכל סט. בחרו סט להתחלה.</p>
            </div>
          </div>
        </section>

        {/* Sets */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <Card className="bg-slate-800/80 border-slate-700/60 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-right">
                  <h2 className="text-xl font-bold mb-1">סטים</h2>
                  <div className="text-slate-400 text-sm">סה"כ 4 סטים</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-200" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Set 1 - Active */}
                <Link to="/listening/continuation/1" className="group">
                  <div className="h-full rounded-xl border border-purple-500/40 bg-purple-900/20 hover:bg-purple-900/30 transition-colors p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-purple-600/40 border border-purple-500/40 flex items-center justify-center">
                          <Play className="w-4 h-4 text-purple-200" />
                        </div>
                        <div className="text-white font-semibold">סט 1</div>
                      </div>
                      <div className="text-slate-300 text-sm">4 קטעים • ~20ש׳ כל אחד</div>
                    </div>
                    <div className="mt-4 inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-purple-600 text-white text-sm group-hover:bg-purple-700">
                      התחל סימולציה
                    </div>
                  </div>
                </Link>

                {/* Sets 2-4 - Locked */}
                {[2,3,4].map((n) => (
                  <div key={n} className="h-full rounded-xl border border-slate-700/60 bg-slate-800/60 p-5 opacity-75 select-none">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-slate-700/60 border border-slate-600/60 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-slate-300" />
                      </div>
                      <div className="text-white font-semibold">סט {n}</div>
                      <Badge className="bg-slate-600 text-white border-0">בקרוב</Badge>
                    </div>
                    <div className="text-slate-400 text-sm mb-3">לא נגיש כרגע</div>
                    <Button size="sm" disabled aria-disabled>
                      נעול
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ListeningContinuation;
