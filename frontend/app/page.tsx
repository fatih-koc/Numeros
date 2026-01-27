import { Hero } from '@/components/sections/home/Hero';
import { TrustBar } from '@/components/sections/home/TrustBar';
import { ValueGrid } from '@/components/sections/home/ValueGrid';
import { UniverseScanPreview } from '@/components/sections/home/UniverseScanPreview';
import { NumbersExplainer } from '@/components/sections/home/NumbersExplainer';
import { SocialProof } from '@/components/sections/home/SocialProof';
import { FinalCTA } from '@/components/sections/home/FinalCTA';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <TrustBar />
      <ValueGrid />
      <UniverseScanPreview />
      <NumbersExplainer />
      <SocialProof />
      <FinalCTA />
    </div>
  );
}
