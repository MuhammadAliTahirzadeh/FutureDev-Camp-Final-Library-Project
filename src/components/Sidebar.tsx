import React from 'react';
import { LayoutDashboard, BookOpen, Search, User, Settings, Library, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  user,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'shelf', label: 'My Shelf', icon: BookOpen },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const sidebarWidthClass = isCollapsed ? 'md:w-20 w-64' : 'w-64';
  const sidebarPaddingClass = isCollapsed ? 'md:p-3 md:px-2.5 p-6' : 'p-6';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          id="sidebar-backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300"
        />
      )}

      <aside
        id="sidebar-container"
        className={`fixed inset-y-0 left-0 z-50 ${sidebarWidthClass} backdrop-blur-lg bg-white/95 dark:bg-slate-900/95 md:bg-white/5 md:dark:bg-black/30 border-r border-white/10 flex flex-col justify-between h-screen ${sidebarPaddingClass} transition-all duration-300 md:translate-x-0 md:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo & Close button on mobile / Collapse on desktop */}
        <div id="sidebar-brand-container" className={`flex ${isCollapsed ? 'md:flex-col md:gap-4 md:items-center' : 'items-center justify-between'} mb-10`}>
          <div
            id="sidebar-brand"
            onClick={() => {
              setActiveView('dashboard');
              onClose();
            }}
            className={`flex items-center gap-3 select-none cursor-pointer hover:opacity-90 active:scale-95 transition-all ${isCollapsed ? 'md:justify-center' : ''}`}
            title="Go to Dashboard"
          >
            <div id="logo-icon-container" className="p-2 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg shadow-lg flex-shrink-0">
              <Library id="logo-icon" className="w-6 h-6 text-white" />
            </div>
            <span
              id="brand-text"
              className={`font-sans font-bold text-xl tracking-wider text-gray-900 dark:text-white uppercase transition-all duration-300 ${
                isCollapsed ? 'md:hidden' : 'block'
              }`}
            >
              Libra
            </span>
          </div>

          <div className={`flex items-center gap-1 ${isCollapsed ? 'md:flex-col' : ''}`}>
            {/* Collapse Toggle Button for Desktop */}
            <button
              id="desktop-sidebar-collapse-toggle"
              onClick={onToggleCollapse}
              className="hidden md:flex items-center justify-center p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-white/10 cursor-pointer active:scale-95"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-800 dark:text-white" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-800 dark:text-white" />
              )}
            </button>

            {/* Close Menu Button - Visible on Mobile only */}
            <button
              id="mobile-sidebar-close"
              onClick={onClose}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-800 dark:text-white" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav id="sidebar-nav" className={`flex-1 space-y-2 ${isCollapsed ? 'md:items-center md:flex md:flex-col' : ''}`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id || (item.id === 'dashboard' && activeView === 'admin');
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => {
                  setActiveView(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-sans text-sm font-semibold transition-all duration-300 group ${
                  isActive
                    ? 'bg-white/20 dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm border-l-4 border-blue-500 dark:border-blue-400 pl-3'
                    : 'text-gray-800 dark:text-slate-200 hover:bg-white/10 dark:hover:bg-white/5 hover:text-gray-950 dark:hover:text-white'
                } ${isCollapsed ? 'md:justify-center md:px-2 md:py-3' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  id={`nav-icon-${item.id}`}
                  className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 flex-shrink-0 ${
                    isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-600 dark:text-slate-400'
                  }`}
                />
                <span
                  className={`transition-all duration-300 whitespace-nowrap ${
                    isCollapsed ? 'md:hidden' : 'block'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div
          id="sidebar-user-footer"
          onClick={() => {
            setActiveView('profile');
            onClose();
          }}
          className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 cursor-pointer transition-all duration-300 ${
            isCollapsed ? 'md:justify-center md:p-1' : ''
          }`}
          title={isCollapsed ? user.name : undefined}
        >
          <img
            id="user-footer-avatar"
            src={user.avatarUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full border border-white/20 object-cover shadow-sm flex-shrink-0"
          />
          <div
            id="user-footer-meta"
            className={`transition-all duration-300 truncate ${
              isCollapsed ? 'md:hidden' : 'block'
            }`}
          >
            <h4 id="user-footer-name" className="font-sans text-sm font-semibold text-gray-800 dark:text-white truncate max-w-[120px]">
              {user.name}
            </h4>
            <p id="user-footer-role" className="font-sans text-xs text-gray-700 dark:text-slate-300 capitalize font-medium truncate max-w-[120px]">
              {user.role}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
