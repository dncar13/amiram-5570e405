
const HowItWorks = () => {
  return (
    <section className="max-w-5xl mx-auto mb-16">
      <h2 className="text-3xl font-bold mb-12 text-blue-900 text-center">איך זה עובד בפועל?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl">
            <span className="text-3xl font-bold text-white">1</span>
          </div>
          <h3 className="font-bold text-xl mb-4 text-blue-900">נרשמים ומתחילים לתרגל</h3>
          <p className="text-gray-600">
            פותחים חשבון, בוחרים נושא או רמת קושי, ומתחילים לתרגל עם שאלות מותאמות בדיוק למבחן.
          </p>
        </div>
        
        <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl">
            <span className="text-3xl font-bold text-white">2</span>
          </div>
          <h3 className="font-bold text-xl mb-4 text-blue-900">מקבלים פידבק מיידי והסברים</h3>
          <p className="text-gray-600">
            כל שאלה מקבלת הסבר מפורט בעברית ודוח התקדמות אחרי כל סימולציה.
          </p>
        </div>
        
        <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl">
            <span className="text-3xl font-bold text-white">3</span>
          </div>
          <h3 className="font-bold text-xl mb-4 text-blue-900">משפרים ומתקדמים</h3>
          <p className="text-gray-600">
            המערכת ממליצה לך במה להתמקד, מציעה חידוד לנקודות חלשות, ונותנת לך תחושת ביטחון אמיתית עד למבחן.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
