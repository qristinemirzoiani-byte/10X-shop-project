    import { Component, type ErrorInfo, type ReactNode } from 'react';
    import { AlertTriangle, RefreshCw } from 'lucide-react';

    interface Props {
    children: ReactNode;
    }

    interface State {
    hasError: boolean;
    error: Error | null;
    }

    export class ErrorBoundary extends Component<Props, State> {
    public override state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[ErrorBoundary caught error]:', error, errorInfo);
    }

    private handleReload = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public override render() {
        if (this.state.hasError) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 text-center bg-[#0B0F19] text-white">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-500 mx-auto flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
                <p className="text-xs text-slate-400 mb-6">
                An unexpected error occurred. Please reload the application.
                </p>
                {this.state.error && (
                <p className="text-xs font-mono bg-slate-950 p-3 rounded-xl text-rose-400 text-left mb-6 break-words">
                    {this.state.error.message}
                </p>
                )}
                <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-white font-bold text-xs transition cursor-pointer w-full"
                >
                <RefreshCw className="w-4 h-4" />
                Reload Page
                </button>
            </div>
            </div>
        );
        }
        return this.props.children;
    }
}