import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, BookOpen, Check, HelpCircle, Calendar, FileText, Book as BookIcon, Barcode } from 'lucide-react';
import { Book, BorrowRecord } from '../types';
import { GlassCard } from './GlassCard';

interface SearchViewProps {
  books: Book[];
  borrows: BorrowRecord[];
  favorites: string[];
  onToggleFavorite: (bookId: string) => void;
  onBorrowBook: (bookId: string) => void;
  onSelectBook: (bookId: string) => void;
  onCancelBorrow: (bookId: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  books,
  borrows,
  favorites,
  onToggleFavorite,
  onBorrowBook,
  onSelectBook,
  onCancelBorrow,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'borrowed'>('all');
  const [maxYear, setMaxYear] = useState(2026);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [detailedBook, setDetailedBook] = useState<Book | null>(null);

  // Dynamic list of unique categories in our mock list
  const allCategories = useMemo(() => {
    return Array.from(new Set(books.map((b) => b.category)));
  }, [books]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // Filter books dynamically based on query, categories, availability, and publication year
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // 1. Text Query matches title, author, or description
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query);

      // 2. Category filter matches
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(book.category);

      // 3. Availability checks in active borrows
      const isCurrentlyBorrowed = borrows.some((b) => b.bookId === book.id && b.status === 'reading');
      const matchesAvailability =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && !isCurrentlyBorrowed) ||
        (availabilityFilter === 'borrowed' && isCurrentlyBorrowed);

      // 4. Year check
      const matchesYear = book.publishedYear <= maxYear;

