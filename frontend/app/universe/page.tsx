"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RadarScan } from '@/components/visuals/RadarScan';
import { Button } from '@/components/ui/Button';
import { motion } from 'motion/react';
import { Clock, Lock, Check, X } from 'lucide-react';

const phases = [
  { time: "0:00", label: "Life Path Extraction", desc: "We reduce your birth date to its single-digit essence, revealing your soul's journey." },
  { time: "2:50", label: "Soul Urge Analysis", desc: "Your name's vowels encode your deepest desires and spiritual nature." },
  { time: "5:00", label: "Expression Mapping", desc: "Every letter in your name carries numeric weight, summing to your natural talents." },
  { time: "7:50", label: "Personality Reading", desc: "Consonants reveal how the world perceives you - your external vibration." },
  { time: "10:00", label: "Resonance Scan", desc: "Your complete matrix is compared against all compatible profiles in our universe." },
];

const mockMatches = [
  { name: "Sarah", match: 92, photoColor: "bg-purple-500", locked: false, reason: "Creative synergy" },
  { name: "Marcus", match: 89, photoColor: "bg-blue-500", locked: false, reason: "Emotional harmony" },
  { name: "Elena", match: 85, photoColor: "bg-pink-500", locked: true, time: "2h 15m" },
  { name: "David", match: 81, photoColor: "bg-green-500", locked: true, time: "4h 30m" },
  { name: "Kai", match: 78, photoColor: "bg-yellow-500", locked: true, time: "6h 45m" },
  { name: "Luna", match: 74, photoColor: "bg-indigo-500", locked: true, time: "8h 00m" },
];

export default function UniverseScan() {
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhase(prev => (prev + 1) % phases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center relative pt-10">
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <RadarScan size="lg" />
        </motion.div>

        <div className="text-center z-10 max-w-2xl px-6">
          <span className="text-accentViolet font-mono text-xs tracking-[0.2em] uppercase mb-4 block">THE UNIVERSE SCAN</span>
          <h1 className="text-4xl md:text-5xl font-display text-white mb-6">12.5 seconds of cosmic revelation</h1>
          <p className="text-textSecondary text-lg font-light">
            The Universe Scan is your initiation into Numeros - an extraction ritual that analyzes your birth data across five phases.
          </p>
          <div className="mt-8 mb-12 font-mono text-accentViolet animate-pulse">
            Analyzing {phases[activePhase].label}...
          </div>
        </div>
      </section>

      {/* Phase Breakdown */}
      <section className="py-20 bg-bgMid">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-display text-white mb-12 text-center">Extraction Phases</h2>
          <div className="relative border-l border-white/10 ml-6 md:ml-0 space-y-12">
            {phases.map((phase, index) => (
              <motion.div
                key={index}
                className={`pl-8 md:pl-12 relative ${index === activePhase ? 'opacity-100' : 'opacity-40'} transition-opacity duration-500`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: index === activePhase ? 1 : 0.4, x: 0 }}
                viewport={{ once: true }}
              >
                <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full ${index === activePhase ? 'bg-accentViolet shadow-[0_0_10px_#8B5CF6]' : 'bg-white/20'}`} />
                <div className="flex flex-col md:flex-row gap-4 md:items-baseline">
                  <span className="font-mono text-accentViolet text-sm">{phase.time}</span>
                  <h3 className="text-xl font-display text-white">{phase.label}</h3>
                </div>
                <p className="text-textSecondary mt-2 max-w-xl">{phase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Preview */}
      <section className="py-24 bg-bgDeep relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display text-white mb-4">Your strongest connections revealed</h2>
            <p className="text-textSecondary max-w-2xl mx-auto">
              After the scan completes, you&apos;ll see your top matches - 6 of your 19 strongest connections, with unlock timers for each.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {mockMatches.map((match, i) => (
              <div key={i} className="bg-bgLight border border-white/5 rounded-2xl overflow-hidden group hover:border-accentViolet/30 transition-all">
                <div className={`h-48 w-full ${match.photoColor} opacity-20 relative flex items-center justify-center`}>
                  {match.locked && <Lock className="text-white/50 w-12 h-12" />}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-display text-2xl">{match.locked ? 'Locked Match' : match.name}</h3>
                      <div className={`text-sm font-mono ${match.locked ? 'text-textDim' : 'text-accentViolet'}`}>
                        {match.match}% Compatibility
                      </div>
                    </div>
                    {match.locked ? (
                      <div className="bg-white/5 px-2 py-1 rounded text-xs font-mono text-textDim flex items-center gap-1">
                        <Clock size={12} /> {match.time}
                      </div>
                    ) : (
                      <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-mono flex items-center gap-1">
                        <Check size={12} /> Unlocked
                      </div>
                    )}
                  </div>

                  {match.locked ? (
                    <Button variant="secondary" size="sm" className="w-full mt-2">Set Reminder</Button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-textSecondary">
                        <div className="w-1.5 h-1.5 bg-accentViolet rounded-full" />
                        {match.reason}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-textSecondary">
                        <div className="w-1.5 h-1.5 bg-accentPink rounded-full" />
                        Venus - Moon
                      </div>
                      <Button size="sm" className="w-full mt-4">View Profile</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-t from-bgDeep to-bgMid text-center">
        <h2 className="text-4xl font-display text-white mb-8">Ready to see your matrix?</h2>
        <Link href="/numerology">
          <Button size="lg" className="px-12">Start Your Scan</Button>
        </Link>
      </section>
    </div>
  );
}
