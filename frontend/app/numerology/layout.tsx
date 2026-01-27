import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Numerology Calculator - Calculate Your Life Path Number',
  description: 'Calculate your numerology profile free. Discover your Life Path, Soul Urge, Expression, and Personality numbers using the Pythagorean system.',
  keywords: [
    'numerology calculator',
    'life path number calculator',
    'free numerology reading',
    'soul urge number',
    'expression number',
    'personality number',
    'pythagorean numerology',
  ],
  openGraph: {
    title: 'Free Numerology Calculator | Numeros',
    description: 'Discover your cosmic numbers. Calculate your Life Path, Soul Urge, Expression, and Personality numbers free.',
  },
};

export default function NumerologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
