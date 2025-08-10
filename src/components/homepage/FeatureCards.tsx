import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, BookOpen, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserJourneySection = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [activeStep, setActiveStep] = useState(0);
  const [showGuide, setShowGuide] = useState(false);

  // Journey steps data with personal touch
  const journeySteps = [
    {
      title: 'כניסה',
      subtitle: 'מתחילים בלי כאב ראש',
      icon: '🚀',
      color: 'from-orange-500 to-red-500',
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-50',
      description: 'הרשמה קצרה ובחירת יעד אישי—ציון, תאריך או נושא חלש.',
      personalNote: 'מיקוד אחד קטן עכשיו חוסך זמן אחר־כך.',
      stats: '1–2 דקות',
      extendedInfo: 'בחירת מטרה ספציפית מגבירה את סיכויי ההצלחה ב-42% על פי מחקרים. כשאתה יודע בדיוק לאן אתה הולך, המוח שלך עובד יותר ממוקד.',
      tip: 'תבחר יעד ציון שהוא 10-15 נקודות מעל מה שאתה חושב שאתה יכול - זה ידחוף אותך לעבוד קצת יותר קשה ובסוף תגיע למקום טוב יותר.',
      visual: (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 text-center relative overflow-hidden">
          <div className="absolute top-2 right-2 text-xs text-orange-600 font-bold italic">בוא נתחיל!</div>
          <div className="text-6xl mb-2">👋</div>
          <p className="text-sm text-gray-600 font-medium">ברוכים הבאים למסע</p>
          <div className="mt-3 text-xs text-orange-500 font-bold">יעד: ציון 134+ 🎯</div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-orange-200 rounded-full opacity-50" />
        </div>
      )
    },
    {
      title: 'אבחון',
      subtitle: 'מיפוי רמה חכם',
      icon: '📊',
      color: 'from-cyan-500 to-teal-500',
      borderColor: 'border-cyan-500',
      bgColor: 'bg-cyan-50',
      description: 'מיני־אבחון 5–7 דקות שמזהה חוזקות וחולשות בדקדוק, קריאה והאזנה (שאלות שמע). בסוף תקבל תקציר + קישורים למאמרים רלוונטיים.',
      personalNote: 'זה מצפן, לא מבחן—ענה בקצב שלך.',
      stats: '5–7 דקות',
      extendedInfo: 'האבחון כולל בדיקת דקדוק (זיהוי הדפוסים הקשים לך), הבנת הנקרא (מיפוי סוגי הטקסטים שמאתגרים אותך) ושאלות שמע חדשות (בדיקה איך אתה מתמודד עם האנגלית המדוברת).',
      tip: 'אל תנסה "להצליח" באבחון - תענה כמו שאתה באמת יודע. המטרה היא לקבל תמונה אמיתית, לא לרשים את המחשב.',
      visual: (
        <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6 relative">
          <div className="absolute top-2 left-2 text-xs text-cyan-600 font-bold">כולל שאלות שמע 🎧</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">דקדוק</span>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full animate-pulse" />
              </div>
              <span className="text-sm font-bold text-teal-600">75%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">הבנה</span>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full" />
              </div>
              <span className="text-sm font-bold text-teal-600">50%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">🎧 שמע</span>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full" />
              </div>
              <span className="text-sm font-bold text-teal-600">65%</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'תוכנית אישית',
      subtitle: 'בנויה להרגלים שלך',
      icon: '🎯',
      color: 'from-emerald-500 to-green-600',
      borderColor: 'border-emerald-500',
      bgColor: 'bg-emerald-50',
      description: 'מערך יומי גמיש: סט תרגול קצר + מאמר ממוקד לנושא של אותו יום. חזרות חכמות על טעויות.',
      personalNote: '20–30 דק׳ ביום מספיקות כששומרים רצף.',
      stats: 'מסלול 30 יום (גמיש)',
      extendedInfo: 'המערכת בונה מסלול של 30 יום גמיש. כל יום מתמקד בנושא ספציפי, אבל גם חוזר על דברים קודמים שטעית בהם. המערכת זוכרת כל שאלה שטעית בה ומביאה אותה שוב בפערי זמן מדעיים.',
      tip: 'אפילו אם יש לך יום קשה - עשה 5 דקות. זה שומר על המומנטום ומקל על החזרה למחרת.',
      visual: (
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 relative">
          <div className="absolute top-1 right-1 text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">מותאם אישית</div>
          <div className="grid grid-cols-7 gap-1 text-xs">
            {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map((day, i) => (
              <div key={i} className="text-center">
                <div className="font-bold mb-1 text-emerald-700">{day}</div>
                <div className={`w-8 h-8 rounded-lg ${i < 5 ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg' : 'bg-gray-200'} flex items-center justify-center text-white transform hover:scale-110 transition-transform`}>
                  {i < 5 ? '✓' : '💤'}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-center text-xs text-emerald-600 font-bold italic">כולל שאלות שמע יומיות</div>
        </div>
      )
    },
    {
      title: 'תרגול',
      subtitle: 'בדיוק כמו בבחינה',
      icon: '📚',
      color: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-500',
      bgColor: 'bg-amber-50',
      description: 'אלפי שאלות לפי נושא ורמה, כולל שאלות שמע ייחודיות. לכל שאלה הסבר תכל׳ס, ובנושאים מורכבים—מאמר קצר משלים.',
      personalNote: 'נתקעת? דלג וחזור אחר־כך—המערכת תשמור מה לחזק.',
      stats: '3,000+ שאלות • כולל שמע',
      extendedInfo: 'התרגול כולל דקדוק מתקדם (all/both/each, זמנים מורכבים), הבנת הנקרא (מאמרים אקדמיים, חדשות), שאלות שמע חדשות (דו-שיחים, הרצאות) ואוצר מילים ברמה אקדמית.',
      tip: 'כשנתקעת על שאלה - דלג, אבל תחזור אליה אחרי 10 דקות. לפעמים המוח צריך זמן לעבד.',
      visual: (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 relative">
          <div className="absolute top-2 left-2 text-xs bg-amber-500 text-white px-2 py-1 rounded-full animate-bounce">חם!</div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-1">3,000+</div>
            <div className="text-sm text-gray-600 mb-2">שאלות מכל הסוגים</div>
            <div className="flex justify-center gap-2 mt-2">
              <span className="text-xs bg-amber-100 px-2 py-1 rounded-full">📖 קריאה</span>
              <span className="text-xs bg-amber-100 px-2 py-1 rounded-full">🎧 שמע</span>
              <span className="text-xs bg-amber-100 px-2 py-1 rounded-full">✏️ דקדוק</span>
            </div>
            <div className="text-xs text-amber-600 font-bold mt-2 italic">+ מאמרים משלימים</div>
          </div>
        </div>
      )
    },
    {
      title: 'הצלחה',
      subtitle: 'מוכנות לבחינה',
      icon: '🏆',
      color: 'from-yellow-500 to-red-500',
      borderColor: 'border-yellow-500',
      bgColor: 'bg-yellow-50',
      description: 'סימולציה מסכמת, דגשים לשבוע האחרון וטיפים ליום הבחינה.',
      personalNote: 'היציבות והביטחון קודמים לציון—והציון יגיע.',
      stats: 'יעד פטור: 134',
      extendedInfo: 'השבוע האחרון: ימים 7-5 חזרה קלה על נושאים חזקים, ימים 4-2 תרגול קצר של נושאים חלשים, יום לפני מנוחה וחזרה על טיפים טכניים.',
      tip: 'זכור - אתה מוכן. עברת הכנה מסודרת. גם אם לא תדע שאלה אחת או שתיים - זה בסדר.',
      visual: (
        <div className="bg-gradient-to-br from-yellow-50 to-red-50 rounded-xl p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/30 to-red-200/30 animate-pulse" />
          <div className="relative">
            <div className="text-5xl mb-2 animate-bounce">🏆</div>
            <div className="text-3xl font-bold text-green-600 mb-1">134+</div>
            <div className="text-sm text-gray-600 font-semibold">פטור מלא מובטח!</div>
            <div className="text-xs text-red-500 font-bold mt-2 italic">🎓 בהצלחה!</div>
          </div>
          <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
          <div className="absolute top-4 right-3 w-2 h-2 bg-red-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
        </div>
      )
    }
  ];

  // Calculate progress
  const progress = ((activeStep + 1) / journeySteps.length) * 100;

  return (
    <section ref={containerRef} className="py-16 md:py-20 bg-gradient-to-b from-orange-50 via-white to-cyan-50 overflow-hidden relative">
      {/* Fun background pattern - lighter for mobile */}
      <div className="absolute inset-0 opacity-20 md:opacity-30">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-orange-300 rounded-full animate-pulse" />
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-cyan-300 rounded-lg rotate-45 animate-bounce hidden md:block" />
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-emerald-200 rounded-full animate-ping" />
      </div>
      
      {/* Floating Action Button - Mobile Only */}
      <div className="md:hidden sticky bottom-6 right-4 z-50 pointer-events-none" style={{ width: 'auto' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: 1,
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          {/* Main button */}
          <motion.a
            href="/simulations-entry"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white relative block"
            style={{ 
              background: 'linear-gradient(135deg, #005683 0%, #4B2E80 100%)',
              marginBottom: 'env(safe-area-inset-bottom, 0px)',
              boxShadow: '0 8px 32px rgba(0, 86, 131, 0.4), 0 2px 8px rgba(0,0,0,0.1)'
            }}
            aria-label="כניסה לסימולציות"
          >
            {/* Subtle pulse effect */}
            <div 
              className="absolute inset-0 rounded-full opacity-30 animate-ping" 
              style={{ background: 'linear-gradient(135deg, #005683 0%, #4B2E80 100%)' }}
            />
            
            {/* Icon - Simple and clear */}
            <div className="relative z-10">
              <span className="text-2xl">
                🎧
              </span>
            </div>
            
            {/* Active indicator dot - using the orange accent */}
            <motion.div 
              className="absolute -top-0.5 -right-0.5"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF7F0E' }} />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with personal touch */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12 md:mb-16 relative"
        >
          {/* Personal signature/motto */}
          <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full font-bold text-xs md:text-sm shadow-lg">
            ✨ לומדים מדויק, נבחנים בטוח ✨
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 relative">
            <span className="text-gray-900">המסע שלך </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-500 to-cyan-600">
              להצלחה
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-2">
            5 שלבים ברורים עד ביטחון בבחינה
          </p>
          
          <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto mb-4">
            כולל <strong className="text-cyan-600">שאלות שמע</strong> ומאמרים קצרים לפי נושא
          </p>
          
          {/* Guide button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => setShowGuide(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            קרא את המדריך המלא
          </motion.button>
          
          {/* Progress bar */}
          <div className="mt-6 max-w-xs mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>התקדמות</span>
              <span className="font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-cyan-500 rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Desktop: Horizontal Timeline / Mobile: Vertical Timeline */}
        <div className="hidden md:block">
          {/* DESKTOP - Horizontal Timeline */}
          <div className="relative mb-16 px-8">
            {/* Horizontal line */}
            <div className="absolute top-10 left-8 right-8 h-1 bg-gray-200 rounded-full" />
            
            {/* Active progress line */}
            <motion.div 
              className="absolute top-10 left-8 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(activeStep / (journeySteps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
              style={{ maxWidth: 'calc(100% - 4rem)' }}
            />

            {/* Steps circles */}
            <div className="relative flex justify-between items-start">
              {journeySteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 * index }}
                  className="flex flex-col items-center cursor-pointer flex-1"
                  onClick={() => setActiveStep(index)}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all shadow-xl z-10 relative ${
                      index <= activeStep 
                        ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-2xl' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    style={{
                      background: index <= activeStep 
                        ? `linear-gradient(135deg, ${index === 0 ? '#f97316' : index === 1 ? '#06b6d4' : index === 2 ? '#10b981' : index === 3 ? '#f59e0b' : '#eab308'}, ${index === 0 ? '#ef4444' : index === 1 ? '#14b8a6' : index === 2 ? '#059669' : index === 3 ? '#f97316' : '#ef4444'})`
                        : '#e5e7eb'
                    }}
                  >
                    {index < activeStep ? (
                      <CheckCircle className="w-10 h-10 text-white animate-pulse" />
                    ) : (
                      <span className="animate-bounce">{step.icon}</span>
                    )}
                  </motion.div>
                  <div className="mt-4 text-center max-w-[120px]">
                    <div className="font-bold text-sm text-gray-900">{step.title}</div>
                    <div className="text-xs text-gray-500 italic mt-1">{step.subtitle}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Active Step Details - Desktop */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-2xl shadow-2xl p-8 border-t-4 ${journeySteps[activeStep].borderColor}`}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className={`inline-block mb-3 px-3 py-1 ${journeySteps[activeStep].bgColor} rounded-full`}>
                  <span className="text-xs font-bold text-gray-700">שלב {activeStep + 1}</span>
                </div>

                <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  <span className="text-3xl">{journeySteps[activeStep].icon}</span>
                  {journeySteps[activeStep].title}
                  {journeySteps[activeStep].stats && (
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded-full font-normal">
                      {journeySteps[activeStep].stats}
                    </span>
                  )}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {journeySteps[activeStep].description}
                </p>

                {/* Extended info */}
                {journeySteps[activeStep].extendedInfo && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600">
                      {journeySteps[activeStep].extendedInfo}
                    </p>
                  </div>
                )}

                <div className={`inline-block px-3 py-1 ${journeySteps[activeStep].bgColor} rounded-lg mb-3`}>
                  <p className="text-xs font-bold italic text-gray-700">
                    💡 {journeySteps[activeStep].personalNote}
                  </p>
                </div>

                {/* Tip */}
                {journeySteps[activeStep].tip && (
                  <div className="border-r-4 border-orange-400 bg-orange-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-orange-700">
                      💎 טיפ: {journeySteps[activeStep].tip}
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                {journeySteps[activeStep].visual}
              </div>
            </div>
          </motion.div>
        </div>

        {/* MOBILE - Vertical Timeline */}
        <div className="md:hidden relative">
          {/* Vertical line */}
          <div className="absolute right-8 top-0 bottom-0 w-1 bg-gray-200 rounded-full" />
          
          {/* Active progress line */}
          <motion.div 
            className="absolute right-8 top-0 w-1 bg-gradient-to-b from-orange-500 via-red-500 to-cyan-500 rounded-full"
            initial={{ height: 0 }}
            animate={{ height: `${(activeStep / (journeySteps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />

          {/* Steps */}
          <div className="relative space-y-8">
            {journeySteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.15 * index }}
                className="relative flex items-start gap-4"
                onClick={() => setActiveStep(index)}
              >
                {/* Step circle */}
                <div className="absolute right-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl cursor-pointer transition-all shadow-xl ${
                      index <= activeStep 
                        ? `bg-gradient-to-br ${step.color} shadow-2xl` 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {index < activeStep ? (
                      <CheckCircle className="w-8 h-8 text-white animate-pulse" />
                    ) : (
                      <span className="animate-bounce">{step.icon}</span>
                    )}
                  </motion.div>
                </div>

                {/* Content card */}
                <div className="flex-1 mr-20">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`bg-white rounded-2xl shadow-lg p-6 border-r-4 ${step.borderColor} cursor-pointer hover:shadow-2xl transition-all`}
                  >
                    <div className={`inline-block mb-3 px-3 py-1 ${step.bgColor} rounded-full`}>
                      <span className="text-xs font-bold text-gray-700">שלב {index + 1}</span>
                    </div>

                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      {step.title}
                      {step.stats && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full font-normal">
                          {step.stats}
                        </span>
                      )}
                    </h3>
                    
                    <p className="text-sm text-gray-500 italic mb-3">
                      {step.subtitle}
                    </p>
                    
                    <p className="text-gray-600 mb-4 text-sm">
                      {step.description}
                    </p>

                    <div className={`inline-block px-3 py-1 ${step.bgColor} rounded-lg mb-4`}>
                      <p className="text-xs font-bold italic text-gray-700">
                        💡 {step.personalNote}
                      </p>
                    </div>
                    
                    {/* Extended info toggle */}
                    {activeStep === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        {step.extendedInfo && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600">
                              {step.extendedInfo}
                            </p>
                          </div>
                        )}
                        
                        {step.tip && (
                          <div className="border-r-4 border-orange-400 bg-orange-50 rounded-lg p-3">
                            <p className="text-xs font-semibold text-orange-700">
                              💎 טיפ: {step.tip}
                            </p>
                          </div>
                        )}
                        
                        {/* Visual representation */}
                        {step.visual}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 mb-8 bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-900">
            למה אנחנו?
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🎧</div>
              <h4 className="font-bold text-gray-900 mb-1">שאלות שמע</h4>
              <p className="text-sm text-gray-600">שמדמות סיטואציות אמיתיות</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📖</div>
              <h4 className="font-bold text-gray-900 mb-1">מאמרים קצרים</h4>
              <p className="text-sm text-gray-600">שמחברים ישירות לנושאי התרגול</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚙️</div>
              <h4 className="font-bold text-gray-900 mb-1">מערך תרגול גמיש</h4>
              <p className="text-sm text-gray-600">שמתאים ללוח הזמנים שלך</p>
            </div>
          </div>
        </motion.div>

        {/* End CTA */}
        <motion.div
          id="journey-cta"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 md:mt-16"
        >
          <Link 
            to="/simulations-entry"
            className="inline-block bg-gradient-to-r from-yellow-400 to-red-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all cursor-pointer"
          >
            <span className="text-lg md:text-xl">מוכנים להתחיל? לתרגול הראשון</span>
          </Link>
          <p className="mt-3 text-sm text-gray-500 italic">
            מתחילים בקטן—כבר היום.
          </p>
        </motion.div>

      </div>

      {/* Full Guide Modal */}
      {showGuide && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowGuide(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">המדריך המלא להכנה לבחינת אמי"ר</h2>
              <button
                onClick={() => setShowGuide(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="prose prose-lg max-w-none" style={{ direction: 'rtl' }}>
                <h3 className="text-xl font-bold mb-4">🎯 למה הכנה נכונה משנה הכל?</h3>
                <p className="mb-4">
                  בחינת אמי"ר איננה רק מבחן אנגלית - היא השער שלך לחופש לימודי ומקצועי. 
                  ציון 134 ומעלה פוטר אותך לחלוטין מלימודי אנגלית באוניברסיטה ופותח בפניך כל התארים המתקדמים.
                </p>
                
                {journeySteps.map((step, index) => (
                  <div key={index} className="mb-8 p-6 bg-gray-50 rounded-xl">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <span className="text-2xl">{step.icon}</span>
                      שלב {index + 1}: {step.title} - {step.subtitle}
                    </h3>
                    
                    <div className="mb-4">
                      <p className="font-semibold mb-2">מה קורה בשלב זה:</p>
                      <p className="text-gray-700">{step.description}</p>
                      {step.extendedInfo && <p className="text-gray-600 mt-2">{step.extendedInfo}</p>}
                    </div>
                    
                    {step.tip && (
                      <div className="bg-orange-50 border-r-4 border-orange-400 p-4 rounded-lg">
                        <p className="font-semibold text-orange-700">💎 טיפ מנצח:</p>
                        <p className="text-gray-700">{step.tip}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <h3 className="text-xl font-bold mb-4">💡 הטיפים הכי חשובים להצלחה</h3>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">לגבי הלמידה:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>עקביות מנצחת אינטנסיביות: 25 דקות כל יום עדיף על 3 שעות אחת לשבוע</li>
                      <li>למד בזמן קבוע: המוח אוהב שגרה ולומד יותר טוב באותה שעה כל יום</li>
                      <li>תן לעצמך פרסים קטנים: אחרי כל סשן מוצלח - משהו שאתה אוהב</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">לגבי שאלות השמע:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>תרגל עם רעש רקע: הבחינה לא תיהיה בשקט מוחלט</li>
                      <li>זהה את סוג השאלה מהר: דו-שיח / הרצאה / הודעה - לכל אחד יש אסטרטגיה</li>
                      <li>כתב הערות קצרות: תאריכים, שמות, מספרים</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">לגבי ביטחון עצמי:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>זכור שרוב האנשים עוברים: הבחינה בנויה להצלחה, לא לכישלון</li>
                      <li>התמקד בביצועים שלך: אל תהשווה את עצמך לאחרים</li>
                      <li>חגוג התקדמות קטנה: אפילו שיפור של 5 נקודות זה הישג</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 text-center p-6 bg-gradient-to-r from-yellow-50 to-red-50 rounded-xl">
                  <p className="text-xl font-bold text-gray-900 mb-2">
                    הצלחה רבה! אתה בדרך הנכונה 🎯
                  </p>
                  <p className="text-gray-700">
                    זכור: הציון בבחינת אמי"ר לא מגדיר כמה אתה חכם. 
                    הוא רק מודד כמה טוב הכנת את עצמך לבחינה הספציפית הזו.
                  </p>
                  <button
                    onClick={() => setShowGuide(false)}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:shadow-lg transition-all"
                  >
                    סגור ובוא נתחיל!
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default UserJourneySection;