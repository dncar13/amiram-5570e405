
const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-10 text-center">מה אומרים עלינו הבוגרים</h2>
        <p className="text-center mb-12 text-sm text-gray-600 max-w-3xl mx-auto">
          מאות תלמידים כבר השתמשו במערכת שלנו והצליחו בבחינות בצורה מיטבית
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white rounded-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-semibold">דני כהן</h4>
                <p className="text-xs text-gray-500">סטודנט להנדסאי חשמל</p>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              "האתר עזר לי מאוד להתכונן לבחינות הגמר. החומר מאורגן בצורה מצוינת, והשאלות ממש דומות למה שהיה בבחינה האמיתית."
            </p>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-white rounded-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-semibold">לירון דויד</h4>
                <p className="text-xs text-gray-500">מהנדס חשמל</p>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              "הסימולציות שלכם מעולות! אני משתמש באתר גם לרענון ידע מדי פעם. ממליץ בחום לכל מי שלומד חשמל או עובד בתחום."
            </p>
          </div>
          
          {/* Testimonial 3 */}
          <div className="bg-white rounded-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-semibold">רון לוי</h4>
                <p className="text-xs text-gray-500">חשמלאי מוסמך</p>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              "עברתי את המבחן בזכותכם! החומר מוסבר בצורה פשוטה וברורה, והשאלות עזרו לי לזהות פערי ידע שהיו לי. תודה רבה!"
            </p>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="flex justify-center items-center mt-16 gap-8 md:gap-24">
          <div className="text-center">
            <div className="text-2xl font-bold text-electric-navy">4.9/5</div>
            <div className="text-xs text-gray-500">דירוג ממוצע</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-electric-blue">98%</div>
            <div className="text-xs text-gray-500">אחוזי הצלחה</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">+100</div>
            <div className="text-xs text-gray-500">משתמשים</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
