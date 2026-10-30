import React, { useState, useEffect } from 'react';
import { X, Calendar, Check, AlertCircle } from 'lucide-react';
import { Objective, ObjectiveFormData, ObjectiveStatus, STATUS_LABELS, STATUS_DESCRIPTIONS } from '../types/objective';

interface ObjectiveFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ObjectiveFormData) => void;
  initialObjective?: Objective | null;
}

export const ObjectiveFormModal: React.FC<ObjectiveFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialObjective,
}) => {
  const isEditing = Boolean(initialObjective);

  // Helper para obter a data no formato YYYY-MM-DD
  const getDefaultDate = (daysFromNow: number = 7) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split('T')[0];
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(getDefaultDate(7));
  const [status, setStatus] = useState<ObjectiveStatus>('nao_iniciado');

  // Erros de validação
  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});

  useEffect(() => {
    if (initialObjective) {
      setTitle(initialObjective.title);
      setDescription(initialObjective.description || '');
      setDeadline(initialObjective.deadline || getDefaultDate(7));
      setStatus(initialObjective.status);
    } else {
      setTitle('');
      setDescription('');
      setDeadline(getDefaultDate(7));
      setStatus('nao_iniciado');
    }
    setErrors({});
  }, [initialObjective, isOpen]);

  // Tecla ESC para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { title?: string; deadline?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Por favor, digite o título do seu objetivo de estudo.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'O título deve ter pelo menos 3 caracteres.';
    }

    if (!deadline) {
      newErrors.deadline = 'Por favor, selecione uma data limite.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });
  };

  const handleShortcutDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setDeadline(d.toISOString().split('T')[0]);
    if (errors.deadline) {
      setErrors((prev) => ({ ...prev, deadline: undefined }));
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-stone-900">
              {isEditing ? 'Editar Objetivo de Estudo' : 'Cadastrar Novo Objetivo'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {isEditing
                ? 'Atualize as informações do seu planejamento.'
                : 'Defina o que você quer aprender com clareza e sem complicação.'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar formulário"
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Formulário com Scroll */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Campo Título */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="objective-title" className="text-sm font-semibold text-stone-800">
                Título do Objetivo <span className="text-amber-600">*</span>
              </label>
              <span className="text-xs text-stone-400">{title.length}/100</span>
            </div>
            <input
              id="objective-title"
              type="text"
              maxLength={100}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="ex: Dominar métodos de Array no JavaScript"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400'
                  : 'border-stone-200 focus:border-amber-400 focus:ring-amber-400/20'
              }`}
            />
            {errors.title && (
              <p className="flex items-center gap-1.5 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Campo Descrição */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="objective-description" className="text-sm font-semibold text-stone-800">
                Descrição e Anotações
              </label>
              <span className="text-xs text-stone-400">Opcional</span>
            </div>
            <textarea
              id="objective-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ex: Fazer exercícios de .map(), .filter() e .reduce() e anotar as dúvidas principais."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all resize-none"
            />
          </div>

          {/* Campo Prazo */}
          <div>
            <label htmlFor="objective-deadline" className="block text-sm font-semibold text-stone-800 mb-1.5">
              Prazo de Conclusão <span className="text-amber-600">*</span>
            </label>
            <div className="relative">
              <input
                id="objective-deadline"
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: undefined }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.deadline
                    ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-400'
                    : 'border-stone-200 focus:border-amber-400 focus:ring-amber-400/20'
                }`}
              />
            </div>

            {/* Atalhos rápidos para ajudar quem está começando a planejar */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs">
              <span className="text-stone-500 font-medium">Atalhos:</span>
              <button
                type="button"
                onClick={() => handleShortcutDate(0)}
                className="px-2 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => handleShortcutDate(3)}
                className="px-2 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                +3 dias
              </button>
              <button
                type="button"
                onClick={() => handleShortcutDate(7)}
                className="px-2 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                +1 semana
              </button>
              <button
                type="button"
                onClick={() => handleShortcutDate(15)}
                className="px-2 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                +15 dias
              </button>
            </div>
            {errors.deadline && (
              <p className="flex items-center gap-1.5 text-xs text-rose-600 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.deadline}</span>
              </p>
            )}
          </div>

          {/* Campo Status */}
          <div>
            <label className="block text-sm font-semibold text-stone-800 mb-2">
              Status Atual
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(['nao_iniciado', 'em_andamento', 'concluido'] as ObjectiveStatus[]).map((st) => {
                const isSelected = status === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`text-xs font-bold ${isSelected ? 'text-amber-900' : 'text-stone-800'}`}>
                        {STATUS_LABELS[st]}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <span className="text-[11px] text-stone-500 leading-tight">
                      {STATUS_DESCRIPTIONS[st]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botões do Rodapé */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
