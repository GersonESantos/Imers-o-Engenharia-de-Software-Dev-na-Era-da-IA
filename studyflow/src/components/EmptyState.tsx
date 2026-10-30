import React from 'react';
import { Compass, Plus, Sparkles, SearchX } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onOpenCreateModal: () => void;
  onClearFilters?: () => void;
  onLoadSamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onOpenCreateModal,
  onClearFilters,
  onLoadSamples,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-500 mx-auto flex items-center justify-center mb-4">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-2">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-sm text-stone-600 mb-6">
          Não encontramos objetivos correspondentes aos filtros ou busca selecionados.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-sm font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            Limpar filtros e ver todos
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 mx-auto flex items-center justify-center mb-5">
        <Compass className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-bold text-stone-900 mb-2">
        Nenhum objetivo cadastrado ainda
      </h3>

      <p className="text-sm text-stone-600 mb-6 max-w-md mx-auto leading-relaxed">
        Grandes conquistas de estudo começam com metas simples e bem definidas.
        Adicione seu primeiro objetivo para dar início à sua rotina!
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onOpenCreateModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar Meu Primeiro Objetivo</span>
        </button>

        {onLoadSamples && (
          <button
            onClick={onLoadSamples}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Carregar Exemplos Práticos</span>
          </button>
        )}
      </div>
    </div>
  );
};
