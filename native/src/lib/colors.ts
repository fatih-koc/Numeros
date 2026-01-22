// numEros color palette - matching prototype exactly
export const colors = {
  // Background colors
  bgDeep: '#0c0a1d',
  bgMid: '#1a1533',

  // Energy colors (for numerology numbers)
  energy1: '#DC2626', // Red
  energy2: '#F472B6', // Pink
  energy3: '#F59E0B', // Orange/Amber
  energy4: '#10B981', // Green
  energy5: '#06B6D4', // Cyan
  energy6: '#FBBF24', // Yellow
  energy7: '#6366F1', // Indigo
  energy8: '#8B5CF6', // Violet
  energy9: '#F5F5F5', // Light gray

  // Glow colors
  glowPrimary: 'rgba(139, 92, 246, 0.5)',
  glowSecondary: 'rgba(236, 72, 153, 0.4)',

  // Text colors - exactly as prototype
  textPrimary: 'rgba(255, 255, 255, 0.95)',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textDim: 'rgba(255, 255, 255, 0.3)',

  // Accent colors
  accentViolet: '#8B5CF6',
  accentPink: '#EC4899',
  accentIndigo: '#6366F1',

  // Border colors
  borderLight: 'rgba(255, 255, 255, 0.1)',
  borderActive: 'rgba(139, 92, 246, 0.5)',
  borderButton: 'rgba(139, 92, 246, 0.3)',

  // Button
  buttonBg: 'rgba(139, 92, 246, 0.15)',
}

export const energyColors: Record<number, string> = {
  1: colors.energy1,
  2: colors.energy2,
  3: colors.energy3,
  4: colors.energy4,
  5: colors.energy5,
  6: colors.energy6,
  7: colors.energy7,
  8: colors.energy8,
  9: colors.energy9,
}

// Sigil colors mapping
export const sigilColors = {
  life_path: colors.energy7, // Indigo - Circle sigil
  soul_urge: colors.energy3, // Orange - Triangle sigil
  expression: colors.energy4, // Green - Square sigil
  personality: colors.energy2, // Pink - Diamond sigil
}
