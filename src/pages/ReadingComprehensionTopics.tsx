import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BookOpen, ArrowRight, Clock, Target, TrendingUp, Filter, Star } from 'lucide-react';
import { getFilteredStories, getAvailableStories } from '@/services/storyQuestionsService';
import { Badge } from '@/components/ui/badge';
import FilterPanel, { FilterOptions } from '@/components/reading-comprehension/FilterPanel';

const ReadingComprehensionTopics: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterOptions>({
    difficulty: 'all',
    subject: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Get filtered stories based on current filters
  const stories = useMemo(() => {
    return getFilteredStories(filters.difficulty, filters.subject);
  }, [filters]);

  // Get all stories for statistics
  const allStories = useMemo(() => {
    return getAvailableStories();
  }, []);

  // Simulate loading for better UX
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleBackClick = () => {
    navigate('/simulations-entry');
  };

  // Calculate filtering statistics
  const stats = useMemo(() => {
    const totalStories = allStories.length;
    const filteredStories = stories.length;
    const difficultyBreakdown = {
      easy: allStories.filter(s => s.difficulty === 'easy').length,
      medium: allStories.filter(s => s.difficulty === 'medium').length,
      hard: allStories.filter(s => s.difficulty === 'hard').length,
      mixed: allStories.filter(s => s.difficulty === 'mixed').length,
    };
    
    return {
      total: totalStories,
      filtered: filteredStories,
      percentage: totalStories > 0 ? Math.round((filteredStories / totalStories) * 100) : 0,
      difficulty: difficultyBreakdown
    };
  }, [allStories, stories]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      case 'mixed': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'קל';
      case 'medium': return 'בינוני';
      case 'hard': return 'קשה';
      case 'mixed': return 'מעורב';
      default: return 'לא ידוע';
    }
  };

  const getSubjectText = (subject?: string) => {
    const subjectMap: Record<string, string> = {
      technology: 'טכנולוגיה',
      economics: 'כלכלה',
      engineering: 'הנדסה',
      health: 'בריאות',
      society: 'חברה',
      education: 'חינוך',
      environment: 'סביבה',
      history: 'היסטוריה',
      psychology: 'פסיכולוגיה'
    };
    return subject ? subjectMap[subject] || subject : 'כללי';
  };

  const getSubjectColor = (subject?: string) => {
    const colorMap: Record<string, string> = {
      technology: 'bg-blue-100 text-blue-700',
      economics: 'bg-green-100 text-green-700',
      engineering: 'bg-purple-100 text-purple-700',
      health: 'bg-red-100 text-red-700',
      society: 'bg-orange-100 text-orange-700',
      education: 'bg-indigo-100 text-indigo-700',
      environment: 'bg-emerald-100 text-emerald-700',
      history: 'bg-amber-100 text-amber-700',
      psychology: 'bg-pink-100 text-pink-700'
    };
    return subject ? colorMap[subject] || 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-700';
  };

  const handleStorySelect = (storyTitle: string) => {
    // Use the story title directly and encode it for URL
    const encodedTitle = encodeURIComponent(storyTitle);
    navigate(`/simulation/story/${encodedTitle}`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={handleBackClick}
              className="flex items-center text-purple-600 hover:text-purple-700 mb-6 font-medium transition-colors group"
            >
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              חזור לדף הכניסה
            </button>

            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full opacity-20"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full opacity-15"></div>
                <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full opacity-10"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="flex items-center text-center lg:text-right">
                    <div className="bg-white bg-opacity-20 rounded-2xl p-4 ml-6 backdrop-blur-sm">
                      <BookOpen className="w-12 h-12" />
                    </div>
                    <div>
                      <h1 className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text">
                        הבנת הנקרא
                      </h1>
                      <p className="text-white text-opacity-90 text-xl max-w-md">
                        בחר סיפור ותתחיל סימולציה של שאלות הבנת הנקרא
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center text-white bg-white bg-opacity-15 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg">
                      <Target className="w-6 h-6 ml-2" />
                      <div className="text-right">
                        <div className="text-2xl font-bold">{stats.filtered}</div>
                        <div className="text-sm opacity-90">סיפורים זמינים</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-white bg-white bg-opacity-15 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg">
                      <TrendingUp className="w-6 h-6 ml-2" />
                      <div className="text-right">
                        <div className="text-2xl font-bold">{stats.percentage}%</div>
                        <div className="text-sm opacity-90">מהמאגר</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filter Panel */}
          {isLoading ? (
            <div className="mb-8 bg-white rounded-lg shadow-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-8 bg-gray-200 rounded w-20"></div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <FilterPanel 
              filters={filters}
              onFiltersChange={handleFiltersChange}
              availableCount={stories.length}
            />
          )}

          {/* Stories Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isLoading ? (
              <>
                {/* Loading state skeleton */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                        <div className="space-y-2">
                          <div className="w-16 h-6 bg-gray-200 rounded"></div>
                          <div className="w-20 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                          <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {stories.length > 0 && (
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-purple-100 text-purple-700 px-3 py-1 text-sm font-medium">
                        <Filter className="w-4 h-4 ml-1" />
                        {stats.filtered} מתוך {stats.total} סיפורים
                      </Badge>
                      {(filters.difficulty !== 'all' || filters.subject !== 'all') && (
                        <Badge variant="outline" className="text-gray-600">
                          סינון פעיל
                        </Badge>
                      )}
                    </div>
                    
                    {stats.filtered > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 ml-1 text-yellow-500" />
                        <span>מומלץ להתחיל מרמה קלה</span>
                      </div>
                    )}
                  </div>
                )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {stories.map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        delay: 0.3 + index * 0.05,
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-2 border border-gray-100 h-full flex flex-col"
                      onClick={() => handleStorySelect(story.title)} // Use story.title instead of story.id
                    >
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-3 group-hover:from-purple-200 group-hover:to-blue-200 transition-colors">
                            <BookOpen className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge className={`${getDifficultyColor(story.difficulty)} font-medium shadow-sm`}>
                              {getDifficultyText(story.difficulty)}
                            </Badge>
                            {story.subject && (
                              <Badge className={`${getSubjectColor(story.subject)} font-medium shadow-sm`}>
                                {getSubjectText(story.subject)}
                              </Badge>
                            )}
                          </div>
                        </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors min-h-[3.5rem]">
                          {story.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow min-h-[4.5rem]">
                          {story.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="w-4 h-4 ml-1" />
                            <span>{story.questionCount} שאלות</span>
                          </div>                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStorySelect(story.title); // Use story.title instead of story.id
                            }}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all flex items-center shadow-md hover:shadow-lg group-hover:scale-105"
                          >
                            התחל
                            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Empty State - No Stories Found */}
          {!isLoading && stories.length === 0 && (filters.difficulty !== 'all' || filters.subject !== 'all') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="text-center py-16"
            >
              <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-gray-100">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  לא נמצאו סיפורים
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  לא נמצאו סיפורים התואמים לסינון שבחרת. נסה לשנות את האפשרויות או לאפס את הסינון.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      סה"כ סיפורים זמינים: {stats.total}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Empty State - No Stories Available */}
          {stories.length === 0 && filters.difficulty === 'all' && filters.subject === 'all' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="text-center py-16"
            >
              <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-gray-100">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  אין סיפורים זמינים
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  כרגע אין סיפורים זמינים להבנת הנקרא. נא לנסות שוב מאוחר יותר.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReadingComprehensionTopics;
