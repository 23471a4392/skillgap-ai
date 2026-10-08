import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
  }[size];

  const variantClasses = {
    default: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    info: 'bg-secondary-100 text-secondary-700 border-secondary-200 dark:bg-secondary-950/40 dark:text-secondary-300 dark:border-secondary-800',
    purple: 'bg-secondary-100 text-secondary-700 border-secondary-200 dark:bg-secondary-950/40 dark:text-secondary-300 dark:border-secondary-800',
    outline: 'bg-transparent text-zinc-600 border-zinc-300 dark:text-zinc-400 dark:border-zinc-700',
  }[variant];

  return (
    <span className={`inline-flex items-center rounded-md border ${sizeClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};
