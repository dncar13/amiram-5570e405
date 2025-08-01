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
  RefreshCw,
  Upload,
  Crown,
  Star,
  BarChart3,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  updateQuestion,
  addQuestion,
  deleteQuestion,
  saveChanges,
  resetChanges,
  uploadTestQuestions
} from "@/services/questions";
import { 
  getAllQuestions,
  refreshQuestionsFromStorage
} from "@/services/questionsService";
import { toast } from "sonner";
import { uploadPremiumSet1Questions } from "@/utils/questionUploadUtils";
import { QuestionsUploadService } from "@/services/questionsUploadService";

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // New filter states
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>("all");
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  // Statistics
  const [questionStats, setQuestionStats] = useState({
    total: 0,
    premium: 0,
    free: 0,
    byType: {} as Record<string, number>,
    byDifficulty: {} as Record<string, number>
  });

  const loadQuestions = useCallback(async (forceRefresh = false) => {
    try {
      console.log("Loading questions in QuestionsManager...");
      const allQuestions = forceRefresh ? await refreshQuestionsFromStorage() : await getAllQuestions();
      console.log("Loaded questions in QuestionsManager:", allQuestions.length);
      console.log("Question types found:", [...new Set(allQuestions.map(q => q.type))]);
      
      // Calculate statistics
      const premiumCount = allQuestions.filter(q => q.is_premium === true).length;
      const freeCount = allQuestions.filter(q => !q.is_premium).length;
      console.log(`Premium questions: ${premiumCount}, Free questions: ${freeCount}`);
      console.log('Premium question IDs:', allQuestions.filter(q => q.is_premium === true).map(q => q.id));
      
      // Count by type
      const byType = allQuestions.reduce((acc, q) => {
        acc[q.type] = (acc[q.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Count by difficulty
      const byDifficulty = allQuestions.reduce((acc, q) => {
        acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      setQuestionStats({
        total: allQuestions.length,
        premium: premiumCount,
        free: freeCount,
        byType,
        byDifficulty
      });
      
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
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.options.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Topic filter (existing)
    if (selectedTopicFilter !== "all") {
      filtered = filtered.filter(q => q.topicId === selectedTopicFilter);
    }
    
    // Type filter
    if (selectedTypeFilter !== "all") {
      filtered = filtered.filter(q => q.type === selectedTypeFilter);
    }
    
    // Difficulty filter
    if (selectedDifficultyFilter !== "all") {
      filtered = filtered.filter(q => q.difficulty === selectedDifficultyFilter);
    }
    
    // Premium filter
    if (showPremiumOnly) {
      filtered = filtered.filter(q => q.is_premium === true);
    }
    
    setFilteredQuestions(filtered);
  }, [searchTerm, selectedTopicFilter, selectedTypeFilter, selectedDifficultyFilter, showPremiumOnly]);

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

  const handleUploadPremiumQuestions = async () => {
    setIsUploading(true);
    setUploadResult(null);
    
    try {
      console.log('🚀 Starting Premium Set 1 upload via unified system...');
      
      const result = await uploadPremiumSet1Questions();
      setUploadResult(result);
      
      if (result.success) {
        toast.success(`הועלו בהצלחה ${result.uploadedCount} שאלות פרמיום Set 1!`);
        loadQuestions(true); // Refresh the questions list
        console.log('🎉 Premium Set 1 upload completed successfully via unified system!');
      } else {
        const errorMsg = result.errors ? result.errors.join(', ') : 'שגיאה לא ידועה';
        toast.error(`שגיאה בהעלאת השאלות: ${errorMsg}`);
        console.error('❌ Premium Set 1 upload failed:', result.errors);
      }
    } catch (error) {
      console.error('❌ Upload process failed:', error);
      const errorMsg = error instanceof Error ? error.message : 'שגיאה לא צפויה';
      toast.error(`שגיאה בהעלאת השאלות: ${errorMsg}`);
      setUploadResult({
        success: false,
        uploadedCount: 0,
        errors: [errorMsg]
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedTypeFilter("all");
    setSelectedDifficultyFilter("all");
    setSelectedTopicFilter("all");
    setShowPremiumOnly(false);
    toast.info("🔄 כל המסננים נוקו - מציג את כל השאלות");
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
            <Button variant="outline" onClick={handleClearFilters}>
              <Filter className="h-4 w-4 ml-1" />
              נקה מסננים
            </Button>
            
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
            
            <Button 
              onClick={() => setShowUploadDialog(true)}
              disabled={isUploading}
              variant="outline"
              className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
            >
              <Crown className="h-4 w-4 ml-1" />
              העלאת Set 1 Premium
            </Button>
            
            <Button onClick={handleCreateNewQuestion}>
              <PlusCircle className="h-4 w-4 ml-1" />
              הוסף שאלה
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-500 rounded-full">
                <Star className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-blue-800">סה״כ שאלות</h3>
            </div>
            <p className="text-2xl font-bold text-blue-700">{questionStats.total}</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-yellow-500 rounded-full">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-yellow-800">שאלות פרמיום</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-700">{questionStats.premium}</p>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-gray-500 rounded-full">
                <Star className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">שאלות חינם</h3>
            </div>
            <p className="text-2xl font-bold text-gray-700">{questionStats.free}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="all">כל סוגי השאלות</option>
              <option value="reading-comprehension">הבנת הנקרא</option>
              <option value="sentence-completion">השלמת משפטים</option>
              <option value="restatement">ניסוח מחדש</option>
              <option value="vocabulary">אוצר מילים</option>
            </select>
          </div>
          
          <div>
            <select
              value={selectedDifficultyFilter}
              onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="all">כל הרמות</option>
              <option value="easy">קל</option>
              <option value="medium">בינוני</option>
              <option value="hard">קשה</option>
            </select>
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
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="premium-only"
              checked={showPremiumOnly}
              onCheckedChange={(checked) => setShowPremiumOnly(checked === true)}
            />
            <label
              htmlFor="premium-only"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              רק שאלות פרמיום
            </label>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">מס'</TableHead>
                <TableHead>שאלה</TableHead>
                <TableHead className="w-32">סוג שאלה</TableHead>
                <TableHead className="w-20">רמה</TableHead>
                <TableHead className="w-24">פרמיום</TableHead>
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
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {question.type === 'reading-comprehension' ? 'הבנת הנקרא' :
                         question.type === 'sentence-completion' ? 'השלמת משפטים' :
                         question.type === 'restatement' ? 'ניסוח מחדש' :
                         question.type === 'vocabulary' ? 'אוצר מילים' :
                         question.type || 'לא מוגדר'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        question.difficulty === 'hard' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {question.difficulty === 'easy' ? 'קל' :
                         question.difficulty === 'medium' ? 'בינוני' :
                         question.difficulty === 'hard' ? 'קשה' :
                         question.difficulty || 'לא מוגדר'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {question.is_premium ? (
                        <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          <Crown className="w-3 h-3" />
                          פרמיום
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          <Star className="w-3 h-3" />
                          חינם
                        </span>
                      )}
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
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
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
      
      {/* Upload Premium Set 1 Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-orange-600" />
              העלאת Set 1 Premium
            </DialogTitle>
            <DialogDescription>
              העלאה של 6 שאלות פרימיום מובנות במבנה סט מאורגן
            </DialogDescription>
          </DialogHeader>
          
          {/* Premium Set Details */}
          <div className="space-y-4">
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Set 1 Premium - פרטי השאלות:
              </h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• 6 שאלות פרימיום במבנה סט מאורגן</li>
                <li>• 3 שאלות Restatement (קל, בינוני, קשה)</li>
                <li>• 3 שאלות Sentence Completion (קל, בינוני, קשה)</li>
                <li>• הסברים מפורטים בעברית</li>
                <li>• מבנה סט עם set_id, set_number, set_order</li>
              </ul>
            </div>

            {/* Upload Results */}
            {uploadResult && (
              <div className="space-y-3">
                {uploadResult.success ? (
                  <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">העלאה הושלמה בהצלחה!</span>
                    </div>
                    <p className="text-green-700">
                      הועלו בהצלחה {uploadResult.uploadedCount} שאלות פרימיום!
                    </p>
                    {uploadResult.batchId && (
                      <div className="mt-2 text-xs text-green-600">
                        Batch ID: <code>{uploadResult.batchId}</code>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-800">העלאה נכשלה</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                      {uploadResult.errors?.map((error: string, index: number) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                    {uploadResult.uploadedCount > 0 && (
                      <div className="mt-2 text-sm font-medium text-red-600">
                        הועלו בכל זאת: {uploadResult.uploadedCount} שאלות
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              ביטול
            </Button>
            <Button
              onClick={handleUploadPremiumQuestions}
              disabled={isUploading}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin ml-2" />
                  מעלה Set 1 Premium...
                </>
              ) : (
                <>
                  <Crown className="h-4 w-4 ml-2" />
                  העלה Set 1 Premium (6 שאלות)
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionsManager;
