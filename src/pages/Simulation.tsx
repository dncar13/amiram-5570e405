
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSimulation } from '@/hooks/useSimulation';
import { useSimulationData } from '@/hooks/useSimulationData';
import { BackButton } from '@/components/simulation/BackButton';
import SimulationContent from '@/components/simulation/SimulationContent';
import { SimulationLoading } from '@/components/simulation/SimulationLoading';
import { EmptySimulation } from '@/components/simulation/EmptySimulation';
import { toast } from '@/hooks/use-toast';

const Simulation: React.FC = () => {
  const { topicId, setId, level, type, storyId } = useParams<{ 
    topicId?: string; 
    setId?: string; 
    level?: string;
    type?: string;
    storyId?: string;
  }>();
  
  const location = useLocation();
  const [storyQuestions, setStoryQuestions] = useState<any[]>([]);
  
  // Determine if this is a question set vs topic simulation
  const isQuestionSet = Boolean(setId);
  const isContinue = new URLSearchParams(location.search).get('continue') === 'true';
  
  // Extract question type from URL path - handle different route patterns
  let questionType = type;
  if (!questionType && location.pathname.includes('/simulation/type/')) {
    questionType = location.pathname.split('/simulation/type/')[1]?.split('/')[0];
  }
  
  console.log('Simulation component mounted or parameters changed', { 
    topicId, setId, level, type, storyId, isContinue 
  });
  
  console.log('Simulation opened with STORY - topicId:', topicId, ', setId:', setId, ', level:', level, ', type:', type, ', storyId:', storyId, ', continue:', isContinue);

  // Use simulation data hook with question type support
  const {
    topic,
    topicQuestions,
    questionSetTitle,
    isLoading: dataLoading,
    isComprehensiveExam,
    setIdNumber,
    getCurrentPart,
    questionCount,
    error: dataError
  } = useSimulationData(topicId, setId, isQuestionSet, storyQuestions, questionType);

  // Use main simulation hook - pass the questions from data hook
  const {
    currentQuestionIndex,
    currentQuestion,
    selectedAnswerIndex,
    isAnswerSubmitted,
    showExplanation,
    simulationComplete,
    score,
    userAnswers,
    questionFlags,
    answeredQuestionsCount,
    correctQuestionsCount,
    progressPercentage,
    currentScorePercentage,
    remainingTime,
    isTimerActive,
    examMode,
    showAnswersImmediately,
    progressLoaded,
    handleAnswerSelect,
    handleSubmitAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    handleToggleExplanation,
    toggleQuestionFlag,
    navigateToQuestion,
    handleRestartSimulation,
    handleBackToTopics,
    resetProgress
  } = useSimulation(simulationId, isQuestionSet, topicQuestions);

  // Create simulationId based on the type of simulation
  const simulationId = questionType ? `type_${questionType}` : (setId ? `qs_${setId}` : topicId);

  const isLoading = dataLoading || !progressLoaded;

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container mx-auto px-4 py-8">
            <BackButton isQuestionSet={isQuestionSet} />
            <SimulationLoading />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Show error state
  if (dataError) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container mx-auto px-4 py-8">
            <BackButton isQuestionSet={isQuestionSet} />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">שגיאה</h2>
              <p className="text-gray-700 mb-4">{dataError}</p>
              <button
                onClick={() => window.location.href = isQuestionSet ? "/questions-sets" : "/simulations-entry"}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                חזור לדף הבחירה
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Show empty state
  if (!topicQuestions || topicQuestions.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container mx-auto px-4 py-8">
            <BackButton isQuestionSet={isQuestionSet} />
            <EmptySimulation isQuestionSet={isQuestionSet} />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      >
        <div className="container mx-auto px-4 py-8">
          <BackButton isQuestionSet={isQuestionSet} />
          
          <SimulationContent
            simulationComplete={simulationComplete}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={topicQuestions.length}
            remainingTime={remainingTime}
            isTimerActive={isTimerActive}
            currentQuestion={currentQuestion}
            selectedAnswerIndex={selectedAnswerIndex}
            isAnswerSubmitted={isAnswerSubmitted}
            showExplanation={showExplanation}
            score={score}
            questionsData={topicQuestions}
            userAnswers={userAnswers}
            questionFlags={questionFlags}
            answeredQuestionsCount={answeredQuestionsCount}
            correctQuestionsCount={correctQuestionsCount}
            progressPercentage={progressPercentage}
            currentScorePercentage={currentScorePercentage}
            examMode={examMode}
            showAnswersImmediately={showAnswersImmediately}
            isQuestionSet={isQuestionSet}
            setNumber={setIdNumber}
            onAnswerSelect={handleAnswerSelect}
            onSubmitAnswer={handleSubmitAnswer}
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
            onToggleExplanation={handleToggleExplanation}
            onToggleQuestionFlag={toggleQuestionFlag}
            onNavigateToQuestion={navigateToQuestion}
            onRestart={handleRestartSimulation}
            onBackToTopics={handleBackToTopics}
            onResetProgress={resetProgress}
          />
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default Simulation;
