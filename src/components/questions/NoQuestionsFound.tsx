
import React from "react";
import { AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface NoQuestionsFoundProps {
  searchTerm: string;
}

const NoQuestionsFound = ({ searchTerm }: NoQuestionsFoundProps) => {
  return (
    <Card className="border border-amber-200 bg-amber-50">
      <CardContent className="pt-6 text-center">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-amber-800 mb-2">לא נמצאו שאלות</h3>
        <p className="text-amber-700 mb-4">
          {searchTerm 
            ? "לא נמצאו שאלות התואמות לחיפוש שלך. נסה/י לשנות את מונחי החיפוש." 
            : "לא נמצאו שאלות בקטגוריה זו. התחל/י להוסיף שאלות חדשות!"}
        </p>
        <Button 
          variant="outline"  
          className="border-amber-300 text-amber-700 hover:bg-amber-100"
        >
          <Plus className="h-4 w-4 mr-2" />
          הוספת שאלה חדשה
        </Button>
      </CardContent>
    </Card>
  );
};

export default NoQuestionsFound;
