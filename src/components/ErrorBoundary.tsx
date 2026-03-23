import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorDetails = '';
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          errorDetails = JSON.stringify(parsed, null, 2);
        }
      } catch (e) {
        errorDetails = this.state.error?.message || 'Unknown error';
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
          <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <h2 className="text-2xl font-bold text-rose-600 mb-4">Something went wrong</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {errorDetails && (
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl text-xs overflow-auto max-h-48 dark:text-zinc-300 mb-6">
                {errorDetails}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
