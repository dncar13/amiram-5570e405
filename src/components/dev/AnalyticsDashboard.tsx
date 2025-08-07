// Development Analytics Dashboard
// Only shown in development mode for testing analytics implementation

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  testGTMIntegration, 
  testAnalyticsService, 
  testEventTypes,
  generateAnalyticsHealthReport,
  enableAnalyticsDebugMode,
  disableAnalyticsDebugMode,
  AnalyticsTestResults
} from '@/utils/analyticsTestUtils';
import { Activity, Bug, CheckCircle, AlertCircle, XCircle, BarChart3 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface DataLayerEvent {
  timestamp: number;
  event: string;
  data: unknown;
}

export const AnalyticsDashboard: React.FC = () => {
  const { isAdmin, isDevEnvironment } = useAuth();
  const [events, setEvents] = useState<DataLayerEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [healthReport, setHealthReport] = useState<string>('');
  const [gtmTest, setGtmTest] = useState<AnalyticsTestResults | null>(null);
  const [eventTests, setEventTests] = useState<Record<string, boolean>>({});
  const [debugModeEnabled, setDebugModeEnabled] = useState(false);

  // PRODUCTION SAFETY: Only show in strict development environments
  // Completely disabled in production to prevent any accidental exposure
  useEffect(() => {
    const debugMode = localStorage.getItem('amiram_analytics_debug') === 'true';
    setDebugModeEnabled(debugMode);
  }, []);

  // STRICT production safety check - only show in actual development environments
  const isStrictDevelopment = import.meta.env.DEV && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname.includes('lovableproject.com'));

  const shouldShowDashboard = isStrictDevelopment && (isAdmin || debugModeEnabled);

  useEffect(() => {
    // Run initial tests
    runTests();
  }, []);

  const runTests = async () => {
    console.log('🧪 Running analytics tests...');
    const gtmResults = testGTMIntegration();
    console.log('✅ GTM test completed');
    
    const eventTestResults = await testEventTypes();
    console.log('✅ Event types test completed');
    
    const report = generateAnalyticsHealthReport();
    console.log('✅ Health report generated');
    
    setGtmTest(gtmResults);
    setEventTests(eventTestResults);
    setHealthReport(report);
  };

  const toggleMonitoring = () => {
    if (isMonitoring) {
      disableAnalyticsDebugMode();
      setIsMonitoring(false);
    } else {
      enableAnalyticsDebugMode();
      setIsMonitoring(true);
      
      // Monitor dataLayer events
      const originalPush = window.dataLayer?.push;
      if (originalPush) {
        window.dataLayer.push = function(...args: unknown[]) {
          args.forEach(event => {
            if (typeof event === 'object' && event && 'event' in event) {
              const eventData = event as { event: string; [key: string]: unknown };
              setEvents(prev => [...prev, {
                timestamp: Date.now(),
                event: eventData.event,
                data: eventData
              }].slice(-50)); // Keep only last 50 events
            }
          });
          return originalPush.apply(this, args);
        };
      }
    }
  };

  const clearEvents = () => {
    setEvents([]);
  };

  const toggleDebugMode = () => {
    const newDebugMode = !debugModeEnabled;
    if (newDebugMode) {
      localStorage.setItem('amiram_analytics_debug', 'true');
    } else {
      localStorage.removeItem('amiram_analytics_debug');
    }
    setDebugModeEnabled(newDebugMode);
  };

  const getVisibilityReason = () => {
    if (import.meta.env.DEV) return 'Development Environment';
    if (isDevEnvironment) return 'Dev Environment Flag';
    if (isAdmin) return 'Admin User';
    if (debugModeEnabled) return 'Debug Mode Enabled';
    return 'Unknown';
  };

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge variant={status ? "default" : "destructive"} className="ml-2">
        {status ? "PASS" : "FAIL"}
      </Badge>
    );
  };

  // Hide dashboard for regular users in production
  if (!shouldShowDashboard) {
    return <div style={{ display: 'none' }} />;
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[80vh] overflow-hidden">
      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          <h3 className="font-semibold">Analytics Dashboard</h3>
          <Badge variant="secondary" className="ml-auto text-xs">
            {getVisibilityReason()}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status" className="text-xs">Status</TabsTrigger>
          <TabsTrigger value="events" className="text-xs">Events</TabsTrigger>
          <TabsTrigger value="dedup" className="text-xs">Dedup</TabsTrigger>
          <TabsTrigger value="tests" className="text-xs">Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="p-4 space-y-4">
          {gtmTest && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  GTM Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>GTM Loaded</span>
                  {getStatusIcon(gtmTest.gtmLoaded)}
                </div>
                <div className="flex items-center justify-between">
                  <span>DataLayer Exists</span>
                  {getStatusIcon(gtmTest.dataLayerExists)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Events in Queue</span>
                  <Badge variant="outline">{gtmTest.eventCount}</Badge>
                </div>
                {gtmTest.errors.length > 0 && (
                  <div className="text-red-600 text-xs">
                    <strong>Errors:</strong> {gtmTest.errors.join(', ')}
                  </div>
                )}
                {gtmTest.warnings.length > 0 && (
                  <div className="text-orange-600 text-xs">
                    <strong>Warnings:</strong> {gtmTest.warnings.join(', ')}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button 
              size="sm" 
              onClick={toggleMonitoring}
              variant={isMonitoring ? "destructive" : "default"}
            >
              {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
            </Button>
            <Button size="sm" onClick={runTests} variant="outline">
              Refresh Tests
            </Button>
            {(isAdmin || import.meta.env.DEV) && (
              <Button 
                size="sm" 
                onClick={toggleDebugMode}
                variant={debugModeEnabled ? "destructive" : "secondary"}
                className="text-xs"
              >
                {debugModeEnabled ? "Disable Debug" : "Enable Debug"}
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="events" className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-sm">Recent Events ({events.length})</h4>
            <Button size="sm" onClick={clearEvents} variant="outline">
              Clear
            </Button>
          </div>
          
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {events.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-8">
                  {isMonitoring ? "Waiting for events..." : "Start monitoring to see events"}
                </div>
              ) : (
                events.map((event, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <code className="bg-blue-100 px-1 rounded">{event.event}</code>
                      <span className="text-gray-500">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <pre className="text-xs text-gray-600 overflow-x-auto">
                      {JSON.stringify(event.data, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="dedup" className="p-4">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  🛡️ Event Deduplication Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Page View Protection:</span>
                    <Badge variant="secondary" className="text-xs">Active (1s cooldown)</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Business Events Protection:</span>
                    <Badge variant="secondary" className="text-xs">Active (2s cooldown)</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>User ID Sync:</span>
                    <Badge variant="secondary" className="text-xs">Once per session</Badge>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-3">
                  <p><strong>Protected Events:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>page_view - Manual tracking disabled, GTM only</li>
                    <li>premium_view - 2s cooldown per plan type</li>
                    <li>begin_checkout - 2s cooldown per transaction</li>
                    <li>user_id_set - Once per session maximum</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tests" className="p-4">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Event Type Tests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {Object.entries(eventTests).map(([testName, passed]) => (
                  <div key={testName} className="flex items-center justify-between">
                    <span className="capitalize">{testName.replace('_', ' ')}</span>
                    {getStatusBadge(passed)}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Health Report</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  <pre className="text-xs whitespace-pre-wrap">
                    {healthReport}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;