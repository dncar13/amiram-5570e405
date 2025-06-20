
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, RotateCcw, BookOpen, TrendingUp, Users, Heart, Building, Globe, History, Brain, Scale, Sparkles } from 'lucide-react';

export interface FilterOptions {
  difficulty: 'all' | 'easy' | 'medium' | 'hard';
  subject: 'all' | 'technology' | 'economics' | 'engineering' | 'health' | 'society' | 'education' | 'environment' | 'history' | 'psychology';
}

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableCount?: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  availableCount = 0
}) => {
  
  const difficultyOptions = [
    { value: 'all' as const, label: 'כל הרמות', color: 'bg-slate-700/50 text-slate-300 border-slate-600' },
    { value: 'easy' as const, label: 'קל', color: 'bg-slate-700/50 text-slate-300 border-slate-600' },
    { value: 'medium' as const, label: 'בינוני', color: 'bg-slate-700/50 text-slate-300 border-slate-600' },
    { value: 'hard' as const, label: 'קשה', color: 'bg-slate-700/50 text-slate-300 border-slate-600' }
  ];
  
  const subjectOptions = [
    { value: 'all' as const, label: 'כל הנושאים', icon: BookOpen, color: 'bg-slate-700/50 text-slate-300 border-slate-600' },
    { value: 'technology' as const, label: 'טכנולוגיה', icon: Building, color: 'bg-slate-700/50 text-slate-300 border-slate-600' },
    { value: 'economics' as const, label: 'כלכלה', icon: TrendingUp, color: 'bg-slate-700/50 text-slate-300 border-slate-600' },
    { value: 'engineering' as const, label: 'הנדסה', icon: Building, color: 'bg-slate-700/50 text-slate-300 border-slate-600' },
    { value: 'health' as const, label: 'בריאות', icon: Heart, color: 'bg-slate-700/50 text-slate-300 border-slate-600' },
    { value: 'society' as const, label: 'חברה', icon: Users, color: 'bg-slate-700/50 text-slate-300 border-slate-600' },
    { value: 'education' as const, label: 'חינוך', icon: BookOpen, color: 'bg-slate-700/50 text-slate-300 border-slate-600' },
    { value: 'environment' as const, label: 'סביבה', icon: Globe, color: 'bg-slate-700/50 text-slate-300 border-slate-600' },
    { value: 'history' as const, label: 'היסטוריה', icon: History, color: 'bg-slate-700/50 text-slate-300 border-slate-600' },
    { value: 'psychology' as const, label: 'פסיכולוגיה', icon: Brain, color: 'bg-slate-700/50 text-slate-300 border-slate-600' }
  ];

  const handleDifficultyChange = (difficulty: FilterOptions['difficulty']) => {
    onFiltersChange({ ...filters, difficulty });
  };

  const handleSubjectChange = (subject: FilterOptions['subject']) => {
    onFiltersChange({ ...filters, subject });
  };

  const resetFilters = () => {
    onFiltersChange({ difficulty: 'all', subject: 'all' });
  };

  const hasActiveFilters = filters.difficulty !== 'all' || filters.subject !== 'all';
  
  return (    <Card className="shadow-lg border-0 bg-transparent overflow-hidden">
      <CardHeader className="pb-3 md:pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-2xl">
            <div className="bg-slate-700/50 backdrop-blur-sm rounded-lg p-1 md:p-2 border border-slate-600/50">
              <Filter className="h-4 w-4 md:h-6 md:w-6 text-slate-300" />
            </div>
            <span className="text-slate-200 font-bold text-lg md:text-2xl">
              סינון מתקדם
            </span>
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 border-slate-600 shadow-sm transition-all hover:shadow-md bg-slate-800/50 text-sm md:text-base"
            >
              <RotateCcw className="h-4 w-4 md:h-5 md:w-5 ml-1" />
              <span className="hidden md:inline">איפוס</span>
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 md:mt-2">
          <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-slate-400" />
          <p className="text-sm md:text-base text-slate-300 font-medium">
            {availableCount > 0 ? (
              <span>
                נמצאו <span className="font-bold text-slate-200 text-base md:text-lg">{availableCount}</span> סיפורים
              </span>
            ) : (
              'בחר סינון למציאת סיפורים'
            )}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-8 p-3 md:p-6">        {/* Difficulty Filter */}
        <div className="space-y-2 md:space-y-4">
          <h4 className="text-base md:text-lg font-semibold text-slate-300 mb-2 md:mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-500 rounded-full"></div>
            רמת קושי
          </h4>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {difficultyOptions.map((option) => (
              <Badge
                key={option.value}
                variant={filters.difficulty === option.value ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 transform px-3 py-2 md:px-5 md:py-3 text-sm md:text-base font-medium shadow-sm ${
                  filters.difficulty === option.value 
                    ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-100 hover:from-slate-500 hover:to-slate-600 shadow-lg border-slate-500' 
                    : `${option.color} hover:bg-slate-600/50 hover:shadow-md`
                }`}
                onClick={() => handleDifficultyChange(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Subject Filter */}
        <div className="space-y-2 md:space-y-4">
          <h4 className="text-base md:text-lg font-semibold text-slate-300 mb-2 md:mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-500 rounded-full"></div>
            נושא התחום
          </h4>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-3">
            {subjectOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Badge
                  key={option.value}
                  variant={filters.subject === option.value ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 transform p-2 md:p-5 justify-center text-center h-auto flex-col shadow-sm ${
                    filters.subject === option.value 
                      ? 'bg-gradient-to-br from-slate-600 to-slate-700 text-slate-100 hover:from-slate-500 hover:to-slate-600 shadow-lg border-slate-500' 
                      : `${option.color} hover:bg-slate-600/50 hover:shadow-md`
                  }`}
                  onClick={() => handleSubjectChange(option.value)}
                >
                  <IconComponent className="h-4 w-4 md:h-6 md:w-6 mb-1 md:mb-2" />
                  <span className="text-xs md:text-sm font-medium">{option.label}</span>
                </Badge>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
