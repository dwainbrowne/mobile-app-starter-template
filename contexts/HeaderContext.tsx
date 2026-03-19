import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface HeaderContextType {
  /** Whether the header is visible */
  headerVisible: boolean;
  /** Show the header */
  showHeader: () => void;
  /** Hide the header */
  hideHeader: () => void;
  /** Set header visibility */
  setHeaderVisible: (visible: boolean) => void;
  /** Current header title override (set by WebView or screens) */
  headerTitle: string | undefined;
  /** Override the header title dynamically */
  setHeaderTitle: (title: string | undefined) => void;
}

const HeaderContext = createContext<HeaderContextType | null>(null);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [headerVisible, setHeaderVisible] = useState(true);
  const [headerTitle, setHeaderTitle] = useState<string | undefined>(undefined);

  const showHeader = useCallback(() => setHeaderVisible(true), []);
  const hideHeader = useCallback(() => setHeaderVisible(false), []);

  return (
    <HeaderContext.Provider
      value={{
        headerVisible,
        showHeader,
        hideHeader,
        setHeaderVisible,
        headerTitle,
        setHeaderTitle,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return ctx;
}
