// src/components/UI/Card.jsx
export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`card p-5 ${hover ? 'card-hover hover:scale-[1.01] cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
