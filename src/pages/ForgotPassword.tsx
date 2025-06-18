
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { RTLWrapper } from "@/components/ui/rtl-wrapper";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "אנא הכניסו כתובת אימייל",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "שגיאה בשליחת איפוס סיסמה",
          description: "אנא בדקו את כתובת האימייל ונסו שוב",
        });
      } else {
        setEmailSent(true);
        toast({
          title: "קישור נשלח!",
          description: "בדקו את תיבת הדואר שלכם להוראות איפוס הסיסמה",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "אירעה שגיאה בשליחת קישור איפוס הסיסמה",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RTLWrapper className="min-h-screen flex flex-col login-page-wrapper">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 login-main">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto login-container">
            {/* Logo */}
            <div className="login-logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <Card className="dark-card">
              <CardHeader className="dark-card-header text-center">
                <CardTitle className="dark-card-title">איפוס סיסמה</CardTitle>
                <CardDescription className="dark-card-description">
                  {emailSent 
                    ? "קישור לאיפוס הסיסמה נשלח לכתובת האימייל שלכם"
                    : "הכניסו את כתובת האימייל שלכם ונשלח לכם קישור לאיפוס הסיסמה"
                  }
                </CardDescription>
              </CardHeader>

              {!emailSent ? (
                <form onSubmit={handleResetPassword}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="dark-label">כתובת אימייל</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-2.5 h-5 w-5 input-icon" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          required
                          className="pl-3 pr-10 dark-input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full btn-primary-enhanced" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="loading-spinner"></span>
                      ) : (
                        <>
                          שלחו קישור לאיפוס
                          <ArrowRight className="mr-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </form>
              ) : (
                <CardContent className="space-y-4">
                  <Alert variant="default" className="dark-alert-warning">
                    <Mail className="h-4 w-4" />
                    <AlertDescription>
                      קישור לאיפוס הסיסמה נשלח לכתובת {email}. 
                      בדקו את תיבת הדואר שלכם (כולל תיקיית הספאם).
                      אם לא קיבלתם את המייל תוך כמה דקות, נסו לשלוח שוב.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    onClick={() => setEmailSent(false)}
                    variant="outline"
                    className="w-full btn-secondary-dark"
                  >
                    שלחו שוב
                  </Button>
                </CardContent>
              )}
              
              <div className="p-6 pt-0">
                <div className="text-center">
                  <Link to="/login" className="link-primary text-sm">
                    ← חזרה להתחברות
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </RTLWrapper>
  );
};

export default ForgotPassword;
