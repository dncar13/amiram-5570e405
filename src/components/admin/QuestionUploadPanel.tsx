
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle, XCircle, Loader2, BarChart3, Crown } from "lucide-react";
import { uploadPremiumSet1Questions } from "@/utils/questionUploadUtils";
import { UploadResult, QuestionsUploadService } from "@/services/questionsUploadService";

const QuestionUploadPanel: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [premiumStats, setPremiumStats] = useState<any>(null);
  const [uploadHistory, setUploadHistory] = useState<any[]>([]);

  useEffect(() => {
    loadPremiumStats();
    loadUploadHistory();
  }, []);

  const loadPremiumStats = async () => {
    const stats = await QuestionsUploadService.getPremiumStats();
    setPremiumStats(stats);
  };

  const loadUploadHistory = async () => {
    const history = await QuestionsUploadService.getUploadHistory(5);
    setUploadHistory(history);
  };

  const handleUploadPremiumSet1 = async () => {
    setUploadStatus('uploading');
    setUploadResult(null);

    try {
      console.log('🚀 Starting Premium Set 1 upload process...');
      
      const result = await uploadPremiumSet1Questions();
      setUploadResult(result);
      
      if (result.success) {
        setUploadStatus('success');
        console.log('🎉 Premium Set 1 upload completed successfully!');
        // Refresh stats and history
        await loadPremiumStats();
        await loadUploadHistory();
      } else {
        setUploadStatus('error');
        console.error('❌ Premium Set 1 upload failed:', result.errors);
      }
    } catch (error) {
      console.error('❌ Upload process failed:', error);
      setUploadStatus('error');
      setUploadResult({
        success: false,
        uploadedCount: 0,
        errors: [error instanceof Error ? error.message : 'Unknown upload error']
      });
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader2 className="h-5 w-5 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':  
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Upload className="h-5 w-5" />;
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Premium Statistics Card */}
      {premiumStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              סטטיסטיקות שאלות פרימיום
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{premiumStats.total}</div>
                <div className="text-sm text-gray-600">סה״כ שאלות פרימיום</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{premiumStats.byDifficulty.easy}</div>
                <div className="text-sm text-gray-600">קל</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{premiumStats.byDifficulty.medium}</div>
                <div className="text-sm text-gray-600">בינוני</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{premiumStats.byDifficulty.hard}</div>
                <div className="text-sm text-gray-600">קשה</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600 mb-2">חלוקה לפי סוג:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(premiumStats.byType).map(([type, count]) => (
                  <Badge key={type} variant="outline">
                    {type}: {count as number}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Panel */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-orange-600" />
            העלאת Set 1 Premium
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Upload Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="font-medium">
                {uploadStatus === 'idle' && 'מוכן להעלאה'}
                {uploadStatus === 'uploading' && 'מעלה שאלות...'}
                {uploadStatus === 'success' && 'העלאה הושלמה בהצלחה!'}
                {uploadStatus === 'error' && 'העלאה נכשלה'}
              </span>
            </div>
            
            <Badge className={`px-3 py-1 ${getStatusColor()}`}>
              {uploadStatus === 'idle' && 'לא פעיל'}
              {uploadStatus === 'uploading' && 'מעלה...'}
              {uploadStatus === 'success' && 'הצליח'}
              {uploadStatus === 'error' && 'נכשל'}
            </Badge>
          </div>

          {/* Premium Set 1 Details */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Set 1 Premium - שאלות להעלאה:
            </h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• 6 שאלות פרימיום במבנה סט מאורגן</li>
              <li>• 3 שאלות Restatement (קל, בינוני, קשה)</li>
              <li>• 3 שאלות Sentence Completion (קל, בינוני, קשה)</li>
              <li>• הסברים מפורטים בעברית</li>
              <li>• מבנה סט עם set_id, set_number, set_order</li>
            </ul>
          </div>

          {/* Upload Results */}
          {uploadResult && (
            <div className="space-y-3">
              {uploadResult.success ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    הועלו בהצלחה {uploadResult.uploadedCount} שאלות פרימיום!
                    {uploadResult.batchId && (
                      <div className="mt-2 text-xs">
                        Batch ID: <code>{uploadResult.batchId}</code>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-2">העלאה נכשלה:</div>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {uploadResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                    {uploadResult.uploadedCount > 0 && (
                      <div className="mt-2 text-sm font-medium">
                        הועלו בכל זאת: {uploadResult.uploadedCount} שאלות
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUploadPremiumSet1}
            disabled={uploadStatus === 'uploading'}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            size="lg"
          >
            {uploadStatus === 'uploading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                מעלה Set 1 Premium...
              </>
            ) : (
              <>
                <Crown className="h-4 w-4 mr-2" />
                העלה Set 1 Premium (6 שאלות)
              </>
            )}
          </Button>

          {/* Upload History */}
          {uploadHistory.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h4 className="font-semibold text-gray-900 mb-2">היסטוריית העלאות אחרונות:</h4>
              <div className="space-y-2">
                {uploadHistory.map((batch, index) => (
                  <div key={index} className="text-sm flex justify-between items-center">
                    <div>
                      <span className="font-medium">{batch.batch_id}</span>
                      {batch.set_type && <span className="text-gray-600"> ({batch.set_type})</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{batch.count} שאלות</Badge>
                      {batch.premium_count > 0 && (
                        <Badge className="bg-orange-100 text-orange-800">
                          {batch.premium_count} פרימיום
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">מבנה Set Premium:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>כל שאלה מקבלת set_id ייחודי לפי סוג ורמת קושי</li>
              <li>set_number = 1 (זהו הסט הראשון)</li>
              <li>set_order מציין את מיקום השאלה בסט</li>
              <li>metadata כולל מידע על מבנה הסט</li>
              <li>השאלות מסומנות כ-premium וset1 בתגים</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionUploadPanel;
