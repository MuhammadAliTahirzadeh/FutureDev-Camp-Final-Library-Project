import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  totalPages: number;
  currentPage: number;
  onSave: (newPage: number) => void;
}

export const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({
  isOpen,
  onClose,
  bookTitle,
  totalPages,
  currentPage,
  onSave,
}) => {
  const [page, setPage] = useState(currentPage);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(page);
    onClose();
  };

  return (
    <div id="modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in font-sans">
      <GlassCard
        id="modal-card"
        className="w-full max-w-md p-6 bg-white/90 dark:bg-slate-900/90 border-white/40 shadow-2xl animate-scale-up"
      >
        {/* Header */}
        <div id="modal-header" className="flex items-center justify-between mb-6">
          <h3 id="modal-title" className="font-sans font-bold text-lg text-gray-900 dark:text-white">
            Reading Progress Update
          </h3>
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form id="modal-form" onSubmit={handleSubmit} className="space-y-6">
          <div id="modal-book-meta">
            <label className="text-xs text-gray-800 dark:text-slate-200 block font-extrabold uppercase tracking-wider">Book Title</label>
            <span id="modal-book-name" className="text-base font-bold text-gray-800 dark:text-white mt-1 block">
              {bookTitle}
            </span>
          </div>

          <div id="modal-slider-container" className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs text-gray-800 dark:text-slate-200 font-extrabold uppercase tracking-wider">Pages Read</label>
              <div className="flex items-center gap-2">
                <input
                  id="progress-page-input"
                  type="number"
                  min="0"
                  max={totalPages}
                  value={page}
                  onChange={(e) => {
                    const val = Math.min(totalPages, Math.max(0, Number(e.target.value) || 0));
                    setPage(val);
                  }}
                  className="w-20 px-2 py-1 text-right font-bold text-sm bg-gray-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">/ {totalPages} pages</span>
              </div>
            </div>
            <input
              id="progress-range-slider"
              type="range"
              min="0"
              max={totalPages}
              value={page}
              onChange={(e) => setPage(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400"
            />
            <div className="flex justify-between text-[10px] text-gray-800 dark:text-slate-200 font-bold px-1">
              <span>Page 0</span>
              <span>Page {Math.round(totalPages * 0.25)}</span>
              <span>Page {Math.round(totalPages * 0.5)}</span>
              <span>Page {Math.round(totalPages * 0.75)}</span>
              <span>Page {totalPages}</span>
            </div>
            <div className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
              ({totalPages > 0 ? Math.round((page / totalPages) * 100) : 0}% Completed)
            </div>
          </div>

          {/* Buttons */}
          <div id="modal-actions" className="flex gap-3 justify-end pt-2">
            <button
              id="modal-cancel-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              id="modal-submit-btn"
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
            >
              <Check className="w-4 h-4" /> Save Progress
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
