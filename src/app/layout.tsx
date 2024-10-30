import type { Metadata } from 'next';
import { Inter, Noto_Serif } from 'next/font/google';
import Link from '@/components/Link';

import GitHub from '@/components/icons/GitHub';
import LinkedIn from '@/components/icons/LinkedIn';
import ExternalIconLink from '@/components/ExternalIconLink';
import { ThemeProvider, ThemeSwitcher } from '@/components/ThemeSwitcher';

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
          <div className="mb-6 flex content-center justify-center p-6">
            <header className="flex w-full max-w-screen-sm flex-row flex-nowrap justify-between">
              <Link
                href={'/'}
                className="text-2xl font-medium tracking-tighter text-stone-900 hover:underline dark:text-white"
              >
                toninau
              </Link>
              <ThemeSwitcher />
              <ul className="flex w-fit gap-x-4 rounded-full px-2 py-1">
                <li>
                  <ExternalIconLink href="https://github.com/toninau" title="LinkedIn">
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
        </ThemeProvider>
      </body>
    </html>
  );
}
