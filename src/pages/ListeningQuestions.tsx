import React from 'react';
import { motion } from 'framer-motion';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Headphones, Target, CheckCircle, AlertCircle, BookOpen, FileText, Mic, Clock, Zap, Star, Play } from "lucide-react";

const ListeningQuestions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-cyan-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 bg-gradient-to-br from-orange-500 via-red-500 to-cyan-600 text-white overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: "url('/images/hero-listening.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center top",
              backgroundRepeat: "no-repeat"
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/60 via-red-500/60 to-cyan-600/70" />
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full animate-pulse" />
            <div className="absolute top-32 right-20 w-16 h-16 border-2 border-white rounded-lg rotate-45 animate-bounce hidden md:block" />
            <div className="absolute bottom-20 left-32 w-12 h-12 bg-white/20 rounded-full animate-ping" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 mb-6 shadow-lg">
                <Star className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-bold">החל מ-17.3.2025</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                המתכונת החדשה של מבחן 
                <span className="block text-yellow-200 mt-2">אמירנט</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
                בישיבת המועצה להשכלה גבוהה (המל"ג) מיום 17.12.2019 הוחלט: מערכת ההשכלה הגבוהה בישראל תעבור ללימוד והערכת הישגים בשפה האנגלית במתכונת מודרנית
              </p>
            </motion.div>
          </div>
        </section>

        {/* 4 Skills Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-orange-50 to-cyan-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                4 מיומנויות שפה מרכזיות
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                המבחן מתמקד בבדיקה מקיפה של כל מיומנויות השפה החיוניות
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 md:p-6 text-white text-center shadow-lg hover:shadow-xl transition-all"
              >
                <BookOpen className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold text-lg">קריאה</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 md:p-6 text-white text-center shadow-lg hover:shadow-xl transition-all"
              >
                <Headphones className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold text-lg">הבנת הנשמע</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 md:p-6 text-white text-center shadow-lg hover:shadow-xl transition-all"
              >
                <FileText className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold text-lg">כתיבה</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 md:p-6 text-white text-center shadow-lg hover:shadow-xl transition-all"
              >
                <Mic className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold text-lg">דיבור</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What's New Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                מה חדש החל מ-17.3.2025?
              </h2>
              <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
                אל הבחינה נוספו <strong>ארבעה סוגי פרקים ניסיוניים</strong>. כל נבחן יקבל <strong>שני פרקים ניסיוניים</strong>
              </p>
            </motion.div>

            {/* Important Notice */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-6 md:p-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-bl-full opacity-50" />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-800 mb-2 text-lg">טיפ חשוב:</h3>
                    <p className="text-amber-900 leading-relaxed">
                      לא ניתן לבחור אילו פרקים תקבלו, וייתכן שתקבלו אפילו שני פרקים מאותו סוג. 
                      <strong className="text-amber-800"> טעות בפרקים אלו לא תפגע בציון</strong>, אבל תשובות נכונות עשויות 
                      <strong className="text-amber-800"> להוסיף נקודה או שתיים</strong> לציון הסופי.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Question Types */}
            <div className="mb-12">
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center"
              >
                סוגי הפרקים החדשים
              </motion.h3>
              <div className="grid gap-6 md:gap-8">
                
                {/* Type 1 - Lecture/Conversation */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-l-4 border-blue-500 shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-bl-full opacity-50" />
                    
                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 relative z-10">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg flex-shrink-0">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-3">
                          <h2 className="text-xl md:text-2xl font-bold text-gray-900">שאלות על הרצאה או שיחה</h2>
                          <Badge className="bg-blue-600 text-white border-0 self-start">7 דקות לפרק</Badge>
                        </div>
                        <p className="text-gray-600 mb-4 text-base md:text-lg leading-relaxed">
                          בכל פרק: 3 קטעי שמע עם שאלות הבנה. נושאים יומיומיים ואקדמיים קלים.
                        </p>
                        <div className="grid gap-3 mb-6">
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-700">קטע קצר (30 שניות) → שאלה אחת</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-700">קטע בינוני (60 שניות) → שתי שאלות</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-700">קטע ארוך (90 שניות) → שתי שאלות</span>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                          <h4 className="font-bold text-blue-800 mb-2">סוגי שאלות:</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• רעיון מרכזי (Main Idea)</li>
                            <li>• פרטים ספציפיים (Specific Details)</li>
                            <li>• מסקנות והשלכות (Inference)</li>
                            <li>• יחס ומטרת הדובר (Speaker Attitude)</li>
                          </ul>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg transform hover:scale-105 transition-all">
                            <Link to="/listening/comprehension" className="inline-flex items-center gap-2">
                              <Play className="w-4 h-4" />
                              סימולציה
                            </Link>
                          </Button>
                          
                          <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg transform hover:scale-105 transition-all">
                            למידה ותרגול
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Type 2 - Audio Continuation */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-l-4 border-purple-500 shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-bl-full opacity-50" />
                    
                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 relative z-10">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg flex-shrink-0">
                        <Headphones className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-3">
                          <h2 className="text-xl md:text-2xl font-bold text-gray-900">השלמת קטע שמע</h2>
                          <Badge className="bg-purple-600 text-white border-0 self-start">4 דקות לפרק</Badge>
                        </div>
                        <p className="text-gray-600 mb-4 text-base md:text-lg leading-relaxed">
                          בכל פרק: 4 קטעי שמע של כ-20 שניות כל אחד. משפט יינתק ותצטרכו לבחור את ההמשך המתאים ביותר.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg transform hover:scale-105 transition-all">
                            <Link to="/listening/continuation" className="inline-flex items-center gap-2">
                              <Play className="w-4 h-4" />
                              סימולציה
                            </Link>
                          </Button>
                          
                          <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg transform hover:scale-105 transition-all">
                            למידה ותרגול
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Type 3 - Word Formation */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-l-4 border-emerald-500 shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-bl-full opacity-50" />
                    
                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 relative z-10">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg flex-shrink-0">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-3">
                          <h2 className="text-xl md:text-2xl font-bold text-gray-900">יצירת מילה</h2>
                          <Badge className="bg-emerald-600 text-white border-0 self-start">10 שאלות לפרק</Badge>
                        </div>
                        <p className="text-gray-600 mb-4 text-base md:text-lg leading-relaxed">
                          השלמת מילה אחת בהתאם להקשר הדקדוקי והמשמעותי. נגזרות, צורות פועל ותארים.
                        </p>
                        
                        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 mb-4">
                          <h4 className="font-bold text-emerald-800 mb-2">דוגמה:</h4>
                          <p className="text-emerald-700 text-sm">
                            "The scientist's discovery was truly ______ (remark)"<br/>
                            <strong>תשובה:</strong> remarkable (תואר המתאר את הגילוי)
                          </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button asChild className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg transform hover:scale-105 transition-all">
                            <Link to="/listening/word-formation" className="inline-flex items-center gap-2">
                              <Play className="w-4 h-4" />
                              סימולציה
                            </Link>
                          </Button>
                          
                          <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg transform hover:scale-105 transition-all">
                            למידה ותרגול
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Type 4 - Grammar in Context */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-l-4 border-orange-500 shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-bl-full opacity-50" />
                    
                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 relative z-10">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
                        <Clock className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-3">
                          <h2 className="text-xl md:text-2xl font-bold text-gray-900">דקדוק בהקשר</h2>
                          <Badge className="bg-orange-600 text-white border-0 self-start">10 שאלות לפרק</Badge>
                        </div>
                        <p className="text-gray-600 mb-4 text-base md:text-lg leading-relaxed">
                          בחינת מבנים דקדוקיים בתוך משפט אמיתי. Subjunctive, Conditionals, Passive ועוד.
                        </p>
                        
                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 mb-4">
                          <h4 className="font-bold text-orange-800 mb-2">דוגמה:</h4>
                          <p className="text-orange-700 text-sm">
                            "The committee insisted that the proposal ______ before the deadline."<br/>
                            <strong>תשובה:</strong> be submitted (Subjunctive אחרי פעלי דרישה)
                          </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button asChild className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg transform hover:scale-105 transition-all">
                            <Link to="/listening/grammar-context" className="inline-flex items-center gap-2">
                              <Play className="w-4 h-4" />
                              סימולציה
                            </Link>
                          </Button>
                          
                          <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg transform hover:scale-105 transition-all">
                            למידה ותרגול
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Scoring Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-12"
            >
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-400 p-6 md:p-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-bl-full opacity-50" />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-800 mb-3">מה חשוב לדעת על הציון?</h3>
                    <div className="space-y-3 text-gray-700">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <span>לפרקים הניסיוניים משקל <strong>קטן מאוד</strong> בציון (אם בכלל)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <span>הציון שמוצג בסוף הבחינה <strong>כולל</strong> את תרומת הפרקים הניסיוניים</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Road to Hillel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-400 p-6 md:p-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-bl-full opacity-50" />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-emerald-800 mb-3">הדרך לבחינת הִלאל</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      <strong>המתכונת החדשה של אמירנט</strong> היא צעד נוסף בדרך לבחינת <strong>הִלאל</strong> – 
                      בחינת השמה לרמות אנגלית באקדמיה, הבודקת:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
                        <BookOpen className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium">הבנת הנקרא</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
                        <Headphones className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium">הבנת הנשמע</span>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium">שימוש בשפה וכתיבה</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-gradient-to-r from-orange-500 via-red-500 to-cyan-600 text-white p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
                {/* Background animations */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-8 left-8 w-16 h-16 border-2 border-white rounded-full animate-pulse" />
                  <div className="absolute bottom-8 right-8 w-12 h-12 bg-white/20 rounded-lg rotate-45 animate-bounce" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/30 rounded-full animate-ping" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Zap className="w-8 h-8 animate-bounce" />
                    <h3 className="text-2xl md:text-3xl font-bold">רוצים להתכונן בצורה חכמה?</h3>
                  </div>
                  <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                    התחילו לתרגל את ארבעת סוגי הפרקים החדשים כבר עכשיו – כדי להגיע רגועים ובטוחים לבחינה.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/listening/practice">
                      <Button className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg transform hover:scale-105 transition-all font-bold">
                        התחילו תרגול עכשיו
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="border-2 border-white text-white hover:bg-white hover:text-orange-600 text-lg px-8 py-4 bg-transparent font-bold transform hover:scale-105 transition-all"
                    >
                      למידע נוסף על הבחינה
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ListeningQuestions;