"use client";

import React from 'react';

interface SigilProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const CircleSigil = ({ className, ...props }: SigilProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const TriangleSigil = ({ className, ...props }: SigilProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12 4L20 18H4L12 4Z" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const SquareSigil = ({ className, ...props }: SigilProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <rect x="5" y="5" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export const DiamondSigil = ({ className, ...props }: SigilProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12 2L22 12L12 22L2 12L12 2Z" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);
