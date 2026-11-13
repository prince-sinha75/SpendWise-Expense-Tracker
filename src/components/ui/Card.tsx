import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = true, delay = 0, onClick }: CardProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover && !reduce ? { y: -3, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
      className={`card-surface ${hover ? 'transition-shadow hover:shadow-2xl hover:shadow-black/20' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
