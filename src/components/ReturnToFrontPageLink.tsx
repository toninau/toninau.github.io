import Link from 'next/link';
import ArrowReturnLeft from './icons/ArrowReturnLeft';

export default function ReturnToFrontPageLink() {
  return (
    <Link
      href={'/'}
      className="inline-flex items-center gap-1 rounded-lg bg-button p-2 text-base font-medium tracking-tighter text-secondary hover:bg-button-hover active:bg-button-active"
    >
      <ArrowReturnLeft />
      <span>Return to front page</span>
    </Link>
  );
}
