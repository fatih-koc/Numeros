"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Share2, Download, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Blueprint, NumerologyData } from '@/components/numerology/Blueprint';
import { calculateAllNumbers } from '@/lib/numerology';

export default function NumerologyResults() {
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("Cosmic Traveler");
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [numerologyData, setNumerologyData] = useState<NumerologyData | null>(null);

  useEffect(() => {
    // Get data from sessionStorage
    const storedData = sessionStorage.getItem('numerologyData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setFullName(data.fullName || "Cosmic Traveler");
      setBirthDate(data.birthDate || "1990-01-01");

      // Calculate numerology numbers
      const numbers = calculateAllNumbers(data.fullName, data.birthDate);
      setNumerologyData(numbers);
    } else {
      // Default data for demo
      setNumerologyData(calculateAllNumbers("Cosmic Traveler", "1990-01-01"));
    }

    // Simulate calculation time
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !numerologyData) {
    return (
      <div className="min-h-screen bg-bgDeep flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <div className="w-24 h-24 rounded-full border-t-2 border-r-2 border-accentViolet blur-[2px]" />
        </motion.div>
        <h2 className="text-2xl font-display text-white mb-2">Calculating Life Path...</h2>
        <p className="text-textSecondary font-mono text-sm animate-pulse">Analyzing vibrational frequencies of {fullName}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgDeep text-white pt-28 pb-20 px-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-accentViolet/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8 gap-6">
          <div>
            <div className="text-accentViolet font-mono text-xs tracking-[0.2em] uppercase mb-2">Numerology Report</div>
            <h1 className="text-4xl md:text-5xl font-display text-white">{fullName}</h1>
            <p className="text-textSecondary mt-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-soulUrge" /> Born {birthDate}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" className="gap-2"><Share2 className="w-4 h-4" /> Share</Button>
            <Button variant="secondary" size="sm" className="gap-2"><Download className="w-4 h-4" /> Export PDF</Button>
          </div>
        </div>

        {/* Blueprint Grid Component */}
        <div className="mb-16 flex justify-center">
          <Blueprint data={numerologyData} />
        </div>

        {/* Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-display text-white mb-6">Cosmic Blueprint Analysis</h2>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-textSecondary leading-relaxed space-y-4">
            <p>
              Your chart reveals a powerful alignment between your Life Path {numerologyData.life_path} and your Expression {numerologyData.expression}.
              This suggests that you are well-equipped to fulfill your destiny. The interaction of your core numbers creates a unique vibrational signature.
            </p>
            <p>
              With a Soul Urge of {numerologyData.soul_urge}, your inner world is driven by a need for depth and connection.
              This may sometimes conflict with the independence of your Life Path, creating a dynamic tension
              that fuels your growth.
            </p>
            <div className="pt-4 flex items-center gap-2 text-accentViolet text-sm font-mono uppercase tracking-widest">
              <Zap className="w-4 h-4" /> Full analysis unlocked
            </div>
          </div>

          <div className="pt-8 flex justify-center">
            <Link href="/astrology">
              <Button variant="outline">
                Explore Astrology Chart <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
