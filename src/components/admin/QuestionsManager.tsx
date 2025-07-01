import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Question } from "@/data/questionsData";
import { topicsData } from "@/data/topicsData";
import { 
  Edit, 
  Trash2, 
  PlusCircle, 
  Save, 
  Search, 
  Filter, 
  AlertCircle, 
  ArrowUpDown, 
  RotateCcw,
  RefreshCw 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import QuestionEditor from "./QuestionEditor";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetFooter 
} from "@/components/ui/sheet";
import {
  getAllQuestions,
  updateQuestion,
  addQuestion,
  deleteQuestion,
  saveChanges,
  resetChanges,
  refreshQuestionsFromStorage
} from "@/services/questions";
import { toast } from "sonner";

const QuestionsManager: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<number | "all">("all");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const loadQuestions = useCallback((forceRefresh = false) => {
    try {
      const allQuestions = forceRefresh ? refreshQuestionsFromStorage() : getAllQuestions();
      console.log("Loaded questions in QuestionsManager:", allQuestions.length);
      setQuestions(allQuestions);
      
      if (forceRefresh) {
        toast.info("נתוני השאלות רועננו בהצלחה");
      }
    } catch (error) {
      console.error("Error loading questions:", error);
      toast.error("שגיאה בטעינת השאלות");
    }
  }, []);

  const applyFiltersAndSearch = useCallback((questionsList: Question[]) => {
    let filtered = questionsList;
    
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.options.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedTopicFilter !== "all") {
      filtered = filtered.filter(q => q.topicId === selectedTopicFilter);
    }
    
    setFilteredQuestions(filtered);
  }, [searchTerm, selectedTopicFilter]);

  useEffect(() => {
    loadQuestions(true);
  }, [loadQuestions]);

  useEffect(() => {
    applyFiltersAndSearch(questions);
  }, [questions, applyFiltersAndSearch]);

  const handleSaveQuestion = (updatedQuestion: Question) => {
    if (isCreating) {
      const success = addQuestion(updatedQuestion);
      if (success) {
        loadQuestions(true);
        setHasUnsavedChanges(true);
      }
    } else {
      const success = updateQuestion(updatedQuestion);
      if (success) {
        loadQuestions(true);
        setHasUnsavedChanges(true);
      }
    }
    setIsEditing(false);
    setIsCreating(false);
    setSelectedQuestion(null);
  };

  const handleDeleteQuestion = () => {
    if (questionToDelete) {
      const success = deleteQuestion(questionToDelete.id);
      if (success) {
        loadQuestions(true);
        setHasUnsavedChanges(true);
      }
    }
    setIsDeleteDialogOpen(false);
    setQuestionToDelete(null);
  };

  const handleSaveAllChanges = () => {
    const success = saveChanges();
    if (success) {
      loadQuestions(true);
      setHasUnsavedChanges(false);
    }
  };

  const handleResetChanges = () => {
    resetChanges();
    loadQuestions(true);
    setHasUnsavedChanges(false);
  };

  const handleRefreshQuestions = () => {
    loadQuestions(true);
    toast.info("רשימת השאלות רועננה");
  };

  const handleCreateNewQuestion = () => {
    const newEmptyQuestion: Question = {
      id: 0,
      type: 'reading-comprehension', // Add required type field
      text: "",
      options: ["", ""],
      correctAnswer: 0,
      difficulty: 'medium', // Add required difficulty field
      explanation: "",
      topicId: topicsData[0]?.id || 1
    };
    
    setSelectedQuestion(newEmptyQuestion);
    setIsCreating(true);
    setIsEditing(true);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">ניהול שאלות</h2>
            <p className="text-gray-600">ניהול מאגר השאלות במערכת</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleRefreshQuestions}>
              <RefreshCw className="h-4 w-4 ml-1" />
              רענן
            </Button>
            
            {hasUnsavedChanges && (
              <Button variant="outline" onClick={handleResetChanges}>
                <RotateCcw className="h-4 w-4 ml-1" />
                בטל שינויים
              </Button>
            )}
            
            {hasUnsavedChanges && (
              <Button onClick={handleSaveAllChanges}>
                <Save className="h-4 w-4 ml-1" />
                שמור הכל
              </Button>
            )}
            
            <Button onClick={handleCreateNewQuestion}>
              <PlusCircle className="h-4 w-4 ml-1" />
              הוסף שאלה
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="חיפוש שאלות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-10"
              dir="rtl"
            />
          </div>
          
          <div>
            <select
              value={selectedTopicFilter === "all" ? "all" : selectedTopicFilter}
              onChange={(e) => setSelectedTopicFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              <option value="all">כל הנושאים</option>
              {topicsData.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">מס'</TableHead>
                <TableHead>שאלה</TableHead>
                <TableHead>נושא</TableHead>
                <TableHead className="w-28">מס' אפשרויות</TableHead>
                <TableHead className="text-right w-24">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>{question.id}</TableCell>
                    <TableCell>
                      <div className="max-w-md truncate" title={question.text}>
                        {question.text}
                      </div>
                    </TableCell>
                    <TableCell>
                      {topicsData.find(t => t.id === question.topicId)?.title || "לא מוגדר"}
                    </TableCell>
                    <TableCell>{question.options.length}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedQuestion(question);
                            setIsEditing(true);
                            setIsCreating(false);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setQuestionToDelete(question);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    לא נמצאו שאלות התואמות את החיפוש
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <Sheet open={isEditing} onOpenChange={setIsEditing}>
        <SheetContent side="left" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{isCreating ? "יצירת שאלה חדשה" : "עריכת שאלה"}</SheetTitle>
            <SheetDescription>
              {isCreating
                ? "הוסף שאלה חדשה למאגר השאלות"
                : "ערוך את פרטי השאלה כרצונך"}
            </SheetDescription>
          </SheetHeader>
          
          {selectedQuestion && (
            <QuestionEditor
              question={selectedQuestion}
              onSave={handleSaveQuestion}
              onCancel={() => {
                setIsEditing(false);
                setIsCreating(false);
                setSelectedQuestion(null);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>אי��ור מחיקת שאלה</DialogTitle>
            <DialogDescription>
              האם אתה בטוח שברצונך למחוק את השאלה? פעולה זו אינה ניתנת לביטול לאחר שמירת השינויים.
            </DialogDescription>
          </DialogHeader>
          
          {questionToDelete && (
            <div className="py-4 px-2 bg-gray-100 rounded my-2 text-sm">
              <strong>שאלה:</strong> {questionToDelete.text}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              ביטול
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuestion}>
              מחק שאלה
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionsManager;
