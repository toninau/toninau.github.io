'use client';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useLoadingIndicatorUpdater } from './LoadingIndicator';

type LinkProps = {
  children?: React.ReactNode;
  className?: string;
  href: NextLinkProps['href'];
};

export default function Link({ children, className, href }: LinkProps) {
  const { startLoading, finishLoading } = useLoadingIndicatorUpdater();
  const pathname = usePathname();

  const handleClick = () => {
    if (href !== pathname) {
      startLoading();
    } else {
      finishLoading();
    }
  };

  return (
    <NextLink onClick={handleClick} href={href} prefetch={false} className={className}>
      {children}
    </NextLink>
  );
}
