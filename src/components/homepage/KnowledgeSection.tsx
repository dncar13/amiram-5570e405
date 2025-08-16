import React from 'react';
import { FileText, ListChecks, Target } from 'lucide-react';

const KnowledgeSection: React.FC = () => {
  return (
    <section
      id="knowledge"
      aria-labelledby="knowledge-title"
      dir="rtl"
      className="py-16 md:py-24 bg-muted/30"
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <header className="text-center mb-12 md:mb-16">
          <h2 id="knowledge-title" className="text-3xl md:text-4xl font-bold text-foreground">
            מידע על מבחן אמיר"ם
          </h2>
          <p className="mt-2 text-base md:text-lg text-muted-foreground">
            מידע בסיסי על מבנה ודרישות המבחן
          </p>
        </header>



        {/* טעימת דקדוק */}
        <div className="bg-card rounded-2xl p-6 md:p-10 shadow-sm">
          <h3 className="text-2xl font-semibold text-foreground text-center mb-2">
            נושאי דקדוק במבחן
          </h3>
          <p className="text-center text-muted-foreground mb-8">
            21 נושאים מרכזיים לפי רמות קושי
          </p>

          <div className="flex flex-col gap-8">
            {/* רמה בסיסית */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">רמה בסיסית</h4>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-full bg-muted px-4 py-3">
                  <div className="font-semibold text-foreground">Present Simple</div>
                  <div className="text-xs text-muted-foreground italic">"She walks"</div>
                </div>
                <div className="rounded-full bg-muted px-4 py-3">
                  <div className="font-semibold text-foreground">Past Simple</div>
                  <div className="text-xs text-muted-foreground italic">"He went"</div>
                </div>
                <div className="rounded-full bg-muted px-4 py-3">
                  <div className="font-semibold text-foreground">Articles</div>
                  <div className="text-xs text-muted-foreground italic">"The, A, An"</div>
                </div>
                <div className="rounded-full border-2 border-dashed border-border px-4 py-3 text-muted-foreground">
                  +4 נושאים נוספים
                </div>
              </div>
            </div>

            {/* רמה בינונית */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">רמה בינונית</h4>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-full bg-muted px-4 py-3">
                  <div className="font-semibold text-foreground">Present Perfect</div>
                  <div className="text-xs text-muted-foreground italic">"I have done"</div>
                </div>
                <div className="rounded-full bg-muted px-4 py-3">
                  <div className="font-semibold text-foreground">Passive Voice</div>
                  <div className="text-xs text-muted-foreground italic">"It was written"</div>
                </div>
                <div className="rounded-full bg-muted px-4 py-3">
                  <div className="font-semibold text-foreground">Modal Verbs</div>
                  <div className="text-xs text-muted-foreground italic">"Should, Must"</div>
                </div>
                <div className="rounded-full border-2 border-dashed border-border px-4 py-3 text-muted-foreground">
                  +7 נושאים נוספים
                </div>
              </div>
            </div>

            {/* רמה מתקדמת */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">רמה מתקדמת</h4>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-full bg-muted px-4 py-3">
                  <div className="font-semibold text-foreground">Conditionals</div>
                  <div className="text-xs text-muted-foreground italic">"If I had..."</div>
                </div>
                <div className="rounded-full bg-muted px-4 py-3">
                  <div className="font-semibold text-foreground">Reported Speech</div>
                  <div className="text-xs text-muted-foreground italic">"He said that..."</div>
                </div>
                <div className="rounded-full border-2 border-dashed border-border px-4 py-3 text-muted-foreground">
                  +1 נושא נוסף
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="/articles"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
            >
              צפייה בכל נושאי הדקדוק
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeSection;
