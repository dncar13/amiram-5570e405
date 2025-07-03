
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  RotateCcw, 
  BookOpenCheck, 
  ArrowLeft,
  Gift,
  Sparkles,
  Clock,
  Target,
  Zap
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PracticeOption {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  gradient: string;
  features: string[];
}

const PracticeOptions: React.FC = () => {
  const navigate = useNavigate();

  const practiceOptions: PracticeOption[] = [
    {
      type: 'sentence-completion',
      title: 'השלמת משפטים',
      description: 'תרגול בשאלות השלמת משפטים ומילים חסרות - חזק את אוצר המילים שלך',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      gradient: 'from-blue-600 to-blue-800',
      features: [
        'שאלות השלמת חסר',
        'בחירת מילה מתאימה',
        'הבנת הקשר המשפט',
        'הרחבת אוצר מילים'
      ]
    },
    {
      type: 'restatement',
      title: 'ניסוח מחדש',
      description: 'שאלות ניסוח מחדש והבעת רעיונות - שפר את כישורי ההבעה שלך',
      icon: <RotateCcw className="w-8 h-8" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      gradient: 'from-emerald-600 to-teal-800',
      features: [
        'ניסוח מחדש של משפטים',
        'הבעת רעיונות',
        'שימור משמעות',
        'שיפור כישורי הבעה'
      ]
    },
    {
      type: 'reading-comprehension',
      title: 'הבנת הנקרא',
      description: 'שאלות הבנת הנקרא עם קטעים מגוונים - פתח את כישורי ההבנה שלך',
      icon: <BookOpenCheck className="w-8 h-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      gradient: 'from-purple-600 to-indigo-800',
      features: [
        'קטעי קריאה מגוונים',
        'שאלות הבנה',
        'ניתוח טקסט',
        'מיומנות קריאה'
      ]
    },
  ];

  const handlePracticeClick = (type: string) => {
    navigate(`/simulation/type/${type}?practice=1`);
  };

  const handleBackClick = () => {
    navigate('/simulations-entry');
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Button
                variant="ghost"
                onClick={handleBackClick}
                className="mr-4 hover:bg-emerald-100"
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                חזרה
              </Button>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center ml-4">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    תרגול חינמי
                  </h1>
                  <div className="flex items-center text-emerald-600">
                    <Sparkles className="w-5 h-5 ml-2" />
                    <span className="font-semibold">ללא הגבלות וללא תשלום</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              בחר את סוג השאלות שברצונך להתרגל עליהן. כל התרגול הוא חינמי ללא הגבלות זמן או כמות שאלות
            </p>
          </motion.div>

          {/* Practice Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {practiceOptions.map((option, index) => (
              <motion.div
                key={option.type}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-2 border-gray-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      onClick={() => handlePracticeClick(option.type)}>
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 ${option.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <div className={option.color}>
                        {option.icon}
                      </div>
                    </div>
                    <CardTitle className="text-2xl mb-2">{option.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {option.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2 mb-6">
                      {option.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full ml-3" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full bg-gradient-to-r ${option.gradient} hover:opacity-90 text-white py-3 text-base font-semibold group-hover:scale-105 transition-transform duration-200`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePracticeClick(option.type);
                      }}
                    >
                      התחל תרגול
                      <Target className="w-4 h-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                למה לבחור בתרגול החינמי שלנו?
              </h2>
              <p className="text-gray-600 text-lg">
                קבל את כל הכלים שאתה צריך כדי להצליח במבחן הפסיכומטרי
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">חינמי לחלוטין</h3>
                <p className="text-gray-600">
                  אין צורך בתשלום או הרשמה - תתחיל לתרגל מיד
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">ללא הגבלות</h3>
                <p className="text-gray-600">
                  תרגל כמה שבא לך, מתי שבא לך, ללא הגבלות זמן
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">הסברים מיידיים</h3>
                <p className="text-gray-600">
                  קבל הסבר מפורט לכל שאלה מיד אחרי הענייה
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PracticeOptions;
