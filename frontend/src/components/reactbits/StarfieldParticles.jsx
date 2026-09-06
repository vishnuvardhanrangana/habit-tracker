import React, { useEffect, useRef } from 'react';

/**
 * StarfieldParticles (React Bits inspired)
 * Distant, quiet lights in the night sky.
 * Very slow, subtle opacity breathing rather than active flying particles.
 */
const StarfieldParticles = ({ count = 50, className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize subtle stars
    const stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      targetAlpha: Math.random() * 0.5 + 0.15,
      speed: Math.random() * 0.003 + 0.002,
      driftX: (Math.random() - 0.5) * 0.08,
      driftY: (Math.random() - 0.5) * 0.05,
      hue: Math.random() > 0.6 ? 348 : (Math.random() > 0.5 ? 15 : 40), // warm rose, faint crimson, or soft warm amber
    }));

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const render = () => {
      if (!isVisible) {
        animationId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        if (!prefersReducedMotion) {
          // Slow breathing opacity
          s.alpha += (s.targetAlpha - s.alpha) * s.speed;
          if (Math.abs(s.targetAlpha - s.alpha) < 0.01) {
            s.targetAlpha = Math.random() * 0.5 + 0.1;
          }

          // Very gentle drift
          s.x += s.driftX;
          s.y += s.driftY;

          if (s.x < 0) s.x = width;
          if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height;
          if (s.y > height) s.y = 0;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 30%, 90%, ${s.alpha})`;
        ctx.shadowBlur = s.size > 1.2 ? 3 : 0;
        ctx.shadowColor = `hsla(${s.hue}, 50%, 80%, ${s.alpha * 0.8})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 select-none ${className}`}
      aria-hidden="true"
    />
  );
};

export default StarfieldParticles;
