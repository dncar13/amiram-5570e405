import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

// אם יש לך קומפוננטת Button מוכנה, השתמש בזו במקום להגדיר מחדש
const Button = ({ children, to, className = "", ...props }) => {
  return (
    <a
      href={to}
      className={`inline-block px-6 py-3 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};

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

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const faqs = [
    {
      question: "איך מתחילים ללמוד באתר?",
      answer: "ההרשמה לאתר פשוטה ומהירה – דרך מייל, גוגל או טלפון. לאחר מכן תוכל להתחיל ללמוד מיד, עם גישה חינמית לתכנים מרכזיים ואפשרות לשדרוג לגישה מלאה בכל שלב."
    },
    {
      question: "כמה זמן באמת לוקח להתכונן למבחן רישוי חשמלאי?",
      answer: "האמת? כדי ללמוד את כל החומר לעומק – נדרשת לפחות שנה, במיוחד כשמדובר במאגר של מעל 1,000 שאלות והבנה יסודית של חוק החשמל. עם זאת, רוב התלמידים שלנו מגיעים אלינו לאחר קורס או שניים, כאשר הם כבר מכירים את התיאוריה – ואז ההתמקדות היא בתרגול ממוקד. במקרה כזה, 2–3 חודשים לפני המבחן זה זמן מצוין לתרגול חכם, חזרות ממוקדות וסימולציות. הפלטפורמה שלנו תעזור לכם למקסם את הזמן ולזהות את הנושאים שדורשים חיזוק."
    },
    {
      question: "האם הפלטפורמה מתאימה גם למהנדסי חשמל והנדסאים?",
      answer: "בהחלט! התרגולים, השאלות והסימולציות באתר מותאמים גם לבחינות הרישוי של מהנדסי חשמל והנדסאי חשמל. התכנים בנויים לפי דרישות משרד העבודה וכוללים שאלות שמופיעות בפועל בבחינות מהסוג הזה. גם אם למדתם במסגרת אקדמית – הפלטפורמה מספקת דרך מעשית לרענן, לתרגל ולחדד את הידע לקראת המבחן."
    },
    
    {
      question: "האם התכנים מתעדכנים לפי תקנות חדשות?",
      answer: "בהחלט. כל שינוי בתקנות או דרישות נבחן ומוטמע באתר תוך 48 שעות – עם הסברים ברורים על ההשלכות. כך תישארו תמיד מעודכנים."
    },
    {
      question: "מה קורה אם לא עוברים את המבחן?",
      answer: "אנחנו מלווים אתכם עד הסוף. אם לא תעברו את הבחינה – תקבלו חודש נוסף במנוי, חינם, כדי שתוכלו להתכונן שוב בראש שקט."
    },
    {
      question: "האם אפשר ללמוד מהנייד?",
      answer: "בוודאי. האתר מותאם למובייל, טאבלט ומחשב – כולל מצב למידה מיוחד לנסיעות (עם תמיכה באופליין). תלמדו מתי שנוח לכם – בבית, בעבודה או באוטובוס."
    },
    {
      question: "איך מתרגלים את החומר בפועל?",
      answer: "באמצעות סימולציות אינטראקטיביות שמדמות תקלות, חיבורים ומצבים מהשטח. כולל גרירת רכיבים, עבודה בלוחות חשמל, ואפילו תצוגת תלת-ממד – חוויה מעשית אמיתית."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <HelpCircle className="text-blue-600 mr-2" size={24} />
            <h2 className="text-2xl md:text-3xl font-bold">שאלות נפוצות</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            קיבצנו עבורכם את התשובות לשאלות הנפוצות ביותר. אם לא מצאתם את מה שחיפשתם, אל תהססו ליצור קשר
          </p>
        </div>

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
              <Button to="/topics" className="bg-blue-600 text-white">
                להתחלת הלימוד עכשיו
              </Button>
              <Button to="/contact" className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50">
                לשיחת ייעוץ אישית
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;