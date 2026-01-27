"use client";

import React from 'react';
import { Lock, Infinity, Hourglass } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    icon: Lock,
    title: "Same inputs, same truth",
    description: "No black-box algorithms. Your compatibility is calculated from ancient numerological and astrological systems - transparent and reproducible."
  },
  {
    icon: Infinity,
    title: "Numbers meet stars",
    description: "We analyze your Life Path, Soul Urge, Expression, and Personality numbers alongside your full birth chart for multi-dimensional matching."
  },
  {
    icon: Hourglass,
    title: "Quality over quantity",
    description: "One daily scan reveals your strongest connections. Matches unlock over time, encouraging meaningful reflection over mindless swiping."
  }
];

export function ValueGrid() {
  return (
    <section className="py-24 bg-bgMid relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] p-8 rounded-2xl hover:border-accentViolet/30 transition-colors group"
            >
              <div className="w-12 h-12 bg-accentViolet/10 rounded-xl flex items-center justify-center mb-6 text-accentViolet group-hover:scale-110 transition-transform duration-300">
                <feature.icon size={24} />
              </div>
              <h3 className="text-2xl font-display text-white mb-4">{feature.title}</h3>
              <p className="text-textSecondary font-display text-lg leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
