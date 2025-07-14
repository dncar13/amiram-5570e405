import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ProgressService } from '@/services/progressService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProgressTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, session } = useAuth();

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testProgressSaving = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      // Check auth context first
      addLog(`📊 Auth context - User: ${currentUser?.email || 'null'}, Session: ${session ? 'exists' : 'null'}`);
      
      // Get current user from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        addLog('❌ No user authenticated in Supabase');
        addLog('💡 Please log in through the authentication system first');
        return;
      }
      
      addLog(`👤 Testing with user: ${user.email}`);
      
      // Check if questions exist
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('id, question_text, type, difficulty')
        .limit(3);
      
      if (questionsError) {
        addLog(`❌ Error fetching questions: ${questionsError.message}`);
        return;
      }
      
      if (!questions || questions.length === 0) {
        addLog('❌ No questions found in database');
        return;
      }
      
      addLog(`✅ Found ${questions.length} questions in database`);
      
      // Test saving progress for each question
      for (const question of questions) {
        addLog(`🎯 Testing progress save for question: ${question.id}`);
        
        const progressData = {
          user_id: user.id,
          question_id: question.id,
          answered_correctly: Math.random() > 0.5,
          answered_at: new Date().toISOString(),
          time_spent: Math.floor(Math.random() * 120) + 30 // 30-150 seconds
        };
        
        const result = await ProgressService.saveUserProgress(progressData);
        
        if (result.success) {
          addLog(`✅ Progress saved successfully for question: ${question.id}`);
        } else {
          addLog(`❌ Failed to save progress for question: ${question.id} - ${result.error}`);
        }
      }
      
      // Test retrieving progress
      addLog('📊 Testing progress retrieval...');
      const stats = await ProgressService.getUserProgressStats(user.id);
      
      if (stats) {
        addLog(`✅ Retrieved stats - Total questions: ${stats.total_questions_answered}, Correct: ${stats.total_correct_answers}`);
      } else {
        addLog('❌ Failed to retrieve stats');
      }
      
    } catch (error) {
      addLog(`❌ Test error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Progress System Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Button 
              onClick={testProgressSaving}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Testing...' : 'Test Progress Saving'}
            </Button>
            {!currentUser && (
              <Button 
                onClick={() => window.location.href = '/login'}
                variant="outline"
                className="flex-1"
              >
                Login First
              </Button>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            Current user: {currentUser?.email || 'Not logged in'}
          </div>
          
          {testResults.length > 0 && (
            <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
              <h3 className="font-semibold mb-2">Test Results:</h3>
              <div className="space-y-1">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTest;