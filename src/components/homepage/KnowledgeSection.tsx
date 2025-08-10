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
            לפני שמתרגלים — בואו נבין את המבחן
          </h2>
          <p className="mt-2 text-base md:text-lg text-muted-foreground">
            ידע מעמיק על אמיר"ם יעזור לכם להתכונן נכון
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {/* כרטיס 1: מה זה אמיר"ם */}
          <article className="bg-card rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition md:row-span-2">
            <div
              className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5"
              aria-hidden="true"
            >
              {/* Icon removed */}
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">מה זה בכלל אמיר"ם?</h3>
            <div className="space-y-4">
              <p className="text-sm md:text-base text-muted-foreground">
                מבחן אמיר"ם קובע את רמת האנגלית שלכם לתואר, ויכול להעניק פטור מקורסי אנגלית.
              </p>
              <ul className="divide-y divide-border rounded-md border border-border">
                <li className="flex items-center justify-between py-3 px-4">
                  <span className="text-muted-foreground">85+ נקודות</span>
                  <strong className="text-primary">פטור מלא</strong>
                </li>
                <li className="flex items-center justify-between py-3 px-4">
                  <span className="text-muted-foreground">70–84 נקודות</span>
                  <strong className="text-primary">פטור חלקי</strong>
                </li>
                <li className="flex items-center justify-between py-3 px-4">
                  <span className="text-muted-foreground">120 דקות</span>
                  <strong className="text-foreground">זמן המבחן</strong>
                </li>
                <li className="flex items-center justify-between py-3 px-4">
                  <span className="text-muted-foreground">75 שאלות</span>
                  <strong className="text-foreground">סה"כ</strong>
                </li>
              </ul>
              <a href="/מה-זה-אמירם" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                למדריך המלא
              </a>
            </div>
          </article>

          {/* כרטיס 2: מבנה המבחן */}
          <article className="bg-card rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition">
            <div
              className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5"
              aria-hidden="true"
            >
              {/* Icon removed */}
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4">מבנה המבחן</h3>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-[80px_1fr_auto] items-center p-3 rounded-lg bg-muted">
                <span className="font-bold text-primary">חלק א'</span>
                <span className="font-medium">הבנת הנקרא</span>
                <span className="text-sm text-muted-foreground">25 שאלות | 40 דק'</span>
              </div>
              <div className="grid grid-cols-[80px_1fr_auto] items-center p-3 rounded-lg bg-muted">
                <span className="font-bold text-primary">חלק ב'</span>
                <span className="font-medium">דקדוק והשלמות</span>
                <span className="text-sm text-muted-foreground">25 שאלות | 30 דק'</span>
              </div>
              <div className="grid grid-cols-[80px_1fr_auto] items-center p-3 rounded-lg bg-muted">
                <span className="font-bold text-primary">חלק ג'</span>
                <span className="font-medium">טקסט ארוך</span>
                <span className="text-sm text-muted-foreground">25 שאלות | 50 דק'</span>
              </div>
            </div>
          </article>

          {/* כרטיס 3: למה זה עובד */}
          <article className="bg-card rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition">
            <div
              className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5"
              aria-hidden="true"
            >
              {/* Icon removed */}
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4">למה התרגול שלנו עובד</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4">
              מעל 3,000 שאלות מעודכנות, יותר מ־15 סיפורים ב־3 רמות, ו־25 שאלות לכל סיפור. התרגולים מכסים:
            </p>
            <ul className="list-disc pr-5 space-y-2 text-sm md:text-base text-foreground">
              <li>סוגי השאלות הנפוצים</li>
              <li>רמות קושי מדויקות</li>
              <li>נושאי הדקדוק החוזרים</li>
              <li>סגנונות טקסטים שונים</li>
            </ul>
          </article>
        </div>

        {/* טעימת דקדוק */}
        <div className="bg-card rounded-2xl p-6 md:p-10 shadow-sm">
          <h3 className="text-2xl font-semibold text-foreground text-center mb-2">
            נושאי הדקדוק שתתרגלו אצלנו
          </h3>
          <p className="text-center text-muted-foreground mb-8">
            21 נושאים מרכזיים, מסודרים לפי רמות קושי
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
              href="/נושאי-דקדוק"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
            >
              ראו את כל נושאי הדקדוק עם הסברים מלאים
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeSection;
