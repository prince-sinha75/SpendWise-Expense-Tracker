import { useState, useCallback } from 'react';
import type { Transaction } from '@/types';
import { useApp } from '@/hooks/useApp';
import { useToast } from '@/hooks/useToast';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TransactionForm } from '@/components/TransactionForm';

export function useTransactionModals() {
  const { addTransaction, updateTransaction, deleteTransaction } = useApp();
  const { notify } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);

  const openAdd = useCallback(() => {
    setEditing(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((tx: Transaction) => {
    setEditing(tx);
    setFormOpen(true);
  }, []);

  const requestDelete = useCallback((tx: Transaction) => {
    setDeleting(tx);
  }, []);

  const handleSubmit = (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (editing) {
      updateTransaction(editing.id, data);
      notify('Transaction updated successfully');
    } else {
      addTransaction(data);
      notify('Transaction added successfully');
    }
    setFormOpen(false);
    setEditing(null);
  };

  const confirmDelete = () => {
    if (deleting) {
      deleteTransaction(deleting.id);
      notify('Transaction deleted', 'info');
      setDeleting(null);
    }
  };

  const modals = (
    <>
      <Modal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        title={editing ? 'Edit Transaction' : 'Add Transaction'}
        subtitle={editing ? 'Update the details below' : 'Record a new income or expense'}
      >
        <TransactionForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setFormOpen(false); setEditing(null); }}
        />
      </Modal>
      <ConfirmDialog
        open={!!deleting}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${deleting?.title}"? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );

  return { openAdd, openEdit, requestDelete, modals };
}
