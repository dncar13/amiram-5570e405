
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Question } from "@/data/questionsData";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  Edit, 
  Trash2, 
  PlusCircle, 
  Save, 
  X, 
  BookmarkPlus, 
  AlertCircle 
} from "lucide-react";
import { topicsData } from "@/data/topicsData";

interface QuestionEditorProps {
  question: Question;
  onSave: (updatedQuestion: Question) => void;
  onCancel: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onSave,
  onCancel,
}) => {
  const [editedQuestion, setEditedQuestion] = useState<Question>({ ...question });
  const [activeOption, setActiveOption] = useState<number | null>(null);

  const handleSave = () => {
    // בדיקות תקינות בסיסיות
    if (!editedQuestion.text || editedQuestion.text.trim() === "") {
      alert("יש להזין טקסט לשאלה");
      return;
    }
    
    if (editedQuestion.options.some(opt => !opt || opt.trim() === "")) {
      alert("לא ניתן להשאיר תשובות ריקות");
      return;
    }
    
    onSave(editedQuestion);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...editedQuestion.options];
    updatedOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: updatedOptions });
  };

  const handleSetCorrectAnswer = (index: number) => {
    setEditedQuestion({ ...editedQuestion, correctAnswer: index });
  };

  const handleAddOption = () => {
    if (editedQuestion.options.length < 6) {
      setEditedQuestion({
        ...editedQuestion,
        options: [...editedQuestion.options, ""]
      });
    }
  };

  const handleRemoveOption = (index: number) => {
    if (editedQuestion.options.length > 2) {
      const newOptions = editedQuestion.options.filter((_, i) => i !== index);
      let newCorrectAnswer = editedQuestion.correctAnswer;
      
      // התאמת התשובה הנכונה במקרה שהיא נמחקה או שהאינדקס השתנה
      if (index === editedQuestion.correctAnswer) {
        newCorrectAnswer = 0;
      } else if (index < editedQuestion.correctAnswer) {
        newCorrectAnswer = editedQuestion.correctAnswer - 1;
      }
      
      setEditedQuestion({
        ...editedQuestion,
        options: newOptions,
        correctAnswer: newCorrectAnswer
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div>
        <Label htmlFor="question-text">טקסט השאלה</Label>
        <Textarea
          id="question-text"
          value={editedQuestion.text}
          onChange={(e) => setEditedQuestion({ ...editedQuestion, text: e.target.value })}
          className="min-h-[100px] mt-2 mb-4"
          dir="rtl"
        />
      </div>
      
      <div>
        <Label htmlFor="topic-select">נושא</Label>
        <select
          id="topic-select"
          value={editedQuestion.topicId}
          onChange={(e) => setEditedQuestion({ 
            ...editedQuestion, 
            topicId: Number(e.target.value) 
          })}
          className="w-full p-2 border rounded mt-2 mb-4"
        >
          {topicsData.map(topic => (
            <option key={topic.id} value={topic.id}>
              {topic.title}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <Label htmlFor="explanation">הסבר (אופציונלי)</Label>
        <Textarea
          id="explanation"
          value={editedQuestion.explanation || ""}
          onChange={(e) => setEditedQuestion({ 
            ...editedQuestion, 
            explanation: e.target.value 
          })}
          className="mt-2 mb-4"
          dir="rtl"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>אפשרויות תשובה</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddOption}
            disabled={editedQuestion.options.length >= 6}
          >
            <PlusCircle className="h-4 w-4 ml-1" />
            הוסף אפשרות
          </Button>
        </div>
        
        <div className="space-y-3">
          {editedQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Button
                type="button"
                variant={editedQuestion.correctAnswer === index ? "default" : "outline"}
                size="icon"
                onClick={() => handleSetCorrectAnswer(index)}
                className={`h-8 w-8 ${editedQuestion.correctAnswer === index ? "bg-green-500 hover:bg-green-600" : ""}`}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`אפשרות ${index + 1}`}
                className="flex-1"
                dir="rtl"
              />
              
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleRemoveOption(index)}
                disabled={editedQuestion.options.length <= 2}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 ml-1" />
          ביטול
        </Button>
        <Button type="button" onClick={handleSave}>
          <Save className="h-4 w-4 ml-1" />
          שמור
        </Button>
      </div>
    </div>
  );
};

export default QuestionEditor;
