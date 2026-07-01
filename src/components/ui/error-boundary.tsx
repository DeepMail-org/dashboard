"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { LiquidButton } from "@/components/marketing/ui/liquid-glass-button";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10">
            <AlertTriangle className="h-6 w-6 text-rose-400" />
          </div>
          <div className="text-center">
            <h3 className="font-display text-lg font-semibold text-fg">Something went wrong</h3>
            <p className="mt-2 text-sm text-muted">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
          </div>
          <LiquidButton onClick={this.handleRetry} className="w-full max-w-xs">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </LiquidButton>
        </div>
      );
    }

    return this.props.children;
  }
}

export function WidgetErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex h-full items-center justify-center p-4">
          <div className="text-center text-sm text-muted">Failed to load widget</div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}