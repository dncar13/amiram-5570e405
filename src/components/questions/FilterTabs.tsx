import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/data/types/questionTypes";

interface FilterTabsProps {
  questions: Question[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  children: React.ReactNode;
  // Support both prop patterns
  filter?: string;
  setFilter?: React.Dispatch<React.SetStateAction<string>>;
  userQuestions?: Question[];
}

const getFilteredQuestions = (questions: Question[], filter: string): Question[] => {
  switch (filter) {
    case 'all':
      return questions;
    case 'easy':
      return questions.filter(q => q.difficulty === 'easy');
    case 'medium':
      return questions.filter(q => q.difficulty === 'medium');
    case 'hard':
      return questions.filter(q => q.difficulty === 'hard');
    case 'reading':
      return questions.filter(q => q.type === 'reading-comprehension');
    case 'vocabulary':
      return questions.filter(q => q.type === 'vocabulary');
    case 'grammar':
      return questions.filter(q => q.type === 'grammar');
    default:
      return questions;
  }
};

const FilterTabs: React.FC<FilterTabsProps> = ({ 
  questions, 
  activeFilter, 
  onFilterChange, 
  children,
  filter,
  setFilter,
  userQuestions
}) => {
  // Use either prop pattern
  const currentFilter = activeFilter || filter || 'all';
  const currentQuestions = questions || userQuestions || [];
  const handleFilterChange = onFilterChange || setFilter || (() => {});

  const allCount = currentQuestions.length;
  const easyCount = currentQuestions.filter(q => q.difficulty === 'easy').length;
  const mediumCount = currentQuestions.filter(q => q.difficulty === 'medium').length;
  const hardCount = currentQuestions.filter(q => q.difficulty === 'hard').length;
  const readingCount = currentQuestions.filter(q => q.type === 'reading-comprehension').length;
  const vocabularyCount = currentQuestions.filter(q => q.type === 'vocabulary').length;
  const grammarCount = currentQuestions.filter(q => q.type === 'grammar').length;

  return (
    <Tabs value={currentFilter} onValueChange={handleFilterChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-6">
        <TabsTrigger value="all" className="flex items-center gap-1">
          הכל
          <Badge variant="secondary" className="text-xs">
            {allCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="easy" className="flex items-center gap-1">
          קל
          <Badge variant="secondary" className="text-xs">
            {easyCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="medium" className="flex items-center gap-1">
          בינוני
          <Badge variant="secondary" className="text-xs">
            {mediumCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="hard" className="flex items-center gap-1">
          קשה
          <Badge variant="secondary" className="text-xs">
            {hardCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="reading" className="flex items-center gap-1">
          הבנת הנקרא
          <Badge variant="secondary" className="text-xs">
            {readingCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="vocabulary" className="flex items-center gap-1">
          אוצרמילים
          <Badge variant="secondary" className="text-xs">
            {vocabularyCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="grammar" className="flex items-center gap-1">
          דקדוק
          <Badge variant="secondary" className="text-xs">
            {grammarCount}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value={currentFilter} className="mt-0">
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default FilterTabs;
