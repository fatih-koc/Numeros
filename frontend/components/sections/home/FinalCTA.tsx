"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function FinalCTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.3)_0%,rgba(12,10,29,1)_70%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-5xl md:text-6xl font-display text-white mb-6">Your matrix is waiting</h2>
        <p className="text-xl text-textSecondary font-light mb-10 max-w-xl mx-auto font-display">
          Calculate your numerology. Discover your cosmic compatibility.
        </p>

        <div className="flex flex-col items-center gap-8">
          <Link href="/numerology">
            <Button size="lg" className="px-10 py-4 text-lg">Get Numeros Free</Button>
          </Link>

          <div className="flex gap-4 text-textDim text-sm font-mono">
            <span>Available on iOS and Android</span>
          </div>
        </div>
      </div>
    </section>
  );
}
