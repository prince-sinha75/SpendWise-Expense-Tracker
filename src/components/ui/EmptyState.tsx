import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-subtle flex items-center justify-center mb-4 text-muted">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-primary">{title}</h3>
      <p className="text-sm text-secondary mt-1.5 max-w-sm">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
