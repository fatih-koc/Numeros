// Planet meanings
export const PLANET_MEANINGS: Record<string, string> = {
  sun: 'Your core identity and life force',
  moon: 'Your emotional nature and instincts',
  mercury: 'Your mind and communication style',
  venus: 'Your love language and values',
  mars: 'Your drive and passion',
  jupiter: 'Your growth and expansion',
  saturn: 'Your discipline and boundaries',
}

// Sign meanings by planet
export const SIGN_MEANINGS: Record<string, Record<string, string>> = {
  Aries: {
    sun: 'Bold, independent, pioneering spirit',
    moon: 'Impulsive emotions, quick to react',
    mercury: 'Direct, assertive communicator',
    venus: 'Passionate, spontaneous in love',
    mars: 'Energetic, competitive drive',
    jupiter: 'Adventurous optimism',
    saturn: 'Learning patience through action',
  },
  Taurus: {
    sun: 'Stable, sensual, grounded nature',
    moon: 'Need for security and comfort',
    mercury: 'Practical, methodical thinking',
    venus: 'Loyal, affectionate love style',
    mars: 'Steady, persistent energy',
    jupiter: 'Growth through stability',
    saturn: 'Mastering material world',
  },
  Gemini: {
    sun: 'Curious, adaptable, communicative',
    moon: 'Need for mental stimulation',
    mercury: 'Quick-witted, versatile mind',
    venus: 'Playful, intellectual attraction',
    mars: 'Scattered but clever energy',
    jupiter: 'Learning through diversity',
    saturn: 'Discipline through focus',
  },
  Cancer: {
    sun: 'Nurturing, intuitive, protective',
    moon: 'Deep emotional sensitivity',
    mercury: 'Intuitive, empathetic communication',
    venus: 'Caring, devoted love',
    mars: 'Protective, defensive energy',
    jupiter: 'Emotional wisdom',
    saturn: 'Building emotional boundaries',
  },
  Leo: {
    sun: 'Charismatic, confident, generous',
    moon: 'Need for recognition and warmth',
    mercury: 'Dramatic, creative expression',
    venus: 'Romantic, lavish affection',
    mars: 'Bold, theatrical action',
    jupiter: 'Expansive creativity',
    saturn: 'Disciplined self-expression',
  },
  Virgo: {
    sun: 'Analytical, helpful, perfectionistic',
    moon: 'Need for order and purpose',
    mercury: 'Precise, detail-oriented mind',
    venus: 'Practical service in love',
    mars: 'Efficient, methodical energy',
    jupiter: 'Growth through refinement',
    saturn: 'Mastering craft',
  },
  Libra: {
    sun: 'Diplomatic, harmonious, fair',
    moon: 'Need for balance and partnership',
    mercury: 'Balanced, considerate communication',
    venus: 'Romantic, partnership-oriented',
    mars: 'Passive-aggressive energy',
    jupiter: 'Social expansion',
    saturn: 'Learning commitment',
  },
  Scorpio: {
    sun: 'Intense, passionate, transformative',
    moon: 'Deep, complex emotions',
    mercury: 'Penetrating, investigative mind',
    venus: 'All-or-nothing love',
    mars: 'Powerful, focused drive',
    jupiter: 'Depth over breadth',
    saturn: 'Mastering transformation',
  },
  Sagittarius: {
    sun: 'Adventurous, optimistic, philosophical',
    moon: 'Need for freedom and meaning',
    mercury: 'Broad, philosophical thinking',
    venus: 'Free-spirited love',
    mars: 'Restless, exploratory energy',
    jupiter: 'Natural expansion',
    saturn: 'Disciplined philosophy',
  },
  Capricorn: {
    sun: 'Ambitious, disciplined, traditional',
    moon: 'Reserved, responsible emotions',
    mercury: 'Strategic, pragmatic thinking',
    venus: 'Traditional, committed love',
    mars: 'Controlled, strategic action',
    jupiter: 'Structured growth',
    saturn: 'Natural discipline',
  },
  Aquarius: {
    sun: 'Innovative, humanitarian, unique',
    moon: 'Detached, progressive emotions',
    mercury: 'Original, unconventional thinking',
    venus: 'Unconventional, friendly love',
    mars: 'Unpredictable, inventive energy',
    jupiter: 'Progressive ideals',
    saturn: 'Structured innovation',
  },
  Pisces: {
    sun: 'Empathic, dreamy, spiritual',
    moon: 'Deeply sensitive, intuitive',
    mercury: 'Imaginative, poetic thinking',
    venus: 'Romantic, selfless love',
    mars: 'Compassionate, diffuse energy',
    jupiter: 'Boundless compassion',
    saturn: 'Disciplining dreams',
  },
}

