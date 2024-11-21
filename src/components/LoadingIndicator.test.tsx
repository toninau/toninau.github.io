import { render, screen, renderHook, fireEvent } from '@testing-library/react';
import { expect, describe, test } from 'vitest';
import React from 'react';
import {
  LoadingIndicator,
  LoadingIndicatorProvider,
  useLoadingIndicatorState,
  useLoadingIndicatorUpdater
} from './LoadingIndicator';

function LoadingStateUpdater() {
  const { finishLoading, startLoading } = useLoadingIndicatorUpdater();
  return (
    <>
      <button onClick={startLoading}>show</button>
      <button onClick={finishLoading}>hide</button>
    </>
  );
}

describe('<LoadingIndicator />', () => {
  test('useLoadingIndicatorState hook throws error when used outside of LoadingIndicatorProvider', () => {
    expect(() => renderHook(useLoadingIndicatorState)).toThrow(
      'useLoadingIndicatorState must be used within a LoadingIndicatorProvider'
    );
  });

  test('useLoadingIndicatorUpdater hook throws error when used outside of LoadingIndicatorProvider', () => {
    expect(() => renderHook(useLoadingIndicatorUpdater)).toThrow(
      'useLoadingIndicatorUpdater must be used within a LoadingIndicatorProvider'
    );
  });

  test('loading indicator is hidden by default', () => {
    render(
      <LoadingIndicatorProvider>
        <LoadingIndicator />
      </LoadingIndicatorProvider>
    );

    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
  });

  test('loading indicator becomes visible when loading state is started', () => {
    render(
      <LoadingIndicatorProvider>
        <LoadingIndicator />
        <LoadingStateUpdater />
      </LoadingIndicatorProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'show' }));

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  test('loading indicator becomes hidden when loading state is finished', () => {
    render(
      <LoadingIndicatorProvider>
        <LoadingIndicator />
        <LoadingStateUpdater />
      </LoadingIndicatorProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'show' }));
    fireEvent.click(screen.getByRole('button', { name: 'hide' }));

    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
  });
});
