import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';

type LinkProps = {
  children?: React.ReactNode;
  className?: string;
  href: NextLinkProps['href'];
};

export default function PostLink({ children, className, href }: LinkProps) {
  return (
    <NextLink href={href} prefetch={false} className={className}>
      {children}
    </NextLink>
  );
}