// Zodiac sign colors
export const ZODIAC_COLORS: Record<string, string> = {
  Aries: '#FF4136',
  Taurus: '#2ECC40',
  Gemini: '#FFDC00',
  Cancer: '#C0C0C0',
  Leo: '#FF851B',
  Virgo: '#3D9970',
  Libra: '#F012BE',
  Scorpio: '#85144b',
  Sagittarius: '#B10DC9',
  Capricorn: '#654321',
  Aquarius: '#0074D9',
  Pisces: '#7FDBFF',
}

// Planet colors
export const PLANET_COLORS: Record<string, string> = {
  sun: '#FFD700',
  moon: '#C0C0C0',
  mercury: '#87CEEB',
  venus: '#FFB6C1',
  mars: '#FF4500',
  jupiter: '#FFA500',
  saturn: '#8B4513',
}

// Planet symbols (Astronomicon font glyphs)
export const PLANET_SYMBOLS: Record<string, string> = {
  sun: 'Q',
  moon: 'R',
  mercury: 'S',
  venus: 'T',
  mars: 'U',
  jupiter: 'V',
  saturn: 'W',
}

// Zodiac sign symbols (Astronomicon font glyphs)
export const ZODIAC_SYMBOLS: Record<string, string> = {
  Aries: 'A',
  Taurus: 'B',
  Gemini: 'C',
  Cancer: 'D',
  Leo: 'E',
  Virgo: 'F',
  Libra: 'G',
  Scorpio: 'H',
  Sagittarius: 'I',
  Capricorn: 'J',
  Aquarius: 'K',
  Pisces: 'L',
}

// Angle symbols (Astronomicon font glyphs)
export const ANGLE_SYMBOLS: Record<string, string> = {
  ascendant: 'c',
  midheaven: 'd',
  descendant: 'f',
  imumCoeli: 'e',
}

// Angle meanings
export const ANGLE_MEANINGS: Record<string, string> = {
  ascendant: 'Your rising sign - how you appear to the world and your approach to new experiences',
  midheaven: 'Your public image - your career path, reputation, and life direction',
}

// Zodiac info for angles
export const ZODIAC_INFO: Record<string, {element: string; quality: string; meaning: string}> = {
  Aries: {element: 'Fire', quality: 'Cardinal', meaning: 'Bold first impressions, pioneering approach'},
  Taurus: {element: 'Earth', quality: 'Fixed', meaning: 'Grounded presence, steady reliability'},
  Gemini: {element: 'Air', quality: 'Mutable', meaning: 'Quick-witted charm, adaptable energy'},
  Cancer: {element: 'Water', quality: 'Cardinal', meaning: 'Nurturing aura, protective instincts'},
  Leo: {element: 'Fire', quality: 'Fixed', meaning: 'Magnetic presence, natural leadership'},
  Virgo: {element: 'Earth', quality: 'Mutable', meaning: 'Refined demeanor, helpful nature'},
  Libra: {element: 'Air', quality: 'Cardinal', meaning: 'Harmonious grace, diplomatic charm'},
  Scorpio: {element: 'Water', quality: 'Fixed', meaning: 'Intense magnetism, mysterious allure'},
  Sagittarius: {element: 'Fire', quality: 'Mutable', meaning: 'Adventurous spirit, optimistic outlook'},
  Capricorn: {element: 'Earth', quality: 'Cardinal', meaning: 'Authoritative presence, ambitious drive'},
  Aquarius: {element: 'Air', quality: 'Fixed', meaning: 'Unique individuality, progressive vision'},
  Pisces: {element: 'Water', quality: 'Mutable', meaning: 'Ethereal presence, compassionate soul'},
}
