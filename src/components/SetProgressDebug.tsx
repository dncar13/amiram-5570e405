/**
 * Set Progress Debug Component
 * Enhanced debug tool for monitoring set progress tracking
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TestResult {
  name: string;
  status: 'running' | 'passed' | 'failed';
  message?: string;
  timestamp?: string;
}

interface Session {
  id: string;
  user_id: string;
  session_type: string;
  difficulty: string;
  status: string;
  current_question_index: number;
  correct_answers: number;
  questions_answered: number;
  total_questions: number;
  score: number;
  created_at: string;
  updated_at: string;
  metadata: any;
}

interface DebugViewItem {
  id: string;
  user_id: string;
  user_email: string;
  created_at: string;
  updated_at: string;
  session_type: string;
  difficulty: string;
  status: string;
  current_question_index: number;
  score: number;
  is_set_based: string;
  set_id: string;
  set_type: string;
  set_difficulty: string;
  set_number: string;
  questions_in_set: string;
  total_questions: number;
  answered_questions: number;
  full_metadata: any;
  update_status: string;
}

interface ProgressSummary {
  set_type: string;
  set_difficulty: string;
  total_sets: number;
  completed_sets: number;
  in_progress_sets: number;
  average_score: number;
}

export default function SetProgressDebug() {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [debugView, setDebugView] = useState<DebugViewItem[]>([]);
  const [summary, setSummary] = useState<ProgressSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('sessions');
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  // Load all data
  const loadData = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // 1. Load sessions
      const { data: sessionsData, error: error1 } = await supabase
        .from('simulation_sessions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error1) {
        console.error('Sessions error:', error1);
      } else {
        setSessions(sessionsData || []);
      }

      // 2. Load debug view
      const { data: debugData, error: error2 } = await supabase
        .from('set_progress_debug')
        .select('*')
        .eq('user_id', currentUser.id);

      if (error2) {
        console.error('Debug view error:', error2);
      } else {
        setDebugView(debugData || []);
      }

      // 3. Load summary
      const { data: summaryData, error: error3 } = await supabase
        .rpc('get_user_set_progress_summary', { p_user_id: currentUser.id });

      if (error3) {
        console.error('Summary error:', error3);
      } else {
        setSummary(summaryData || []);
      }

    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test 1: Create session
  const testCreateSession = async () => {
    const test: TestResult = { name: 'Create Session', status: 'running' };
    setTestResults(prev => [...prev, test]);

    try {
      const testData = {
        user_id: currentUser!.id,
        session_type: 'practice',
        difficulty: 'easy',
        status: 'in_progress',
        current_question_index: 0,
        correct_answers: 0,
        questions_answered: 0,
        total_questions: 10,
        score: 0,
        metadata: {
          is_set_based: 'true',
          set_id: '99',
          set_type: 'sentence-completion',
          set_difficulty: 'easy',
          set_number: '99',
          questions_in_set: '10'
        }
      };

      console.log('Creating test session:', testData);

      const { data, error } = await supabase
        .from('simulation_sessions')
        .insert([testData])
        .select()
        .single();

      if (error) {
        updateTestResult('Create Session', 'failed', error.message);
      } else {
        updateTestResult('Create Session', 'passed', `Session created with ID: ${data.id}`);
        await loadData();
      }
    } catch (err: any) {
      updateTestResult('Create Session', 'failed', err.message);
    }
  };

  // Test 2: Update session
  const testUpdateSession = async () => {
    const test: TestResult = { name: 'Update Session', status: 'running' };
    setTestResults(prev => [...prev, test]);

    try {
      // Find session to update
      const latestSession = sessions.find(s => 
        s.metadata?.is_set_based === 'true' && 
        s.status === 'in_progress'
      );

      if (!latestSession) {
        updateTestResult('Update Session', 'failed', 'No in_progress session found');
        return;
      }

      const { data, error } = await supabase
        .from('simulation_sessions')
        .update({
          current_question_index: 5,
          score: 50,
          questions_answered: 5,
          correct_answers: 4
        })
        .eq('id', latestSession.id)
        .select()
        .single();

      if (error) {
        updateTestResult('Update Session', 'failed', error.message);
      } else {
        updateTestResult('Update Session', 'passed', 'Session updated successfully');
        await loadData();
      }
    } catch (err: any) {
      updateTestResult('Update Session', 'failed', err.message);
    }
  };

  // Test 3: Metadata validation
  const testMetadataValidation = async () => {
    const test: TestResult = { name: 'Metadata Validation', status: 'running' };
    setTestResults(prev => [...prev, test]);

    try {
      // Try to create session with invalid metadata
      const invalidData = {
        user_id: currentUser!.id,
        session_type: 'practice',
        metadata: {
          is_set_based: 'true',
          // Missing required fields
        }
      };

      const { error } = await supabase
        .from('simulation_sessions')
        .insert([invalidData]);

      if (error) {
        updateTestResult('Metadata Validation', 'passed', 'Invalid metadata rejected correctly');
      } else {
        updateTestResult('Metadata Validation', 'failed', 'Invalid metadata was accepted');
      }
    } catch (err: any) {
      updateTestResult('Metadata Validation', 'passed', 'Validation working: ' + err.message);
    }
  };

  // Test 4: RLS policies
  const testRLSPolicies = async () => {
    const test: TestResult = { name: 'RLS Policies', status: 'running' };
    setTestResults(prev => [...prev, test]);

    try {
      // Try to read sessions of another user (should fail)
      const { data, error } = await supabase
        .from('simulation_sessions')
        .select('*')
        .neq('user_id', currentUser!.id)
        .limit(1);

      if (data && data.length > 0) {
        updateTestResult('RLS Policies', 'failed', 'Can see other users data!');
      } else {
        updateTestResult('RLS Policies', 'passed', 'RLS working correctly');
      }
    } catch (err: any) {
      updateTestResult('RLS Policies', 'passed', 'RLS working: ' + err.message);
    }
  };

  // Update test result
  const updateTestResult = (testName: string, status: 'passed' | 'failed', message: string) => {
    setTestResults(prev => prev.map(test => 
      test.name === testName 
        ? { ...test, status, message, timestamp: new Date().toISOString() }
        : test
    ));
  };

  // Run all tests
  const runAllTests = async () => {
    setTestResults([]);
    await testCreateSession();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testUpdateSession();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testMetadataValidation();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testRLSPolicies();
  };

  // Clean test data
  const cleanTestData = async () => {
    try {
      const { error } = await supabase
        .from('simulation_sessions')
        .delete()
        .eq('user_id', currentUser!.id)
        .eq('metadata->>set_id', '99');

      if (error) {
        alert('Error cleaning test data: ' + error.message);
      } else {
        alert('Test data cleaned successfully');
        await loadData();
      }
    } catch (err: any) {
      alert('Clean failed: ' + err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Debug Mode - Login Required</CardTitle>
            <CardDescription>Please login to access the debug dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/login'}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Set Progress Debug Dashboard</h1>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            Back to App
          </Button>
        </div>

        {/* User Info */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400">User ID:</span> {currentUser.id}
              </div>
              <div>
                <span className="text-gray-400">Email:</span> {currentUser.email}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Button
            onClick={loadData}
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </Button>
          
          <Button
            onClick={runAllTests}
            className="bg-green-600 hover:bg-green-700"
          >
            Run All Tests
          </Button>

          <Button
            onClick={cleanTestData}
            variant="destructive"
          >
            Clean Test Data
          </Button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {testResults.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <span className="text-white">{test.name}</span>
                    <div className="flex items-center gap-4">
                      {test.message && (
                        <span className="text-sm text-gray-400">{test.message}</span>
                      )}
                      <Badge 
                        variant={
                          test.status === 'passed' ? 'default' :
                          test.status === 'failed' ? 'destructive' :
                          'secondary'
                        }
                      >
                        {test.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                <TabsTrigger value="sessions">All Sessions</TabsTrigger>
                <TabsTrigger value="debug_view">Debug View</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="sessions" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">All Sessions ({sessions.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-2 text-gray-300">ID</th>
                        <th className="text-left p-2 text-gray-300">Type</th>
                        <th className="text-left p-2 text-gray-300">Status</th>
                        <th className="text-left p-2 text-gray-300">Score</th>
                        <th className="text-left p-2 text-gray-300">Created</th>
                        <th className="text-left p-2 text-gray-300">Updated</th>
                        <th className="text-left p-2 text-gray-300">Metadata</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map(session => (
                        <tr key={session.id} className="border-b border-gray-700">
                          <td className="p-2 text-gray-300">{session.id.slice(0, 8)}...</td>
                          <td className="p-2 text-gray-300">{session.session_type}</td>
                          <td className="p-2">
                            <Badge variant={
                              session.status === 'completed' ? 'default' :
                              session.status === 'in_progress' ? 'secondary' :
                              'outline'
                            }>
                              {session.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-gray-300">{session.score || 0}</td>
                          <td className="p-2 text-gray-300">{new Date(session.created_at).toLocaleString()}</td>
                          <td className="p-2 text-gray-300">{session.updated_at ? new Date(session.updated_at).toLocaleString() : 'Never'}</td>
                          <td className="p-2">
                            <details>
                              <summary className="cursor-pointer text-blue-400">View</summary>
                              <pre className="text-xs mt-2 overflow-auto max-w-md bg-gray-900 p-2 rounded text-gray-300">
                                {JSON.stringify(session.metadata, null, 2)}
                              </pre>
                            </details>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="debug_view" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Debug View - Set Sessions ({debugView.length})</h3>
                </div>
                <div className="space-y-4">
                  {debugView.map(item => (
                    <div key={item.id} className="bg-gray-700 p-4 rounded">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div className="text-gray-300">
                          <strong>Set:</strong> {item.set_type} - {item.set_difficulty} - Set {item.set_id}
                        </div>
                        <div className="text-gray-300">
                          <strong>Status:</strong> {item.status}
                        </div>
                        <div className="text-gray-300">
                          <strong>Score:</strong> {item.score}/{parseInt(item.questions_in_set || '10') * 10}
                        </div>
                        <div className="text-gray-300">
                          <strong>Progress:</strong> {item.answered_questions}/{item.total_questions}
                        </div>
                        <div className="text-gray-300">
                          <strong>Update Status:</strong> {item.update_status}
                        </div>
                        <div className="text-gray-300">
                          <strong>Created:</strong> {new Date(item.created_at).toLocaleString()}
                        </div>
                        <div className="text-gray-300">
                          <strong>Updated:</strong> {item.updated_at ? new Date(item.updated_at).toLocaleString() : 'Never'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="summary" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Progress Summary</h3>
                </div>
                {summary && summary.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {summary.map((item, index) => (
                      <div key={index} className="bg-gray-700 p-4 rounded">
                        <h4 className="font-semibold mb-2 text-white">
                          {item.set_type} - {item.set_difficulty}
                        </h4>
                        <div className="space-y-1 text-sm text-gray-300">
                          <div>Total Sets: {item.total_sets}</div>
                          <div>Completed: {item.completed_sets}</div>
                          <div>In Progress: {item.in_progress_sets}</div>
                          <div>Average Score: {item.average_score ? Math.round(item.average_score) : 'N/A'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No summary data available</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}