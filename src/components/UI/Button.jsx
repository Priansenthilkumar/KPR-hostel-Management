// src/components/UI/Button.jsx
export default function Button({
  children,
  _variant, // ignored in favor of global green theme
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

  // Apply '!...' classes to ensure this green theme overrides any legacy tailwind props passed in via className
  const globalGreenStyle = `inline-flex items-center justify-center gap-2 rounded-xl font-bold !text-white transition-all duration-200 
    !bg-gradient-to-r !from-[#44A03C] !to-[#388A31] 
    shadow-[0_4px_14px_rgba(82,183,74,0.35)] 
    hover:shadow-[0_6px_20px_rgba(82,183,74,0.45)] 
    hover:-translate-y-[1.5px] hover:scale-[1.02] 
    active:scale-[0.98] active:translate-y-[0.5px] 
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#52B74A] focus-visible:ring-offset-2
    disabled:!opacity-60 disabled:!bg-none disabled:!bg-gray-400 disabled:!from-gray-400 disabled:!to-gray-500 disabled:!text-gray-100 disabled:!shadow-none disabled:!transform-none disabled:cursor-not-allowed cursor-pointer`;

  return (
    <button
      className={`${sizeClass} ${globalGreenStyle} ${(className || '').replace(/\bbg-\S+|\btext-\S+|\bshadow-\S+|\bfrom-\S+|\bto-\S+/g, '')}`}
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
