import React from 'react';
import { Search, X } from 'lucide-react';
import { FilterStatus, Objective } from '../types/objective';

interface FilterBarProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  objectives: Objective[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  objectives,
}) => {
  const counts = {
    todos: objectives.length,
    nao_iniciado: objectives.filter((o) => o.status === 'nao_iniciado').length,
    em_andamento: objectives.filter((o) => o.status === 'em_andamento').length,
    concluido: objectives.filter((o) => o.status === 'concluido').length,
  };

  const filterButtons: { key: FilterStatus; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'nao_iniciado', label: 'Não iniciados' },
    { key: 'em_andamento', label: 'Em andamento' },
    { key: 'concluido', label: 'Concluídos' },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
      {/* Segmented Filter Control */}
      <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-xl overflow-x-auto max-w-full">
        {filterButtons.map((btn) => {
          const isActive = currentFilter === btn.key;
          return (
            <button
              key={btn.key}
              onClick={() => onFilterChange(btn.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <span>{btn.label}</span>
              <span
                className={`text-[11px] tabular-nums font-bold ${
                  isActive ? 'text-amber-600' : 'text-stone-400'
                }`}
              >
                {counts[btn.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full md:w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar objetivos..."
          className="w-full pl-9 pr-8 py-1.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-stone-400 hover:text-stone-700"
            title="Limpar busca"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
