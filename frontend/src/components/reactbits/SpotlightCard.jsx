import React, { useRef, useState } from 'react';

/**
 * SpotlightCard (React Bits inspired)
 * Subtle glow effect that tracks cursor movement across the card.
 */
const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(244, 63, 94, 0.09)', // subtle dark rose/crimson glow
}) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/60 backdrop-blur-xl shadow-2xl transition-colors duration-300 ${className}`}
    >
      {/* Spotlight layer */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(550px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
        }}
        aria-hidden="true"
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default SpotlightCard;
