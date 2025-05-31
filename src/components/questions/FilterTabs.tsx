
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Question } from "@/data/types/questionTypes";

interface FilterTabsProps {
  filter: "all" | "mine" | "flagged";
  setFilter: (value: "all" | "mine" | "flagged") => void;
  userQuestions: Question[];
}

const FilterTabs = ({ filter, setFilter, userQuestions }: FilterTabsProps) => {
  return (
    <div className="mt-4">
      <Tabs 
        defaultValue={filter} 
        onValueChange={(value) => setFilter(value as any)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mine">השאלות שלי</TabsTrigger>
          <TabsTrigger value="flagged">
            מסומנות {userQuestions.filter(q => q.flagged === true).length > 0 && 
              `(${userQuestions.filter(q => q.flagged === true).length})`}
          </TabsTrigger>
          <TabsTrigger value="all">הכל</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default FilterTabs;
