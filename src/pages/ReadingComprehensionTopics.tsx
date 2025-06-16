
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BookOpen, ArrowRight, Clock, Target, TrendingUp, Filter, Star, Sparkles, Brain, Zap, Rocket, ChevronLeft, Eye, Award, CircuitBoard } from 'lucide-react';
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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/simulations-entry');
    }
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
      case 'easy': return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25';
      case 'medium': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25';
      case 'hard': return 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25';
      case 'mixed': return 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25';
      default: return 'bg-gradient-to-r from-gray-400 to-slate-400 text-white shadow-lg shadow-gray-400/25';
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
      technology: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25',
      economics: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25',
      engineering: 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/25',
      health: 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25',
      society: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25',
      education: 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/25',
      environment: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25',
      history: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/25',
      psychology: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25'
    };
    return subject ? colorMap[subject] || 'bg-gradient-to-r from-gray-400 to-slate-400 text-white shadow-lg shadow-gray-400/25' : 'bg-gradient-to-r from-gray-400 to-slate-400 text-white shadow-lg shadow-gray-400/25';
  };

  const handleStorySelect = (storyTitle: string) => {
    const encodedTitle = encodeURIComponent(storyTitle);
    navigate(`/simulation/story/${encodedTitle}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full opacity-15 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-full opacity-10 animate-pulse delay-500"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/simulations-entry')}
              className="flex items-center text-purple-600 hover:text-purple-700 mb-6 font-medium transition-colors group"
            >
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              חזור לדף הכניסה
            </button>

            <motion.div 
              className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-3xl p-8 mb-8 shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Animated background elements */}
              <div className="absolute inset-0">
                <motion.div 
                  className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full opacity-10"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full opacity-15"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.15, 0.3, 0.15]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                <motion.div 
                  className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full opacity-10"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="flex items-center text-center lg:text-right">
                    <motion.div 
                      className="bg-white bg-opacity-20 rounded-2xl p-4 ml-6 backdrop-blur-sm border border-white/20"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <motion.div
                        animate={{ rotateY: [0, 180, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Brain className="w-12 h-12" />
                      </motion.div>
                    </motion.div>
                    <div>
                      <motion.h1 
                        className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                      >
                        הבנת הנקרא
                      </motion.h1>
                      <motion.p 
                        className="text-white text-opacity-90 text-xl max-w-md leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      >
                        גלה עולמות של ידע דרך סיפורים מרתקים ושאלות מתקדמות
                      </motion.p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.div 
                      className="flex items-center text-white bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-6 py-4 shadow-2xl border border-white/20"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Target className="w-6 h-6 ml-2" />
                      </motion.div>
                      <div className="text-right">
                        <motion.div 
                          className="text-3xl font-bold"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {stats.filtered}
                        </motion.div>
                        <div className="text-sm opacity-90">סיפורים זמינים</div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center text-white bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-6 py-4 shadow-2xl border border-white/20"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Rocket className="w-6 h-6 ml-2" />
                      </motion.div>
                      <div className="text-right">
                        <motion.div 
                          className="text-3xl font-bold"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                          {stats.percentage}%
                        </motion.div>
                        <div className="text-sm opacity-90">מהמאגר</div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Filter Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {isLoading ? (
              <div className="mb-8 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 animate-pulse border border-slate-600/50">
                <div className="h-6 bg-slate-600 rounded w-1/4 mb-4"></div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-8 bg-slate-600 rounded w-20"></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                      <div key={i} className="h-16 bg-slate-600 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-8 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-slate-600/50">
                <FilterPanel 
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  availableCount={stories.length}
                />
              </div>
            )}
          </motion.div>

          {/* Stories Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            variants={containerVariants}
          >
            {isLoading ? (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div className="h-8 bg-slate-600 rounded w-48 animate-pulse"></div>
                  <div className="h-6 bg-slate-600 rounded w-32 animate-pulse"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-2xl p-6 animate-pulse border border-slate-600">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-slate-600 rounded-xl"></div>
                        <div className="space-y-2">
                          <div className="w-16 h-6 bg-slate-600 rounded"></div>
                          <div className="w-20 h-6 bg-slate-600 rounded"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-6 bg-slate-600 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-600 rounded w-full"></div>
                        <div className="h-4 bg-slate-600 rounded w-5/6"></div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="h-4 bg-slate-600 rounded w-20"></div>
                          <div className="h-8 bg-slate-600 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <AnimatePresence>
                  {stories.length > 0 && (
                    <motion.div 
                      className="mb-6 flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="flex items-center gap-4">
                        <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-sm font-medium shadow-lg">
                          <CircuitBoard className="w-4 h-4 ml-1" />
                          {stats.filtered} מתוך {stats.total} סיפורים
                        </Badge>
                        {(filters.difficulty !== 'all' || filters.subject !== 'all') && (
                          <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg">
                            <Zap className="w-4 h-4 ml-1" />
                            סינון פעיל
                          </Badge>
                        )}
                      </div>
                      
                      {stats.filtered > 0 && (
                        <motion.div 
                          className="flex items-center text-sm text-cyan-300 bg-slate-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-cyan-500/20"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Award className="w-4 h-4 ml-1 text-yellow-400" />
                          <span>מומלץ להתחיל מרמה קלה</span>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {stories.map((story, index) => (
                    <motion.div
                      key={story.id}
                      variants={itemVariants}
                      className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 cursor-pointer border border-slate-700/50 hover:border-cyan-500/50 h-full flex flex-col overflow-hidden"
                      onClick={() => handleStorySelect(story.title)}
                      onMouseEnter={() => setHoveredCard(story.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -8,
                        transition: { type: "spring", stiffness: 300, damping: 20 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Animated border gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"></div>
                      
                      {/* Glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        animate={hoveredCard === story.id ? {
                          opacity: [0, 0.3, 0],
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      />

                      <div className="relative z-10 p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                          <motion.div 
                            className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-3 border border-purple-500/30 group-hover:border-cyan-400/50 transition-colors duration-300"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.8 }}
                          >
                            <Eye className="w-6 h-6 text-cyan-400" />
                          </motion.div>
                          <div className="flex flex-col gap-2">
                            <Badge className={`${getDifficultyColor(story.difficulty)} font-medium transform transition-transform group-hover:scale-105`}>
                              {getDifficultyText(story.difficulty)}
                            </Badge>
                            {story.subject && (
                              <Badge className={`${getSubjectColor(story.subject)} font-medium transform transition-transform group-hover:scale-105`}>
                                {getSubjectText(story.subject)}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300 min-h-[3.5rem]">
                          {story.title}
                        </h3>
                        
                        <p className="text-slate-300 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow min-h-[4.5rem] group-hover:text-slate-200 transition-colors duration-300">
                          {story.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center text-slate-400 text-sm group-hover:text-cyan-300 transition-colors duration-300">
                            <Clock className="w-4 h-4 ml-1" />
                            <span>{story.questionCount} שאלות</span>
                          </div>
                          
                          <motion.button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStorySelect(story.title);
                            }}
                            className="relative bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center shadow-lg hover:shadow-cyan-500/25 overflow-hidden group/btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                            />
                            <span className="relative z-10">התחל</span>
                            <motion.div
                              className="relative z-10"
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </motion.div>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
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
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-md mx-auto border border-slate-700/50">
                <motion.div 
                  className="bg-gradient-to-br from-slate-700 to-slate-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <BookOpen className="w-10 h-10 text-slate-300" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  לא נמצאו סיפורים
                </h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  לא נמצאו סיפורים התואמים לסינון שבחרת. נסה לשנות את האפשרויות או לאפס את הסינון.
                </p>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-center justify-center">
                    <span className="bg-slate-700 px-3 py-1 rounded-full">
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
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-md mx-auto border border-slate-700/50">
                <motion.div 
                  className="bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <BookOpen className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  אין סיפורים זמינים
                </h3>
                <p className="text-slate-300 leading-relaxed">
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
