// Font family constants for numEros app
// Fonts loaded at runtime via expo-font

export const fonts = {
  // Serif - Cormorant Garamond (for body text, meanings, descriptions)
  serif: 'CormorantGaramond-Regular',
  serifItalic: 'CormorantGaramond-Italic',
  serifLight: 'CormorantGaramond-Light',
  serifLightItalic: 'CormorantGaramond-LightItalic',

  // Monospace - JetBrains Mono (for labels, buttons, technical text)
  mono: 'JetBrainsMono-Regular',
  monoItalic: 'JetBrainsMono-Italic',
  monoMedium: 'JetBrainsMono-Medium',
  monoSemiBold: 'JetBrainsMono-SemiBold',

  // Symbols - Astronomicon (for astrology glyphs)
  symbols: 'Astronomicon',
}

// Font assets for runtime loading
export const fontAssets = {
  // Cormorant Garamond
  'CormorantGaramond-Light': require('../../assets/fonts/CormorantGaramond-Light.ttf'),
  'CormorantGaramond-LightItalic': require('../../assets/fonts/CormorantGaramond-LightItalic.ttf'),
  'CormorantGaramond-Regular': require('../../assets/fonts/CormorantGaramond-Regular.ttf'),
  'CormorantGaramond-Italic': require('../../assets/fonts/CormorantGaramond-Italic.ttf'),

  // JetBrains Mono
  'JetBrainsMono-Regular': require('../../assets/fonts/JetBrainsMono-Regular.ttf'),
  'JetBrainsMono-Italic': require('../../assets/fonts/JetBrainsMono-Italic.ttf'),
  'JetBrainsMono-Medium': require('../../assets/fonts/JetBrainsMono-Medium.ttf'),
  'JetBrainsMono-SemiBold': require('../../assets/fonts/JetBrainsMono-SemiBold.ttf'),

  // Astronomicon
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
