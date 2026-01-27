import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Birth Chart Calculator - Astrology Chart Generator',
  description: 'Generate your complete birth chart free. Discover your Sun, Moon, and Rising signs. Calculated using Swiss Ephemeris for professional accuracy.',
  keywords: [
    'birth chart calculator',
    'astrology chart',
    'free astrology reading',
    'sun sign',
    'moon sign',
    'rising sign',
    'ascendant calculator',
    'natal chart',
  ],
  openGraph: {
    title: 'Free Birth Chart Calculator | Numeros',
    description: 'Generate your complete astrological birth chart free. Professional accuracy with Swiss Ephemeris.',
  },
};

export default function AstrologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
