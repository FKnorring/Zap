import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryClass extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }: { error?: Error }) {
  const { t } = useTranslation('general');

  return (
    <div className="min-h-dvh inset-0 fixed bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-4 text-center">
        <h1 className="text-2xl font-bold text-primary">
          {t('error.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('error.description')}
        </p>
        {error && (
          <pre className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg text-sm text-left border border-destructive/20 whitespace-pre-wrap break-words max-h-[200px] overflow-y-auto">
            {error.message}
          </pre>
        )}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          {t('error.refresh')}
        </button>
      </div>
    </div>
  );
}

export default function ErrorBoundary(props: Props) {
  return <ErrorBoundaryClass {...props} />;
} 