import { Metadata } from 'next';
import ReturnToFrontPageLink from '@/components/ReturnToFrontPageLink';

export const metadata: Metadata = {
  title: '404 Not Found'
};

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
      <ReturnToFrontPageLink />
    </div>
  );
}
