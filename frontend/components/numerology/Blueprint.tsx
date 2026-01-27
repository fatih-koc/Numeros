"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

export interface NumerologyData {
  life_path: number;
  soul_urge: number;
  expression: number;
  personality: number;
}

interface BlueprintProps {
  data: NumerologyData;
}

const ENERGY_COLORS = {
  life_path: {
    color: 'var(--color-lifePath)',
    glow: 'rgba(245, 158, 11, 0.4)',
    hoverBorder: 'rgba(245, 158, 11, 0.5)',
    expandedBg: 'rgba(245, 158, 11, 0.15)'
  },
  soul_urge: {
    color: 'var(--color-soulUrge)',
    glow: 'rgba(6, 182, 212, 0.4)',
    hoverBorder: 'rgba(6, 182, 212, 0.5)',
    expandedBg: 'rgba(6, 182, 212, 0.15)'
  },
  expression: {
    color: 'var(--color-expression)',
    glow: 'rgba(16, 185, 129, 0.4)',
    hoverBorder: 'rgba(16, 185, 129, 0.5)',
    expandedBg: 'rgba(16, 185, 129, 0.15)'
  },
  personality: {
    color: 'var(--color-personality)',
    glow: 'rgba(244, 114, 182, 0.4)',
    hoverBorder: 'rgba(244, 114, 182, 0.5)',
    expandedBg: 'rgba(244, 114, 182, 0.15)'
  }
};

const DETAILED_INFO = {
  life_path: {
    subtitle: "Life Path Number",
    details: "Your fundamental nature and life purpose. This is the essence of who you are and what you're meant to become. It influences every major decision and relationship in your life.",
    resonance: "In love, this number determines your compatibility with others. It's the bedrock of lasting connections."
  },
  soul_urge: {
    subtitle: "Soul Urge Number",
    details: "Your innermost yearnings and motivations. This reveals what drives you at the deepest level and what you need to feel fulfilled in love and life.",
    resonance: "Understanding your soul urge helps you recognize when a partner can truly satisfy your needs."
  },
  expression: {
    subtitle: "Expression Number",
    details: "How you connect and relate to others. This shows your natural attachment style and the ways you build emotional connections with those you love.",
    resonance: "Your expression style determines how you communicate love and what makes you feel connected to another person."
  },
  personality: {
    subtitle: "Personality Number",
    details: "Your outward persona in relationships. Understanding this helps you recognize how others perceive you and how you present yourself in love.",
    resonance: "Knowing your personality number allows you to understand how you come across to potential partners."
  }
};

const TILE_POSITIONS = {
  life_path: { row: 0, col: 0 },
  soul_urge: { row: 0, col: 1 },
  expression: { row: 1, col: 0 },
  personality: { row: 1, col: 1 }
};

