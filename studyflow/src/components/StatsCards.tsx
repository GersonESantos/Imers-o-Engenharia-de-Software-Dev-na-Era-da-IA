import React from 'react';
import { Target, Clock, CheckCircle2, CircleDashed } from 'lucide-react';
import { Objective } from '../types/objective';

interface StatsCardsProps {
  objectives: Objective[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ objectives }) => {
  const total = objectives.length;
  const naoIniciados = objectives.filter((o) => o.status === 'nao_iniciado').length;
  const emAndamento = objectives.filter((o) => o.status === 'em_andamento').length;
  const concluidos = objectives.filter((o) => o.status === 'concluido').length;

  const percentConcluidos = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <section aria-label="Estatísticas de Objetivos" className="mb-8">
      {/* Container Principal de Resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Cadastrado */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 text-stone-500 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase text-stone-500">
              Total Geral
            </span>
            <div className="p-1.5 rounded-lg bg-stone-100 text-stone-700">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
              {total}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {total === 1 ? '1 objetivo cadastrado' : `${total} objetivos cadastrados`}
            </p>
          </div>
        </div>

        {/* Não Iniciados */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 text-stone-500 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase text-amber-700">
              Não Iniciados
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <CircleDashed className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-800 tabular-nums">
              {naoIniciados}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Aguardando início
            </p>
          </div>
        </div>

        {/* Em Andamento */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 text-stone-500 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase text-sky-700">
              Em Andamento
            </span>
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-sky-800 tabular-nums">
              {emAndamento}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Foco atual nos estudos
            </p>
          </div>
        </div>

        {/* Concluídos */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 text-stone-500 mb-2">
            <span className="text-xs font-semibold tracking-wide uppercase text-emerald-700">
              Concluídos
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-800 tabular-nums">
                {concluidos}
              </span>
              <span className="text-xs font-medium text-emerald-600 tabular-nums">
                ({percentConcluidos}%)
              </span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${percentConcluidos}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
