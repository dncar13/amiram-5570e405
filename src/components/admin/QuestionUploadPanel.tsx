import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { uploadTestQuestions } from "@/utils/questionUploadUtils";
import { UploadResult } from "@/services/questionsUploadService";

const QuestionUploadPanel: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const handleUploadTestQuestions = async () => {
    setUploadStatus('uploading');
    setUploadResult(null);

    try {
      console.log('🚀 Starting test question upload process...');
      
      const result = await uploadTestQuestions();
      setUploadResult(result);
      
      if (result.success) {
        setUploadStatus('success');
        console.log('🎉 Upload completed successfully!');
      } else {
        setUploadStatus('error');
        console.error('❌ Upload failed:', result.errors);
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-6 w-6" />
          העלאת שאלות פרימיום
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

        {/* Test Question Details */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">שאלות בדיקה להעלאה:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 6 שאלות פרימיום (3 restatement + 3 sentence-completion)</li>
            <li>• רמות קושי: קל, בינוני, קשה</li>
            <li>• הסברים בעברית ואנגלית</li>
            <li>• תיוג פרימיום אוטומטי</li>
          </ul>
        </div>

        {/* Upload Results */}
        {uploadResult && (
          <div className="space-y-3">
            {uploadResult.success ? (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  הועלו בהצלחה {uploadResult.uploadedCount} שאלות!
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
          onClick={handleUploadTestQuestions}
          disabled={uploadStatus === 'uploading'}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          size="lg"
        >
          {uploadStatus === 'uploading' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              מעלה שאלות...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              העלה שאלות בדיקה (6 שאלות פרימיום)
            </>
          )}
        </Button>

        {/* Instructions */}
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <h4 className="font-semibold text-yellow-900 mb-2">הוראות:</h4>
          <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
            <li>השאלות יועלו עם תיוג פרימיום אוטומטי</li>
            <li>רק משתמשי פרימיום יוכלו לראות את השאלות</li>
            <li>ההסברים יוצגו בכיוון RTL (עברית + אנגלית)</li>
            <li>השאלות יקבלו batch ID ייחודי למעקב</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionUploadPanel;