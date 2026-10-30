import { Objective, ObjectiveFormData } from '../types/objective';

const STORAGE_KEY = 'studyflow_objectives_v1';

// Exemplos iniciais acolhedores para estudantes iniciantes
export const INITIAL_SAMPLE_OBJECTIVES: Objective[] = [
  {
    id: 'sample-1',
    title: 'Fundamentos de Algoritmos e Lógica',
    description: 'Compreender estruturas condicionais (if/else) e laços de repetição (for/while) com exercícios práticos.',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Vocabulário Essencial de Inglês para Tech',
    description: 'Listar e praticar 30 termos técnicos em inglês mais usados na documentação e fóruns de desenvolvimento.',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'nao_iniciado',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Montagem do Ambiente de Estudos',
    description: 'Instalar editor de código, configurar navegador e organizar a pasta principal de anotações no computador.',
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'concluido',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const storageService = {
  /**
   * Recupera a lista de objetivos salva no localStorage.
   * Se for a primeira visita do estudante, inicializa com exemplos práticos.
   */
  getObjectives(): Objective[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Inicializa com dados de exemplo amigáveis na primeira execução
        this.saveObjectives(INITIAL_SAMPLE_OBJECTIVES);
        return INITIAL_SAMPLE_OBJECTIVES;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa de objetivos no localStorage.
   */
  saveObjectives(objectives: Objective[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
    } catch (error) {
      console.error('Erro ao persistir objetivos no localStorage:', error);
    }
  },

  /**
   * Cadastra um novo objetivo gerando identificador único e carimbos de data.
   */
  createObjective(data: ObjectiveFormData): Objective {
    const currentList = this.getObjectives();
    const now = new Date().toISOString();
    const newObjective: Objective = {
      id: 'obj_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7),
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    };

    const updatedList = [newObjective, ...currentList];
    this.saveObjectives(updatedList);
    return newObjective;
  },

  /**
   * Atualiza os dados de um objetivo existente.
   */
  updateObjective(id: string, data: ObjectiveFormData): Objective | null {
    const currentList = this.getObjectives();
    const index = currentList.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updatedObjective: Objective = {
      ...currentList[index],
      title: data.title.trim(),
      description: data.description.trim(),
      deadline: data.deadline,
      status: data.status,
      updatedAt: new Date().toISOString(),
    };

    currentList[index] = updatedObjective;
    this.saveObjectives(currentList);
    return updatedObjective;
  },

  /**
   * Remove um objetivo pelo ID.
   */
  deleteObjective(id: string): boolean {
    const currentList = this.getObjectives();
    const filtered = currentList.filter((item) => item.id !== id);
    if (filtered.length === currentList.length) {
      return false;
    }
    this.saveObjectives(filtered);
    return true;
  },

  /**
   * Atualiza apenas o status de um objetivo (atalho rápido no card).
   */
  updateStatus(id: string, newStatus: Objective['status']): Objective | null {
    const currentList = this.getObjectives();
    const index = currentList.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updated: Objective = {
      ...currentList[index],
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    currentList[index] = updated;
    this.saveObjectives(currentList);
    return updated;
  },

  /**
   * Limpa todos os dados ou reinicia para exemplos caso o usuário queira.
   */
  resetToSamples(): Objective[] {
    this.saveObjectives(INITIAL_SAMPLE_OBJECTIVES);
    return INITIAL_SAMPLE_OBJECTIVES;
  },

  clearAll(): void {
    this.saveObjectives([]);
  },
};
