import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WordCard from '@/components/vocab/WordCard';
import vocabData from '@/data/vocab-static.json';

const VocabDictionary: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState(searchParams.get('level') || 'all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredWords = useMemo(() => {
    return vocabData.words.filter(word => {
      const matchesSearch = searchTerm === '' || 
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.translation.includes(searchTerm);
      
      const matchesLevel = levelFilter === 'all' || word.level === levelFilter;
      const matchesCategory = categoryFilter === 'all' || word.category === categoryFilter;
      
      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [searchTerm, levelFilter, categoryFilter]);

  const levelCounts = useMemo(() => {
    const counts = { easy: 0, medium: 0, hard: 0 };
    vocabData.words.forEach(word => {
      counts[word.level as keyof typeof counts]++;
    });
    return counts;
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(vocabData.words.map(word => word.category))];
    return uniqueCategories.sort();
  }, []);

  const handleLevelChange = (level: string) => {
    setLevelFilter(level);
    if (level === 'all') {
      searchParams.delete('level');
    } else {
      searchParams.set('level', level);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/vocab" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-5 h-5" />
          חזרה לאוצר מילים
        </Link>
        <h1 className="text-3xl font-bold text-slate-800">מילון</h1>
        <div className="w-32"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{vocabData.words.length}</div>
          <div className="text-slate-600">סה"כ מילים</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{levelCounts.easy}</div>
          <div className="text-slate-600">מילים קלות</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">{levelCounts.medium}</div>
          <div className="text-slate-600">מילים בינוניות</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">{levelCounts.hard}</div>
          <div className="text-slate-600">מילים קשות</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-semibold">סינון וחיפוש</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="חפש מילה..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Level Filter */}
          <Select value={levelFilter} onValueChange={handleLevelChange}>
            <SelectTrigger>
              <SelectValue placeholder="רמת קושי" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הרמות</SelectItem>
              <SelectItem value="easy">קל</SelectItem>
              <SelectItem value="medium">בינוני</SelectItem>
              <SelectItem value="hard">קשה</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="סוג מילה" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הסוגים</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={levelFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleLevelChange('all')}
          >
            הכל ({vocabData.words.length})
          </Button>
          <Button
            variant={levelFilter === 'easy' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleLevelChange('easy')}
          >
            קל ({levelCounts.easy})
          </Button>
          <Button
            variant={levelFilter === 'medium' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleLevelChange('medium')}
          >
            בינוני ({levelCounts.medium})
          </Button>
          <Button
            variant={levelFilter === 'hard' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleLevelChange('hard')}
          >
            קשה ({levelCounts.hard})
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            תוצאות ({filteredWords.length} מילים)
          </h3>
          {(searchTerm || levelFilter !== 'all' || categoryFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setLevelFilter('all');
                setCategoryFilter('all');
                setSearchParams({});
              }}
            >
              נקה סינונים
            </Button>
          )}
        </div>

        {filteredWords.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">לא נמצאו מילים התואמות לחיפוש</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWords.map(word => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabDictionary;
