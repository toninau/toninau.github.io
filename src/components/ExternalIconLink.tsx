import { ReactNode } from 'react';

export default function ExternalIconLink({
  children,
  href,
  title
}: {
  children: ReactNode;
  href: string;
  title: string;
}) {
  return (
    <a
      href={href}
      title={title}
      className="text-link-icon hover:text-link-icon-active focus:text-link-icon-active"
    >
      {children}
      <span className="sr-only">{title}</span>
    </a>
  );
}
