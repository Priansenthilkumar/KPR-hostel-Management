// src/components/UI/Button.jsx
export default function Button({
  children,
  variant = 'primary', // support variant explicitly
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) {
  const sizeClass = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }[size] || 'px-5 py-2.5 text-sm';

  const baseStyle = 'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:!opacity-60 disabled:!bg-none disabled:!bg-gray-400 disabled:!from-gray-400 disabled:!to-gray-500 disabled:!text-gray-100 disabled:!shadow-none disabled:!transform-none disabled:cursor-not-allowed cursor-pointer hover:-translate-y-[1.5px] hover:scale-[1.02] active:scale-[0.98] active:translate-y-[0.5px]';

  let variantStyle = '';
  
  if (variant === 'danger') {
    variantStyle = '!bg-gradient-to-r !from-red-500 !to-red-600 !text-white shadow-[0_4px_14px_rgba(239,68,68,0.35)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.45)] focus-visible:ring-red-500';
  } else if (variant === 'outline') {
    variantStyle = 'bg-transparent border-2 border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] focus-visible:ring-gray-400';
  } else {
    // Default green theme
    variantStyle = '!bg-gradient-to-r !from-[#44A03C] !to-[#388A31] !text-white shadow-[0_4px_14px_rgba(82,183,74,0.35)] hover:shadow-[0_6px_20px_rgba(82,183,74,0.45)] focus-visible:ring-[#52B74A]';
  }

  return (
    <button
      className={`${sizeClass} ${baseStyle} ${variantStyle} ${String(className || '').replace(/bg-\S+|text-\S+|shadow-\S+|from-\S+|to-\S+/g, '')}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
      )}
      {children}
    </button>
  );
}
