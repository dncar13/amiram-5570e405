/**
 * Progress Tracking Test Component
 * Tests end-to-end progress tracking functionality
 */
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, Database, Users, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ProgressService } from '@/services/progressService';
import { MigrationService } from '@/services/migrationService';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  duration?: number;
}

const ProgressTrackingTest: React.FC = () => {
  const { currentUser } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [migrationStats, setMigrationStats] = useState<any>(null);

  const updateTestResult = (index: number, result: Partial<TestResult>) => {
    setTestResults(prev => prev.map((test, i) => 
      i === index ? { ...test, ...result } : test
    ));
  };

  const initialTests: TestResult[] = [
    {
      name: 'Database Connection',
      status: 'pending',
      message: 'Testing Supabase connection...'
    },
    {
      name: 'User Authentication',
      status: 'pending',
      message: 'Verifying user authentication...'
    },
    {
      name: 'Profile Creation',
      status: 'pending',
      message: 'Testing profile creation...'
    },
    {
      name: 'Progress Saving',
      status: 'pending',
      message: 'Testing progress saving to database...'
    },
    {
      name: 'Progress Retrieval',
      status: 'pending',
      message: 'Testing progress retrieval from database...'
    },
    {
      name: 'Session Tracking',
      status: 'pending',
      message: 'Testing simulation session tracking...'
    },
    {
      name: 'Data Migration',
      status: 'pending',
      message: 'Testing localStorage to Supabase migration...'
    }
  ];

  const runTests = async () => {
    if (!currentUser) {
      alert('Please log in to run tests');
      return;
    }

    setIsRunning(true);
    setTestResults([...initialTests]);
    const startTime = Date.now();

    try {
      // Test 1: Database Connection
      updateTestResult(0, { status: 'running', message: 'Testing database connection...' });
      const testStart = Date.now();
      
      try {
        const { data, error } = await supabase.from('profiles').select('id').limit(1);
        if (error) throw error;
        
        updateTestResult(0, { 
          status: 'success', 
          message: 'Database connection successful',
          duration: Date.now() - testStart
        });
      } catch (error) {
        updateTestResult(0, { 
          status: 'error', 
          message: `Database connection failed: ${(error as Error).message}`,
          duration: Date.now() - testStart
        });
      }

      // Test 2: User Authentication
      updateTestResult(1, { status: 'running', message: 'Verifying user authentication...' });
      const authStart = Date.now();
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (!user) throw new Error('User not authenticated');
        
        updateTestResult(1, { 
          status: 'success', 
          message: `User authenticated: ${user.email}`,
          duration: Date.now() - authStart
        });
      } catch (error) {
        updateTestResult(1, { 
          status: 'error', 
          message: `Authentication failed: ${(error as Error).message}`,
          duration: Date.now() - authStart
        });
      }

      // Test 3: Profile Creation
      updateTestResult(2, { status: 'running', message: 'Testing profile creation...' });
      const profileStart = Date.now();
      
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', currentUser.id);
        
        if (error) throw error;
        
        if (profiles && profiles.length > 0) {
          updateTestResult(2, { 
            status: 'success', 
            message: `Profile exists: ${profiles[0].display_name || profiles[0].email}`,
            duration: Date.now() - profileStart
          });
        } else {
          updateTestResult(2, { 
            status: 'error', 
            message: 'No profile found - profile creation may have failed',
            duration: Date.now() - profileStart
          });
        }
      } catch (error) {
        updateTestResult(2, { 
          status: 'error', 
          message: `Profile check failed: ${(error as Error).message}`,
          duration: Date.now() - profileStart
        });
      }

      // Test 4: Progress Saving
      updateTestResult(3, { status: 'running', message: 'Testing progress saving...' });
      const progressStart = Date.now();
      
      try {
        const testProgress = {
          user_id: currentUser.id,
          question_id: 'test-question-' + Date.now(),
          answered_correctly: true,
          answered_at: new Date().toISOString(),
          time_spent: 30
        };
        
        const result = await ProgressService.saveUserProgress(testProgress);
        if (!result.success) throw new Error(result.error);
        
        updateTestResult(3, { 
          status: 'success', 
          message: 'Progress saved successfully',
          duration: Date.now() - progressStart
        });
      } catch (error) {
        updateTestResult(3, { 
          status: 'error', 
          message: `Progress saving failed: ${(error as Error).message}`,
          duration: Date.now() - progressStart
        });
      }

      // Test 5: Progress Retrieval
      updateTestResult(4, { status: 'running', message: 'Testing progress retrieval...' });
      const retrievalStart = Date.now();
      
      try {
        const stats = await ProgressService.getUserProgressStats(currentUser.id);
        if (!stats) throw new Error('Failed to retrieve progress stats');
        
        updateTestResult(4, { 
          status: 'success', 
          message: `Retrieved ${stats.total_questions_answered} answered questions`,
          duration: Date.now() - retrievalStart
        });
      } catch (error) {
        updateTestResult(4, { 
          status: 'error', 
          message: `Progress retrieval failed: ${(error as Error).message}`,
          duration: Date.now() - retrievalStart
        });
      }

      // Test 6: Session Tracking
      updateTestResult(5, { status: 'running', message: 'Testing session tracking...' });
      const sessionStart = Date.now();
      
      try {
        const testSession = {
          user_id: currentUser.id,
          session_type: 'practice' as const,
          questions_answered: 5,
          correct_answers: 4,
          total_questions: 5,
          time_spent: 120,
          metadata: { test: true }
        };
        
        const result = await ProgressService.saveSimulationSession(testSession);
        if (!result.success) throw new Error(result.error);
        
        updateTestResult(5, { 
          status: 'success', 
          message: 'Session tracking successful',
          duration: Date.now() - sessionStart
        });
      } catch (error) {
        updateTestResult(5, { 
          status: 'error', 
          message: `Session tracking failed: ${(error as Error).message}`,
          duration: Date.now() - sessionStart
        });
      }

      // Test 7: Data Migration
      updateTestResult(6, { status: 'running', message: 'Testing data migration...' });
      const migrationStart = Date.now();
      
      try {
        const stats = await MigrationService.getMigrationStats();
        if (stats) {
          setMigrationStats(stats);
          updateTestResult(6, { 
            status: 'success', 
            message: `Migration stats: ${stats.totalLocalRecords} local, ${stats.totalSupabaseRecords} database`,
            duration: Date.now() - migrationStart
          });
        } else {
          updateTestResult(6, { 
            status: 'error', 
            message: 'Failed to get migration stats',
            duration: Date.now() - migrationStart
          });
        }
      } catch (error) {
        updateTestResult(6, { 
          status: 'error', 
          message: `Migration test failed: ${(error as Error).message}`,
          duration: Date.now() - migrationStart
        });
      }

    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const runMigration = async () => {
    if (!currentUser) {
      alert('Please log in to run migration');
      return;
    }

    try {
      const result = await MigrationService.migrateUserData();
      if (result.success) {
        alert(`Migration completed successfully! ${result.migratedRecords} records migrated.`);
      } else {
        alert(`Migration failed: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      alert(`Migration error: ${(error as Error).message}`);
    }
  };

  if (!currentUser) {
    return (
      <Alert>
        <Users className="h-4 w-4" />
        <AlertDescription>
          Please log in to test progress tracking functionality.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Progress Tracking Test Suite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                {isRunning ? 'Running Tests...' : 'Run Tests'}
              </Button>
              
              <Button 
                onClick={runMigration}
                variant="outline"
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                Run Migration
              </Button>
            </div>

            {testResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Test Results:</h3>
                {testResults.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <span className="font-medium">{test.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{test.message}</span>
                      {test.duration && (
                        <Badge variant="outline" className="text-xs">
                          {test.duration}ms
                        </Badge>
                      )}
                      <Badge className={`text-xs ${getStatusColor(test.status)}`}>
                        {test.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {migrationStats && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Migration Statistics:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Local Records: {migrationStats.totalLocalRecords}</div>
                  <div>Database Records: {migrationStats.totalSupabaseRecords}</div>
                  <div>Duplicates: {migrationStats.duplicateRecords}</div>
                  <div>New Records: {migrationStats.newRecords}</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTrackingTest;