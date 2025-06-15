import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Mail, KeyIcon, UserIcon, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle, loginWithEmailAndPassword, registerWithEmailAndPassword } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { RTLWrapper } from "@/components/ui/rtl-wrapper";

const Login = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });
  const [authError, setAuthError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser, isDevEnvironment, checkAndUpdateSession } = useAuth();
  
  // If user is already logged in, redirect to simulations
  if (currentUser) {
    console.log("User already logged in, redirecting to simulations:", currentUser.email);
    navigate("/simulations-entry");
    return null;
  }
  
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      console.log("Google login clicked");
      const { user, error } = await signInWithGoogle();
      
      if (error) {
        console.error("Google login error:", error);
        setAuthError(error.message || "שגיאה בהתחברות עם Google");
        toast({
          variant: "destructive",
          title: "שגיאה בהתחברות",
          description: error.message || "אירעה שגיאה. אנא נסה שוב.",
        });
      }
      // For OAuth, we don't get user immediately, redirect happens
    } catch (error) {
      console.error("Google login catch error:", error);
      const errorMessage = error instanceof Error ? error.message : "אירעה שגיאה בהתחברות";
      setAuthError(errorMessage);
      toast({
        variant: "destructive",
        title: "שגיאה בהתחברות",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setAuthError("אנא מלאו את כל השדות");
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Login attempt for:", formData.email);
      const { user, error } = await loginWithEmailAndPassword(formData.email, formData.password);
      
      if (user) {
        console.log("Login successful, user:", user.email);
        
        // רענון מיידי של מצב Auth
        await checkAndUpdateSession();
        
        toast({
          title: "התחברת בהצלחה!",
          description: `ברוך הבא ${user.displayName || user.email}`,
        });
        
        // ניווט עם עיכוב קטן כדי לוודא שהמצב התעדכן
        setTimeout(() => {
          navigate("/simulations-entry");
        }, 200);
      } else if (error) {
        console.error("Login failed:", error);
        setAuthError(error.message);
        toast({
          variant: "destructive",
          title: "שגיאה בהתחברות",
          description: error.message,
        });
      }
    } catch (error) {
      console.error("Login catch error:", error);
      const errorMessage = error instanceof Error ? error.message : "אירעה שגיאה בהתחברות";
      setAuthError(errorMessage);
      toast({
        variant: "destructive",
        title: "שגיאה בהתחברות",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    
    // Basic validation
    if (!formData.email || !formData.password || !formData.name) {
      setAuthError("אנא מלאו את כל השדות");
      setIsLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setAuthError("הסיסמה חייבת להכיל לפחות 6 תווים");
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Registration attempt for:", formData.email);
      const { user, error } = await registerWithEmailAndPassword(formData.email, formData.password);
      
      if (user) {
        console.log("Registration successful, user:", user.email);
        
        // רענון מיידי של מצב Auth
        await checkAndUpdateSession();
        
        toast({
          title: "נרשמת בהצלחה!",
          description: `ברוך הבא ${formData.name || user.email}`,
        });
        
        // ניווט עם עיכוב קטן כדי לוודא שהמצב התעדכן
        setTimeout(() => {
          navigate("/simulations-entry");
        }, 200);
      } else if (error) {
        console.error("Registration failed:", error);
        setAuthError(error.message);
        toast({
          variant: "destructive",
          title: "שגיאה בהרשמה",
          description: error.message,
        });
      }
    } catch (error) {
      console.error("Registration catch error:", error);
      const errorMessage = error instanceof Error ? error.message : "אירעה שגיאה בהרשמה";
      setAuthError(errorMessage);
      toast({
        variant: "destructive",
        title: "שגיאה בהרשמה",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('register-', '')]: value
    }));
    // Clear error when user starts typing
    if (authError) {
      setAuthError(null);
    }
  };
  
  return (
    <RTLWrapper className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 bg-electric-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {authError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>שגיאה</AlertTitle>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">התחברות</TabsTrigger>
                <TabsTrigger value="register">הרשמה</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>התחברות</CardTitle>
                    <CardDescription>
                      התחברו כדי לקבל גישה להתקדמות שלכם ולנושאים נוספים
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full flex items-center justify-center"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                      >
                        <svg className="ml-2 h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        התחברות עם גוגל
                      </Button>
                      
                      <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm">או</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">דוא"ל</Label>
                        <div className="relative">
                          <Mail className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="email"
                            placeholder="your@email.com"
                            type="email"
                            required
                            className="pl-3 pr-10"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">סיסמה</Label>
                          <Link to="/forgot-password" className="text-sm text-electric-blue hover:underline">
                            שכחתם סיסמה?
                          </Link>
                        </div>
                        <div className="relative">
                          <KeyIcon className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="password"
                            type="password"
                            required
                            className="pl-3 pr-10"
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full btn-electric" disabled={isLoading}>
                        {isLoading ? "מתחבר..." : "התחברות"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>הרשמה</CardTitle>
                    <CardDescription>
                      צרו חשבון חדש לגישה לנושאים נוספים וסימולציות
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full flex items-center justify-center"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                      >
                        <svg className="ml-2 h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        הרשמה עם גוגל
                      </Button>
                      
                      <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm">או</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="register-name">שם מלא</Label>
                        <div className="relative">
                          <UserIcon className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="register-name"
                            placeholder="ישראל ישראלי"
                            required
                            className="pl-3 pr-10"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">דוא"ל</Label>
                        <div className="relative">
                          <Mail className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="register-email"
                            placeholder="your@email.com"
                            type="email"
                            required
                            className="pl-3 pr-10"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">סיסמה</Label>
                        <div className="relative">
                          <KeyIcon className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="register-password"
                            type="password"
                            required
                            minLength={6}
                            placeholder="לפחות 6 תווים"
                            className="pl-3 pr-10"
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground flex items-start space-x-2 space-x-reverse">
                          <Shield className="h-4 w-4 mt-0.5 text-electric-blue ml-2" />
                          <span>
                            בהרשמה, אתם מסכימים ל
                            <Link to="/terms" className="text-electric-blue hover:underline mx-1">
                              תנאי השימוש
                            </Link>
                            ול
                            <Link to="/privacy" className="text-electric-blue hover:underline mx-1">
                              מדיניות הפרטיות
                            </Link>
                            שלנו.
                          </span>
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full btn-electric" disabled={isLoading}>
                        {isLoading ? "יוצר חשבון..." : "הרשמה"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 bg-white p-4 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-electric-blue ml-2" />
                יתרונות החשבון
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-electric-blue ml-2 mt-1" />
                  <span>גישה לשני נושאים במקום אחד בלבד</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-electric-blue ml-2 mt-1" />
                  <span>שמירת ההתקדמות והציונים שלכם</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-electric-blue ml-2 mt-1" />
                  <span>נתוני ביצועים והמלצות אישיות</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-electric-orange ml-2 mt-1" />
                  <span>אפשרות לשדרוג לחשבון פרימיום עם גישה לכל 7 הנושאים</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </RTLWrapper>
  );
};

export default Login;
