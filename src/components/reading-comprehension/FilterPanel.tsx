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
    { value: 'all' as const, label: 'כל הרמות', color: 'bg-gray-100 text-gray-700' },
    { value: 'easy' as const, label: 'קל', color: 'bg-green-100 text-green-700' },
    { value: 'medium' as const, label: 'בינוני', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'hard' as const, label: 'קשה', color: 'bg-red-100 text-red-700' }
  ];
  const subjectOptions = [
    { value: 'all' as const, label: 'כל הנושאים', icon: BookOpen, color: 'bg-gray-100 text-gray-700' },
    { value: 'technology' as const, label: 'טכנולוגיה', icon: Building, color: 'bg-blue-100 text-blue-700' },
    { value: 'economics' as const, label: 'כלכלה', icon: TrendingUp, color: 'bg-green-100 text-green-700' },
    { value: 'engineering' as const, label: 'הנדסה', icon: Building, color: 'bg-purple-100 text-purple-700' },
    { value: 'health' as const, label: 'בריאות', icon: Heart, color: 'bg-red-100 text-red-700' },
    { value: 'society' as const, label: 'חברה', icon: Users, color: 'bg-orange-100 text-orange-700' },
    { value: 'education' as const, label: 'חינוך', icon: BookOpen, color: 'bg-indigo-100 text-indigo-700' },
    { value: 'environment' as const, label: 'סביבה', icon: Globe, color: 'bg-emerald-100 text-emerald-700' },
    { value: 'history' as const, label: 'היסטוריה', icon: History, color: 'bg-amber-100 text-amber-700' },
    { value: 'psychology' as const, label: 'פסיכולוגיה', icon: Brain, color: 'bg-pink-100 text-pink-700' }
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
  return (
    <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-white to-gray-50 overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-2">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">
              סינון מתקדם
            </span>
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="text-gray-600 hover:text-gray-800 hover:bg-white border-gray-300 shadow-sm transition-all hover:shadow-md"
            >
              <RotateCcw className="h-4 w-4 ml-1" />
              איפוס
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <p className="text-sm text-gray-600 font-medium">
            {availableCount > 0 ? (
              <span>
                נמצאו <span className="font-bold text-purple-600">{availableCount}</span> סיפורים מתאימים
              </span>
            ) : (
              'בחר סינון למציאת סיפורים מתאימים'
            )}
          </p>
        </div>
      </CardHeader>
        <CardContent className="space-y-8 p-6">
        {/* Difficulty Filter */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            רמת קושי
          </h4>
          <div className="flex flex-wrap gap-3">
            {difficultyOptions.map((option) => (
              <Badge
                key={option.value}
                variant={filters.difficulty === option.value ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 transform px-4 py-2 text-sm font-medium shadow-sm ${
                  filters.difficulty === option.value 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg' 
                    : `${option.color} hover:opacity-80 hover:shadow-md border-gray-200`
                }`}
                onClick={() => handleDifficultyChange(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Subject Filter */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            נושא התחום
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {subjectOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Badge
                  key={option.value}
                  variant={filters.subject === option.value ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 transform p-4 justify-center text-center h-auto flex-col shadow-sm ${
                    filters.subject === option.value 
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg' 
                      : `${option.color} hover:opacity-80 hover:shadow-md border-gray-200`
                  }`}
                  onClick={() => handleSubjectChange(option.value)}
                >
                  <IconComponent className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{option.label}</span>
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
