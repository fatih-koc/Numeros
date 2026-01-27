"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';

interface RadarScanProps {
  size?: 'sm' | 'md' | 'lg';
  showIndicators?: boolean;
}

export function RadarScan({ size = 'md', showIndicators = true }: RadarScanProps) {
  const dimensions = {
    sm: 'w-[300px] h-[300px]',
    md: 'w-[400px] h-[400px]',
    lg: 'w-[500px] h-[500px]'
  };

  const ringSizes = {
    sm: [300, 200, 100],
    md: [400, 300, 200],
    lg: [500, 350, 200]
  };

  return (
    <div className={`relative ${dimensions[size]} flex items-center justify-center`}>
      {/* Radar Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)]" />

      {ringSizes[size].map((d, i) => (
        <div key={i} className="rounded-full border border-white/10 absolute" style={{ width: d, height: d }} />
      ))}

      {/* Scan Sweep */}
      <motion.div
        className="absolute origin-bottom-left bg-gradient-to-r from-transparent to-accentViolet/20"
        style={{
          width: ringSizes[size][0] / 2,
          height: ringSizes[size][0] / 2,
          top: '50%',
          left: '50%',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
          borderRadius: '0 100% 0 0'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* Central Orb */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accentViolet to-accentPink blur-md absolute animate-pulse" />

      {/* Match Indicators */}
      {showIndicators && (
        <>
          <motion.div
            className="absolute top-[20%] right-[20%] bg-bgMid border border-expression/50 px-3 py-1 rounded-full flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.9] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.8, 1], repeatDelay: 1 }}
          >
            <div className="w-4 h-4 bg-expression rounded-full flex items-center justify-center">
              <Check size={10} className="text-bgDeep" />
            </div>
            <span className="text-xs font-mono text-white">Match Found</span>
          </motion.div>

          <motion.div
            className="absolute bottom-[30%] left-[10%] bg-bgMid border border-red-500/30 px-3 py-1 rounded-full flex items-center gap-2 opacity-60"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.9] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 0.8, 1], delay: 2 }}
          >
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <X size={10} className="text-bgDeep" />
            </div>
            <span className="text-xs font-mono text-white">Dissonance</span>
          </motion.div>
        </>
      )}
    </div>
  );
}
