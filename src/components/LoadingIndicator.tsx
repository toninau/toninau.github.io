'use client';
import { createContext, useCallback, useContext, useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

const LoadingIndicatorStateContext = createContext<boolean | undefined>(undefined);

const LoadingIndicatorUpdaterContext = createContext<
  | {
      startLoading: () => void;
      finishLoading: () => void;
    }
  | undefined
>(undefined);

export function LoadingIndicatorProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startLoading = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsLoading(true);
    }, 300);
  }, [setIsLoading]);

  const finishLoading = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsLoading(false);
  }, [setIsLoading]);

  return (
    <LoadingIndicatorStateContext.Provider value={isLoading}>
      <LoadingIndicatorUpdaterContext.Provider value={{ startLoading, finishLoading }}>
        {children}
      </LoadingIndicatorUpdaterContext.Provider>
    </LoadingIndicatorStateContext.Provider>
  );
}

export function useLoadingIndicatorState() {
  const loadingState = useContext(LoadingIndicatorStateContext);

  if (typeof loadingState === 'undefined') {
    throw new Error('useLoadingIndicatorState must be used within a LoadingIndicatorProvider');
  }
  return loadingState;
}

export function useLoadingIndicatorUpdater() {
  const updater = useContext(LoadingIndicatorUpdaterContext);

  if (typeof updater === 'undefined') {
    throw new Error('useLoadingIndicatorUpdater must be used within a LoadingIndicatorProvider');
  }

  return updater;
}

export function LoadingIndicator() {
  const pathname = usePathname();
  const isLoading = useLoadingIndicatorState();
  const { finishLoading } = useLoadingIndicatorUpdater();

  useEffect(() => {
    finishLoading();
  }, [pathname, finishLoading]);

  return (
    <div aria-live="polite" aria-busy={isLoading}>
      {isLoading && (
        <div className="fixed top-0 left-0 z-100 h-1 w-full overflow-hidden">
          <div className="via-secondary animate-loading-bar h-full bg-linear-to-r from-transparent to-transparent">
            <span className="sr-only">Loading</span>
          </div>
        </div>
      )}
    </div>
  );
}
