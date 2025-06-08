
const ModernStorySection = () => {
  return (
    <section className="py-32 bg-white relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Story content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                הסיפור שלנו
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                נולדנו מתוך
                <br />
                <span className="text-blue-600">תסכול אמיתי</span>
              </h2>
            </div>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                אחרי שנים של ליווי סטודנטים, הבנתי שרוב הקורסים והאתרים מציעים חומר כללי 
                ולא נוגעים באמת בלב של מבחן האמירם.
              </p>
              
              <p>
                ראיתי תלמידים מתאמנים בלי סוף – ועדיין מופתעים מהמבנה, מהסגנון 
                ומהשאלות הייחודיות של האמירם.
              </p>
              
              <p className="font-semibold text-gray-900">
                החלטתי להקים פלטפורמה שבאמת מבינה אותך: לא עוד שיעורים משעממים, 
                לא עוד חומר מיותר.
              </p>
            </div>
          </div>

          {/* Visual element */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 shadow-xl">
              <div className="h-full bg-white rounded-2xl shadow-inner flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">א</span>
                  </div>
                  <p className="text-gray-600 font-medium">
                    בניתי את האקדמיה הזו כדי לתת לך שקט, ביטחון, 
                    ולהביא אותך לציון שמגיע לך
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernStorySection;
