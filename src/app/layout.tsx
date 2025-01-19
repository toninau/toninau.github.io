import type { Metadata } from 'next';
import { Inter, Noto_Serif } from 'next/font/google';

import Link from '@/components/Link';
import GitHub from '@/components/icons/GitHub';
import LinkedIn from '@/components/icons/LinkedIn';
import ExternalIconLink from '@/components/ExternalIconLink';
import { ThemeProvider, ThemeSwitcher } from '@/components/ThemeSwitcher';
import { LoadingIndicator, LoadingIndicatorProvider } from '@/components/LoadingIndicator';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const noto_serif = Noto_Serif({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-serif'
});

export const metadata: Metadata = {
  title: {
    template: "%s - toninau's Dev Blog",
    default: "toninau's Dev Blog"
  },
  description: "toninau's software development blog."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${noto_serif.variable} antialiased`}>
        <ThemeProvider>
          <LoadingIndicatorProvider>
            <LoadingIndicator />
            <div className="mb-6 flex content-center justify-center px-4 py-6 sm:px-6">
              <header className="grid w-full max-w-screen-sm grid-cols-3">
                <Link
                  href={'/'}
                  className="self-center justify-self-start text-2xl font-medium tracking-tighter text-stone-900 hover:underline dark:text-white"
                >
                  toninau
                </Link>
                <div className="justify-self-center">
                  <ThemeSwitcher />
                </div>
                <ul className="flex w-fit gap-x-4 justify-self-end rounded-full py-1">
                  <li>
                    <ExternalIconLink
                      href="https://www.linkedin.com/in/toni-naumanen/"
                      title="LinkedIn"
                    >
                      <LinkedIn />
                    </ExternalIconLink>
                  </li>
                  <li>
                    <ExternalIconLink href="https://github.com/toninau" title="GitHub">
                      <GitHub />
                    </ExternalIconLink>
                  </li>
                </ul>
              </header>
            </div>
            {children}
          </LoadingIndicatorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
