
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  isQuestionSet: boolean;
}

export const BackButton = ({ isQuestionSet }: BackButtonProps) => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    // Check if this is a story simulation
    const isStorySimulation = window.sessionStorage.getItem('is_story_simulation') === 'true';
    
    console.log('BackButton clicked - isStorySimulation:', isStorySimulation, 'isQuestionSet:', isQuestionSet);
    
    if (isStorySimulation) {
      console.log('Navigating to reading comprehension page');
      navigate("/reading-comprehension");
    } else if (isQuestionSet) {
      console.log('Navigating to question sets page');
      navigate("/questions-sets");
    } else {
      console.log('Navigating to simulations entry page');
      navigate("/simulations-entry");
    }
  };
  
  const getBackText = () => {
    const isStorySimulation = window.sessionStorage.getItem('is_story_simulation') === 'true';
    
    if (isStorySimulation) {
      return "חזרה לסיפורי הבנת הנקרא";
    } else if (isQuestionSet) {
      return "חזרה לקבוצות השאלות";
    } else {
      return "חזרה לסימולציות";
    }
  };
  
  return (
    <div className="mb-6">
      <Button 
        variant="ghost" 
        size="sm"
        className="text-gray-300 hover:text-white hover:bg-slate-700/50 -mr-2 transition-colors duration-200"
        onClick={handleBackClick}
      >
        <ChevronRight className="h-4 w-4 ml-1" />
        {getBackText()}
      </Button>
    </div>
  );
};
