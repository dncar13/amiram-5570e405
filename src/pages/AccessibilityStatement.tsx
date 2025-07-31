import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageCircle } from 'lucide-react';

const AccessibilityStatement: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main id="main-content" role="main" className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              הצהרת נגישות
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              אנחנו מחויבים להפוך את האתר שלנו לנגיש לכל המשתמשים, ללא תלות ביכולותיהם
            </p>
          </div>

          {/* Compliance Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-500">
                  תקן ישראלי 5568
                </Badge>
                רמת תאימות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                האתר שלנו תואם לתקן הישראלי 5568 (IS 5568) ולהנחיות הנגישות של W3C WCAG 2.1 ברמה AA.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>תאימות מלאה לקוראי מסך</li>
                <li>ניווט מלא באמצעות מקלדת</li>
                <li>ניגודיות צבעים מתאימה</li>
                <li>תמיכה בזום עד 200%</li>
                <li>טקסט חלופי לכל התמונות</li>
              </ul>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Keyboard Navigation */}
            <Card>
              <CardHeader>
                <CardTitle>ניווט במקלדת</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  האתר תומך בניווט מלא באמצעות מקלדת:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Tab - מעבר בין אלמנטים</li>
                  <li>Shift+Tab - מעבר אחורה</li>
                  <li>Enter/Space - הפעלת כפתורים</li>
                  <li>Escape - סגירת דיאלוגים</li>
                  <li>חצים - ניווט בתפריטים</li>
                </ul>
              </CardContent>
            </Card>

            {/* Screen Reader Support */}
            <Card>
              <CardHeader>
                <CardTitle>תמיכה בקוראי מסך</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  האתר מותאם לקוראי מסך מובילים:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>NVDA</li>
                  <li>JAWS</li>
                  <li>VoiceOver (Mac/iOS)</li>
                  <li>TalkBack (Android)</li>
                  <li>Dragon NaturallySpeaking</li>
                </ul>
              </CardContent>
            </Card>

            {/* Visual Accessibility */}
            <Card>
              <CardHeader>
                <CardTitle>נגישות חזותית</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>ניגודיות צבעים 4.5:1 לפחות</li>
                  <li>גדלי מטרה מינימליים 44x44 פיקסלים</li>
                  <li>תמיכה בזום עד 200%</li>
                  <li>אפשרות להפחתת אנימציות</li>
                  <li>מחווני פוקוס ברורים</li>
                </ul>
              </CardContent>
            </Card>

            {/* Content Structure */}
            <Card>
              <CardHeader>
                <CardTitle>מבנה תוכן</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>היררכית כותרות נכונה</li>
                  <li>רכיבי ARIA מתאימים</li>
                  <li>תוויות ברורות לטפסים</li>
                  <li>הודעות שגיאה מפורטות</li>
                  <li>קישורי דילוג לתוכן</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Known Issues */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>בעיות ידועות ופתרונות</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                אנחנו עובדים באופן רציף לשיפור הנגישות. בעיות ידועות נוכחיות:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong>סימולציות מתקדמות:</strong> חלק מהסימולציות המתקדמות עדיין נמצאות בתהליך התאמה מלאה לקוראי מסך
                </li>
                <li>
                  <strong>גרפים ותרשימים:</strong> עובדים על הוספת תיאורים מפורטים לכל הגרפים
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">פתרונות זמניים:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                  <li>ניתן לבקש מידע על תרשימים בטלפון או באימייל</li>
                  <li>זמינות מידע חלופי לכל התכנים</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>צור קשר לנושאי נגישות</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">
                נתקלת בבעיית נגישות? רוצה להציע שיפור? אנחנו כאן בשבילך!
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <div className="text-center">
                    <div className="font-semibold">אימייל</div>
                    <div className="text-sm text-gray-600">accessibility@amiram.co.il</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Phone className="w-6 h-6 text-green-600" />
                  <div className="text-center">
                    <div className="font-semibold">טלפון</div>
                    <div className="text-sm text-gray-600">03-1234567</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                  <div className="text-center">
                    <div className="font-semibold">צ'אט מקוון</div>
                    <div className="text-sm text-gray-600">זמין בשעות העבודה</div>
                  </div>
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>זמן תגובה:</strong> אנחנו מתחייבים לחזור אליך בתוך 48 שעות לכל פנייה הקשורה לנגישות.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-sm text-gray-600">
                <p>הצהרה זו עודכנה לאחרונה: {new Date().toLocaleDateString('he-IL')}</p>
                <p className="mt-2">גרסת תקן: IS 5568:2018, WCAG 2.1 AA</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AccessibilityStatement;