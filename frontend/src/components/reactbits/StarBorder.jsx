import React from 'react';

/**
 * StarBorder (React Bits inspired)
 * Very subtle animated traveling border light.
 * Low intensity, elegant and calm.
 */
const StarBorder = ({
  as: Component = 'div',
  className = '',
  innerClassName = 'bg-[#140307]/90',
  color = '#be123c',
  speed = '12s',
  children,
  ...rest
}) => {
  return (
    <Component
      className={`relative p-[1px] overflow-hidden rounded-3xl ${className}`}
      {...rest}
    >
      {/* Animated conic gradient beam */}
      <div
        className="absolute inset-[-100%] animate-star-border opacity-40 pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg, transparent 0 340deg, ${color} 360deg)`,
          animationDuration: speed,
        }}
        aria-hidden="true"
      />
      {/* Inner background container */}
      <div className={`relative w-full h-full rounded-[calc(1.5rem-1px)] backdrop-blur-xl ${innerClassName}`}>
        {children}
      </div>

      <style>{`
        @keyframes starBorderSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-star-border {
          animation: starBorderSpin linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-star-border {
            animation: none;
            opacity: 0.15;
          }
        }
      `}</style>
    </Component>
  );
};

export default StarBorder;
