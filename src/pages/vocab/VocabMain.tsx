import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, List, Brain, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const VocabMain: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-800">אוצר מילים</h1>
        <p className="text-xl text-slate-600">
          בנה את אוצר המילים שלך עם מילים נבחרות ושיטות לימוד מתקדמות
        </p>
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Word of the Day */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Calendar className="w-12 h-12 mx-auto text-blue-600 mb-2" />
            <CardTitle className="text-xl">מילת היום</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">
              למד מילה חדשה כל יום עם הסברים מפורטים ודוגמאות
            </p>
            <Link to="/vocab/word-of-day">
              <Button className="w-full">
                למד מילת היום
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Dictionary */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <BookOpen className="w-12 h-12 mx-auto text-green-600 mb-2" />
            <CardTitle className="text-xl">מילון</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">
              עיין במילון המילים המלא עם חיפוש לפי רמת קושי
            </p>
            <Link to="/vocab/dictionary">
              <Button variant="outline" className="w-full">
                עיין במילון
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quiz */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Brain className="w-12 h-12 mx-auto text-purple-600 mb-2" />
            <CardTitle className="text-xl">חידון</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">
              בחן את עצמך עם שאלות מגוונות על המילים שלמדת
            </p>
            <Link to="/vocab/quiz">
              <Button variant="outline" className="w-full">
                התחל חידון
              </Button>
            </Link>
          </CardContent>
        </Card>

      </div>

      {/* Stats Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            הסטטיסטיקות שלך
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">120</div>
              <div className="text-slate-600">מילים זמינות</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">40</div>
              <div className="text-slate-600">מילים קלות</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">40</div>
              <div className="text-slate-600">מילים בינוניות</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-4">פעולות מהירות</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/vocab/dictionary?level=easy">
            <Button variant="outline" size="lg">
              מילים קלות
            </Button>
          </Link>
          <Link to="/vocab/dictionary?level=medium">
            <Button variant="outline" size="lg">
              מילים בינוניות
            </Button>
          </Link>
          <Link to="/vocab/dictionary?level=hard">
            <Button variant="outline" size="lg">
              מילים קשות
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VocabMain;
