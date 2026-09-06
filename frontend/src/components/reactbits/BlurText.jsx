import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * BlurText (React Bits inspired)
 * Words gently come into focus with a quiet blur fade.
 */
const BlurText = ({
  text = '',
  delay = 120,
  animateBy = 'words', // 'words' | 'letters'
  className = '',
  once = true,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '0px 0px -50px 0px' });

  const elements = animateBy === 'words' ? text.split(' ') : Array.from(text);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {elements.map((segment, index) => (
        <motion.span
          key={`${segment}-${index}`}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 8 }}
          animate={
            isInView
              ? { filter: 'blur(0px)', opacity: 1, y: 0 }
              : { filter: 'blur(10px)', opacity: 0, y: 8 }
          }
          transition={{
            duration: 0.75,
            delay: (index * delay) / 1000,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="inline-block"
          style={{ willChange: 'filter, opacity, transform' }}
        >
          {segment}
          {animateBy === 'words' && index < elements.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  );
};

export default BlurText;
