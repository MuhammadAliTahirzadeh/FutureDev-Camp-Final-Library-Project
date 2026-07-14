import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { MyShelfView } from './components/MyShelfView';
import { SearchView } from './components/SearchView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { AdminView } from './components/AdminView';
import { AILibrarian } from './components/AILibrarian';
import { UpdateProgressModal } from './components/UpdateProgressModal';
import {
  UserProfile,
  Book,
  BorrowRecord,
  ActivityLog,
  SystemAlert,
  INITIAL_USER,
  INITIAL_BOOKS,
  INITIAL_BORROWS,
  INITIAL_ACTIVITIES,
  INITIAL_ALERTS,
} from './types';

// Helper to format local date as YYYY-MM-DD
const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to get difference in calendar days between two YYYY-MM-DD strings
const getDaysBetween = (date1Str: string, date2Str: string) => {
  const d1 = new Date(date1Str + 'T00:00:00');
  const d2 = new Date(date2Str + 'T00:00:00');
  const diffTime = d1.getTime() - d2.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

export default function App() {
  // Global States (acting as our client-side state engine with localStorage persistence)
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('user_profile');
    const u = saved ? JSON.parse(saved) : INITIAL_USER;
    return {
      ...u,
      readingStreak: 0,
      booksReadThisYear: 0,
    };
  });
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [borrows, setBorrows] = useState<BorrowRecord[]>(() => {
    const saved = localStorage.getItem('borrow_records');
    const parsed: BorrowRecord[] = saved ? JSON.parse(saved) : INITIAL_BORROWS;
    // Deduplicate: Keep only the first record for each bookId (since newer ones are added to the front)
    const deduped: BorrowRecord[] = [];
    const seen = new Set<string>();
    for (const b of parsed) {
      if (!seen.has(b.bookId)) {
        seen.add(b.bookId);
        deduped.push(b);
      }
    }
    return deduped;
  });
  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('activity_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);

  // Favorites global state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorite_books');
    return saved ? JSON.parse(saved) : ['1', '3']; // Pre-populate some favorites
  });

  // Layout & Routing States
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Modal State
  const [updateBorrowId, setUpdateBorrowId] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('borrow_records', JSON.stringify(borrows));
  }, [borrows]);

  useEffect(() => {
    localStorage.setItem('activity_logs', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('favorite_books', JSON.stringify(favorites));
  }, [favorites]);

  // Sync dark class on document element for tailwind dark: selectors
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Verify streak on mount
  useEffect(() => {
    const todayStr = getLocalDateString();
    const lastUpdate = localStorage.getItem('lastStreakUpdateDate');

    if (lastUpdate) {
      const diffDays = getDaysBetween(todayStr, lastUpdate);
      // If they missed more than 1 day (i.e. diffDays > 1), reset streak to 0
      if (diffDays > 1) {
        setUser((prev) => ({ ...prev, readingStreak: 0 }));
        logActivity('Streak Reset', 'Reading streak was reset because no reading was logged yesterday.');
      }
    } else {
      // First run, initialize last update date to yesterday so initial streak is preserved
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayYear = yesterday.getFullYear();
      const yesterdayMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
      const yesterdayDay = String(yesterday.getDate()).padStart(2, '0');
      const yesterdayStr = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;
      localStorage.setItem('lastStreakUpdateDate', yesterdayStr);
    }
  }, []);

  // Utility to inject new logs
  const logActivity = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `act_${Date.now()}`,
      date: new Date().toLocaleDateString('en-US'),
      user: user.name,
      action,
      details,
    };
    setActivities((prev) => [newLog, ...prev]);
  };

  // ----------------------------------------------------
  // EVENT HANDLERS (Domain Service Layer Rules)
  // ----------------------------------------------------

  // Borrow a book
  const handleBorrowBook = (bookId: string) => {
    // Check if already borrowed
    const alreadyBorrowed = borrows.some((b) => b.bookId === bookId && b.status === 'reading');
    if (alreadyBorrowed) return;

    // Create borrow record
    const newRecord: BorrowRecord = {
      id: `b_${Date.now()}`,
      bookId,
      userId: user.id,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days due
      progress: 15, // Starting progress
      status: 'reading',
    };

    setBorrows((prev) => [newRecord, ...prev.filter((b) => b.bookId !== bookId)]);

    // Update book status
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, isAvailable: false, borrowCount: b.borrowCount + 1 } : b))
    );

    const book = books.find((b) => b.id === bookId);
    logActivity('Borrow Book', `Borrowed: ${book?.title || bookId}`);
  };

  // Cancel/Undo borrow of a book
  const handleCancelBorrow = (bookId: string) => {
    // Filter out the active reading record for this book
    setBorrows((prev) => prev.filter((b) => !(b.bookId === bookId && b.status === 'reading')));

    // Update book availability back to true
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, isAvailable: true } : b))
    );

    const book = books.find((b) => b.id === bookId);
    logActivity('Cancel Borrow', `Canceled borrowing for: ${book?.title || bookId}`);
  };

  // Return a book
  const handleReturnBook = (bookId: string) => {
    setBorrows((prev) =>
      prev.map((b) =>
        b.bookId === bookId && b.status === 'reading'
          ? { ...b, status: 'returned', progress: 100, returnDate: new Date().toISOString().split('T')[0] }
          : b
      )
    );

    // Update book availability
    setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, isAvailable: true } : b)));

    // Increment completed books counter
    setUser((prev) => ({ ...prev, booksReadThisYear: prev.booksReadThisYear + 1 }));

    const book = books.find((b) => b.id === bookId);
    logActivity('Return Book', `Returned: ${book?.title || bookId}`);

    // Unlock an achievement if they reach 33 books read!
    if (user.booksReadThisYear + 1 >= 33) {
      unlockAchievement('Elite Scholar', 'Read 33+ books in a single calendar year', '👑');
    }
  };

  // Update Reading Progress
  const handleSaveProgress = (newPage: number) => {
    if (!updateBorrowId) return;

    const borrow = borrows.find((b) => b.id === updateBorrowId);
    if (!borrow) return;

    const book = books.find((b) => b.id === borrow.bookId);
    const totalPages = book?.pages || 100;
    const newProgress = totalPages > 0 ? Math.round((newPage / totalPages) * 100) : 0;

    const progressChanged = borrow.progress !== newProgress || borrow.currentPage !== newPage;
    const isDone = newProgress === 100 && borrow.status === 'reading';

    setBorrows((prev) =>
      prev.map((b) => {
        if (b.id === updateBorrowId) {
          return {
            ...b,
            progress: newProgress,
            currentPage: newPage,
            status: newProgress === 100 ? 'returned' : b.status,
            returnDate: newProgress === 100 ? new Date().toISOString().split('T')[0] : b.returnDate,
          };
        }
        return b;
      })
    );

    if (isDone) {
      // Also update availability
      setBooks((curr) => curr.map((bk) => (bk.id === borrow.bookId ? { ...bk, isAvailable: true } : bk)));
      setUser((curr) => ({ ...curr, booksReadThisYear: curr.booksReadThisYear + 1 }));
    }

    logActivity('Reading Update', `${book?.title || 'Book'} progress updated to page ${newPage}/${totalPages} (${newProgress}%)`);

    let nextStreak = user.readingStreak;

    // Only update streak if they actually changed their progress percentage!
    if (progressChanged) {
      const todayStr = getLocalDateString();
      const lastUpdate = localStorage.getItem('lastStreakUpdateDate') || '';
      let streakUpdated = false;

      if (lastUpdate) {
        const diffDays = getDaysBetween(todayStr, lastUpdate);
        if (diffDays === 1) {
          nextStreak = user.readingStreak + 1;
          streakUpdated = true;
        } else if (diffDays > 1) {
          nextStreak = 1;
          streakUpdated = true;
        } else if (diffDays === 0) {
          // Already updated today, do not increment streak again
        }
      } else {
        // First ever update
        nextStreak = user.readingStreak > 0 ? user.readingStreak + 1 : 1;
        streakUpdated = true;
      }

      if (streakUpdated) {
        setUser((prev) => ({ ...prev, readingStreak: nextStreak }));
        localStorage.setItem('lastStreakUpdateDate', todayStr);
        logActivity('Streak Progress', `Streak increased to ${nextStreak} days!`);
      }
    }

    // Unlock achievement for 15+ days streak!
    if (nextStreak >= 15) {
      unlockAchievement('Streak Master', 'Maintain a reading streak of 15+ days', '🔥');
    }
  };

  // Toggle user favorites
  const handleToggleFavorite = (bookId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(bookId);
      const next = isFav ? prev.filter((id) => id !== bookId) : [...prev, bookId];
      const book = books.find((b) => b.id === bookId);
      logActivity(
        isFav ? 'Favoritlərdən Sil' : 'Favoritlərə Əlavə Et',
        isFav ? `Kitab favoritlərdən çıxarıldı: ${book?.title || bookId}` : `Kitab favoritlərə əlavə edildi: ${book?.title || bookId}`
      );
      return next;
    });
  };

  // Mark a returned/completed book as currently reading again
  const handleSetCurrentlyReading = (bookId: string) => {
    setBorrows((prev) => {
      const filtered = prev.filter((b) => b.bookId !== bookId);
      const newRecord: BorrowRecord = {
        id: `b_${Date.now()}`,
        bookId,
        userId: user.id,
        borrowDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 0,
        status: 'reading',
      };
      return [newRecord, ...filtered];
    });

    setBooks((prev) => prev.map((b) => b.id === bookId ? { ...b, isAvailable: false } : b));

    const book = books.find((b) => b.id === bookId);
    logActivity('Oxumağa Yenidən Başla', `Kitab yenidən oxunmağa başlandı: ${book?.title || bookId}`);
  };

  // Renew a book
  const handleRenewBook = (borrowId: string) => {
    setBorrows((prev) =>
      prev.map((b) => {
        if (b.id === borrowId) {
          const currentDueDate = new Date(b.dueDate);
          const newDueDate = new Date(currentDueDate.getTime() + 14 * 24 * 60 * 60 * 1000); // Add 14 days
          return { ...b, dueDate: newDueDate.toISOString().split('T')[0] };
        }
        return b;
      })
    );

    const borrow = borrows.find((b) => b.id === borrowId);
    const book = books.find((b) => b.id === borrow?.bookId);
    logActivity('Renewed Book', `Extended due date for: ${book?.title || 'Book'}`);
  };

  // Profile Email Updates
  const handleUpdateEmail = (newEmail: string) => {
    setUser((prev) => ({ ...prev, email: newEmail }));
    logActivity('Account Update', 'Changed email settings');
  };

  // Update User Name
  const handleUpdateName = (newName: string) => {
    setUser((prev) => ({ ...prev, name: newName }));
    logActivity('Account Update', `Changed name to: ${newName}`);
  };

  // Update User Interests
  const handleUpdateInterests = (newInterests: string[]) => {
    setUser((prev) => ({ ...prev, interests: newInterests }));
    logActivity('Account Update', 'Updated interests list');
  };

  // Update User Avatar
  const handleUpdateAvatar = (newAvatarUrl: string) => {
    setUser((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
    logActivity('Account Update', 'Profil şəklini yenilədi');
  };

  // Dismiss System Alerts (Admin)
  const handleDismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    logActivity('Alert Dismissed', `Cleared alert: ${alertId}`);
  };

  // Clear log entries (Admin)
  const handleClearLogs = () => {
    setActivities([]);
    logActivity('Logs Cleared', 'Empty activity cache');
  };

  // Quick navigation to details
  const handleSelectBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setActiveView('shelf');
  };

  // Inline streak incrementor (no-op as per user request to prevent manual click abuse)
  const handleIncrementStreak = () => {
    // Click-to-increment disabled. Streak updates automatically on daily reading updates.
  };

  // Helper to dynamically unlock custom achievements
  const unlockAchievement = (title: string, description: string, icon: string) => {
    const exists = user.achievements.some((a) => a.title === title);
    if (exists) return;

    const newAchievement = {
      id: `ach_${Date.now()}`,
      title,
      description,
      icon,
      unlockedAt: new Date().toLocaleDateString('en-US'),
    };

    setUser((prev) => ({
      ...prev,
      achievements: [newAchievement, ...prev.achievements],
    }));

    logActivity('Achievement Unlocked', `Unlocked: ${title}!`);
  };

  // Toggle user role view
  const handleSetRole = (role: 'member' | 'admin') => {
    setUser((prev) => ({ ...prev, role }));
    setActiveView(role === 'admin' ? 'admin' : 'dashboard');
    logActivity('Role Toggle', `Switched view mode to: ${role}`);
  };

  // Get metadata for active update borrow
  const activeUpdateBorrow = borrows.find((b) => b.id === updateBorrowId);
  const activeUpdateBook = activeUpdateBorrow
    ? books.find((b) => b.id === activeUpdateBorrow.bookId)
    : null;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true';
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const newVal = !prev;
      localStorage.setItem('sidebar_collapsed', String(newVal));
      return newVal;
    });
  };

  return (
    <div
      id="app-container"
      className="min-h-screen flex flex-col md:flex-row bg-gradient-to-tr from-sky-100 via-indigo-50 to-purple-100 dark:from-slate-950 dark:via-indigo-950/40 dark:to-slate-900 transition-colors duration-500"
    >
      {/* Mobile Top Header */}
      <header
        id="mobile-top-header"
        className="flex md:hidden items-center justify-between p-4 bg-white/20 dark:bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-30"
      >
        <button
          id="mobile-menu-trigger"
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-xl bg-white/25 dark:bg-white/5 border border-white/15 text-gray-800 dark:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => {
            setActiveView('dashboard');
            setIsSidebarOpen(false);
          }}
          className="flex items-center gap-2 select-none cursor-pointer hover:opacity-90 active:scale-95 transition-all"
          title="Go to Dashboard"
        >
          <span className="font-sans font-bold text-lg tracking-wider text-gray-900 dark:text-white uppercase">
            Libra
          </span>
        </div>

        <img
          id="mobile-header-avatar"
          onClick={() => {
            setActiveView('profile');
            setIsSidebarOpen(false);
          }}
          src={user.avatarUrl}
          alt={user.name}
          className="w-8 h-8 rounded-full border border-white/20 object-cover cursor-pointer shadow-sm"
        />
      </header>

      {/* Persistent left sidebar navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        user={user}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      {/* Main Content scrollable panel */}
      <main id="main-content-scroll" className="flex-1 overflow-y-auto h-screen p-4 sm:p-8 lg:p-12">
        <div id="content-boundary-box" className="max-w-7xl mx-auto pb-12">
          {activeView === 'dashboard' && (
            <DashboardView
              user={user}
              books={books}
              borrows={borrows}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onUpdateClick={setUpdateBorrowId}
              onRenewClick={handleRenewBook}
              onSelectBook={handleSelectBook}
              onIncrementStreak={handleIncrementStreak}
            />
          )}

          {activeView === 'shelf' && (
            <MyShelfView
              books={books}
              borrows={borrows}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSetCurrentlyReading={handleSetCurrentlyReading}
              onBorrowBook={handleBorrowBook}
              onReturnBook={handleReturnBook}
              selectedBookId={selectedBookId}
              onSelectBook={setSelectedBookId}
            />
          )}

          {activeView === 'search' && (
            <SearchView
              books={books}
              borrows={borrows}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onBorrowBook={handleBorrowBook}
              onSelectBook={handleSelectBook}
              onCancelBorrow={handleCancelBorrow}
            />
          )}

          {activeView === 'profile' && (
            <ProfileView
              user={user}
              onSetRole={handleSetRole}
              onUpdateName={handleUpdateName}
              onUpdateInterests={handleUpdateInterests}
              onUpdateAvatar={handleUpdateAvatar}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              user={user}
              onUpdateEmail={handleUpdateEmail}
              isDarkMode={isDarkMode}
              onToggleTheme={() => setIsDarkMode(!isDarkMode)}
            />
          )}

          {activeView === 'admin' && (
            <AdminView
              activities={activities}
              alerts={alerts}
              onDismissAlert={handleDismissAlert}
              onClearLogs={handleClearLogs}
            />
          )}
        </div>
      </main>

      {/* Real-time AI Assistant integration (Gemini) */}
      <AILibrarian />

      {/* Update Progress dialog modal overlay */}
      {updateBorrowId && activeUpdateBook && activeUpdateBorrow && (
        <UpdateProgressModal
          isOpen={!!updateBorrowId}
          onClose={() => setUpdateBorrowId(null)}
          bookTitle={activeUpdateBook.title}
          totalPages={activeUpdateBook.pages}
          currentPage={typeof activeUpdateBorrow.currentPage === 'number' ? activeUpdateBorrow.currentPage : Math.round((activeUpdateBorrow.progress / 100) * activeUpdateBook.pages)}
          onSave={handleSaveProgress}
        />
      )}
    </div>
  );
}