export function Blueprint({ data }: BlueprintProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const tiles = [
    {
      key: 'life_path',
      title: 'LIFE PATH',
      number: data.life_path,
      meaning: 'Your core journey',
      colors: ENERGY_COLORS.life_path,
      details: DETAILED_INFO.life_path
    },
    {
      key: 'soul_urge',
      title: 'SOUL URGE',
      number: data.soul_urge,
      meaning: 'Your inner motivation',
      colors: ENERGY_COLORS.soul_urge,
      details: DETAILED_INFO.soul_urge
    },
    {
      key: 'expression',
      title: 'EXPRESSION',
      number: data.expression,
      meaning: 'How you connect',
      colors: ENERGY_COLORS.expression,
      details: DETAILED_INFO.expression
    },
    {
      key: 'personality',
      title: 'PERSONALITY',
      number: data.personality,
      meaning: 'Your outer self',
      colors: ENERGY_COLORS.personality,
      details: DETAILED_INFO.personality
    }
  ];

  const handleTileClick = (key: string) => {
    setExpanded(expanded === key ? null : key);
  };

  const getTileStyle = (tileKey: string) => {
    const isExpanded = expanded === tileKey;
    const isOtherExpanded = expanded !== null && !isExpanded;
    const position = TILE_POSITIONS[tileKey as keyof typeof TILE_POSITIONS];

    if (isExpanded) {
      return {
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        opacity: 1,
        zIndex: 20
      };
    } else if (isOtherExpanded) {
      return {
        top: `${position.row * 50}%`,
        left: `${position.col * 50}%`,
        width: 'calc(50% - 12px)',
        height: 'calc(50% - 12px)',
        opacity: 0,
        zIndex: 1
      };
    } else {
      return {
        top: `${position.row * 50}%`,
        left: `${position.col * 50}%`,
        width: 'calc(50% - 12px)',
        height: 'calc(50% - 12px)',
        opacity: 1,
        zIndex: 1
      };
    }
  };

  return (
    <div className="w-full relative animate-fade-in">
      {/* Blueprint Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      />

      {/* Grid Container */}
      <div
        className="relative w-full mx-auto mb-10 transition-all duration-500"
        style={{ height: '500px', maxWidth: '600px' }}
      >
        {tiles.map((tile, index) => {
          const isExpanded = expanded === tile.key;
          const isOtherExpanded = expanded !== null && !isExpanded;
          const tileStyle = getTileStyle(tile.key);

          return (
            <div
              key={tile.key}
              className="absolute"
              style={{
                ...tileStyle,
                perspective: '1000px',
                transition: 'all 0.7s cubic-bezier(0.215, 0.61, 0.355, 1)',
                transitionProperty: 'top, left, width, height, opacity',
                animation: `tileAppear 0.6s ease backwards ${index * 0.1}s`,
                pointerEvents: isOtherExpanded ? 'none' : 'auto'
              }}
            >
              <div
                onClick={() => handleTileClick(tile.key)}
                className="relative w-full h-full cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isExpanded ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transition: 'transform 0.8s cubic-bezier(0.215, 0.61, 0.355, 1)'
                }}
              >
                {/* Front Face */}
                <div
                  className="absolute inset-0 rounded-[24px] border bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] transition-all duration-300"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="h-full w-full p-8 flex flex-col items-center justify-center text-center">
                    <div className="uppercase tracking-[0.25em] mb-4 font-mono text-[0.65rem] text-textDim">
                      {tile.title}
                    </div>
                    <div
                      className="mb-3 text-5xl font-light"
                      style={{
                        color: tile.colors.color,
                        textShadow: `0 0 30px ${tile.colors.glow}`
                      }}
                    >
                      {tile.number}
                    </div>
                    <div className="text-sm text-textSecondary">{tile.meaning}</div>
                    <div className="text-[0.6rem] text-textDim mt-3 font-mono tracking-wider opacity-50">
                      Click to reveal
                    </div>
                  </div>
                </div>

                {/* Back Face */}
                <div
                  className="absolute inset-0 rounded-[24px] border overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: tile.colors.expandedBg,
                    borderColor: tile.colors.hoverBorder,
                    boxShadow: `0 0 80px ${tile.colors.glow}, 0 20px 60px rgba(0, 0, 0, 0.5)`
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(null);
                    }}
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-white/10 z-30 text-white/40 hover:text-white/90"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="h-full w-full p-12 flex flex-col items-center justify-center text-center overflow-y-auto no-scrollbar">
                    <div
                      className="uppercase tracking-[0.25em] font-mono text-xs mb-2"
                      style={{ color: tile.colors.color }}
                    >
                      {tile.title}
                    </div>
                    <div className="font-mono text-[0.6rem] text-textDim mb-6 tracking-wider">
                      {tile.details.subtitle}
                    </div>
                    <div
                      className="text-6xl font-light mb-6"
                      style={{
                        color: tile.colors.color,
                        textShadow: `0 0 50px ${tile.colors.glow}, 0 0 80px ${tile.colors.glow}`
                      }}
                    >
                      {tile.number}
                    </div>
                    <div className="text-base text-textSecondary mb-6">{tile.meaning}</div>
                    <div className="max-w-[85%]">
                      <div
                        className="text-sm text-textSecondary leading-relaxed italic py-5 mb-5"
                        style={{ borderTop: `1px solid ${tile.colors.hoverBorder}`, borderBottom: `1px solid ${tile.colors.hoverBorder}` }}
                      >
                        {tile.details.details}
                      </div>
                      <div className="text-sm leading-relaxed" style={{ color: tile.colors.color }}>
                        {tile.details.resonance}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
