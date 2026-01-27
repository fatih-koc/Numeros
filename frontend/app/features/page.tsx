"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { RadarScan } from '@/components/visuals/RadarScan';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Sparkles, Scan, Heart, Globe, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const features = [
  {
    icon: <Sparkles className="w-6 h-6 text-accentViolet" />,
    title: "Numerology Engine",
    description: "Our proprietary algorithm analyzes life path numbers, expression numbers, and soul urge numbers to find your geometric match."
  },
  {
    icon: <Globe className="w-6 h-6 text-accentCyan" />,
    title: "Planetary Resonance",
    description: "We map your natal chart against potential matches to identify harmonic planetary alignments and karmic connections."
  },
  {
    icon: <Scan className="w-6 h-6 text-expression" />,
    title: "Universe Scan",
    description: "Visualize compatibility in real-time with our radar interface, scanning the cosmic ether for your resonant frequencies."
  },
  {
    icon: <Heart className="w-6 h-6 text-accentPink" />,
    title: "Deep Compatibility",
    description: "Go beyond surface-level traits. We reveal the invisible threads that connect resonant souls across space and time."
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: "Instant Synergy",
    description: "Get immediate feedback on potential connections with our synastry scoring system, updated in real-time."
  },
  {
    icon: <Lock className="w-6 h-6 text-white" />,
    title: "Private & Secure",
    description: "Your cosmic data is sacred. We use end-to-end encryption to ensure your spiritual blueprint remains private."
  }
];

export default function Features() {
  return (
    <div className="min-h-screen bg-bgDeep text-white pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-display font-light mb-6 leading-tight"
            >
              Technology Meets <br />
              <span className="text-accentViolet">Destiny</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-textSecondary font-light mb-8 max-w-xl mx-auto md:mx-0 font-display"
            >
              Numeros combines ancient wisdom with modern algorithms to decode the mathematics of your heart.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/numerology">
                <Button size="lg">Start Your Journey</Button>
              </Link>
            </motion.div>
          </div>

          <div className="flex-1 flex justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <RadarScan size="md" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6 bg-bgMid/30 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-light mb-4">The Numeros Ecosystem</h2>
            <p className="text-textSecondary max-w-2xl mx-auto font-mono text-sm">Everything you need to find your cosmic counterpart.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-md h-full hover:bg-white/10 transition-colors duration-300">
                  <CardHeader>
                    <div className="mb-4 p-3 bg-bgDeep rounded-lg w-fit border border-white/10">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-display text-xl tracking-wide">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-textSecondary text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl bg-gradient-to-br from-accentViolet/20 to-bgDeep border border-accentViolet/20 rounded-3xl p-8 md:p-12 overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-display mb-6">Powered by the LoveEngine</h2>
              <p className="text-textSecondary mb-6 leading-relaxed">
                Our core matching engine processes over 50 data points from your birth chart and numerology profile.
                Unlike other apps that rely on self-reported preferences, we calculate compatibility at a fundamental, energetic level.
              </p>
              <ul className="space-y-3 font-mono text-sm text-textDim">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accentViolet" />
                  Life Path Number Calculation
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accentCyan" />
                  Sun, Moon, and Rising Sign Analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accentPink" />
                  Karmic Lesson Identification
                </li>
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-64 h-64 rounded-full border border-white/10 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border border-accentViolet/30 animate-ping opacity-20" />
                <div className="text-6xl font-display text-white">98%</div>
                <div className="absolute bottom-10 text-xs font-mono text-accentViolet">MATCH ACCURACY</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
