import ArrowReturnLeft from '@/components/icons/ArrowReturnLeft';
import Link from '@/components/Link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        aria-hidden="true"
        className="flex select-none flex-col items-center justify-center text-stone-200 dark:text-stone-200/10"
      >
        <span className="text-nowrap text-[14rem] leading-tight tracking-tighter">: (</span>
        <span className="font-mono text-4xl tracking-tighter">404</span>
      </div>
      <h1 className="my-8 text-center text-4xl font-semibold tracking-tighter text-stone-900 dark:text-white">
        Page not found!
      </h1>
      <Link
        href={'/'}
        className="mb-8 inline-flex items-center gap-2 rounded-lg bg-button p-2 text-base font-medium tracking-tighter text-secondary hover:bg-button-hover active:bg-button-active"
      >
        <ArrowReturnLeft /> Return to front page
      </Link>
    </div>
  );
}
