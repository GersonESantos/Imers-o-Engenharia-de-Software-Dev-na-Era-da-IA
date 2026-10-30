/**
 * Utilitários para exibição amigável de datas em português do Brasil
 */

export function formatDateBr(dateString: string): string {
  if (!dateString) return 'Sem prazo definido';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export interface DeadlineUrgency {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
  daysRemaining: number;
}

export function getDeadlineUrgency(dateString: string, isCompleted: boolean): DeadlineUrgency | null {
  if (!dateString || isCompleted) return null;

  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return null;

    const deadline = new Date(year, month - 1, day);
    deadline.setHours(23, 59, 59, 999);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const daysOver = Math.abs(diffDays);
      return {
        label: daysOver === 1 ? 'Atrasado há 1 dia' : `Atrasado há ${daysOver} dias`,
        isOverdue: true,
        isToday: false,
        daysRemaining: diffDays,
      };
    }

    if (diffDays === 0) {
      return {
        label: 'Vence hoje!',
        isOverdue: false,
        isToday: true,
        daysRemaining: 0,
      };
    }

    if (diffDays === 1) {
      return {
        label: 'Vence amanhã',
        isOverdue: false,
        isToday: false,
        daysRemaining: 1,
      };
    }

    return {
      label: `Restam ${diffDays} dias`,
      isOverdue: false,
      isToday: false,
      daysRemaining: diffDays,
    };
  } catch {
    return null;
  }
}
