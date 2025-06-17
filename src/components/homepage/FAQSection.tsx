
import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm p-6 mb-4 border transition-all duration-300 ${
        isOpen ? "border-blue-200" : "border-transparent"
      }`}
    >
      <button
        className="w-full flex justify-between items-center text-right"
        onClick={onClick}
      >
        <span className="text-blue-600">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
        <h3 className="text-lg font-semibold pr-2 flex-grow text-right">{question}</h3>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-600 text-base leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [showFAQ, setShowFAQ] = useState(false);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const faqs = [
    {
      question: "איך מתחילים להתכונן למבחן אמיר/אמיר\"ם?",
      answer: "פשוט מאוד: נרשמים לסימולטור, בוחרים את רמת הקושי והנושא שמעניינים אתכם – ומתחילים לתרגל! המערכת מתאימה את עצמה בדיוק אליכם, עם דוחות התקדמות, סטטיסטיקות, וטיפים שמקפיצים אתכם קדימה."
    },
    {
      question: "כמה זמן באמת צריך להשקיע כדי להגיע לציון גבוה?",
      answer: "כל אחד והקצב שלו, אבל היתרון שלנו – אתם מקבלים תרגול ממוקד וחכם! 20-30 דקות ביום עם הסימולטור שלנו, ואתם כבר תרגישו בהבדל. ככל שתתמידו, תראו שיפור אמיתי ומדוד."
    },
    {
      question: "האם הסימולטור מתאים גם למתקשים באנגלית?",
      answer: "בהחלט! כל השאלות מגיעות עם הסברים מפורטים וטיפים בעברית, כך שגם מי שמרגיש \"חלש\" באנגלית יוכל להתחזק ולהבין איפה צריך להשתפר."
    },
    {
      question: "האם השאלות מעודכנות לפי הפורמט החדש של הבחינה?",
      answer: "בוודאי! השאלות שלנו לא מועתקות מהמבחן, אבל הן נכתבות ומעודכנות בקפידה על-ידי צוות מומחים שמכיר לעומק את דרישות הפורמט, רמות הקושי, וסגנון הבחינה של אמיר ואמיר\"ם. כל שאלה עוברת בקרת איכות ומותאמת בדיוק לרמה של הבחינה העדכנית ביותר."
    },
    {
      question: "מה קורה אם לא מצליחים לענות על שאלה?",
      answer: "אנחנו כאן בשבילכם גם כשלא הולך! אם ניסיתם, התמדתם, ועדיין לא עברתם – שלחו לנו הוכחה (צילום תוצאה או פירוט קצר) ותקבלו גישה חוזרת לסימולציה ב-50% הנחה. אנחנו מאמינים בכם ובשירות שלנו!"
    },
    {
      question: "האם אפשר להתאמן כמה פעמים שרוצים?",
      answer: "כן! יש לכם גישה חופשית להתאמן, לשפר ולחזור על כל סימולציה – עד שתרגישו בטוחים לגמרי. אפשר לחזור על אותם נושאים ולתרגל בלי הגבלה."
    },
    {
      question: "האם יש הסברים וטיפים לכל שאלה?",
      answer: "בטח! לכל שאלה מחכה לכם הסבר מפורט וטיפ ממוקד שיעזור לכם להבין את הלוגיקה הנכונה, לחדד את אסטרטגיית הפתרון ולחסוך זמן בבחינה האמיתית."
    },
    {
      question: "איך יודעים מהן החולשות שלי באנגלית?",
      answer: "המערכת שלנו מזהה עבורכם את הנושאים שבהם אתם פחות חזקים ומציעה תרגול ממוקד. תקבלו דוחות התקדמות, התראות והמלצות אישיות, כדי שלא תפספסו אף הזדמנות להשתפר."
    },
    {
      question: "מה ההבדל בין סימולציה לבין מבחן אמיתי?",
      answer: "הסימולציה שלנו מדמה במדויק את התנאים של הבחינה – כולל לחץ זמן, רמות קושי, וסוגי שאלות. אבל אצלנו אפשר לעצור, לחזור ולנתח כל שאלה עם הסבר – כך שתגיעו מוכנים ובטוחים למבחן האמיתי."
    },
    {
      question: "האם אפשר להתרגל לתנאי הזמן של הבחינה?",
      answer: "חד-משמעית כן! אפשר לבחור בסימולציה עם טיימר אמיתי, כך שתתרגלו לנהל את הזמן ולחוות את הלחץ של הבחינה. רוצים לתרגל בלי לחץ? אפשר גם לבחור תרגול חופשי."
    }
  ];
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <HelpCircle className="text-blue-600 mr-2" size={24} />
            <Button
              onClick={() => setShowFAQ(!showFAQ)}
              variant="ghost"
              className="text-2xl md:text-3xl font-bold p-0 h-auto hover:bg-transparent hover:text-blue-600 transition-colors"
            >
              שאלות נפוצות
              <span className="mr-2">
                {showFAQ ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </span>
            </Button>
          </div>
          {showFAQ && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              קיבצנו עבורכם את כל מה שחשוב לדעת כדי להתחיל ולנצח במבחן אמיר/אמיר"ם. לא מצאתם תשובה? צרו קשר ונשמח לעזור!
            </p>
          )}
        </div>

        {showFAQ && (
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => toggleFAQ(index)}
              />
            ))}

            <div className="bg-blue-50 rounded-lg p-8 mt-10 text-center border border-blue-100">
              <h3 className="text-lg font-semibold mb-3">מוכנים להתחיל ללמוד?</h3>
              <p className="text-gray-700 mb-6">
                הצטרפו למאות תלמידים שכבר מתקדמים איתנו לקראת רישיון החשמלאי – בצורה ממוקדת, גמישה ומעודכנת.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <a href="/simulations-entry">להתחלת הלימוד עכשיו</a>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  className="bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <a href="/contact">לשיחת ייעוץ אישית</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
