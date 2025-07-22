import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Layout, 
  Users, 
  Settings, 
  Book, 
  BarChart, 
  Shield, 
  Lock,
  Ticket
} from "lucide-react";
import QuestionsManager from "@/components/admin/QuestionsManager";
import { CouponManagement } from "@/pages/CouponManagement";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const AdminPanel = () => {
  const { currentUser, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // הפניה לדף התחברות אם המשתמש לא מחובר
  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [currentUser, isLoading, navigate, location]);
  
  // Render loading state first to maintain consistent hook order
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4">טוען...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // No access screen for authenticated non-admin users
  if (currentUser && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto">
              <div className="mb-4 text-red-500">
                <Shield className="h-16 w-16 mx-auto" />
              </div>
              <h1 className="text-2xl font-bold mb-4">אין גישה</h1>
              <p className="mb-6 text-gray-600">
                אין לך הרשאות מנהל מערכת הנדרשות כדי לגשת לאזור זה.
                רק משתמשים מורשים יכולים לגשת לפאנל הניהול.
              </p>
              <Button onClick={() => navigate("/")}>
                חזרה לדף הבית
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If no user is logged in, show loading until redirect happens
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4">טוען...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-grow py-6">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">פאנל ניהול</h1>
              <p className="text-gray-600">ברוכים הבאים לממשק ניהול המערכת</p>
            </div>
            
            <Tabs defaultValue="questions" className="w-full">
              <TabsList className="w-full mb-6 bg-white/80 p-1 border-b overflow-x-auto flex flex-nowrap">
                <TabsTrigger value="questions" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  ניהול שאלות
                </TabsTrigger>
                <TabsTrigger value="topics" className="flex items-center gap-1">
                  <Book className="h-4 w-4" />
                  נושאים
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  משתמשים
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" />
                  סטטיסטיקות
                </TabsTrigger>
                <TabsTrigger value="coupons" className="flex items-center gap-1">
                  <Ticket className="h-4 w-4" />
                  קופונים
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  הגדרות
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="questions">
                <ErrorBoundary>
                  <QuestionsManager />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="topics">
                <div className="bg-white rounded-lg shadow-sm p-6 text-center min-h-[300px] flex items-center justify-center">
                  <div>
                    <Book className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-lg font-medium mb-2">ניהול נושאים</h2>
                    <p className="text-gray-600 mb-4">חלק זה עדיין בפיתוח ויהיה זמין בקרוב.</p>
                    <Button variant="outline">התראה כשיהיה זמין</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="users">
                <div className="bg-white rounded-lg shadow-sm p-6 text-center min-h-[300px] flex items-center justify-center">
                  <div>
                    <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-lg font-medium mb-2">ניהול משתמשים</h2>
                    <p className="text-gray-600 mb-4">חלק זה עדיין בפיתוח ויהיה זמין בקרוב.</p>
                    <Button variant="outline">התראה כשיהיה זמין</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="stats">
                <div className="bg-white rounded-lg shadow-sm p-6 text-center min-h-[300px] flex items-center justify-center">
                  <div>
                    <BarChart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-lg font-medium mb-2">סטטיסטיקות</h2>
                    <p className="text-gray-600 mb-4">חלק זה עדיין בפיתוח ויהיה זמין בקרוב.</p>
                    <Button variant="outline">התראה כשיהיה זמין</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="coupons">
                <ErrorBoundary>
                  <CouponManagement />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="bg-white rounded-lg shadow-sm p-6 text-center min-h-[300px] flex items-center justify-center">
                  <div>
                    <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-lg font-medium mb-2">הגדרות מערכת</h2>
                    <p className="text-gray-600 mb-4">חלק זה עדיין בפיתוח ויהיה זמין בקרוב.</p>
                    <Button variant="outline">התראה כשיהיה זמין</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default AdminPanel;
