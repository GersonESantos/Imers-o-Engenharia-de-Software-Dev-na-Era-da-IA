export type ObjectiveStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface Objective {
  id: string;
  title: string;
  description: string;
  deadline: string; // formato YYYY-MM-DD
  status: ObjectiveStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type ObjectiveFormData = {
  title: string;
  description: string;
  deadline: string;
  status: ObjectiveStatus;
};

export type FilterStatus = 'todos' | ObjectiveStatus;

export const STATUS_LABELS: Record<ObjectiveStatus, string> = {
  nao_iniciado: 'Não iniciado',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
};

export const STATUS_DESCRIPTIONS: Record<ObjectiveStatus, string> = {
  nao_iniciado: 'Planejado para começar em breve',
  em_andamento: 'Estudo ativo e em progresso',
  concluido: 'Objetivo alcançado com sucesso',
};
