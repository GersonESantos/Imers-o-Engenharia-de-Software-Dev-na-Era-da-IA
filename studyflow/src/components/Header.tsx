import React from 'react';
import { BookOpen, Plus } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal, totalCount }) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-900 text-stone-100 shadow-md border-b border-stone-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
              StudyFlow
            </h1>
          </div>
        </div>

        {/* Center Subtitle on medium+ screens */}
        <p className="hidden md:block text-xs text-stone-400 font-medium">
          Organização simples e sem estresse para iniciantes
        </p>

        {/* Action Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl transition-all shadow-sm shadow-amber-950/20 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Novo Objetivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
