
import { Target, Zap, Users, MessageCircle } from "lucide-react";

const ModernFeaturesSection = () => {
  const features = [
    {
      icon: Target,
      title: "תרגול 1:1 עם המבחן האמיתי",
      description: "כל שאלה, טקסט וסימולציה אצלנו בנויים לפי המבנה והניסוח של מבחני האמירם האחרונים."
    },
    {
      icon: Zap,
      title: "פידבק מיידי והכוונה אישית",
      description: "בסוף כל תרגול תקבל הסבר קצר וברור על כל טעות, כולל המלצות ממוקדות למה כדאי לחזור."
    },
    {
      icon: Users,
      title: "מאגר שמתעדכן כל הזמן",
      description: "אנחנו עוקבים אחרי שינויים אמיתיים במבחן, ומוסיפים שאלות וטקסטים חדשים."
    },
    {
      icon: MessageCircle,
      title: "ליווי אמיתי, בלי מסך עשן",
      description: "אני כאן כדי לעזור, לייעץ וללוות – בין אם זו שאלה על חומר, התלבטות או טיפ ליום המבחן."
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-100/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            למה דווקא אצלנו?
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
            כי כאן אתה מתאמן בדיוק על
            <br />
            <span className="text-blue-600">מה שמצפה לך</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            לא על "בערך" – על הדבר האמיתי
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                <div className="flex items-start space-x-6 space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ModernFeaturesSection;
