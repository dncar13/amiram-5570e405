
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/data/types/questionTypes";

interface FilterTabsProps {
  questions: Question[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  children: React.ReactNode;
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
  children 
}) => {
  const allCount = questions.length;
  const easyCount = questions.filter(q => q.difficulty === 'easy').length;
  const mediumCount = questions.filter(q => q.difficulty === 'medium').length;
  const hardCount = questions.filter(q => q.difficulty === 'hard').length;
  const readingCount = questions.filter(q => q.type === 'reading-comprehension').length;
  const vocabularyCount = questions.filter(q => q.type === 'vocabulary').length;
  const grammarCount = questions.filter(q => q.type === 'grammar').length;

  return (
    <Tabs value={activeFilter} onValueChange={onFilterChange} className="w-full">
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
          אוצר מילים
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

      <TabsContent value={activeFilter} className="mt-0">
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default FilterTabs;
