
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { UserCircle, Award, Clock, Shield } from "lucide-react";
import CancelPremiumDialog from "@/components/premium/CancelPremiumDialog";
import { useToast } from "@/hooks/use-toast";

const OverviewTab = () => {
  const { currentUser, userData, isPremium, updatePremiumStatus } = useAuth();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { toast } = useToast();
  
  // Get user display name - prioritize displayName, then extract name from email, fallback to "משתמש"
  const getUserDisplayName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName;
    }
    
    if (currentUser?.email) {
      // Extract name from email (part before @)
      const emailName = currentUser.email.split('@')[0];
      // Capitalize first letter
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    return "משתמש";
  };

  const userName = getUserDisplayName();
  
  const userInitials = currentUser?.displayName 
    ? `${currentUser.displayName.split(' ')[0][0]}${currentUser.displayName.split(' ')[1]?.[0] || ''}`
    : currentUser?.email?.substring(0, 2).toUpperCase() || "מש";
  
  const joinDate = currentUser?.metadata?.creationTime 
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('he-IL')
    : "לא ידוע";
  
  const handleCancelPremium = () => {
    updatePremiumStatus(false);
    
    toast({
      title: "פרימיום בוטל בהצלחה",
      description: "חשבונך הוחזר למצב חינמי",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-right">
          <CardTitle className="flex items-center gap-2 justify-end">
            <UserCircle className="h-5 w-5" />
            פרטי משתמש
          </CardTitle>
          <CardDescription className="text-right">
            פרטי החשבון והמנוי שלך
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row-reverse items-start gap-6">
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src={currentUser?.photoURL || undefined} />
              <AvatarFallback className="bg-electric-blue/10 text-electric-blue text-xl">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="space-y-3 flex-grow text-right">
            <div>
              <p className="text-sm font-medium text-muted-foreground">שם משתמש</p>
              <p className="text-lg">{userName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">דוא"ל</p>
              <p>{currentUser?.email || "לא הוגדר"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">תאריך הצטרפות</p>
              <p>{joinDate}</p>
            </div>
            <div className="flex justify-between items-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowCancelDialog(true)}
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                ביטול מנוי פרימיום
              </Button>
              
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">סוג חשבון</p>
                <p className="font-medium">
                  {isPremium 
                    ? <span className="text-electric-orange font-bold">פרימיום</span> 
                    : "חינמי"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="text-right">
            <CardTitle className="flex items-center gap-2 justify-end">
              <Award className="h-5 w-5" />
              הישגים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="mb-2 text-muted-foreground">עדיין אין הישגים</p>
              <p className="text-sm text-muted-foreground">השלימו סימולציות כדי לקבל הישגים</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-right">
            <CardTitle className="flex items-center gap-2 justify-end">
              <Clock className="h-5 w-5" />
              פעילות אחרונה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="mb-2 text-muted-foreground">אין פעילות אחרונה</p>
              <p className="text-sm text-muted-foreground">השלימו סימולציות כדי לראות את ההיסטוריה שלכם</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <CancelPremiumDialog 
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelPremium}
      />
    </div>
  );
};

export default OverviewTab;
