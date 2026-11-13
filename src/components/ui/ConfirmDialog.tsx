import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
          <motion.div
            role="alertdialog"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            className="relative glass w-full max-w-sm rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-expense/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-expense" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary">{title}</h3>
                <p className="text-sm text-secondary mt-1">{message}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-sm font-medium text-secondary hover:text-primary border border-subtle hover:border-strong transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-expense hover:opacity-90 transition-opacity"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
