"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CircleSigil, TriangleSigil, SquareSigil, DiamondSigil } from '@/components/icons/Sigils';

export default function HowItWorks() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-20 text-center container mx-auto px-6">
        <span className="text-accentViolet font-mono text-xs tracking-[0.2em] uppercase mb-4 block">HOW IT WORKS</span>
        <h1 className="text-4xl md:text-5xl font-display text-white mb-6">Compatibility through cosmic calculation</h1>
        <p className="text-textSecondary text-lg max-w-2xl mx-auto">
          Numeros combines two ancient systems - numerology and astrology - to reveal compatibility patterns invisible to surface-level matching.
        </p>
      </section>

      {/* The Two Pillars */}
      <section className="py-16 bg-bgMid">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Numerology */}
          <div className="bg-bgLight rounded-2xl p-8 border border-white/5">
            <h3 className="text-2xl font-display text-white mb-4">The science of numbers</h3>
            <p className="text-textSecondary mb-8">Your name and birth date encode four fundamental numbers that define your cosmic blueprint.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bgDeep p-4 rounded-lg flex items-center gap-3 border border-white/5">
                <CircleSigil className="text-lifePath w-6 h-6" />
                <div className="text-sm">
                  <div className="text-white">Life Path</div>
                  <div className="text-textDim text-xs">Birth Date</div>
                </div>
              </div>
              <div className="bg-bgDeep p-4 rounded-lg flex items-center gap-3 border border-white/5">
                <TriangleSigil className="text-soulUrge w-6 h-6" />
                <div className="text-sm">
                  <div className="text-white">Soul Urge</div>
                  <div className="text-textDim text-xs">Vowels</div>
                </div>
              </div>
              <div className="bg-bgDeep p-4 rounded-lg flex items-center gap-3 border border-white/5">
                <SquareSigil className="text-expression w-6 h-6" />
                <div className="text-sm">
                  <div className="text-white">Expression</div>
                  <div className="text-textDim text-xs">All Letters</div>
                </div>
              </div>
              <div className="bg-bgDeep p-4 rounded-lg flex items-center gap-3 border border-white/5">
                <DiamondSigil className="text-personality w-6 h-6" />
                <div className="text-sm">
                  <div className="text-white">Personality</div>
                  <div className="text-textDim text-xs">Consonants</div>
                </div>
              </div>
            </div>
          </div>

          {/* Astrology */}
          <div className="bg-bgLight rounded-2xl p-8 border border-white/5">
            <h3 className="text-2xl font-display text-white mb-4">The language of stars</h3>
            <p className="text-textSecondary mb-8">Your birth chart maps planetary positions at your exact moment of birth, revealing how you connect with others.</p>
            <div className="relative w-full aspect-square max-w-[300px] mx-auto rounded-full border border-white/10 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-white/5 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="text-center">
                <div className="text-3xl text-accentViolet font-display">Sun</div>
                <div className="text-xs text-textDim uppercase tracking-widest mt-1">Core Identity</div>
              </div>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
              <div className="absolute bottom-10 right-10 w-1.5 h-1.5 bg-accentPink rounded-full" />
              <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-accentIndigo rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Deterministic */}
      <section className="py-24 container mx-auto px-6 text-center">
        <h2 className="text-3xl font-display text-white mb-6">No machine learning. No manipulation.</h2>
        <p className="text-textSecondary max-w-3xl mx-auto mb-12">
          Every dating app uses ML algorithms that optimize for engagement, not connection. Numeros uses fixed mathematical systems - the same inputs always produce the same compatibility score.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-8 text-sm font-mono">
          <div className="text-textDim line-through decoration-red-500/50">Black box AI</div>
          <div className="text-accentViolet">Cosmic calculation</div>
        </div>

        <div className="mt-16">
          <Link href="/numerology">
            <Button size="lg">Calculate Your Numbers</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
