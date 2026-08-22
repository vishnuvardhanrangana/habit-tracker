import React, { useEffect, useRef } from 'react';

const Antigravity = ({
  count = 300,
  magnetRadius = 6,
  ringRadius = 7,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 1.5,
  lerpSpeed = 0.05,
  color = '#5227FF',
  autoAnimate = true,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = 'capsule',
  fieldStrength = 10
}) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    // Prefers-reduced-motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Helper to calculate target count based on screen width
    const getTargetCount = () => {
      if (width < 768) return Math.round(count * 0.3); // mobile
      if (width < 1024) return Math.round(count * 0.6); // tablet
      return count; // desktop;
    };

    // Initialize particles
    const initParticles = () => {
      particles = [];
      const particleCount = getTargetCount();

      for (let i = 0; i < particleCount; i++) {
        // Random layout coordinates
        const baseX = Math.random() * width;
        const baseY = Math.random() * height;

        particles.push({
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          angle: Math.random() * Math.PI * 2,
          variance: Math.random() * 0.8 + 0.2, // size/speed scaling factor
          z: Math.random(), // pseudo depth
          pulseOffset: Math.random() * Math.PI * 2
        });
      }
    };

    initParticles();

    // Event listeners
    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initParticles();
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const mouse = mouseRef.current;
    let time = 0;

    // Main animation loop
    const animate = () => {
      time += 0.05;
      ctx.clearRect(0, 0, width, height);

      // Determine colors
      ctx.fillStyle = color;
      ctx.strokeStyle = color;

      particles.forEach((p) => {
        let targetX = p.baseX;
        let targetY = p.baseY;

        // 1. Auto Animate Wave Force
        if (autoAnimate) {
          const waveX = Math.sin(time * waveSpeed + p.angle) * waveAmplitude * p.variance * 6;
          const waveY = Math.cos(time * waveSpeed + p.angle) * waveAmplitude * p.variance * 6;
          targetX += waveX;
          targetY += waveY;
        }

        // 2. Mouse Repel (Antigravity) Interaction
        if (mouse.active && mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = magnetRadius * fieldStrength * 7;

          if (dist < influence) {
            const force = (influence - dist) / influence;
            // Push direction away from mouse
            const pushX = (dx / (dist || 1)) * force * fieldStrength * 6;
            const pushY = (dy / (dist || 1)) * force * fieldStrength * 6;
            targetX += pushX;
            targetY += pushY;
          }
        }

        // 3. Coordinate Orbit Rotation around screen center
        if (rotationSpeed > 0) {
          const centerX = width / 2;
          const centerY = height / 2;
          const rx = targetX - centerX;
          const ry = targetY - centerY;
          const cos = Math.cos(rotationSpeed * 0.01);
          const sin = Math.sin(rotationSpeed * 0.01);
          targetX = centerX + (rx * cos - ry * sin);
          targetY = centerY + (rx * sin + ry * cos);
        }

        // 4. Lerp Coordinate Interpolation
        p.x += (targetX - p.x) * lerpSpeed;
        p.y += (targetY - p.y) * lerpSpeed;

        // 5. Depth and Pulse scaling
        const depthScale = (1 - p.z * 0.5) * depthFactor;
        const size = particleSize * depthScale * (1 + p.variance * particleVariance * 0.3);
        const pulse = 0.3 + 0.7 * Math.sin(time * pulseSpeed + p.pulseOffset);
        const opacity = Math.max(0, Math.min(1, pulse * depthScale));

        ctx.globalAlpha = opacity;

        // 6. Draw shapes
        if (particleShape === 'capsule') {
          ctx.beginPath();
          // Draw rounded capsule
          ctx.arc(p.x, p.y - size, size, Math.PI, 0);
          ctx.arc(p.x, p.y + size, size, 0, Math.PI);
          ctx.closePath();
          ctx.fill();
        } else if (particleShape === 'square') {
          ctx.fillRect(p.x - size, p.y - size, size * 2, size * 2);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1.0;

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (prefersReducedMotion) {
      // Just draw static frame
      animate();
    } else {
      animationFrameId = requestAnimationFrame(animate);
    }

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    count,
    magnetRadius,
    ringRadius,
    waveSpeed,
    waveAmplitude,
    particleSize,
    lerpSpeed,
    color,
    autoAnimate,
    particleVariance,
    rotationSpeed,
    depthFactor,
    pulseSpeed,
    particleShape,
    fieldStrength
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-none"
    />
  );
};

export default Antigravity;
