"use client";

import React from 'react';
import { Quote } from 'lucide-react';

export function SocialProof() {
  return (
    <section className="py-24 bg-bgMid relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl font-display text-white mb-12 text-center">Real resonances</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Testimonial 1 */}
          <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] p-8 rounded-2xl relative">
            <Quote className="absolute top-8 right-8 text-white/5 w-12 h-12" />
            <p className="text-textSecondary text-lg italic mb-6 relative z-10 font-display">
              &quot;I&apos;ve never felt so understood by a match. Our numbers aligned perfectly.&quot;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accentViolet to-accentIndigo flex items-center justify-center text-white font-mono font-bold text-sm">S</div>
              <div>
                <div className="text-white font-mono text-sm">Sarah</div>
                <div className="text-textDim text-xs font-mono">Life Path 3</div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] p-8 rounded-2xl relative">
            <Quote className="absolute top-8 right-8 text-white/5 w-12 h-12" />
            <p className="text-textSecondary text-lg italic mb-6 relative z-10 font-display">
              &quot;Finally, an app that explains WHY we&apos;re compatible. It&apos;s not just random swiping.&quot;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accentPink to-accentViolet flex items-center justify-center text-white font-mono font-bold text-sm">M</div>
              <div>
                <div className="text-white font-mono text-sm">Marcus</div>
                <div className="text-textDim text-xs font-mono">Life Path 7</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-white/5 pt-12">
          <div>
            <div className="text-4xl md:text-5xl font-display text-accentViolet mb-2">89%</div>
            <div className="text-textSecondary text-sm font-mono">match accuracy reported</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-display text-accentPink mb-2">47%</div>
            <div className="text-textSecondary text-sm font-mono">longer conversations</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-display text-accentIndigo mb-2">3.2x</div>
            <div className="text-textSecondary text-sm font-mono">more likely to meet</div>
          </div>
        </div>
      </div>
    </section>
  );
}
