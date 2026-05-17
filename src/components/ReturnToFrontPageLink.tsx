import Link from 'next/link';
import ArrowReturnLeft from './icons/ArrowReturnLeft';

export default function ReturnToFrontPageLink() {
  return (
    <Link
      href={'/'}
      className="bg-button text-secondary hover:bg-button-hover active:bg-button-active inline-flex items-center gap-1 rounded-lg p-2 text-base font-medium tracking-tighter"
    >
      <ArrowReturnLeft />
      <span>Return to front page</span>
    </Link>
  );
}
