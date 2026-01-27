"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LoveEngine } from '@/components/visuals/LoveEngine';
import { motion } from 'motion/react';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-20">
      <div className="container mx-auto px-6 z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <LoveEngine />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <span className="text-accentViolet font-mono text-xs tracking-[0.2em] uppercase mb-6 block">Cosmic Compatibility</span>
          <h1 className="text-5xl md:text-7xl font-display font-light leading-[1.1] mb-6 text-white">
            Your numbers know who you&apos;re looking for.
          </h1>
          <p className="text-lg md:text-xl text-textSecondary font-light max-w-2xl mx-auto mb-10 leading-relaxed font-display">
            Numeros uses numerology and astrology to reveal your deepest compatibility patterns - no algorithms, no guesswork.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/numerology">
              <Button size="lg" className="w-full sm:w-auto">Begin Your Scan</Button>
            </Link>
            <Link href="/product">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">See how it works</Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1)_0%,rgba(12,10,29,0)_60%)] pointer-events-none" />
    </section>
  );
}
