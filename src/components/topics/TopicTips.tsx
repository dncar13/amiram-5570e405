
import { LightbulbIcon } from "lucide-react";
import { Subtopic } from "@/data/topicsData";

interface TopicTipsProps {
  tips: string[];
  subtopics?: Subtopic[] | string[];
}

export function TopicTips({ tips, subtopics }: TopicTipsProps) {
  return (
    <div className="mb-10">
      {tips.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-electric-navy">
            <LightbulbIcon className="h-5 w-5 text-electric-orange" />
            <span>טיפים לסימולציה</span>
          </h3>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="bg-electric-blue/10 text-electric-blue rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-electric-slate">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {subtopics && subtopics.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-electric-navy">
            <span className="h-5 w-5 text-electric-blue">#</span>
            <span>תת-נושאים בסימולציה זו</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subtopics.map((subtopic, index) => {
              // Handle both string array and Subtopic array
              if (typeof subtopic === 'string') {
                return (
                  <div key={index} className="bg-electric-gray/30 p-4 rounded-lg">
                    <h4 className="font-medium mb-1">{subtopic}</h4>
                    <p className="text-sm text-electric-slate mb-2">תת-נושא בסימולציה</p>
                  </div>
                );
              } else {
                return (
                  <div key={subtopic.id} className="bg-electric-gray/30 p-4 rounded-lg">
                    <h4 className="font-medium mb-1">{subtopic.name || subtopic.title}</h4>
                    <p className="text-sm text-electric-slate mb-2">{subtopic.description}</p>
                    <div className="text-xs text-electric-blue">
                      {subtopic.questionIds?.length || 0} שאלות
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}
