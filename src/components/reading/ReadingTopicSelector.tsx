import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { READING_COMPREHENSION_TOPICS, MIXED_TOPIC, ReadingTopic } from '@/data/readingComprehensionTopics';
import { ArrowRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadingTopicSelectorProps {
  onTopicSelect: (topicId: number) => void;
  topicCounts?: Record<number, number>; // Number of questions per topic
  userProgress?: Record<number, { completed: number; total: number }>; // User's progress per topic
}

export const ReadingTopicSelector: React.FC<ReadingTopicSelectorProps> = ({
  onTopicSelect,
  topicCounts = {},
  userProgress = {}
}) => {
  const allTopics = [MIXED_TOPIC, ...READING_COMPREHENSION_TOPICS];

  const handleTopicSelect = (topic: ReadingTopic) => {
    console.log('[ReadingTopicSelector] Selected topic:', topic.nameHebrew, 'ID:', topic.id);
    onTopicSelect(topic.id);
  };

  const getProgressPercentage = (topicId: number): number => {
    const progress = userProgress[topicId];
    if (!progress || progress.total === 0) return 0;
    return Math.round((progress.completed / progress.total) * 100);
  };

  const getQuestionCount = (topicId: number): number => {
    // For mixed topic, sum all topics
    if (topicId === 0) {
      return Object.entries(topicCounts)
        .filter(([id]) => id !== '0')
        .reduce((sum, [, count]) => sum + count, 0);
    }
    return topicCounts[topicId] || 0;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          בחר נושא לתרגול הבנת הנקרא
        </h2>
        <p className="text-gray-600">
          בחר נושא ספציפי לתרגול ממוקד או בחר "מעורב" לתרגול מגוון
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allTopics.map((topic) => {
          const questionCount = getQuestionCount(topic.id);
          const progressPercentage = getProgressPercentage(topic.id);
          const Icon = topic.icon;

          return (
            <Card
              key={topic.id}
              className={cn(
                "relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer",
                "hover:scale-[1.02] hover:border-blue-300",
                topic.id === 0 && "md:col-span-2 lg:col-span-3"
              )}
              onClick={() => handleTopicSelect(topic)}
            >
              {/* Progress bar background */}
              {progressPercentage > 0 && (
                <div
                  className="absolute top-0 left-0 h-1 bg-green-500 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              )}

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-3 rounded-lg",
                      topic.color.split(' ')[0] // Extract background color class
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-1">{topic.nameHebrew}</CardTitle>
                      <CardDescription className="text-sm">
                        {topic.descriptionHebrew}
                      </CardDescription>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 mt-1" />
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {questionCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {questionCount} שאלות
                      </Badge>
                    )}
                    {progressPercentage > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {progressPercentage}% הושלם
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTopicSelect(topic);
                    }}
                  >
                    התחל תרגול
                    <ArrowRight className="h-4 w-4 ms-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          💡 טיפ: התחל עם נושא שמעניין אותך כדי לשפר את הריכוז והמוטיבציה
        </p>
      </div>
    </div>
  );
};