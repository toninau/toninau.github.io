'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LoadingSpinner from './icons/LoadingSpinner';

const LoadingIndicatorStateContext = createContext<boolean | undefined>(undefined);

const LoadingIndicatorUpdaterContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>> | undefined
>(undefined);

export function LoadingIndicatorProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingIndicatorStateContext.Provider value={isLoading}>
      <LoadingIndicatorUpdaterContext.Provider value={setIsLoading}>
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
  const setIsLoading = useContext(LoadingIndicatorUpdaterContext);

  if (typeof setIsLoading === 'undefined') {
    throw new Error('useLoadingIndicatorUpdater must be used within a LoadingIndicatorProvider');
  }

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  const finishLoading = useCallback(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  return {
    startLoading,
    finishLoading
  };
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
      <div className="pointer-events-none fixed bottom-0 flex w-full justify-center px-6 py-8">
        <div className="flex w-full max-w-screen-sm justify-end">
          {isLoading && (
            <div
              className={`${isLoading ? 'loading-animation animate-fade-in' : ''} invisible rounded-lg bg-button p-2 text-secondary opacity-0`}
            >
              <div className="animate-spin">
                <LoadingSpinner />
              </div>
              <span className="sr-only">Loading</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
