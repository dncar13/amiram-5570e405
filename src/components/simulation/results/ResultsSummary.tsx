import React from 'react';

interface ResultsSummaryProps {
  score: number;
  answeredQuestionsCount: number;
  correctQuestionsCount: number;
  totalQuestions: number;
}

const ResultsSummary = ({
  score,
  answeredQuestionsCount,
  correctQuestionsCount,
  totalQuestions
}: ResultsSummaryProps) => {
  return (
    <div className="bg-card rounded-xl p-6 border">
      <h2 className="text-2xl font-bold text-foreground mb-4">Results Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{score}%</div>
          <div className="text-sm text-muted-foreground">Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{correctQuestionsCount}</div>
          <div className="text-sm text-muted-foreground">Correct</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{answeredQuestionsCount}</div>
          <div className="text-sm text-muted-foreground">Answered</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{totalQuestions}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;