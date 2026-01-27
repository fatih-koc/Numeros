"use client";

import React from 'react';
import { motion } from 'motion/react';
import { CircleSigil, TriangleSigil, SquareSigil, DiamondSigil } from '@/components/icons/Sigils';

export function LoveEngine() {
  return (
    <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-accentViolet/10 rounded-full blur-3xl animate-pulse" />

      {/* Outer rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-white/5 flex items-center justify-center"
      >
        {/* Decorative dots on ring */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 30}deg) translateY(-50%) translateX(148px)`
            }}
          />
        ))}
      </motion.div>

      {/* Middle Ring with Sigils */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full border border-white/10"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lifePath"><CircleSigil className="w-6 h-6 md:w-8 md:h-8" /></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-expression"><SquareSigil className="w-6 h-6 md:w-8 md:h-8" /></div>
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-soulUrge"><TriangleSigil className="w-6 h-6 md:w-8 md:h-8" /></div>
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-personality"><DiamondSigil className="w-6 h-6 md:w-8 md:h-8" /></div>
      </motion.div>

      {/* Inner Numbers Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute w-[140px] h-[140px] md:w-[220px] md:h-[220px] rounded-full border border-accentViolet/20 flex items-center justify-center"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, i) => (
          <span
            key={num}
            className="absolute font-mono text-xs md:text-sm text-accentViolet/60"
            style={{
              transform: `rotate(${i * 40}deg) translateY(-55px) rotate(-${i * 40}deg)`
            }}
          >
            {num}
          </span>
        ))}
      </motion.div>

      {/* Center Core */}
      <div className="relative w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-accentViolet to-accentPink rounded-full blur-sm opacity-50 animate-pulse" />
      <div className="absolute w-12 h-12 md:w-20 md:h-20 bg-bgDeep rounded-full border border-white/20 flex items-center justify-center z-10">
        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
      </div>

      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute w-1 h-1 bg-white/40 rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
}
