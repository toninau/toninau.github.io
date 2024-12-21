import type { Metadata } from 'next';
import { Noto_Serif, Inter, Literata } from 'next/font/google';

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

const literata = Literata({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-literata'
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
      <body className={`${inter.variable} ${noto_serif.variable} ${literata.variable} antialiased`}>
        <ThemeProvider>
          <LoadingIndicatorProvider>
            <LoadingIndicator />
            <div className="mb-6 flex content-center justify-center p-6">
              <header className="grid w-full max-w-screen-sm grid-cols-3">
                <Link
                  href={'/'}
                  className="justify-self-start font-sans text-2xl font-medium tracking-tighter text-stone-900 hover:underline dark:text-white"
                >
                  toninau
                </Link>
                <div className="justify-self-center">
                  <ThemeSwitcher />
                </div>
                <ul className="flex w-fit gap-x-4 justify-self-end rounded-full px-2 py-1">
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
            <div className="flex content-center justify-center px-6">
              <main className="w-full max-w-screen-sm">{children}</main>
            </div>
          </LoadingIndicatorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
