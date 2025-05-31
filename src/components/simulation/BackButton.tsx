
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  isQuestionSet: boolean;
}

export const BackButton = ({ isQuestionSet }: BackButtonProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6">
      <Button 
        variant="ghost" 
        size="sm"
        className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 -mr-2"
        onClick={() => navigate(isQuestionSet ? "/questions-sets" : "/simulations")}
      >
        <ChevronRight className="h-4 w-4 ml-1" />
        {isQuestionSet ? "חזרה לקבוצות השאלות" : "חזרה לסימולציות"}
      </Button>
    </div>
  );
};
