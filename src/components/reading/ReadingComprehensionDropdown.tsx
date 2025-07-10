import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllReadingTopicsWithMixed } from '@/data/readingComprehensionTopics';
import { BookOpen } from 'lucide-react';

interface ReadingComprehensionDropdownProps {
  className?: string;
  placeholder?: string;
}

export const ReadingComprehensionDropdown: React.FC<ReadingComprehensionDropdownProps> = ({
  className = "",
  placeholder = "בחר נושא להבנת הנקרא"
}) => {
  const navigate = useNavigate();
  const topics = getAllReadingTopicsWithMixed();

  const handleTopicSelect = (topicIdStr: string) => {
    const topicId = parseInt(topicIdStr);
    const selectedTopic = topics.find(topic => topic.id === topicId);
    
    if (selectedTopic) {
      console.log('[ReadingComprehensionDropdown] Selected topic:', selectedTopic.nameHebrew);
      
      // Navigate to adaptive simulation with selected topic
      navigate('/adaptive-simulation', {
        state: {
          questionType: 'reading-comprehension',
          topicId: topicId,
          topicName: selectedTopic.nameHebrew,
          questionLimit: 20,
          difficulty: 'mixed',
          sessionType: 'practice'
        }
      });
    }
  };

  return (
    <div className={`min-w-[200px] ${className}`}>
      <Select onValueChange={handleTopicSelect}>
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {topics.map((topic) => (
            <SelectItem key={topic.id} value={topic.id.toString()}>
              <div className="flex items-center gap-2 text-right" dir="rtl">
                <topic.icon className="h-4 w-4" />
                <span>{topic.nameHebrew}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};