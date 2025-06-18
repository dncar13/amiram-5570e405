
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RTLWrapper } from "@/components/ui/rtl-wrapper";
import { UserCircle, History, Bookmark, Settings, ShieldAlert } from "lucide-react";

import SavedQuestionsTab from "@/components/account/SavedQuestionsTab";
import HistoryTab from "@/components/account/HistoryTab";
import OverviewTab from "@/components/account/OverviewTab";
import AdminTab from "@/components/account/AdminTab";

const UserAccount = () => {
  const { currentUser, userData, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["overview", "saved", "history", "admin", "settings"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [currentUser, navigate, location.search]);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <RTLWrapper className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 bg-electric-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-electric-navy">החשבון שלי</h1>
              <p className="text-electric-slate mt-2">
                נהל את החשבון שלך, עקוב אחר ההתקדמות שלך וגש לתוכן שמור
              </p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`grid ${isAdmin ? 'grid-cols-5' : 'grid-cols-4'} mb-8`}>
                <TabsTrigger value="settings">הגדרות</TabsTrigger>
                <TabsTrigger value="history">התקדמות</TabsTrigger>
                <TabsTrigger value="saved">שאלות שמורות</TabsTrigger>
                <TabsTrigger value="overview">סקירה</TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="admin">פאנל ניהול</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="overview">
                <OverviewTab />
              </TabsContent>
              
              <TabsContent value="saved">
                <SavedQuestionsTab />
              </TabsContent>
              
              <TabsContent value="history">
                <HistoryTab />
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      הגדרות חשבון
                    </CardTitle>
                    <CardDescription>
                      נהל את הגדרות החשבון ופרטי החשבון שלך
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert className="bg-red-50 border-red-200 text-red-800">
                      <AlertDescription className="flex flex-col">
                        <p className="mb-4">פעולה זו תנתק אותך מהחשבון ותחזיר אותך למסך הכניסה.</p>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="mr-auto" 
                          onClick={handleLogout}
                        >
                          התנתק
                        </Button>
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {isAdmin && (
                <TabsContent value="admin">
                  <AdminTab />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </RTLWrapper>
  );
};

export default UserAccount;
