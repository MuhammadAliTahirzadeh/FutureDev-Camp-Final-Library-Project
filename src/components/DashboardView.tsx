import React from 'react';
import { Flame, BookOpen, Calendar, RefreshCw } from 'lucide-react';
import { UserProfile, Book, BorrowRecord } from '../types';
import { GlassCard } from './GlassCard';
import { CircularProgress } from './CircularProgress';

interface DashboardViewProps {
  user: UserProfile;
  books: Book[];
  borrows: BorrowRecord[];
  favorites: string[];
  onToggleFavorite: (bookId: string) => void;
  onUpdateClick: (borrowId: string) => void;
  onRenewClick: (borrowId: string) => void;
  onSelectBook: (bookId: string) => void;
  onIncrementStreak: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  books,
  borrows,
  favorites,
  onToggleFavorite,
  onUpdateClick,
  onRenewClick,
  onSelectBook,
  onIncrementStreak,
}) => {
  // Filter active currently reading borrows
  const activeBorrows = borrows.filter((b) => b.status === 'reading').slice(0, 3);

  // Upcoming returns: returned list or just records needing return soon
  const returnsList = borrows
    .filter((b) => b.status === 'reading' && b.progress < 100)
    .slice(0, 2);

  // Recommendations: general list from mock catalog
  const recommendedBooks = books.slice(3, 7); // Dune, The Alchemist, Sapiens, Quiet

  return (
    <div id="dashboard-view-container" className="space-y-8 animate-fade-in font-sans">
      {/* Header & Welcome */}
      <div id="dashboard-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 id="dashboard-welcome-heading" className="text-4xl font-sans font-bold tracking-tight text-gray-900 dark:text-white">
            Good morning, {user.name.split(' ')[0]}.
          </h1>
          <p id="dashboard-welcome-subheading" className="text-gray-800 dark:text-slate-200 mt-1 font-medium">
            Every day is a great day to discover a new world.
          </p>
        </div>

        {/* Top metrics bar */}
        <div id="dashboard-metrics-row" className="flex gap-4">
          {/* Reading Streak */}
          <GlassCard
            id="streak-metric-card"
            className="flex items-center gap-4 px-6 py-4 border-white/20 select-none"
            title="Gündəlik oxuma progressinizi yenilədikdə streak avtomatik artır"
          >
            <div id="streak-icon-bg" className="p-3 bg-orange-100 dark:bg-orange-950/40 rounded-xl">
              <Flame id="streak-icon" className="w-6 h-6 text-orange-500 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-gray-800 dark:text-slate-200 font-bold">Reading Streak</p>
              <h3 id="streak-value" className="text-xl font-bold text-gray-900 dark:text-white">
                {user.readingStreak} Days
              </h3>
            </div>
          </GlassCard>

          {/* Books Read */}
          <GlassCard
            id="books-read-metric-card"
            className="flex items-center gap-4 px-6 py-4 border-white/20"
          >
            <div id="books-read-icon-bg" className="p-3 bg-blue-100 dark:bg-blue-950/40 rounded-xl">
              <BookOpen id="books-read-icon" className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-800 dark:text-slate-200 font-bold">Books Read</p>
              <h3 id="books-read-value" className="text-xl font-bold text-gray-900 dark:text-white">
                {user.booksReadThisYear} This Year
              </h3>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Currently Reading Section */}
      <div id="currently-reading-section" className="space-y-4">
        <h2 id="currently-reading-title" className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Currently Reading
        </h2>
        {activeBorrows.length === 0 ? (
          <GlassCard className="p-8 text-center text-gray-800 dark:text-slate-200 font-medium">
            You haven't borrowed any books yet. Discover and borrow new books from the Search page!
          </GlassCard>
        ) : (
          <div id="currently-reading-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeBorrows.map((borrow) => {
              const book = books.find((b) => b.id === borrow.bookId);
              if (!book) return null;

              return (
                <GlassCard
                  key={borrow.id}
                  id={`reading-card-${borrow.id}`}
                  className="p-5 flex items-center justify-between border-white/20 group hover:shadow-2xl transition-all"
                >
                  <div className="flex items-center gap-4 flex-1 mr-4">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      onClick={() => onSelectBook(book.id)}
                      className="w-16 h-22 rounded-lg object-cover shadow-md cursor-pointer group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300';
                      }}
                    />
                    <div className="flex flex-col justify-between h-20">
                      <div>
                        <h4
                          onClick={() => onSelectBook(book.id)}
                          className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1 cursor-pointer hover:text-blue-500"
                        >
                          {book.title}
                        </h4>
                        <p className="text-xs text-gray-800 dark:text-slate-200 line-clamp-1 font-medium">{book.author}</p>
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-1">
                          Page {typeof borrow.currentPage === 'number' ? borrow.currentPage : Math.round((borrow.progress / 100) * book.pages)} / {book.pages}
                        </p>
                      </div>
                      <button
                        onClick={() => onUpdateClick(borrow.id)}
                        className="px-4 py-1.5 bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/15 text-gray-800 dark:text-white border border-white/10 rounded-lg text-xs font-semibold transition-all shadow-sm w-max"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                  <CircularProgress percentage={borrow.progress} size={60} strokeWidth={5} />
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Favorite Books Section */}
      {favorites.length > 0 && (
        <div id="favorites-section" className="space-y-4">
          <h2 id="favorites-title" className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Favorite Books
          </h2>
          <GlassCard id="favorites-container" className="p-6 border-white/20 flex gap-6 overflow-x-auto scrollbar-thin">
            {favorites.map((id) => {
              const book = books.find((b) => b.id === id);
              if (!book) return null;
              return (
                <div
                  key={book.id}
                  id={`favorite-item-${book.id}`}
                  onClick={() => onSelectBook(book.id)}
                  className="flex-shrink-0 w-28 group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-xl shadow-lg border border-white/10 mb-3">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-xs font-semibold text-white bg-pink-600/90 px-2.5 py-1 rounded-full">Open</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate group-hover:text-pink-500 transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-[10px] text-gray-800 dark:text-slate-200 font-semibold truncate">{book.author}</p>
                </div>
              );
            })}
          </GlassCard>
        </div>
      )}

      {/* Grid: Recommended for You & Upcoming Returns */}
      <div id="dashboard-bento-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recommended for You */}
        <div id="recommendations-column" className="lg:col-span-7 space-y-4">
          <h2 id="recommendations-title" className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Recommended for You
          </h2>
          <GlassCard id="recommendations-container" className="p-6 border-white/20 flex gap-6 overflow-x-auto scrollbar-thin">
            {recommendedBooks.map((book) => (
              <div
                key={book.id}
                id={`recommended-item-${book.id}`}
                onClick={() => onSelectBook(book.id)}
                className="flex-shrink-0 w-28 group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg border border-white/10 mb-3">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-xs font-semibold text-white bg-blue-600/90 px-2.5 py-1 rounded-full">Explore</span>
                  </div>
                </div>
                <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate group-hover:text-blue-500 transition-colors">
                  {book.title}
                </h4>
                <p className="text-[10px] text-gray-800 dark:text-slate-200 font-semibold truncate">{book.author}</p>
              </div>
            ))}
          </GlassCard>
        </div>

        {/* Upcoming Returns */}
        <div id="returns-column" className="lg:col-span-5 space-y-4">
          <h2 id="returns-title" className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Upcoming Returns
          </h2>
          <GlassCard id="returns-container" className="p-6 border-white/20 space-y-4 h-[212px] flex flex-col justify-between">
            {returnsList.length === 0 ? (
              <div className="text-center text-gray-800 dark:text-slate-200 py-10 font-medium">You have no upcoming book returns.</div>
            ) : (
              <div className="space-y-3 overflow-y-auto pr-1">
                {returnsList.map((borrow) => {
                  const book = books.find((b) => b.id === borrow.bookId);
                  if (!book) return null;

                  return (
                    <div
                      key={borrow.id}
                      id={`return-item-${borrow.id}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 dark:bg-black/10 border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-10 h-14 object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300';
                          }}
                        />
                        <div>
                          <h4 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-1">{book.title}</h4>
                          <p className="text-[10px] text-gray-800 dark:text-slate-200 font-semibold flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-blue-500" /> Due on {new Date(borrow.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onRenewClick(borrow.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-gray-800 dark:text-white transition-all shadow-sm"
                      >
                        <RefreshCw className="w-3 h-3 text-blue-500" /> Renew
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
