
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldAlert, Users, Database, Settings } from "lucide-react";

const AdminTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            פאנל ניהול
          </CardTitle>
          <CardDescription>
            כלים וגישות ניהוליות למנהלי המערכת
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            ברוך הבא לפאנל הניהול. כאן תוכל לנהל את כל ההיבטים של המערכת. לחץ על אחד מהלינקים למטה כדי לנווט לאזורי הניהול השונים.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 ml-2" />
                  ניהול משתמשים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  נהל חשבונות משתמשים, הרשאות והגדרות
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/admin/users">
                    עבור לניהול משתמשים
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Database className="h-5 w-5 ml-2" />
                  ניהול תוכן
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  נהל שאלות, נושאים, קטגוריות ותוכן אחר
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/admin/questions">
                    עבור לניהול תוכן
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Settings className="h-5 w-5 ml-2" />
                  הגדרות מערכת
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  נהל הגדרות מערכת ותצורה
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/admin/settings">
                    עבור להגדרות מערכת
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTab;
