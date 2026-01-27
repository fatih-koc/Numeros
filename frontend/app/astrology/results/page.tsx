"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Share2, Download, Star, Compass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getSunSign } from '@/lib/numerology';

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const ZODIAC_COLORS: Record<string, string> = {
  Aries: '#FF4136', Taurus: '#2ECC40', Gemini: '#FFDC00', Cancer: '#C0C0C0',
  Leo: '#FF851B', Virgo: '#3D9970', Libra: '#F012BE', Scorpio: '#85144b',
  Sagittarius: '#B10DC9', Capricorn: '#654321', Aquarius: '#0074D9', Pisces: '#7FDBFF',
};

export default function AstrologyResults() {
  const [loading, setLoading] = useState(true);
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [birthTime, setBirthTime] = useState("12:00");
  const [birthPlace, setBirthPlace] = useState("Unknown Location");
  const [sunSign, setSunSign] = useState("Capricorn");
  const [moonSign, setMoonSign] = useState("Cancer");
  const [ascendant, setAscendant] = useState("Leo");
  const [chartRuler, setChartRuler] = useState("Sun");

  useEffect(() => {
    const storedData = sessionStorage.getItem('astrologyData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setBirthDate(data.birthDate || "1990-01-01");
      setBirthTime(data.birthTime || "12:00");
      setBirthPlace(data.birthPlace || "Unknown Location");
      setSunSign(getSunSign(data.birthDate));
    }

    // Random values for demo (in production, would be calculated from API)
    setMoonSign(ZODIAC_SIGNS[Math.floor(Math.random() * 12)]);
    setAscendant(ZODIAC_SIGNS[Math.floor(Math.random() * 12)]);
    setChartRuler(["Mars", "Venus", "Mercury", "Jupiter", "Saturn", "Sun", "Moon"][Math.floor(Math.random() * 7)]);

    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bgDeep flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-accentPink/20 blur-xl rounded-full" />
          <Star className="w-16 h-16 text-accentPink relative z-10" />
        </motion.div>
        <h2 className="text-2xl font-display text-white mb-2">Aligning Celestial Bodies...</h2>
        <p className="text-textSecondary font-mono text-sm animate-pulse">Calculating planetary positions for {birthPlace}</p>
      </div>
    );
  }

  const astroTiles = [
    { key: 'sun', title: 'SUN SIGN', value: sunSign, meaning: 'Your core identity', color: ZODIAC_COLORS[sunSign] },
    { key: 'moon', title: 'MOON SIGN', value: moonSign, meaning: 'Your emotional nature', color: ZODIAC_COLORS[moonSign] },
    { key: 'ascendant', title: 'ASCENDANT', value: ascendant, meaning: 'Your outer self', color: ZODIAC_COLORS[ascendant] },
    { key: 'ruler', title: 'CHART RULER', value: chartRuler, meaning: 'Your guiding planet', color: '#8B5CF6' },
  ];

  return (
    <div className="min-h-screen bg-bgDeep text-white pt-28 pb-20 px-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accentPink/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8 gap-6">
          <div>
            <div className="text-accentPink font-mono text-xs tracking-[0.2em] uppercase mb-2">Natal Chart Report</div>
            <h1 className="text-4xl md:text-5xl font-display text-white">Your Astral Blueprint</h1>
            <p className="text-textSecondary mt-2 flex items-center gap-2">
              <Compass className="w-4 h-4 text-accentViolet" /> {birthPlace} - {birthDate} @ {birthTime}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" className="gap-2"><Share2 className="w-4 h-4" /> Share</Button>
            <Button variant="secondary" size="sm" className="gap-2"><Download className="w-4 h-4" /> Save Chart</Button>
          </div>
        </div>

        {/* Astrology Grid */}
        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
          {astroTiles.map((tile, index) => (
            <motion.div
              key={tile.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 text-center hover:border-[rgba(255,255,255,0.2)] transition-colors"
            >
              <div className="uppercase tracking-[0.25em] mb-4 font-mono text-[0.65rem] text-textDim">
                {tile.title}
              </div>
              <div
                className="text-4xl font-display mb-3"
                style={{ color: tile.color }}
              >
                {tile.value}
              </div>
              <div className="text-sm text-textSecondary">{tile.meaning}</div>
            </motion.div>
          ))}
        </div>

        {/* Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-3xl mx-auto mb-8">
            <h3 className="text-lg font-display text-white mb-4">Planetary Synergy</h3>
            <p className="text-textSecondary leading-relaxed">
              With your Sun in {sunSign} and Moon in {moonSign}, you possess a unique blend of
              conscious drive and emotional depth. Your {ascendant} Ascendant shapes how you present yourself
              to the world, while {chartRuler} as your Chart Ruler acts as the guiding force unifying these energies.
            </p>
          </div>

          <div className="text-center">
            <Link href="/numerology">
              <Button variant="outline">
                Explore Numerology Chart <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
