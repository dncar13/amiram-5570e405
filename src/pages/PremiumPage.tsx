import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, CheckCircle, ArrowRight, Sparkles, Target, BookOpen, Brain, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { checkUserPremiumStatus } from '@/services/supabaseQuestionsService';

const PremiumPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const premiumStatus = await checkUserPremiumStatus();
        setIsPremium(premiumStatus);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleStartPremiumPractice = (type: string, difficulty: string) => {
    if (!isPremium) {
      toast({
        title: "נדרש שדרוג לפרמיום",
        description: "תכונה זו זמינה רק למנויים פרמיום",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to unified simulation with premium access
    navigate(`/simulation/type/${type}/${difficulty}?limit=50`);
  };

  const handleStartMixedPractice = () => {
    if (!isPremium) {
      toast({
        title: "נדרש שדרוג לפרמיום", 
        description: "תכונה זו זמינה רק למנויים פרמיום",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to unified simulation with mixed questions
    navigate('/simulation/full');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-amber-500/20 rounded-full">
              <Crown className="w-8 h-8 text-amber-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">AmirAM Premium</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            שדרג את החוויה שלך עם גישה בלתי מוגבלת לכל השאלות ותכונות מתקדמות
          </p>
        </div>

        {isPremium ? (
          /* Premium User Content */
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/30 rounded-xl p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-300 mb-2">ברוך הבא, מנוי פרמיום!</h2>
              <p className="text-green-200/80">יש לך גישה לכל התכונות המתקדמות</p>
            </div>

            {/* Premium Practice Options */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <CardTitle className="text-white">הבנת הנקרא</CardTitle>
                  </div>
                  <CardDescription className="text-slate-400">
                    תרגול מקיף בהבנת הנקרא
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => handleStartPremiumPractice('reading-comprehension', 'easy')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    רמה קלה
                  </Button>
                  <Button 
                    onClick={() => handleStartPremiumPractice('reading-comprehension', 'medium')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    רמה בינונית
                  </Button>
                  <Button 
                    onClick={() => handleStartPremiumPractice('reading-comprehension', 'hard')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    רמה קשה
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-400" />
                    <CardTitle className="text-white">השלמת המשפט</CardTitle>
                  </div>
                  <CardDescription className="text-slate-400">
                    שיפור יכולות השלמת משפטים
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => handleStartPremiumPractice('sentence-completion', 'easy')}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    רמה קלה
                  </Button>
                  <Button 
                    onClick={() => handleStartPremiumPractice('sentence-completion', 'medium')}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    רמה בינונית
                  </Button>
                  <Button 
                    onClick={() => handleStartPremiumPractice('sentence-completion', 'hard')}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    רמה קשה
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <CardTitle className="text-white">אוצר מילים</CardTitle>
                  </div>
                  <CardDescription className="text-slate-400">
                    הרחבת אוצר המילים
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => handleStartPremiumPractice('vocabulary', 'easy')}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    רמה קלה
                  </Button>
                  <Button 
                    onClick={() => handleStartPremiumPractice('vocabulary', 'medium')}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    רמה בינונית
                  </Button>
                  <Button 
                    onClick={() => handleStartPremiumPractice('vocabulary', 'hard')}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    רמה קשה
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Mixed Practice */}
            <Card className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-700/30">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-amber-400" />
                  <CardTitle className="text-amber-300 text-xl">תרגול מעורב מתקדם</CardTitle>
                </div>
                <CardDescription className="text-amber-200/80">
                  בחינה מלאה עם כל סוגי השאלות - חוויה אמיתית של מבחן פסיכומטרי
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleStartMixedPractice}
                  className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-medium"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  התחל תרגול מעורב (80 שאלות)
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Non-Premium User Content */
          <div className="space-y-8">
            {/* Upgrade Prompt */}
            <Card className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-700/30">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-amber-300 flex items-center justify-center gap-2">
                  <Crown className="w-6 h-6" />
                  שדרג לפרמיום עכשיו
                </CardTitle>
                <CardDescription className="text-amber-200/80 text-lg">
                  קבל גישה בלתי מוגבלת לכל השאלות והתכונות המתקדמות
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">מה תקבל בפרמיום:</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>גישה לכל השאלות ללא הגבלה</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>בחינות מלאות בתנאי זמן אמיתיים</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>מעקב מתקדם אחר ההתקדמות</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>הסברים מפורטים לכל שאלה</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Try Free First */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">רוצה לנסות קודם?</CardTitle>
                <CardDescription className="text-slate-400">
                  התחל עם השאלות החינמיות ושדרג כשתהיה מוכן
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/topics')}
                  variant="outline" 
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  התחל תרגול חינמי
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate('/')}
            variant="ghost" 
            className="text-slate-400 hover:text-white"
          >
            חזור לעמוד הבית
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
