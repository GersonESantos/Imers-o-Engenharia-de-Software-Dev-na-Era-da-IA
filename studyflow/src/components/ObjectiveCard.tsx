import React from 'react';
import { Calendar, Edit3, Trash2, CheckCircle2, Clock, CircleDashed, ChevronRight } from 'lucide-react';
import { Objective, ObjectiveStatus, STATUS_LABELS } from '../types/objective';
import { formatDateBr, getDeadlineUrgency } from '../utils/dateUtils';

interface ObjectiveCardProps {
  objective: Objective;
  onEdit: (objective: Objective) => void;
  onDeleteRequest: (objective: Objective) => void;
  onStatusChange: (id: string, newStatus: ObjectiveStatus) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  const isCompleted = objective.status === 'concluido';
  const urgency = getDeadlineUrgency(objective.deadline, isCompleted);

  // Ícones e tonalidades textuais para cada status (sem pill capsules genéricas)
  const statusConfig = {
    nao_iniciado: {
      icon: CircleDashed,
      colorText: 'text-amber-700',
      nextStatus: 'em_andamento' as ObjectiveStatus,
      nextActionLabel: 'Iniciar estudo',
    },
    em_andamento: {
      icon: Clock,
      colorText: 'text-sky-700',
      nextStatus: 'concluido' as ObjectiveStatus,
      nextActionLabel: 'Concluir',
    },
    concluido: {
      icon: CheckCircle2,
      colorText: 'text-emerald-700',
      nextStatus: 'nao_iniciado' as ObjectiveStatus,
      nextActionLabel: 'Reabrir',
    },
  }[objective.status];

  const StatusIcon = statusConfig.icon;

  return (
    <article
      className={`group bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between p-5 relative ${
        isCompleted
          ? 'border-emerald-200/70 bg-emerald-50/20 shadow-xs'
          : 'border-stone-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-md'
      }`}
    >
      <div>
        {/* Top bar do card: Metadados limpos e Ações */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Status como texto limpo e legível */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.colorText}`} />
            <span className={statusConfig.colorText}>
              {STATUS_LABELS[objective.status]}
            </span>
          </div>

          {/* Botões de Ação: Editar e Excluir */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(objective)}
              title="Editar objetivo"
              aria-label={`Editar ${objective.title}`}
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteRequest(objective)}
              title="Excluir objetivo"
              aria-label={`Excluir ${objective.title}`}
              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base sm:text-lg font-bold leading-snug mb-2 text-wrap-balance ${
            isCompleted ? 'text-stone-600 line-through decoration-stone-300' : 'text-stone-900'
          }`}
        >
          {objective.title}
        </h3>

        {/* Descrição */}
        <p className="text-sm text-stone-600 leading-relaxed mb-4 whitespace-pre-line line-clamp-3">
          {objective.description ? (
            objective.description
          ) : (
            <span className="text-stone-400 italic">Sem descrição detalhada</span>
          )}
        </p>
      </div>

      {/* Rodapé do Card: Data limite e Troca Rápida de Status */}
      <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
        {/* Data e Urgência */}
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Calendar className="w-3.5 h-3.5 shrink-0 text-stone-400" />
          <span className="font-medium">{formatDateBr(objective.deadline)}</span>
          {urgency && (
            <>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span
                className={`font-semibold ${
                  urgency.isOverdue
                    ? 'text-rose-600'
                    : urgency.isToday
                    ? 'text-amber-600'
                    : 'text-stone-500'
                }`}
              >
                {urgency.label}
              </span>
            </>
          )}
        </div>

        {/* Botão de avanço rápido de status */}
        <button
          onClick={() => onStatusChange(objective.id, statusConfig.nextStatus)}
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            isCompleted
              ? 'text-stone-600 bg-stone-100 hover:bg-stone-200'
              : objective.status === 'em_andamento'
              ? 'text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/70'
              : 'text-sky-800 bg-sky-100/70 hover:bg-sky-200/70'
          }`}
          title={`Alterar para ${STATUS_LABELS[statusConfig.nextStatus]}`}
        >
          <span>{statusConfig.nextActionLabel}</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </article>
  );
};
