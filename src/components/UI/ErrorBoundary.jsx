// src/components/UI/ErrorBoundary.jsx
import React from 'react';
import kprLogo from '../../assets/kprLogo.png';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('KPR Hostel App ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0E2730] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="max-w-md w-full bg-[#123843] border border-[#235868] p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-5 animate-fade-in">
            <img
              src={kprLogo}
              alt="KPR Logo"
              className="h-14 w-auto object-contain bg-white p-2 rounded-2xl shadow-md"
            />
            
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                KPR Hostel Suite - Connection Notice
              </h2>
              <p className="text-xs text-[#B0D0D8] mt-2 leading-relaxed">
                The application encountered a network load glitch or captive portal timeout. Click below to refresh your session.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="w-full bg-[#0E2730] p-3 rounded-xl border border-red-500/30 text-left text-[11px] text-red-300 font-mono overflow-x-auto max-h-24 no-scrollbar">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full py-3 rounded-2xl bg-[#52B74A] hover:bg-[#44A03C] text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Reload Application Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
