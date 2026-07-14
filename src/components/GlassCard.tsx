import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', id, onClick }) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/5 rounded-2xl shadow-xl transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:bg-white/20 dark:hover:bg-black/30' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
