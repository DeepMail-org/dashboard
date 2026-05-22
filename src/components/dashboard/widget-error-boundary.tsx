"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  widgetId: string;
  onRemove?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WidgetErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
          <AlertTriangle className="h-8 w-8 text-danger" />
          <p className="text-center text-xs text-muted">
            Widget failed to load
          </p>
          <div className="flex gap-2">
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-1.5 rounded-md bg-surface-hover px-3 py-1.5 text-xs text-secondary transition-colors hover:bg-border"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </button>
            {this.props.onRemove && (
              <button
                onClick={this.props.onRemove}
                className="rounded-md px-3 py-1.5 text-xs text-muted transition-colors hover:text-danger"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
