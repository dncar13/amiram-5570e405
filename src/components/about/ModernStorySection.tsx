
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
                <span className="text-blue-600">הכל התחיל</span>
                <br />
                בסלון שלנו
              </h2>
            </div>
            
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                במשך 5 שנים לימדנו יחד יותר מ-80 תלמידים לאנגלית פסיכומטרי. 
                ראינו איך כל תלמיד צריך גישה שונה, איך השיטות המסורתיות לא עובדות לכולם,
                ובעיקר - איך תלמידים מוכשרים מוותרים על חלומות בגלל מחירי ההכנה הגבוהים.
              </p>
              
              <p>
                אז החלטנו לשנות את הכללים. 
                לקחנו את כל הידע שצברנו, השיטות שפיתחנו, והטעויות הנפוצות שזיהינו -
                והעברנו הכל לפלטפורמה דיגיטלית נגישה.
              </p>
              
              <p className="font-semibold text-gray-900">
                היום כל תלמיד יכול לקבל הכנה איכותית, מותאמת אישית, במחיר הוגן.
              </p>
            </div>
          </div>

          {/* Visual element - Living room photo */}
          <div className="relative">
            <div className="aspect-square overflow-hidden shadow-xl" style={{borderRadius: '18px'}}>
              <img 
                src="https://i.postimg.cc/cCDTZvjk/pexels-cottonbro-7128754.jpg"
                alt="Living room where our teaching journey began"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              
              {/* Simple caption overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white font-semibold text-lg">
                  "כאן הכל התחיל"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernStorySection;
