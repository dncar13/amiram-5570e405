
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BookOpen, ArrowRight, Clock, Target } from 'lucide-react';
import { getAvailableStories } from '@/services/storyQuestionsService';
import { Badge } from '@/components/ui/badge';

const ReadingComprehensionTopics: React.FC = () => {
  const navigate = useNavigate();
  const stories = getAvailableStories();

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

  const handleStorySelect = (storyId: string) => {
    navigate(`/simulation/story/${storyId}`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/simulations-entry')}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              חזור לדף הכניסה
            </button>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-8 mb-8">
              <div className="flex items-center mb-4">
                <div className="bg-white bg-opacity-20 rounded-full p-3 ml-4">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">הבנת הנקרא</h1>
                  <p className="text-white text-opacity-90 text-lg">
                    בחר סיפור ותתחיל סימולציה של שאלות הבנת הנקרא
                  </p>
                </div>
              </div>
              <div className="flex items-center text-white text-opacity-90">
                <Target className="w-5 h-5 ml-2" />
                <span>{stories.length} סיפורים זמינים</span>
              </div>
            </div>
          </motion.div>

          {/* Stories Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => handleStorySelect(story.id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-purple-100 rounded-full p-3">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <Badge className={getDifficultyColor(story.difficulty)}>
                      {getDifficultyText(story.difficulty)}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {story.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {story.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 ml-1" />
                      <span>{story.questionCount} שאלות</span>
                    </div>
                    
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center">
                      התחל
                      <ArrowRight className="w-4 h-4 mr-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {stories.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-12"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  אין סיפורים זמינים
                </h3>
                <p className="text-gray-600">
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
