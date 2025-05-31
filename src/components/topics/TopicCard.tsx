
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Topic } from '@/data/types/topicTypes';
import { useAuth } from '@/context/AuthContext';
import { checkTopicAccess } from '@/utils/topicAccess';

interface TopicCardProps {
  topic: Topic;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  const navigate = useNavigate();
  const { currentUser, isPremium, isAdmin } = useAuth();
  
  const isTopicAvailable = checkTopicAccess(topic.id, isPremium, isAdmin);
  
  const handleStartPractice = () => {
    if (isTopicAvailable) {
      navigate(`/topics/${topic.id}/intro`);
    } else {
      navigate('/premium');
    }
  };
  
  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'advanced': return 'מתקדם';
      case 'intermediate': return 'בינוני';
      case 'beginner': return 'בסיסי';
      default: return 'בסיסי';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-t-electric-blue hover:shadow-lg transition-all">
      <h3 className="text-lg font-semibold mb-3 text-right">
        {topic.title}
      </h3>
      
      {topic.description && (
        <p className="text-sm text-electric-slate mb-4 text-right">
          {topic.description}
        </p>
      )}
      
      <div className="flex justify-between text-xs text-electric-slate mb-4">
        <span className="text-sm">{topic.targetCount || '+50'} שאלות</span>
        <span className="text-sm">קושי: {getDifficultyText(topic.difficulty)}</span>
      </div>
      
      <Button 
        className="w-full" 
        variant={isTopicAvailable ? "default" : "secondary"}
        onClick={handleStartPractice}
      >
        {isTopicAvailable ? 'התחל תרגול' : 'דרוש חשבון פרימיום'}
      </Button>
    </div>
  );
};

export default TopicCard;
