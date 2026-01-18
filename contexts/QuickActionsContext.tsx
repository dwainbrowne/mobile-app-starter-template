import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface QuickActionsContextType {
  isOpen: boolean;
  openQuickActions: () => void;
  closeQuickActions: () => void;
  toggleQuickActions: () => void;
}

const QuickActionsContext = createContext<QuickActionsContextType | undefined>(undefined);

interface QuickActionsProviderProps {
  children: ReactNode;
}

export function QuickActionsProvider({ children }: QuickActionsProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openQuickActions = useCallback(() => setIsOpen(true), []);
  const closeQuickActions = useCallback(() => setIsOpen(false), []);
  const toggleQuickActions = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <QuickActionsContext.Provider
      value={{ isOpen, openQuickActions, closeQuickActions, toggleQuickActions }}
    >
      {children}
    </QuickActionsContext.Provider>
  );
}

export function useQuickActions() {
  const context = useContext(QuickActionsContext);
  if (context === undefined) {
    throw new Error('useQuickActions must be used within a QuickActionsProvider');
  }
  return context;
}
