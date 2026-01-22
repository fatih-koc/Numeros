// Font family constants for numEros app
// Fonts loaded at runtime via expo-font

export const fonts = {
  // Serif - Garamond Premier Pro (for titles, meanings, body text)
  serif: 'GaramondPremrPro-Disp',
  serifItalic: 'GaramondPremrPro-It',

  // Monospace - Letter Gothic MT Std (for labels, buttons, technical text)
  mono: 'LetterGothicMTStd',
  monoItalic: 'LetterGothicMTStd-Oblique',

  // Symbols - Astronomicon (for astrology glyphs)
  symbols: 'Astronomicon',
}

// Font assets for runtime loading
export const fontAssets = {
  'GaramondPremrPro-Disp': require('../../assets/fonts/GaramondPremrPro-Disp.otf'),
  'GaramondPremrPro-It': require('../../assets/fonts/GaramondPremrPro-It.otf'),
  'LetterGothicMTStd': require('../../assets/fonts/LetterGothicMTStd.otf'),
  'LetterGothicMTStd-Oblique': require('../../assets/fonts/LetterGothicMTStd-Oblique.otf'),
  'Astronomicon': require('../../assets/fonts/Astronomicon.ttf'),
}

// Astronomicon glyph mappings for astrology symbols
export const astroGlyphs = {
  // Zodiac Signs
  aries: 'A',
  taurus: 'B',
  gemini: 'C',
  cancer: 'D',
  leo: 'E',
  virgo: 'F',
  libra: 'G',
  scorpio: 'H',
  sagittarius: 'I',
  capricorn: '\\',  // European style
  capricornUS: 'J',
  aquarius: 'K',
  pisces: 'L',

  // Planets
  sun: 'Q',
  moon: 'R',
  mercury: 'S',
  venus: 'T',
  mars: 'U',
  jupiter: 'V',
  saturn: 'W',
  uranus: 'X',
  neptune: 'Y',
  pluto: 'Z',

  // Earth & Nodes
  earth: 'h',
  northNode: 'g',
  southNode: 'i',
  lilith: 'z',

  // Houses
  house1: '0',
  house2: '1',
  house3: '2',
  house4: '3',
  house5: '4',
  house6: '5',
  house7: '6',
  house8: '7',
  house9: '8',
  house10: '9',
  house11: ':',
  house12: ';',

  // Angles
  ascendant: 'c',
  midheaven: 'd',
  descendant: 'f',
  imumCoeli: 'e',

  // Aspects
  conjunction: '!',
  sextile: '%',
  square: '#',
  trine: '$',
  opposition: '"',

  // Asteroids
  chiron: 'q',
  ceres: 'l',
  pallas: 'm',
  juno: 'n',
  vesta: 'o',

  // Parts
  partOfFortune: '?',
  partOfSpirit: '@',

  // Elements (Alchemy)
  fire: '±',
  air: '²',
  water: '³',
  earthElement: '´',
}
