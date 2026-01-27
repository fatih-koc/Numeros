"use client";

import React from 'react';
import { Star } from 'lucide-react';

export function TrustBar() {
  return (
    <div className="border-t border-[rgba(255,255,255,0.05)] bg-bgDeep/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-textSecondary font-mono text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          12,847 resonances today
        </div>
        <div className="flex items-center gap-2">
          <div className="flex text-accentGold">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
          </div>
          <span>4.9 rating</span>
        </div>
        <div className="flex items-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
          <span>Featured in</span>
          <span className="font-display font-bold text-lg">VOGUE</span>
          <span className="font-display font-bold text-lg">WIRED</span>
          <span className="font-display font-bold text-lg">VICE</span>
        </div>
      </div>
    </div>
  );
}
