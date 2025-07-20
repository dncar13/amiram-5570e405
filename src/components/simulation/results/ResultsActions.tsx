import React from 'react';
import { Button } from '@/components/ui/button';

interface ResultsActionsProps {
  onRestart: () => void;
  onBackToTopics: () => string;
  isQuestionSet?: boolean;
}

const ResultsActions = ({
  onRestart,
  onBackToTopics,
  isQuestionSet
}: ResultsActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button onClick={onRestart} variant="default">
        Restart Simulation
      </Button>
      <Button onClick={() => window.location.href = onBackToTopics()} variant="outline">
        Back to Topics
      </Button>
    </div>
  );
};

export default ResultsActions;