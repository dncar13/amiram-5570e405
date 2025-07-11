import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Mail, KeyIcon, UserIcon, CheckCircle, AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle, loginWithEmailAndPassword, registerWithEmailAndPassword } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { RTLWrapper } from "@/components/ui/rtl-wrapper";
import { resendConfirmationEmail } from "@/lib/supabase";
import { getMobileOptimizedConfig, debounce } from "@/utils/mobile-performance";

// Enhanced login state management
type LoginState = 'idle' | 'google-auth' | 'email-auth' | 'registering' | 'success' | 'error';

const Login = () => {
  const [loginState, setLoginState] = useState<LoginState>('idle');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    newsletter: true
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isDevEnvironment, isLoading: authLoading, session } = useAuth();
  
  const from = location.state?.from?.pathname || "/simulations-entry";
  const isLoading = loginState !== 'idle' || authLoading;
  
  // Navigate user if already authenticated
  useEffect(() => {
    if (session?.user && !authLoading) {
      console.log("✅ User already authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [session, authLoading, navigate, from]);

  // Handle successful authentication
  useEffect(() => {
    if (session?.user && loginState === 'success') {
      console.log("🎉 Login successful, navigating to:", from);
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    }
  }, [session, loginState, navigate, from]);
  
  // Enhanced OAuth callback handling - Let Supabase handle it naturally
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasOAuthCode = urlParams.get('code');
    const hasOAuthError = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (hasOAuthError) {
      console.error("❌ OAuth error:", hasOAuthError, errorDescription);
      let errorMessage = "שגיאה בהתחברות עם Google. אנא נסו שוב.";
      
      if (hasOAuthError === 'access_denied') {
        errorMessage = "הגישה נדחתה. אנא נסו שוב ואשרו את הגישה.";
      } else if (hasOAuthError === 'invalid_client') {
        errorMessage = "בעיה בהגדרות Google OAuth. אנא פנו לתמיכה טכנית.";
      }
      
      setAuthError(errorMessage);
      setLoginState('error');
      
      toast({
        variant: "destructive",
        title: "שגיאה בהתחברות עם Google",
        description: errorMessage,
        duration: 5000,
      });
      
      // Clean URL after showing error
      setTimeout(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 100);
    } else if (hasOAuthCode) {
      console.log("🔗 OAuth callback detected with code - letting Supabase handle it");
      setLoginState('google-auth');
      
      toast({
        title: "מעבד התחברות Google...",
        description: "אנא המתינו רגע",
        duration: 3000,
      });
      
      // Let Supabase's detectSessionInUrl handle the OAuth flow
      // Clean URL after a delay to allow Supabase to process
      setTimeout(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 2000);
    }
  }, [toast]);
  
  const handleGoogleLogin = async () => {
    setLoginState('google-auth');
    setAuthError(null);
    setAwaitingConfirmation(null);
    
    try {
      console.log("🔗 Initiating Google login");
      
      toast({
        title: "מתחבר עם Google...",
        description: "פותח חלון Google לאימות",
        duration: 3000,
      });
      
      const { user, error } = await signInWithGoogle();
      
      if (error) {
        console.error("❌ Google login error:", error);
        setAuthError(error.message || "שגיאה בהתחברות עם Google");
        setLoginState('error');
        
        toast({
          variant: "destructive",
          title: "שגיאה בהתחברות עם Google",
          description: error.message,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("❌ Google login error:", error);
      const errorMessage = error instanceof Error ? error.message : "אירעה שגיאה בהתחברות";
      setAuthError(errorMessage);
      setLoginState('error');
      
      toast({
        variant: "destructive",
        title: "שגיאה בהתחברות עם Google",
        description: errorMessage,
        duration: 5000,
      });
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginState('email-auth');
    setAuthError(null);
    setAwaitingConfirmation(null);

    if (!formData.email || !formData.password) {
      setAuthError("אנא מלאו את כל השדות");
      setLoginState('error');
      return;
    }

    if (!formData.email.includes('@')) {
      setAuthError("כתובת אימייל לא תקינה");
      setLoginState('error');
      return;
    }

    try {
      console.log("🔐 Login attempt for:", formData.email);
      
      toast({
        title: "מתחבר...",
        description: "בודק פרטי התחברות",
        duration: 2000,
      });
      
      const { user, error } = await loginWithEmailAndPassword(formData.email, formData.password);

      if (error) {
        if (
          error.message.includes("יש לאשר את כתובת האימייל") ||
          error.message.toLowerCase().includes("confirm your email") ||
          error.message.toLowerCase().includes("email not confirmed")
        ) {
          setAwaitingConfirmation(formData.email);
          setLoginState('idle');
          return;
        }
        
        setAuthError(error.message);
        setLoginState('error');
        
        toast({
          variant: "destructive",
          title: "שגיאה בהתחברות",
          description: error.message,
          duration: 5000,
        });
      } else if (user) {
        console.log("✅ Login successful:", user.email);
        setLoginState('success');
        
        toast({
          title: "התחברת בהצלחה! 🎉",
          description: "מעביר אותך לסימולציות...",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      const errorMessage = error instanceof Error ? error.message : "אירעה שגיאה בהתחברות";
      setAuthError(errorMessage);
      setLoginState('error');
      
      toast({
        variant: "destructive",
        title: "שגיאה בהתחברות",
        description: errorMessage,
        duration: 5000,
      });
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginState('registering');
    setAuthError(null);
    setAwaitingConfirmation(null);
    
    if (!formData.email || !formData.password || !formData.name) {
      setAuthError("אנא מלאו את כל השדות");
      setLoginState('error');
      return;
    }
    
    if (!formData.email.includes('@')) {
      setAuthError("כתובת אימייל לא תקינה");
      setLoginState('error');
      return;
    }
    
    if (formData.password.length < 6) {
      setAuthError("הסיסמה חייבת להכיל לפחות 6 תווים");
      setLoginState('error');
      return;
    }
    
    if (formData.name.trim().length < 2) {
      setAuthError("שם מלא חייב להכיל לפחות 2 תווים");
      setLoginState('error');
      return;
    }
    
    try {
      console.log("📝 Registration attempt for:", formData.email);
      
      toast({
        title: "מרשם חשבון חדש...",
        description: "יוצר את החשבון שלך",
        duration: 3000,
      });
      
      const { user, error } = await registerWithEmailAndPassword(formData.email, formData.password);
      
      if (error) {
        if (
          error.message.includes("יש לאשר את כתובת האימייל") ||
          error.message.toLowerCase().includes("confirm your email") ||
          error.message.toLowerCase().includes("email not confirmed")
        ) {
          setAwaitingConfirmation(formData.email);
          setLoginState('idle');
          
          toast({
            title: "אישור אימייל נדרש",
            description: "בדקו את תיבת הדואר שלכם",
            duration: 5000,
          });
          return;
        }
        
        setAuthError(error.message);
        setLoginState('error');
        
        toast({
          variant: "destructive",
          title: "שגיאה בהרשמה",
          description: error.message,
          duration: 5000,
        });
      } else if (user) {
        console.log("✅ Registration successful:", user.email);
        setLoginState('success');
        
        toast({
          title: "נרשמת בהצלחה! 🎉",
          description: "מעביר אותך לסימולציות...",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("❌ Registration error:", error);
      const errorMessage = error instanceof Error ? error.message : "אירעה שגיאה בהרשמה";
      setAuthError(errorMessage);
      setLoginState('error');
      
      toast({
        variant: "destructive",
        title: "שגיאה בהרשמה",
        description: errorMessage,
        duration: 5000,
      });
    }
  };
  
  // Mobile-optimized input handling with debouncing
  const mobileConfig = getMobileOptimizedConfig();
  
  const debouncedInputValidation = useMemo(
    () => debounce((fieldName: string, value: string) => {
      // Clear errors when user starts typing (mobile-optimized)
      if (authError || loginState === 'error') {
        setAuthError(null);
        setLoginState('idle');
      }
    }, mobileConfig.inputDebounce),
    [authError, loginState, mobileConfig.inputDebounce]
  );
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    const fieldName = id.replace('register-', '');
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: type === 'checkbox' ? checked : value
    }));
    
    // Debounced validation for mobile performance
    if (type !== 'checkbox') {
      debouncedInputValidation(fieldName, value);
    } else {
      // Immediate update for checkboxes
      if (authError || loginState === 'error') {
        setAuthError(null);
        setLoginState('idle');
      }
    }
  }, [debouncedInputValidation, authError, loginState]);
  
  const handleResendConfirmation = async () => {
    if (!awaitingConfirmation || isLoading) return;
    
    setLoginState('email-auth');
    setAuthError(null);
    
    try {
      toast({
        title: "שולח מייל אישור...",
        description: "אנא המתינו רגע",
        duration: 2000,
      });
      
      const { success, error } = await resendConfirmationEmail(awaitingConfirmation);
      
      if (success) {
        toast({
          title: "נשלח בהצלחה! 📧",
          description: "בדקו את תיבת הדואר שלכם",
          duration: 4000,
        });
        setLoginState('idle');
      } else if (error) {
        setAuthError(error.message);
        setLoginState('error');
        toast({
          variant: "destructive",
          title: "שגיאה בשליחת אישור",
          description: error.message,
          duration: 5000,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "שגיאה בשליחת אימייל";
      setAuthError(errorMessage);
      setLoginState('error');
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: errorMessage,
        duration: 5000,
      });
    }
  };
  
  return (
    <RTLWrapper className="min-h-screen flex flex-col login-page-wrapper">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 login-main">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto login-container animate-fade-in">
            {/* Marketing Header */}
            <div className="login-header">
              <h1 className="login-title">הדרך החכמה להצליח במבחן אמיר"ם</h1>
              <p className="login-subtitle">📚 התחילו ללמוד נכון – עם סימולציה שמבינה אתכם</p>
            </div>

            {/* Logo */}
            <div className="login-logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Debug info */}
            {isDevEnvironment && (
              <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded text-xs">
                <div>Login State: {loginState}</div>
                <div>Auth Loading: {authLoading ? 'true' : 'false'}</div>
                <div>Current User: {currentUser?.email || 'null'}</div>
                <div>Session: {session ? 'exists' : 'null'}</div>
                <div>Auth Error: {authError || 'none'}</div>
                <div>Intended Destination: {from}</div>
                <div>Current URL: {window.location.href}</div>
              </div>
            )}

            {/* Error Alert */}
            {authError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>שגיאה</AlertTitle>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            {/* Confirmation Alert */}
            {awaitingConfirmation && (
              <Alert variant="default" className="mb-6 dark-alert-warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>אימייל לא אושר</AlertTitle>
                <AlertDescription>
                  החשבון לא מאושר עדיין. <br />
                  אנא בדקו את תיבת הדואר שלכם ולחצו על קישור האישור מהמערכת.<br/>
                  לא קיבלתם את המייל?
                  <Button
                    size="sm"
                    className="mx-2 mt-2"
                    onClick={handleResendConfirmation}
                    disabled={isLoading}
                  >
                    {isLoading ? "שולח..." : "שלח שוב מייל אישור"}
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 dark-tabs">
                <TabsTrigger value="login" className="dark-tab-trigger">התחברות</TabsTrigger>
                <TabsTrigger value="register" className="dark-tab-trigger">הרשמה</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Card className="dark-card">
                  <CardHeader className="dark-card-header">
                    <CardTitle className="dark-card-title">התחברות</CardTitle>
                    <CardDescription className="dark-card-description">
                      התחברו כדי לקבל גישה להתקדמות שלכם ולנושאים נוספים
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full flex items-center justify-center btn-secondary-dark"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                      >
                        {loginState === 'google-auth' ? (
                          <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            מתחבר עם Google...
                          </>
                        ) : (
                          <>
                            <svg className="ml-2 h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            התחברות עם Google
                          </>
                        )}
                      </Button>
                      
                      <div className="divider-dark">
                        <span>או</span>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="dark-label">דוא"ל</Label>
                        <div className="relative">
                          <Mail className="absolute right-3 top-2.5 h-5 w-5 input-icon" />
                          <Input
                            id="email"
                            name="email"
                            placeholder="your@email.com"
                            type="email"
                            required
                            className="pl-3 pr-10 dark-input"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="dark-label">סיסמה</Label>
                          <Link to="/forgot-password" className="text-sm link-primary">
                            שכחת סיסמה?
                          </Link>
                        </div>
                        <div className="relative">
                          <KeyIcon className="absolute right-3 top-2.5 h-5 w-5 input-icon" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            className="pl-10 pr-10 dark-input"
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                          <button
                            type="button"
                            className="absolute left-3 top-2.5 h-5 w-5 input-icon hover:text-primary transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full btn-primary-enhanced" disabled={isLoading}>
                        {loginState === 'email-auth' ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            מתחבר...
                          </>
                        ) : loginState === 'success' ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            הצלחה! מעביר...
                          </>
                        ) : (
                          "התחברות"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                  
                  <div className="trust-badges">
                    <span>⏱ תוך פחות מדקה</span>
                    <span>🔐 מאובטח לחלוטין</span>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="register">
                <Card className="dark-card">
                  <CardHeader className="dark-card-header">
                    <CardTitle className="dark-card-title">הרשמה</CardTitle>
                    <CardDescription className="dark-card-description">
                      צרו חשבון חדש לגישה לנושאים נוספים ולסימולציות
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full flex items-center justify-center btn-secondary-dark"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                      >
                        {loginState === 'google-auth' ? (
                          <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            מתחבר עם Google...
                          </>
                        ) : (
                          <>
                            <svg className="ml-2 h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            הרשמה עם Google
                          </>
                        )}
                      </Button>
                      
                      <div className="divider-dark">
                        <span>או</span>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="register-name" className="dark-label">שם מלא</Label>
                        <div className="relative">
                          <UserIcon className="absolute right-3 top-2.5 h-5 w-5 input-icon" />
                          <Input
                            id="register-name"
                            placeholder="נועה לוי"
                            required
                            className="pl-3 pr-10 dark-input"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email" className="dark-label">דוא"ל</Label>
                        <div className="relative">
                          <Mail className="absolute right-3 top-2.5 h-5 w-5 input-icon" />
                          <Input
                            id="register-email"
                            name="email"
                            placeholder="your@email.com"
                            type="email"
                            required
                            className="pl-3 pr-10 dark-input"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password" className="dark-label">סיסמה</Label>
                        <div className="relative">
                          <KeyIcon className="absolute right-3 top-2.5 h-5 w-5 input-icon" />
                          <Input
                            id="register-password"
                            name="password"
                            type={showRegisterPassword ? "text" : "password"}
                            required
                            minLength={6}
                            placeholder="לפחות 6 תווים"
                            className="pl-10 pr-10 dark-input"
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                          <button
                            type="button"
                            className="absolute left-3 top-2.5 h-5 w-5 input-icon hover:text-primary transition-colors"
                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          >
                            {showRegisterPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-sm flex items-start space-x-2 space-x-reverse dark-text">
                          <Shield className="h-4 w-4 mt-0.5 ml-2 text-primary-accent" />
                          <span>
                            בהרשמה, אתם מסכימים ל
                            <Link to="/terms" className="link-primary mx-1">
                              תנאי השימוש
                            </Link>
                            ול
                            <Link to="/privacy" className="link-primary mx-1">
                              מדיניות הפרטיות
                            </Link>
                            שלנו.
                          </span>
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                      <Button type="submit" className="w-full btn-primary-enhanced" disabled={isLoading}>
                        {loginState === 'registering' ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            מרשם...
                          </>
                        ) : loginState === 'success' ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            הצלחה! מעביר...
                          </>
                        ) : (
                          "הרשמה"
                        )}
                      </Button>
                      
                      <div className="trust-badges">
                        <span>🆓 חינם וללא התחייבות</span>
                        <span>⏱ נרשמים תוך דקה</span>
                      </div>
                      
                      <div className="newsletter-opt">
                        <label>
                          <input 
                            type="checkbox" 
                            id="newsletter"
                            checked={formData.newsletter}
                            onChange={handleInputChange}
                          />
                          <span>☑️ שלחו לי טיפים למבחן והנחות מיוחדות</span>
                        </label>
                      </div>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="testimonial-box">
              <p className="testimonial-text">"השתפרתי ב-20 נקודות תוך שבוע. ממליץ בחום!"</p>
              <span className="testimonial-author">– נועם, ראשון לציון</span>
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </RTLWrapper>
  );
};

export default Login;
