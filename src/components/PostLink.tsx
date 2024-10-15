import Link, { LinkProps } from 'next/link';
import React from 'react';

type PostLinkProps = {
  children?: React.ReactNode;
  href: LinkProps['href'];
};

export default function PostLink({ children, href }: PostLinkProps) {
  return (
    <Link href={href} prefetch={false}>
      {children}
    </Link>
  );
}
