"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Sparkles, Heart, Eye } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-bgDeep text-white pb-20">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1765120298918-e9932c6c0332?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG5lYnVsYSUyMHNwYWNlJTIwZGVlcCUyMHB1cnBsZXxlbnwxfHx8fDE3Njk0OTUyNzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Cosmic Nebula"
            fill
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bgDeep/50 via-bgDeep/80 to-bgDeep" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-display font-light mb-6"
          >
            We Are <span className="text-accentViolet italic">Stargazers</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-textSecondary max-w-2xl mx-auto font-light leading-relaxed font-display"
          >
            Decoding the invisible language of the universe to help you find your resonant soul.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1744605745887-25e20b7d1652?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdGVsbGF0aW9uJTIwc3RhciUyMG1hcCUyMHZpbnRhZ2V8ZW58MXx8fHwxNzY5NDk1Mjg1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Ancient Star Map"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-accentViolet/20 mix-blend-overlay" />
              </div>
            </motion.div>

            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-light">Our Mission</h2>
              <p className="text-textSecondary leading-relaxed">
                In a world of swipe-left superficiality, Numeros seeks depth. We believe that true compatibility is not about shared hobbies or favorite foods - it is about energetic resonance.
              </p>
              <p className="text-textSecondary leading-relaxed">
                By combining Pythagorean numerology with Hellenistic astrology, we have built the world&apos;s first &quot;LoveEngine&quot; - an algorithm capable of calculating the harmonic frequency between two souls.
              </p>
              <div className="pt-4">
                <Button variant="outline">Learn the Science</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-accentViolet/20 flex items-center justify-center mx-auto text-accentViolet">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-display">Cosmic Truth</h3>
              <p className="text-textSecondary text-sm leading-relaxed">We do not rely on guesswork. Every match is backed by thousands of years of mathematical and astronomical wisdom.</p>
            </div>

            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-accentPink/20 flex items-center justify-center mx-auto text-accentPink">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-display">Intentional Connection</h3>
              <p className="text-textSecondary text-sm leading-relaxed">We foster slow, meaningful connections. Quality over quantity. Depth over breadth.</p>
            </div>

            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-accentCyan/20 flex items-center justify-center mx-auto text-accentCyan">
                <Eye size={32} />
              </div>
              <h3 className="text-xl font-display">Radical Transparency</h3>
              <p className="text-textSecondary text-sm leading-relaxed">We show you the &quot;why&quot; behind every match. No black box algorithms - just clear, cosmic data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-display font-light mb-12">The Architects</h2>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[21/9] mb-8 group">
            <Image
              src="https://images.unsplash.com/photo-1758691737387-a89bb8adf768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwY3JlYXRpdmUlMjB0ZWFtJTIwd29ya2luZyUyMHRvZ2V0aGVyJTIwb2ZmaWNlfGVufDF8fHx8MTc2OTQ5NTI4OXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Numeros Team"
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bgDeep/90 to-transparent flex items-end justify-center pb-8">
              <p className="text-lg font-mono tracking-widest uppercase">A collective of data scientists & mystics</p>
            </div>
          </div>
          <p className="text-textSecondary leading-relaxed max-w-2xl mx-auto">
            Founded in 2024, Numeros is a remote-first team spread across 12 time zones, united by a single obsession: understanding the invisible patterns that govern human relationships.
          </p>
        </div>
      </section>
    </div>
  );
}
