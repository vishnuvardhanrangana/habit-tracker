import React from 'react';
import { motion } from 'framer-motion';

/**
 * StaggeredText (React Bits inspired)
 * Gives emotional headings a slow, gentle appearance instead of rendering immediately.
 */
const StaggeredText = ({
  text = '',
  className = '',
  staggerDelay = 0.04,
  initialDelay = 0.2,
  as = 'h1',
}) => {
  const letters = Array.from(text);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 14,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const Component = motion[as] || motion.div;

  return (
    <Component
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`inline-flex flex-wrap ${className}`}
      style={{ willChange: 'opacity, transform' }}
    >
      {letters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={childVariants}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </Component>
  );
};

export default StaggeredText;
