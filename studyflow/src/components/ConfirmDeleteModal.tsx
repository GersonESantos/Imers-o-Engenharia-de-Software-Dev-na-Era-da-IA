import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Objective } from '../types/objective';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  objective: Objective | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  objective,
  onCancel,
  onConfirm,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !objective) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button
              onClick={onCancel}
              aria-label="Cancelar exclusão"
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 id="confirm-delete-title" className="text-lg font-bold text-stone-900 mb-2">
            Confirmar exclusão de objetivo
          </h2>

          <p className="text-sm text-stone-600 mb-4">
            Você tem certeza de que deseja excluir o objetivo:{' '}
            <strong className="text-stone-900 font-semibold block mt-1 p-2 bg-stone-50 rounded-lg border border-stone-200">
              "{objective.title}"
            </strong>
          </p>

          <p className="text-xs text-rose-600 mb-6 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
            Esta ação não poderá ser desfeita após a confirmação.
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-sm font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 active:bg-rose-700 rounded-xl transition-all shadow-xs shadow-rose-900/20 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Sim, excluir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
