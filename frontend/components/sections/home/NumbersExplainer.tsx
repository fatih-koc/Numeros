"use client";

import React from 'react';
import { CircleSigil, TriangleSigil, SquareSigil, DiamondSigil } from '@/components/icons/Sigils';
import { motion } from 'motion/react';

const numbers = [
  {
    label: "Life Path",
    color: "var(--color-lifePath)",
    sigil: CircleSigil,
    number: "7",
    desc: "Your soul's journey and life purpose"
  },
  {
    label: "Soul Urge",
    color: "var(--color-soulUrge)",
    sigil: TriangleSigil,
    number: "3",
    desc: "Your inner desires and spiritual nature"
  },
  {
    label: "Expression",
    color: "var(--color-expression)",
    sigil: SquareSigil,
    number: "5",
    desc: "Your natural talents and abilities"
  },
  {
    label: "Personality",
    color: "var(--color-personality)",
    sigil: DiamondSigil,
    number: "9",
    desc: "How others perceive you"
  }
];

export function NumbersExplainer() {
  return (
    <section className="py-24 bg-bgDeep">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-display text-white mb-4">Your cosmic DNA in four numbers</h2>
          <p className="text-textSecondary text-lg font-display">
            Each person carries four core numerological values, derived from their name and birth date.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {numbers.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-bgLight rounded-xl p-8 border border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
              style={{ borderTop: `4px solid ${item.color}` }}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className="mb-4 transition-transform duration-500 group-hover:rotate-180"
                  style={{ color: item.color }}
                >
                  <item.sigil width={32} height={32} />
                </div>

                <div
                  className="text-5xl font-display mb-4"
                  style={{
                    color: item.color,
                    filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.2))'
                  }}
                >
                  {item.number}
                </div>

                <h3 className="text-white font-mono text-sm uppercase tracking-wider mb-2">{item.label}</h3>
                <p className="text-textSecondary text-sm leading-relaxed">{item.desc}</p>
              </div>

              {/* Background Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: item.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