      return matchesQuery && matchesCategory && matchesAvailability && matchesYear;
    });
  }, [books, searchQuery, selectedCategories, availabilityFilter, maxYear, borrows]);

  return (
    <div id="search-view-container" className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div id="search-header" className="flex justify-between items-center">
        <div>
          <h1 id="search-view-title" className="text-4xl font-sans font-bold tracking-tight text-gray-900 dark:text-white">
            Search Results
          </h1>
          <p id="search-view-subtitle" className="text-gray-800 dark:text-slate-200 mt-1 font-medium">
            Search our comprehensive library archive in seconds.
          </p>
        </div>

        {/* Toggle Filters Panel (Desktop focus) */}
        <button
          id="toggle-filters-btn"
          onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-semibold text-gray-800 dark:text-white transition-all shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4 text-blue-500" />
          {isFilterPanelOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Main Search Bar (Floating design) */}
      <GlassCard id="main-search-bar" className="p-4 border-white/20 flex items-center gap-4 bg-white/10 dark:bg-black/20">
        <Search className="w-5 h-5 text-gray-800 dark:text-slate-200 select-none flex-shrink-0 font-bold" />
        <input
          id="search-input-field"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search book title, author, category..."
          className="flex-1 bg-transparent border-none text-base text-gray-900 dark:text-white focus:outline-none placeholder-gray-800 dark:placeholder-slate-300 font-medium"
        />
        {searchQuery && (
          <button
            id="clear-search-btn"
            onClick={() => setSearchQuery('')}
            className="p-1 hover:bg-white/20 rounded-full transition-all"
          >
            <X className="w-4 h-4 text-gray-800 dark:text-slate-200 hover:text-gray-950 font-bold" />
          </button>
        )}
      </GlassCard>

      {/* Grid: Books List vs Filters panel */}
      <div id="search-results-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Books Card List */}
        <div id="books-results-col" className={`space-y-6 ${isFilterPanelOpen ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          {filteredBooks.length === 0 ? (
            <GlassCard className="p-16 text-center text-gray-800 dark:text-slate-200 font-semibold border-white/15">
              <BookOpen className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-4 animate-bounce" />
              <h3 className="font-bold text-lg text-gray-800 dark:text-slate-200">No Books Found</h3>
              <p className="text-xs text-gray-800 dark:text-slate-200 mt-2 font-semibold">Try changing your search query or clearing some filters.</p>
            </GlassCard>
          ) : (
            <div
              id="search-books-layout-grid"
              className={`grid grid-cols-2 ${isFilterPanelOpen ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-6`}
            >
              {filteredBooks.map((book) => {
                const isBorrowed = borrows.some((b) => b.bookId === book.id && b.status === 'reading');
                return (
                  <GlassCard
                    key={book.id}
                    id={`search-item-card-${book.id}`}
                    className="p-4 flex flex-col justify-between hover:scale-103 hover:shadow-2xl transition-all duration-300 group border-white/15"
                  >
                    <div className="space-y-4">
                      {/* Image container */}
                      <div
                        onClick={() => setDetailedBook(book)}
                        className="relative overflow-hidden rounded-xl shadow-md border border-white/5 aspect-[3/4] cursor-pointer"
                      >
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <span className="text-xs font-semibold text-white bg-blue-600/90 px-3 py-1.5 rounded-full shadow-lg">Details</span>
                        </div>
                      </div>

                      {/* Info Text */}
                      <div>
                        <h4
                          onClick={() => setDetailedBook(book)}
                          className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1 cursor-pointer hover:text-blue-500"
                        >
                          {book.title}
                        </h4>
                        <p className="text-xs text-gray-800 dark:text-slate-300 line-clamp-1 font-semibold mt-0.5">{book.author}</p>
                        <span className="inline-block bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-300 text-[9px] font-bold px-2 py-0.5 rounded-md mt-2">
                          {book.category}
                        </span>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="pt-4 mt-4 border-t border-white/5">
                      {isBorrowed ? (
                        <button
                          id={`borrow-btn-${book.id}`}
                          onClick={() => onCancelBorrow(book.id)}
                          className="w-full flex items-center justify-center gap-1 py-2 bg-blue-500/15 hover:bg-red-500/10 text-blue-600 dark:text-blue-400 hover:text-red-500 border border-transparent hover:border-red-500/20 text-xs font-bold rounded-xl transition-all duration-200 active:scale-95 cursor-pointer group"
                          title="Click to cancel borrow and return book to library"
                        >
                          <Check className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 group-hover:hidden" />
                          <span className="group-hover:hidden">Reading</span>
                          <span className="hidden group-hover:inline">Cancel Borrow</span>
                        </button>
                      ) : (
                        <button
                          id={`borrow-btn-${book.id}`}
                          onClick={() => onBorrowBook(book.id)}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          Borrow
                        </button>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar: Dynamic Filters (Screen 4 Layout) */}
        {isFilterPanelOpen && (
          <div id="filters-col" className="lg:col-span-4 lg:sticky lg:top-24">
            <GlassCard id="filter-panel-card" className="p-6 border-white/20 bg-white/15 dark:bg-black/10 space-y-6">
              <div id="filter-header" className="flex items-center justify-between pb-3 border-b border-white/5">
                <h3 className="font-sans font-bold text-base text-gray-900 dark:text-white">Filter Results</h3>
                <button
                  id="reset-filters-btn"
                  onClick={() => {
                    setSelectedCategories([]);
                    setAvailabilityFilter('all');
                    setMaxYear(2026);
                  }}
                  className="text-xs text-blue-500 font-bold hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Categories checkboxes */}
              <div id="categories-filter-group" className="space-y-3">
                <h4 className="text-xs text-gray-800 dark:text-slate-200 font-extrabold uppercase tracking-wider">Categories</h4>
                <div className="space-y-2">
                  {allCategories.map((category) => {
                    const isChecked = selectedCategories.includes(category);
                    return (
                      <label key={category} className="flex items-center gap-3 cursor-pointer text-sm font-extrabold text-gray-950 dark:text-white hover:text-black">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCategoryToggle(category)}
                          className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 dark:bg-slate-800 accent-blue-600"
                        />
                        {category}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Availability Filter Toggles */}
              <div id="availability-filter-group" className="space-y-3">
                <h4 className="text-xs text-gray-800 dark:text-slate-200 font-extrabold uppercase tracking-wider">Availability</h4>
                <div className="space-y-2">
                  {(['all', 'available', 'borrowed'] as const).map((opt) => {
                    const isSelected = availabilityFilter === opt;
                    return (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer text-sm font-extrabold text-gray-950 dark:text-white">
                        <input
                          type="radio"
                          name="availability"
                          checked={isSelected}
                          onChange={() => setAvailabilityFilter(opt)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:bg-slate-800 accent-blue-600"
                        />
                        {opt === 'all' ? 'All' : opt === 'available' ? 'Available (In Library)' : 'Borrowed'}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Publication Year Slider (Screen 4 Slider) */}
              <div id="year-filter-group" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs text-gray-800 dark:text-slate-200 font-extrabold uppercase tracking-wider">Year</h4>
                  <span id="year-filter-val" className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100/40 dark:bg-blue-900/10 px-2 py-0.5 rounded-md">
                    &lt;= {maxYear}
                  </span>
                </div>
                <input
                  id="year-range-slider"
                  type="range"
                  min="1930"
                  max="2026"
                  value={maxYear}
                  onChange={(e) => setMaxYear(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-400"
                />
                <div className="flex justify-between text-[10px] text-gray-800 dark:text-slate-200 font-extrabold">
                  <span>1930</span>
                  <span>1980</span>
                  <span>2026</span>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>

      {/* Detailed Book Modal Overlay */}
      {detailedBook && (
        <div 
          id="book-detail-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
          onClick={() => setDetailedBook(null)}
        >
          <div 
            id="book-detail-modal-card"
            className="relative w-full max-w-4xl backdrop-blur-xl bg-slate-900/80 dark:bg-black/75 border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-300 transform scale-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              id="close-detail-modal-btn"
              onClick={() => setDetailedBook(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all cursor-pointer z-10"
              title="Close Details"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
              {/* Left Column: Book Cover */}
              <div className="col-span-1 md:col-span-4 flex justify-center">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 aspect-[3/4] w-full max-w-[240px] shadow-2xl">
                  <img
                    src={detailedBook.coverUrl}
                    alt={detailedBook.title}
                    className="w-full h-full object-cover animate-fade-in"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300';
                    }}
                  />
                </div>
              </div>

              {/* Right Column: Title, Author, Description, Actions */}
              <div className="col-span-1 md:col-span-8 flex flex-col h-full justify-between space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {detailedBook.title}
                  </h2>
                  <p className="text-base md:text-lg text-slate-300 dark:text-gray-400 font-medium mt-1">
                    {detailedBook.author}
                  </p>
                  <span className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-2.5 py-1 rounded-md mt-3">
                    {detailedBook.category}
                  </span>
                  
                  <p className="text-sm md:text-base text-gray-200 dark:text-gray-300 mt-6 leading-relaxed">
                    {detailedBook.description}
                  </p>
                </div>

                {/* Two Distinct Buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  {/* Button 1: Borrow / Cancel Borrow */}
                  {borrows.some((b) => b.bookId === detailedBook.id && b.status === 'reading') ? (
                    <button
                      id={`modal-borrow-btn-${detailedBook.id}`}
                      onClick={() => onCancelBorrow(detailedBook.id)}
                      className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-6 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 text-sm font-bold rounded-xl transition-all duration-200 active:scale-95 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Cancel Borrow
                    </button>
                  ) : (
                    <button
                      id={`modal-borrow-btn-${detailedBook.id}`}
                      onClick={() => onBorrowBook(detailedBook.id)}
                      className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 active:scale-95 cursor-pointer"
                    >
                      Borrow
                    </button>
                  )}

                  {/* Button 2: Add to Shelf / Remove from Shelf */}
                  {favorites.includes(detailedBook.id) ? (
                    <button
                      id={`modal-fav-btn-${detailedBook.id}`}
                      onClick={() => onToggleFavorite(detailedBook.id)}
                      className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-6 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 text-sm font-bold rounded-xl transition-all duration-200 active:scale-95 cursor-pointer"
                    >
                      Remove from Shelf
                    </button>
                  ) : (
                    <button
                      id={`modal-fav-btn-${detailedBook.id}`}
                      onClick={() => onToggleFavorite(detailedBook.id)}
                      className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-6 bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20 text-sm font-bold rounded-xl shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
                    >
                      Add to Shelf
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Thin Horizontal Divider Line */}
            <hr className="my-6 border-white/10" />

            {/* Bottom Metadata Boxes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Box 1: Published */}
              <div className="flex items-center gap-3 p-3.5 bg-white/5 dark:bg-black/20 border border-white/10 rounded-2xl">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Published</p>
                  <p className="text-sm font-bold text-white">{detailedBook.publishedYear}</p>
                </div>
              </div>

              {/* Box 2: Pages */}
              <div className="flex items-center gap-3 p-3.5 bg-white/5 dark:bg-black/20 border border-white/10 rounded-2xl">
                <div className="p-2 bg-green-500/10 text-green-400 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Pages</p>
                  <p className="text-sm font-bold text-white">{detailedBook.pages}</p>
                </div>
              </div>

              {/* Box 3: Format */}
              <div className="flex items-center gap-3 p-3.5 bg-white/5 dark:bg-black/20 border border-white/10 rounded-2xl">
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                  <BookIcon className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">Format</p>
                  <p className="text-sm font-bold text-white">{detailedBook.format}</p>
                </div>
              </div>

              {/* Box 4: ISBN */}
              <div className="flex items-center gap-3 p-3.5 bg-white/5 dark:bg-black/20 border border-white/10 rounded-2xl">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                  <Barcode className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider">ISBN</p>
                  <p className="text-sm font-bold text-white truncate">{detailedBook.isbn}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
