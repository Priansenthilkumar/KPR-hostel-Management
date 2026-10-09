// src/components/UI/Button.jsx
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) {
  const sizeClass = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm',
    lg: 'px-6 py-3 text-sm sm:text-base',
  }[size] || 'px-4 py-2 text-xs sm:text-sm';

  const baseStyle =
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:!opacity-50 disabled:!cursor-not-allowed cursor-pointer hover:-translate-y-[1px] active:scale-[0.97] select-none';

  let variantStyle = '';

  switch (variant) {
    case 'danger':
      variantStyle =
        'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 hover:shadow-lg focus-visible:ring-red-500 border border-red-500/30';
      break;
    case 'success':
    case 'accent':
      // KPRIET Official Green: #1B924B
      variantStyle =
        'bg-[#1B924B] hover:bg-[#167A3E] text-white shadow-md shadow-[#1B924B]/25 hover:shadow-lg hover:shadow-[#1B924B]/35 focus-visible:ring-[#1B924B] border border-green-400/20';
      break;
    case 'outline':
      variantStyle =
        'bg-transparent border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] focus-visible:ring-slate-400';
      break;
    case 'ghost':
      variantStyle =
        'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] focus-visible:ring-slate-400';
      break;
    case 'warning':
    case 'gold':
      variantStyle =
        'bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md shadow-amber-500/20 hover:shadow-lg focus-visible:ring-amber-500 border border-amber-300/30';
      break;
    case 'primary':
    default:
      // KPRIET Official Blue: #1B345F
      variantStyle =
        'bg-[#1B345F] hover:bg-[#112547] text-white shadow-md shadow-[#1B345F]/25 hover:shadow-lg hover:shadow-[#1B345F]/35 focus-visible:ring-[#1B345F] border border-blue-400/15';
      break;
  }

  return (
    <button
      className={`${baseStyle} ${sizeClass} ${variantStyle} ${className}`}
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
