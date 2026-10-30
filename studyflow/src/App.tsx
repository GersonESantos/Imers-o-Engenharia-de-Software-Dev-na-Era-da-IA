import React, { useState, useEffect, useMemo } from 'react';
import { Objective, ObjectiveFormData, ObjectiveStatus, FilterStatus } from './types/objective';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { FilterBar } from './components/FilterBar';
import { ObjectiveCard } from './components/ObjectiveCard';
import { ObjectiveFormModal } from './components/ObjectiveFormModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { EmptyState } from './components/EmptyState';
import { Toast, ToastMessage } from './components/Toast';
import { Lightbulb, Sparkles } from 'lucide-react';

export default function App() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [objectiveToDelete, setObjectiveToDelete] = useState<Objective | null>(null);

  // Notificações
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({
      id: Date.now().toString(),
      type,
      message,
    });
  };

  // Carregar dados na montagem da aplicação
  useEffect(() => {
    const loaded = storageService.getObjectives();
    setObjectives(loaded);
  }, []);

  // Abrir modal para novo objetivo
  const handleOpenCreateModal = () => {
    setEditingObjective(null);
    setIsFormModalOpen(true);
  };

  // Abrir modal para editar
  const handleOpenEditModal = (obj: Objective) => {
    setEditingObjective(obj);
    setIsFormModalOpen(true);
  };

  // Submeter formulário (criação ou edição)
  const handleFormSubmit = (data: ObjectiveFormData) => {
    if (editingObjective) {
      const updated = storageService.updateObjective(editingObjective.id, data);
      if (updated) {
        setObjectives((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        showToast('success', 'Objetivo de estudo atualizado com sucesso!');
      }
    } else {
      const created = storageService.createObjective(data);
      setObjectives((prev) => [created, ...prev]);
      showToast('success', 'Novo objetivo cadastrado com sucesso!');
    }
    setIsFormModalOpen(false);
    setEditingObjective(null);
  };

  // Solicitar exclusão (abre confirmação)
  const handleDeleteRequest = (obj: Objective) => {
    setObjectiveToDelete(obj);
    setIsDeleteModalOpen(true);
  };

  // Confirmar exclusão
  const handleConfirmDelete = () => {
    if (!objectiveToDelete) return;

    const success = storageService.deleteObjective(objectiveToDelete.id);
    if (success) {
      setObjectives((prev) => prev.filter((item) => item.id !== objectiveToDelete.id));
      showToast('success', 'Objetivo excluído com sucesso.');
    } else {
      showToast('error', 'Não foi possível excluir o objetivo.');
    }
    setIsDeleteModalOpen(false);
    setObjectiveToDelete(null);
  };

  // Troca rápida de status no próprio card
  const handleStatusChange = (id: string, newStatus: ObjectiveStatus) => {
    const updated = storageService.updateStatus(id, newStatus);
    if (updated) {
      setObjectives((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      showToast(
        'info',
        newStatus === 'concluido'
          ? 'Parabéns! Objetivo marcado como concluído!'
          : `Status atualizado para "${newStatus === 'em_andamento' ? 'Em andamento' : 'Não iniciado'}".`
      );
    }
  };

  // Carregar exemplos práticos se a lista estiver vazia
  const handleLoadSamples = () => {
    const samples = storageService.resetToSamples();
    setObjectives(samples);
    showToast('info', 'Exemplos de estudos carregados para você explorar!');
  };

  // Filtragem e busca
  const filteredObjectives = useMemo(() => {
    return objectives.filter((item) => {
      // Filtro de status
      if (filter !== 'todos' && item.status !== filter) {
        return false;
      }
      // Busca por título ou descrição
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = (item.description || '').toLowerCase().includes(query);
        return matchesTitle || matchesDesc;
      }
      return true;
    });
  }, [objectives, filter, searchQuery]);

  const hasActiveFilterOrSearch = filter !== 'todos' || Boolean(searchQuery.trim());

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-sans">
      {/* Top Bar */}
      <Header
        onOpenCreateModal={handleOpenCreateModal}
        totalCount={objectives.length}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner acolhedor para iniciantes */}
        <section
          aria-label="Dica para estudantes iniciantes"
          className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-100/70 via-stone-100 to-amber-50/50 border border-amber-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 shrink-0 mt-0.5 sm:mt-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                Dica de aprendizado para iniciantes
              </h2>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                Divida metas grandes em passos curtos de 1 a 2 semanas. A consistência diária é mais valiosa do que longas horas espaçadas.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="text-xs font-bold text-amber-900 bg-amber-200/70 hover:bg-amber-300/80 px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            + Definir objetivo
          </button>
        </section>

        {/* Estatísticas e Quantidade de Objetivos */}
        <StatsCards objectives={objectives} />

        {/* Barra de Filtros e Busca */}
        <FilterBar
          currentFilter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          objectives={objectives}
        />

        {/* Listagem de Objetivos / Estados Vazios */}
        {filteredObjectives.length > 0 ? (
          <section aria-label="Lista de Objetivos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredObjectives.map((obj) => (
                <ObjectiveCard
                  key={obj.id}
                  objective={obj}
                  onEdit={handleOpenEditModal}
                  onDeleteRequest={handleDeleteRequest}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </section>
        ) : (
          <EmptyState
            isFiltered={hasActiveFilterOrSearch}
            onOpenCreateModal={handleOpenCreateModal}
            onClearFilters={() => {
              setFilter('todos');
              setSearchQuery('');
            }}
            onLoadSamples={objectives.length === 0 ? handleLoadSamples : undefined}
          />
        )}
      </main>

      {/* Rodapé institucional limpo */}
      <footer className="mt-auto py-6 border-t border-stone-200/80 bg-white/50 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>StudyFlow · Organização de estudos descomplicada</span>
          <span className="text-stone-400">Dados salvos automaticamente no seu navegador</span>
        </div>
      </footer>

      {/* Modal de Cadastro e Edição */}
      <ObjectiveFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingObjective(null);
        }}
        onSubmit={handleFormSubmit}
        initialObjective={editingObjective}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        objective={objectiveToDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setObjectiveToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Notificações em Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
