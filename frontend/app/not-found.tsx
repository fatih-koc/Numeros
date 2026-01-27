import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="mb-8">
        <div className="text-9xl font-display text-accentViolet opacity-20">404</div>
      </div>
      <h1 className="text-4xl md:text-5xl font-display text-white mb-4">Lost in the Cosmos</h1>
      <p className="text-textSecondary text-lg mb-8 max-w-md">
        The page you are seeking has drifted into a parallel dimension. Let us guide you back to charted territory.
      </p>
      <Link href="/">
        <Button size="lg">Return to Home</Button>
      </Link>
    </div>
  );
}
