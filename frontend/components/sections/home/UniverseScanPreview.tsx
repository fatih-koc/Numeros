"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { RadarScan } from '@/components/visuals/RadarScan';

export function UniverseScanPreview() {
  return (
    <section className="py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* Visual Side */}
          <div className="w-full lg:w-1/2 relative h-[500px] flex items-center justify-center">
            <RadarScan size="md" />
            <div className="absolute bottom-10 text-center w-full font-mono text-xs text-accentViolet animate-pulse">
              Scanning for compatible energies...
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-1/2">
            <span className="text-accentViolet font-mono text-xs tracking-[0.2em] uppercase mb-4 block">THE UNIVERSE SCAN</span>
            <h2 className="text-4xl md:text-5xl font-display text-white mb-6">12.5 seconds that reveal everything</h2>
            <p className="text-textSecondary text-lg font-display leading-relaxed mb-8">
              Our extraction ritual analyzes your birth data through five phases, comparing numerological harmonics and astrological aspects to find your resonant matches.
            </p>

            <ul className="space-y-4 mb-10">
              {['Extracting Life Path', 'Analyzing Soul Urge', 'Mapping Expression', 'Reading Personality', 'Scanning for Resonance'].map((phase, i) => (
                <li key={i} className="flex items-center gap-4 text-white font-mono text-sm">
                  <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[10px] text-accentViolet">
                    {i + 1}
                  </div>
                  {phase}
                </li>
              ))}
            </ul>

            <Link href="/universe">
              <Button>Experience the scan</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
