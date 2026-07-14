import React, { useState } from 'react';
import { Calendar, Layers, Hash, BookOpen, Trash2, Heart, PlusCircle, CheckCircle } from 'lucide-react';
import { Book, BorrowRecord } from '../types';
import { GlassCard } from './GlassCard';

interface MyShelfViewProps {
  books: Book[];
  borrows: BorrowRecord[];
  favorites: string[];
  onToggleFavorite: (bookId: string) => void;
  onSetCurrentlyReading: (bookId: string) => void;
  onBorrowBook: (bookId: string) => void;
  onReturnBook: (bookId: string) => void;
  selectedBookId: string | null;
  onSelectBook: (bookId: string) => void;
}

export const MyShelfView: React.FC<MyShelfViewProps> = ({
  books,
  borrows,
  favorites,
  onToggleFavorite,
  onSetCurrentlyReading,
  onBorrowBook,
  onReturnBook,
  selectedBookId,
  onSelectBook,
}) => {
  const [shelfFilter, setShelfFilter] = useState<'all' | 'reading' | 'returned' | 'favorites'>('all');

  // Find user borrowed books details
  const shelfRecords = borrows.filter((borrow) => {
    if (shelfFilter === 'all' || shelfFilter === 'favorites') return true;
    return borrow.status === shelfFilter;
  });

  // Get matching books for shelf view
  const shelfBooks = shelfFilter === 'favorites'
    ? favorites.map((id) => {
        const book = books.find((b) => b.id === id);
        const br = borrows.find((x) => x.bookId === id);
        return book ? { ...book, borrowRecord: br } : null;
      }).filter((b) => b !== null) as (Book & { borrowRecord?: BorrowRecord })[]
    : shelfRecords.map((b) => {
        const book = books.find((x) => x.id === b.bookId);
        return { ...book, borrowRecord: b };
      }).filter((b) => b.id !== undefined) as (Book & { borrowRecord?: BorrowRecord })[];

  // Fallback to active book if selectedBookId is empty, or the first shelf book
  const activeBookId = selectedBookId || (shelfBooks.length > 0 ? shelfBooks[0].id : null);
  const activeBook = books.find((b) => b.id === activeBookId);
  const activeBorrow = borrows.find((b) => b.bookId === activeBookId && b.status === 'reading');
  const completedRecord = borrows.find((b) => b.bookId === activeBookId && b.status === 'returned');

  return (
    <div id="myshelf-view-container" className="space-y-8 animate-fade-in font-sans">
      <div id="myshelf-header">
        <h1 id="myshelf-title" className="text-4xl font-sans font-bold tracking-tight text-gray-900 dark:text-white">
          My Shelf
        </h1>
        <p id="myshelf-subtitle" className="text-gray-800 dark:text-slate-200 mt-1 font-medium">
          All books you are reading or have completed in one place.
        </p>
      </div>

      <div id="myshelf-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Shelf List */}
        <div id="shelf-list-col" className="lg:col-span-5 space-y-6">
          {/* Filters Row */}
          <div id="shelf-filters" className="flex bg-gray-100 dark:bg-slate-800/60 p-1.5 rounded-xl border border-gray-200/40 dark:border-white/5">
            {(['all', 'reading', 'returned', 'favorites'] as const).map((filter) => (
              <button
                key={filter}
                id={`shelf-filter-btn-${filter}`}
                onClick={() => setShelfFilter(filter)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                  shelfFilter === filter
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                    : 'text-gray-800 dark:text-slate-200 hover:text-gray-950 dark:hover:text-white'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'reading' ? 'Reading' : filter === 'returned' ? 'Completed' : `Favorites (${favorites.length})`}
              </button>
            ))}
          </div>

          {/* Book List Stack */}
          <div id="shelf-books-scroll" className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
            {shelfBooks.length === 0 ? (
              <GlassCard className="p-8 text-center text-gray-800 dark:text-slate-200 border-white/10 font-semibold">
                No books found in this category.
              </GlassCard>
            ) : (
              shelfBooks.map((item) => {
                const isActive = activeBookId === item.id;
                return (
                  <GlassCard
                    key={item.borrowRecord ? `${item.id}-${item.borrowRecord.id}` : `${item.id}-fav`}
                    id={`shelf-list-card-${item.id}`}
                    onClick={() => onSelectBook(item.id)}
                    className={`p-4 flex items-center justify-between border-white/20 hover:scale-101 transition-all ${
                      isActive ? 'ring-2 ring-blue-500 bg-white/20 dark:bg-white/15' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        className="w-12 h-18 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300';
                        }}
                      />
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-gray-800 dark:text-slate-300 font-semibold">{item.author}</p>
                        {item.borrowRecord ? (
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 capitalize ${
                              item.borrowRecord.status === 'reading'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            }`}
                          >
                            {item.borrowRecord.status === 'reading'
                              ? `Reading (p. ${typeof item.borrowRecord.currentPage === 'number' ? item.borrowRecord.currentPage : Math.round((item.borrowRecord.progress / 100) * item.pages)} / ${item.pages})`
                              : 'Completed'}
                          </span>
                        ) : (
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 capitalize bg-pink-100 text-pink-850 dark:bg-pink-950/30 dark:text-pink-300">
                            Favorite
                          </span>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Book Details Pane (Screen 2 High Fidelity clone) */}
        <div id="shelf-details-col" className="lg:col-span-7">
          {activeBook ? (
            <GlassCard id="book-details-pane-card" className="p-8 border-white/30 bg-white/15 dark:bg-black/10 relative overflow-hidden flex flex-col justify-between h-[600px]">
              {/* Top Details block */}
              <div id="details-pane-top" className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Book Cover Image */}
                  <div className="w-40 h-56 rounded-xl overflow-hidden shadow-2xl border border-white/15 flex-shrink-0 mx-auto md:mx-0">
                    <img
                      src={activeBook.coverUrl}
                      alt={activeBook.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300';
                      }}
                    />
                  </div>

                  {/* Metadata Text */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 id="details-book-title" className="text-3xl font-sans font-bold text-gray-950 dark:text-white tracking-tight">
                        {activeBook.title}
                      </h2>
                      <p id="details-book-author" className="text-lg text-blue-600 dark:text-blue-400 font-semibold mt-1">
                        {activeBook.author}
                      </p>
                    </div>

                    <p id="details-book-desc" className="text-sm text-gray-800 dark:text-slate-200 leading-relaxed font-medium">
                      {activeBook.description}
                    </p>

                    {/* Action buttons (Screen 2 buttons) */}
                    <div id="details-action-buttons-row" className="flex flex-wrap gap-4 pt-2">
                      {activeBorrow ? (
                        <button
                          id="action-return-btn"
                          onClick={() => onReturnBook(activeBook.id)}
                          className="flex items-center gap-2 px-6 py-3 bg-red-600/90 hover:bg-red-700 text-white font-semibold text-sm rounded-xl shadow-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" /> Return Book
                        </button>
                      ) : completedRecord ? (
                        <button
                          id="action-re-read-btn"
                          onClick={() => onSetCurrentlyReading(activeBook.id)}
                          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl shadow-lg transition-all"
                        >
                          <BookOpen className="w-4 h-4" /> Currently Reading
                        </button>
                      ) : (
                        <button
                          id="action-borrow-btn"
                          onClick={() => onBorrowBook(activeBook.id)}
                          className="flex items-center gap-2 px-6 py-3 bg-blue-600/90 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg transition-all"
                        >
                          <CheckCircle className="w-4 h-4" /> Borrow Book
                        </button>
                      )}

                      <button
                        id="action-toggle-fav-btn"
                        onClick={() => onToggleFavorite(activeBook.id)}
                        className={`flex items-center gap-2 px-6 py-3 border font-semibold text-sm rounded-xl transition-all shadow-sm ${
                          favorites.includes(activeBook.id)
                            ? 'bg-pink-100 dark:bg-pink-950/30 text-pink-600 border-pink-300 dark:border-pink-900/50'
                            : 'bg-white/20 dark:bg-white/5 hover:bg-white/30 dark:hover:bg-white/10 border-white/20 text-gray-800 dark:text-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(activeBook.id) ? 'fill-pink-600' : ''}`} />
                        {favorites.includes(activeBook.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Technical Stats Block (Grid format exactly like Screen 2) */}
                <div id="technical-stats-grid" className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                  <div className="bg-white/5 dark:bg-black/20 p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-800 dark:text-slate-200 font-extrabold block uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" /> Published
                    </span>
                    <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                      {activeBook.publishedYear}
                    </span>
                  </div>

                  <div className="bg-white/5 dark:bg-black/20 p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-800 dark:text-slate-200 font-extrabold block uppercase tracking-wider mb-1 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" /> Pages
                    </span>
                    <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                      {activeBook.pages}
                    </span>
                  </div>

                  <div className="bg-white/5 dark:bg-black/20 p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-800 dark:text-slate-200 font-extrabold block uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-500" /> Format
                    </span>
                    <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                      {activeBook.format}
                    </span>
                  </div>

                  <div className="bg-white/5 dark:bg-black/20 p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] text-gray-800 dark:text-slate-200 font-extrabold block uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-blue-500" /> ISBN
                    </span>
                    <span className="text-xs font-extrabold text-gray-900 dark:text-white truncate block">
                      {activeBook.isbn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic reading status footer card */}
              {activeBorrow && (
                <div id="details-pane-reading-progress" className="p-4 bg-blue-500/10 dark:bg-blue-900/10 border border-blue-500/20 rounded-xl mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Current Reading Progress</span>
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                      Page {typeof activeBorrow.currentPage === 'number' ? activeBorrow.currentPage : Math.round((activeBorrow.progress / 100) * activeBook.pages)} / {activeBook.pages} ({activeBorrow.progress}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${activeBorrow.progress}%` }}></div>
                  </div>
                </div>
              )}
            </GlassCard>
          ) : (
            <GlassCard className="h-full flex items-center justify-center text-gray-800 dark:text-slate-200 font-bold">
              Select a book to inspect details.
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
