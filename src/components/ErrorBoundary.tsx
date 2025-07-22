import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
          <div className="max-w-md text-center space-y-4">
            <div className="flex justify-center">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold">משהו השתבש</h1>
            <p className="text-muted-foreground">
              אירעה שגיאה בלתי צפויה. אנא רענן את הדף ונסה שוב.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-sm text-left bg-muted p-4 rounded">
                <summary className="font-semibold cursor-pointer">פרטי השגיאה</summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div className="space-x-2">
              <Button onClick={() => window.location.reload()}>
                רענן דף
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                חזור
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}