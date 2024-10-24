import type { Metadata } from 'next';
import { Inter, Noto_Serif } from 'next/font/google';
import Link from 'next/link';

import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { LinkedInIcon } from '@/components/icons/LinkedInIcon';
import ExternalIconLink from '@/components/ExternalIconLink';

import { ThemeProvider, ThemeSwitcher } from './features/ThemeSwitcher';

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
          <div className="flex content-center justify-center p-6">
            <header className="flex w-full max-w-screen-lg flex-row flex-nowrap justify-between">
              <Link href={'/'} className="text-2xl font-medium tracking-tighter hover:underline">
                toninau
              </Link>
              <ThemeSwitcher />
              <ul className="flex w-fit gap-x-4 rounded-full px-2 py-1">
                <li>
                  <ExternalIconLink href="https://github.com/toninau" title="LinkedIn">
                    <LinkedInIcon />
                  </ExternalIconLink>
                </li>
                <li>
                  <ExternalIconLink href="https://github.com/toninau" title="GitHub">
                    <GitHubIcon />
                  </ExternalIconLink>
                </li>
              </ul>
            </header>
          </div>
          <div className="flex content-center justify-center px-6">
            <main className="w-full max-w-screen-lg">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
