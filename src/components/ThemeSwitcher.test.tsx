import { expect, describe, test, vi, afterAll } from 'vitest';
import { ThemeProvider, ThemeSwitcher } from './ThemeSwitcher';
import { fireEvent, render, screen } from '@testing-library/react';

vi.stubGlobal(
  'matchMedia',
  vi.fn((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
);

describe('<ThemeSwitcher />', () => {
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  test('theme options list is hidden by default', () => {
    render(<ThemeSwitcher />);

    expect(screen.getByRole('button', { name: 'Theme options' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('theme options become visible when "Theme options" button is clicked', () => {
    render(<ThemeSwitcher />);

    fireEvent.click(screen.getByRole('button', { name: 'Theme options' }));

    expect(screen.queryByRole('dialog')).toBeInTheDocument();
  });

  test('theme options become hidden when one of the options is clicked', () => {
    render(<ThemeSwitcher />);

    fireEvent.click(screen.getByRole('button', { name: 'Theme options' }));
    fireEvent.click(screen.getByRole('button', { name: 'Dark' }));
    // trigger `onAnimationEnd` manually
    fireEvent.animationEnd(screen.getByRole('list'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('theme options become hidden when "Theme options" button is clicked', () => {
    render(<ThemeSwitcher />);

    fireEvent.click(screen.getByRole('button', { name: 'Theme options' }));
    fireEvent.click(screen.getByRole('button', { name: 'Theme options' }));
    // trigger `onAnimationEnd` manually
    fireEvent.animationEnd(screen.getByRole('list'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('theme options become hidden when area outside of the theme options is clicked', () => {
    render(<ThemeSwitcher />);

    fireEvent.click(screen.getByRole('button', { name: 'Theme options' }));
    fireEvent.click(document.body);
    // trigger `onAnimationEnd` manually
    fireEvent.animationEnd(screen.getByRole('list'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('default theme option is OS Default', () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Theme options' }));

    expect(screen.getByRole('button', { name: 'OS Default', pressed: true })).toBeInTheDocument();
  });

  test.each(['Light', 'Dark'])('can change theme option to "%s"', (theme: string) => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Theme options' }));
    fireEvent.click(screen.getByRole('button', { name: theme }));

    expect(screen.getByRole('button', { name: theme, pressed: true })).toBeInTheDocument();
  });

  test("only one theme option can be pressed at a time and it's the option that is pressed last", () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Theme options' }));
    fireEvent.click(screen.getByRole('button', { name: 'Dark' }));
    fireEvent.click(screen.getByRole('button', { name: 'Light' }));
    fireEvent.click(screen.getByRole('button', { name: 'OS Default' }));
    fireEvent.click(screen.getByRole('button', { name: 'Light' }));

    expect(screen.getByRole('button', { name: 'Dark', pressed: false })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OS Default', pressed: false })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Light', pressed: true })).toBeInTheDocument();
  });
});
