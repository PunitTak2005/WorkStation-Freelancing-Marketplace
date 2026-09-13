import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, House, ChevronDown } from 'lucide-react';
import Button from './Button';
import BrandLogo from './BrandLogo';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production, forward to monitoring service like Sentry
    console.error('WorkStation Error Boundary caught an exception:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetError: this.handleReset,
        });
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#080B12] blueprint-grid text-slate-100 relative overflow-hidden">
          {/* Brand concentric blueprint rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-[#0A84FF]/10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-dashed border-[#0A84FF]/5 pointer-events-none" />
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#002366]/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#0A84FF]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full max-w-lg p-8 rounded-3xl bg-[#101826]/95 border border-[#22324A] shadow-2xl backdrop-blur-xl text-center relative z-10">
            {/* WorkStation Branded Logo in White Container */}
            <div className="flex justify-center mb-6">
              <BrandLogo stacked size="lg" textClassName="text-white" />
            </div>

            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <AlertTriangle size={28} />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 font-display">
              Something went slightly off
            </h2>
            <p className="text-[#A8C0D8] text-sm mb-6 leading-relaxed max-w-md mx-auto">
              WorkStation encountered an unexpected client error. Don't worry—your account and project data are safe. Try reloading or heading home.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Button
                variant="primary"
                onClick={this.handleReload}
                icon={RefreshCw}
                className="w-full sm:w-auto justify-center shadow-lg shadow-[#0A84FF]/25"
              >
                Reload Application
              </Button>
              <a href="/" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  icon={House}
                  className="w-full justify-center"
                >
                  Return Home
                </Button>
              </a>
            </div>

            {/* Collapsible Error Trace for Developers */}
            {import.meta.env.DEV && this.state.error && (
              <div className="text-left mt-6 pt-4 border-t border-[#22324A]">
                <button
                  type="button"
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-200 font-mono py-1 transition-colors"
                >
                  <span>Stack Trace (Development Mode)</span>
                  <ChevronDown
                    size={14}
                    className={`transform transition-transform ${this.state.showDetails ? 'rotate-180' : ''}`}
                  />
                </button>

                {this.state.showDetails && (
                  <pre className="mt-2 p-3 rounded-xl bg-[#080B12] border border-[#22324A] text-[11px] font-mono text-rose-300 overflow-x-auto max-h-48 whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
