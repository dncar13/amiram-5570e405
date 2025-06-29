
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { registerWithEmailAndPassword, signInWithGoogle } from '@/lib/supabase';
import { Eye, EyeOff, Mail, Lock, Chrome } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: "שגיאה",
        description: "אנא מלא את כל השדות",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "שגיאה",
        description: "הסיסמאות אינן תואמות",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "שגיאה",
        description: "הסיסמה חייבת להכיל לפחות 6 תווים",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    console.log("Attempting signup for:", email);

    try {
      const { user, error } = await registerWithEmailAndPassword(email, password);
      
      if (error) {
        console.error("Signup error:", error);
        toast({
          title: "שגיאת הרשמה",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log("Signup successful for:", email);
        toast({
          title: "נרשמת בהצלחה! 🎉",
          description: "ברוך הבא לאמירם אקדמיה",
        });
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 500);
      }
    } catch (error) {
      console.error("Signup catch error:", error);
      toast({
        title: "שגיאה במערכת",
        description: "אירעה שגיאה לא צפויה. נסה שוב.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    console.log("🔗 Starting Google signup process...");
    setIsGoogleLoading(true);
    
    try {
      const result = await signInWithGoogle();
      
      if (result.error) {
        console.error("Google signup error:", result.error);
        toast({
          title: "שגיאת הרשמה",
          description: result.error.message,
          variant: "destructive"
        });
        setIsGoogleLoading(false);
      } else {
        console.log("Google OAuth initiated successfully");
        toast({
          title: "מעביר לגוגל...",
          description: "אנא המתן, מעביר אותך להרשמה עם Google",
        });
      }
    } catch (error) {
      console.error("Google signup catch error:", error);
      toast({
        title: "שגיאה במערכת",
        description: "בעיה בהרשמה עם Google. נסה שוב.",
        variant: "destructive"
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-electric-blue via-electric-purple to-electric-teal flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold text-electric-navy mb-2">
            יצירת חשבון חדש
          </CardTitle>
          <p className="text-electric-slate">
            הצטרף לאמירם אקדמיה והתחל ללמוד
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Google Signup Button */}
          <Button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading || isLoading}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 h-12 text-base font-medium shadow-sm"
          >
            {isGoogleLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                נרשם...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Chrome className="w-5 h-5" />
                הירשם עם Google
              </div>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-electric-slate">או</span>
            </div>
          </div>

          {/* Email Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-electric-navy">
                אימייל
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-electric-slate w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="הכנס כתובת אימייל"
                  className="pr-10 h-12 text-right"
                  disabled={isLoading || isGoogleLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-electric-navy">
                סיסמה
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-electric-slate w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="לפחות 6 תווים"
                  className="pr-10 pl-10 h-12 text-right"
                  disabled={isLoading || isGoogleLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-electric-slate hover:text-electric-navy"
                  disabled={isLoading || isGoogleLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-electric-navy">
                אישור סיסמה
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-electric-slate w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="הכנס שוב את הסיסמה"
                  className="pr-10 pl-10 h-12 text-right"
                  disabled={isLoading || isGoogleLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-electric-slate hover:text-electric-navy"
                  disabled={isLoading || isGoogleLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full electric-gradient hover:opacity-90 h-12 text-base font-medium"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  נרשם...
                </div>
              ) : (
                'הירשם'
              )}
            </Button>
          </form>

          <div className="text-center">
            <div className="text-sm text-electric-slate">
              כבר יש לך חשבון?{' '}
              <Link 
                to="/login" 
                className="text-electric-blue hover:text-electric-purple font-medium transition-colors"
              >
                התחבר כאן
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
