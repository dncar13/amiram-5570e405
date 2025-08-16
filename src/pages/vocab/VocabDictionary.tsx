import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Volume2, Check, ChevronDown, ChevronUp, BookOpen, Zap, LayoutGrid, List, X, Star, Play, Bookmark, Clock, Target, Flame, Plus, Shuffle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import WordCard from '@/components/vocab/WordCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useVocabulary } from '@/hooks/useVocabulary';
import { updateMastery } from '@/services/vocabularyServiceDemo';
import FlashcardTab from '@/components/vocab/FlashcardTab';
import { SpellingTab } from '@/components/vocab/SpellingTab';
import { vocabularySimulationQuestions } from '@/data/simulation-vocab-120';
import vocabFlashcardData from '@/data/vocab-flashcard-120.json';

const VocabDictionary: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState(searchParams.get('level') || 'all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'saved', 'known', 'needs-review'
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'cards'
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [sortBy, setSortBy] = useState('frequency'); // 'frequency', 'alpha', 'level'
  const [activeMode, setActiveMode] = useState('dictionary');
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState(new Set());
  const [dailyGoal] = useState(20);
  
  const searchRef = useRef<HTMLInputElement>(null);
  
  // Convert flashcard data to words format for the vocabulary hook
  const convertedWords = useMemo(() => {
    return vocabFlashcardData.questions.map((q, index) => {
      // Extract the Hebrew word from the correct answer
      const hebrewTranslation = q.options[q.correct];
      // Extract the English word from the question
      const englishWord = q.question.replace("What is the best translation of '", "").replace("'?", "");
      
      return {
        id: `w${String(index + 1).padStart(3, '0')}`,
        word: englishWord,
        translation: hebrewTranslation,
        example: q.explanation || `Example with ${englishWord}`,
        level: q.difficulty,
        category: q.category || 'general'
      };
    });
  }, []);

  // Get all word IDs for the vocabulary hook
  const allWordIds = useMemo(() => convertedWords.map(w => w.id), [convertedWords]);
  
  // Use vocabulary hook for state management
  const {
    saved,
    known,
    mastery,
    loading: vocabLoading,
    stats,
    onStar,
    onCheck,
    refreshStats
  } = useVocabulary(allWordIds);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not in input fields
      const activeElement = document.activeElement;
      const isInInput = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
      
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !isInInput) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  // Play audio with animation
  const playAudio = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  // Toggle expanded state
  const toggleExpanded = (id: string | number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };


  // Filter and sort words
  const filteredAndSortedWords = useMemo(() => {
    const filtered = convertedWords.filter(word => {
      const matchesSearch = searchTerm === '' || 
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.translation.includes(searchTerm);
      
      const matchesLevel = levelFilter === 'all' || word.level === levelFilter;
      const matchesCategory = categoryFilter === 'all' || word.category === categoryFilter;
      
      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'saved') {
        matchesStatus = saved.has(word.id);
      } else if (statusFilter === 'known') {
        matchesStatus = known.has(word.id);
      } else if (statusFilter === 'needs-review') {
        // This would need next_review date from vocabulary service
        // For now, we'll show words that are known but not mastered
        matchesStatus = known.has(word.id) && (mastery.get(word.id) || 0) < 5;
      }
      
      return matchesSearch && matchesLevel && matchesCategory && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'alpha') return a.word.localeCompare(b.word);
      if (sortBy === 'level') {
        const levelOrder = { easy: 1, medium: 2, hard: 3 };
        return levelOrder[a.level as keyof typeof levelOrder] - levelOrder[b.level as keyof typeof levelOrder];
      }
      return 0;
    });

    return filtered;
  }, [searchTerm, levelFilter, categoryFilter, statusFilter, sortBy, saved, known, mastery]);

  // Count by level and status
  const counts = useMemo(() => {
    const levelCounts = { easy: 0, medium: 0, hard: 0 };
    const statusCounts = { 
      all: convertedWords.length,
      saved: saved.size,
      known: known.size,
      needsReview: 0
    };
    
    filteredAndSortedWords.forEach(word => {
      levelCounts[word.level as keyof typeof levelCounts]++;
    });
    
    // Count words that need review (known but not fully mastered)
    convertedWords.forEach(word => {
      if (known.has(word.id) && (mastery.get(word.id) || 0) < 5) {
        statusCounts.needsReview++;
      }
    });
    
    return { level: levelCounts, status: statusCounts };
  }, [filteredAndSortedWords, saved, known, mastery]);

  const totalCount = filteredAndSortedWords.length;

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(convertedWords.map(w => w.category))].sort();
  }, []);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setLevelFilter('all');
    setCategoryFilter('all');
    setStatusFilter('all');
    setSearchParams({});
  };

  const hasActiveFilters = searchTerm || levelFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all';

  // Highlight search term
  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() ? 
        <mark key={i} className="bg-yellow-200 px-0.5 rounded">{part}</mark> : part
    );
  };

  // Level color mapping
  const getLevelColor = (level: string) => {
    switch(level) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleLevelChange = (level: string) => {
    setLevelFilter(level);
    if (level === 'all') {
      searchParams.delete('level');
    } else {
      searchParams.set('level', level);
    }
    setSearchParams(searchParams);
  };

  // Word Row Component with hover actions
  const WordRow = ({ word }: { word: { id: string; word: string; translation: string; level: string; category: string; example?: string; synonyms?: string[]; collocations?: string[]; wordFamily?: string[] } }) => {
    const isExpanded = expandedIds.has(word.id);
    const isMarked = known.has(word.id);
    const isSaved = saved.has(word.id);
    const isHovered = hoveredWord === word.id;
    const currentMastery = mastery.get(word.id) || 0;

    return (
      <div 
        className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 group"
        onMouseEnter={() => setHoveredWord(word.id)}
        onMouseLeave={() => setHoveredWord(null)}
      >
        <div className="flex items-center gap-3 py-3 px-4">
          {/* Expand button */}
          <button
            onClick={() => toggleExpanded(word.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={isExpanded ? `צמצם פרטי המילה ${word.word}` : `הרחב פרטי המילה ${word.word}`}
            title={isExpanded ? 'צמצם פרטים' : 'הרחב פרטים'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Word info */}
          <div className="flex-1 flex items-baseline gap-3">
            <div className="flex items-center gap-2">
              <span 
                className="font-bold text-lg text-gray-900" 
                dir="ltr"
              >
                {highlightText(word.word, searchTerm)}
              </span>
              <button
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="השמע הגייה"
                aria-label={`השמע הגייה של המילה ${word.word}`}
                onClick={() => playAudio(word.word)}
              >
                <Volume2 size={16} />
              </button>
            </div>
            <span className="text-xs text-gray-500">
              {word.category}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${getLevelColor(word.level)}`}>
              {word.level === 'easy' ? 'קל' : word.level === 'medium' ? 'בינוני' : 'קשה'}
            </span>
            <span className="text-gray-600 mr-auto">
              {highlightText(word.translation, searchTerm)}
            </span>
          </div>

          {/* Quick Actions - visible on hover */}
          <div className={`flex items-center gap-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={() => onCheck(word.id)}
              className={`p-1.5 rounded-full transition-all duration-200 ${
                isMarked ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
              }`}
              title={isMarked ? 'מסומנת כמוכרת' : 'סמן כמוכרת'}
              aria-label={isMarked ? `המילה ${word.word} מסומנת כמוכרת` : `סמן את המילה ${word.word} כמוכרת`}
            >
              <Check size={16} />
            </button>
            
            <button
              onClick={() => onStar(word.id)}
              className={`p-1.5 rounded-full transition-all duration-200 ${
                isSaved ? 'text-yellow-600 bg-yellow-50' : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
              }`}
              title={isSaved ? 'נשמר' : 'שמור'}
              aria-label={isSaved ? `המילה ${word.word} נשמרה` : `שמור את המילה ${word.word}`}
            >
              <Star size={16} />
            </button>
            
            <button
              onClick={() => playAudio(word.word)}
              className="p-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              title="השמע הגייה"
              aria-label={`השמע הגייה של המילה ${word.word}`}
            >
              <Play size={16} />
            </button>
          </div>

          {/* Always visible action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onCheck(word.id)}
              className={`transition-colors ${
                isMarked ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
              } ${isHovered ? 'opacity-0' : 'opacity-100'}`}
              title={isMarked ? 'מסומנת כמוכרת' : 'סמן כמוכרת'}
              aria-label={isMarked ? `המילה ${word.word} מסומנת כמוכרת` : `סמן את המילה ${word.word} כמוכרת`}
            >
              <Check size={18} />
            </button>
          </div>
        </div>

        {/* Expanded content with rich information */}
        {isExpanded && (
          <div className="px-4 pb-4 pr-12 bg-gray-50 border-t border-gray-100">
            <div className="space-y-3 py-3">
              {word.example && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">דוגמה במשפט:</h4>
                  <p className="text-sm text-gray-600 italic bg-white p-2 rounded border" dir="ltr">
                    {word.example}
                  </p>
                </div>
              )}
              
              {word.collocations && word.collocations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">צמדי מילים נפוצים:</h4>
                  <div className="flex flex-wrap gap-1">
                    {word.collocations.map((collocation, i) => (
                      <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {collocation}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {word.wordFamily && word.wordFamily.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">משפחת מילים:</h4>
                  <div className="flex flex-wrap gap-1">
                    {word.wordFamily.map((related, i) => (
                      <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {related}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {word.synonyms && word.synonyms.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">מילים דומות:</h4>
                  <p className="text-sm text-gray-600">
                    {word.synonyms.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link 
                to="/vocab" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                aria-label="חזרה לעמוד הראשי של אוצר המילים"
              >
                <ArrowLeft size={20} />
                <span>חזרה לאוצר מילים</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">מילון</h1>
              <div className="w-32"></div>
            </div>
          </div>
        </div>

        {/* Progress Header - Sticky */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-[73px] z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Target size={18} />
                  <span className="text-sm">יעד יומי: {stats.learnedToday}/{dailyGoal}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame size={18} />
                  <span className="text-sm">{stats.streak} ימים רצופים</span>
                </div>
                <div className="hidden md:block">
                  <Progress value={(stats.learnedToday / dailyGoal) * 100} className="w-32 h-2" />
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                    <Zap size={16} className="ml-2" />
                    למד 10 מילים עכשיו
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>בחר מצב למידה</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 pt-4">
                    <Button className="w-full justify-start" variant="outline">
                      <Clock size={16} className="ml-2" />
                      חידון מהיר (2 דקות)
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Shuffle size={16} className="ml-2" />
                      מערבב לפי שליטה
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Bookmark size={16} className="ml-2" />
                      מילים שמורות
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Plus size={16} className="ml-2" />
                      מילים חדשות
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Learning Mode Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4">
            <Tabs value={activeMode} onValueChange={setActiveMode} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-12">
                <TabsTrigger value="dictionary" className="text-sm">מילון</TabsTrigger>
                <TabsTrigger value="flashcards" className="text-sm">פלשקארדים</TabsTrigger>
                <TabsTrigger value="typing" className="text-sm">כתיב</TabsTrigger>
              </TabsList>

              {/* Tab Contents */}
              <TabsContent value="dictionary" className="mt-0">
                {/* Sticky Toolbar - only show for dictionary */}
                <div className="bg-white border-b sticky top-[145px] z-10 shadow-sm">
                  <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Search with keyboard shortcut hint */}
                      <div className="relative flex-1 min-w-[200px] max-w-xs">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          ref={searchRef}
                          type="text"
                          placeholder="חפש מילה... (לחץ / לחיפוש מהיר)"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pr-10 pl-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          dir="auto"
                          aria-label="חיפוש במילון"
                        />
                      </div>

                      {/* Level chips */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLevelChange('all')}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            levelFilter === 'all' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          aria-label={`הצג את כל המילים (${totalCount})`}
                        >
                          הכל ({totalCount})
                        </button>
                        <button
                          onClick={() => handleLevelChange('easy')}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            levelFilter === 'easy' 
                              ? 'bg-green-600 text-white' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                          aria-label={`הצג מילים ברמת קושי קלה (${counts.level.easy})`}
                        >
                          קל ({counts.level.easy})
                        </button>
                        <button
                          onClick={() => handleLevelChange('medium')}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            levelFilter === 'medium' 
                              ? 'bg-orange-600 text-white' 
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          }`}
                          aria-label={`הצג מילים ברמת קושי בינונית (${counts.level.medium})`}
                        >
                          בינוני ({counts.level.medium})
                        </button>
                        <button
                          onClick={() => handleLevelChange('hard')}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            levelFilter === 'hard' 
                              ? 'bg-red-600 text-white' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                          aria-label={`הצג מילים ברמת קושי קשה (${counts.level.hard})`}
                        >
                          קשה ({counts.level.hard})
                        </button>
                      </div>

                      {/* Status filters */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setStatusFilter('saved')}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            statusFilter === 'saved' 
                              ? 'bg-yellow-600 text-white' 
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                          aria-label={`הצג מילים שמורות (${counts.status.saved})`}
                        >
                          שמורות ({counts.status.saved})
                        </button>
                        <button
                          onClick={() => setStatusFilter('known')}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            statusFilter === 'known' 
                              ? 'bg-green-600 text-white' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                          aria-label={`הצג מילים ידועות (${counts.status.known})`}
                        >
                          ידועות ({counts.status.known})
                        </button>
                        <button
                          onClick={() => setStatusFilter('needs-review')}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            statusFilter === 'needs-review' 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          }`}
                          aria-label={`הצג מילים לחזרה (${counts.status.needsReview})`}
                        >
                          לחזרה ({counts.status.needsReview})
                        </button>
                      </div>

                      {/* Category dropdown */}
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="בחר קטגוריה"
                      >
                        <option value="all">כל הסוגים</option>
                        <option value="academic">אקדמיה</option>
                        <option value="travel">טיול</option>
                        <option value="business">עבודה</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>

                      {/* Enhanced Sort dropdown */}
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="בחר אופן מיון"
                      >
                        <option value="alpha">A-Z</option>
                        <option value="level">רמה</option>
                        <option value="frequency">שכיחות</option>
                        <option value="mastery">שליטה</option>
                        <option value="recent">נוספו לאחרונה</option>
                      </select>

                      {/* View toggle */}
                      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-1.5 rounded transition-colors ${
                            viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                          }`}
                          aria-label="תצוגת רשימה"
                          title="תצוגת רשימה"
                        >
                          <List size={16} />
                        </button>
                        <button
                          onClick={() => setViewMode('cards')}
                          className={`p-1.5 rounded transition-colors ${
                            viewMode === 'cards' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                          }`}
                          aria-label="תצוגת כרטיסים"
                          title="תצוגת כרטיסים"
                        >
                          <LayoutGrid size={16} />
                        </button>
                      </div>

                      {/* Clear filters */}
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                          aria-label="נקה את כל המסננים"
                          title="נקה מסננים"
                        >
                          <X size={14} />
                          נקה
                        </button>
                      )}
                    </div>

                    {/* Active filters pills */}
                    {hasActiveFilters && (
                      <div className="flex gap-2 mt-2">
                        {searchTerm && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            חיפוש: {searchTerm}
                            <button onClick={() => setSearchTerm('')}>
                              <X size={12} />
                            </button>
                          </span>
                        )}
                        {levelFilter !== 'all' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            רמה: {levelFilter === 'easy' ? 'קל' : levelFilter === 'medium' ? 'בינוני' : 'קשה'}
                            <button onClick={() => handleLevelChange('all')}>
                              <X size={12} />
                            </button>
                          </span>
                        )}
                        {categoryFilter !== 'all' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            סוג: {categoryFilter}
                            <button onClick={() => setCategoryFilter('all')}>
                              <X size={12} />
                            </button>
                          </span>
                        )}
                        {statusFilter !== 'all' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            סטטוס: {statusFilter === 'saved' ? 'שמורות' : statusFilter === 'known' ? 'ידועות' : 'לחזרה'}
                            <button onClick={() => setStatusFilter('all')}>
                              <X size={12} />
                            </button>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Results header */}
                <div className="max-w-6xl mx-auto px-4 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      נמצאו <strong>{totalCount}</strong> מילים
                      {levelFilter !== 'all' && ` · ${counts.level.easy} קל · ${counts.level.medium} בינוני · ${counts.level.hard} קשה`}
                    </p>
                    {totalCount > 0 && (
                      <Link to="/vocab/quiz">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <Zap size={16} />
                          סימולציה על {totalCount} מילים
                        </button>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Words list */}
                <div className="max-w-6xl mx-auto px-4 pb-8">
                  <div className="bg-white rounded-lg shadow-sm">
                    {filteredAndSortedWords.length === 0 ? (
                      <div className="text-center py-12">
                        <BookOpen className="mx-auto mb-4 text-gray-300" size={48} />
                        <p className="text-gray-500 mb-2">לא נמצאו מילים התואמות לחיפוש</p>
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            נסה להרחיב את החיפוש
                          </button>
                        )}
                      </div>
                    ) : (
                      <div>
                        {viewMode === 'list' ? (
                          filteredAndSortedWords.map(word => (
                            <WordRow key={word.id} word={word} />
                          ))
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                            {filteredAndSortedWords.map(word => (
                              <div key={word.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg" dir="ltr">
                                      {highlightText(word.word, searchTerm)}
                                    </h3>
                                    <button 
                                      className="text-gray-400 hover:text-blue-600"
                                      title="השמע הגייה"
                                      aria-label={`השמע הגייה של המילה ${word.word}`}
                                      onClick={() => playAudio(word.word)}
                                    >
                                      <Volume2 size={16} />
                                    </button>
                                  </div>
                                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getLevelColor(word.level)}`}>
                                    {word.level === 'easy' ? 'קל' : word.level === 'medium' ? 'בינוני' : 'קשה'}
                                  </span>
                                </div>
                                <p className="text-gray-600 mb-3">
                                  {highlightText(word.translation, searchTerm)}
                                </p>
                                {word.example && (
                                  <p className="text-sm text-gray-500 italic mb-3" dir="ltr">
                                    {word.example}
                                  </p>
                                )}
                                <div className="flex justify-end gap-2">
                                  <button 
                                    onClick={() => onStar(word.id)}
                                    className={saved.has(word.id) ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}
                                    title={saved.has(word.id) ? 'נשמר' : 'שמור'}
                                    aria-label={saved.has(word.id) ? `המילה ${word.word} נשמרה` : `שמור את המילה ${word.word}`}
                                  >
                                    <Star size={18} />
                                  </button>
                                  <button 
                                    onClick={() => onCheck(word.id)}
                                    className={known.has(word.id) ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}
                                    title={known.has(word.id) ? 'מסומנת כמוכרת' : 'סמן כמוכרת'}
                                    aria-label={known.has(word.id) ? `המילה ${word.word} מסומנת כמוכרת` : `סמן את המילה ${word.word} כמוכרת`}
                                  >
                                    <Check size={18} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="flashcards" className="mt-0">
                <FlashcardTab 
                  words={filteredAndSortedWords}
                  onUpdateMastery={async (wordId, isCorrect) => {
                    const currentMasteryLevel = mastery.get(wordId) || 0;
                    try {
                      await updateMastery(wordId, isCorrect, currentMasteryLevel);
                      // Refresh stats after mastery update
                      refreshStats();
                    } catch (error) {
                      console.error('Error updating mastery:', error);
                    }
                  }}
                />
              </TabsContent>
              
              <TabsContent value="typing" className="mt-0">
                <SpellingTab 
                  words={filteredAndSortedWords.slice(0, 20)}
                  onWordMastered={async (wordId, masteryLevel) => {
                    try {
                      await updateMastery(wordId, masteryLevel >= 2, masteryLevel);
                      refreshStats();
                    } catch (error) {
                      console.error('Failed to update mastery:', error);
                    }
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default VocabDictionary;
