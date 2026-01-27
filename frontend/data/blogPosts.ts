export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  imageUrl: string;
  slug: string;
  author: string;
  readTime: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Hidden Meaning of Life Path Number 7',
    excerpt: 'Discover why sevens are considered the spiritual seekers of numerology and what it means for your compatibility.',
    content: `
      <p>Life Path Number 7 is often called the "Seeker" in numerology. People with this life path are driven by a profound desire to uncover the truth behind the surface of reality. They are the philosophers, the mystics, and the analysts of the world.</p>

      <h3>The Energy of the 7</h3>
      <p>The number 7 resonates with the vibration of analysis, introspection, and spiritual awareness. Unlike the material-focused 8 or the community-oriented 6, the 7 is primarily concerned with the inner world. If you are a 7, you likely need plenty of alone time to recharge and process your thoughts.</p>

      <h3>Compatibility for 7s</h3>
      <p>In relationships, 7s can be challenging partners because they require a high degree of independence. They thrive with partners who respect their need for solitude and who can engage them in deep, intellectual conversations.</p>
      <ul>
        <li><strong>Best Matches:</strong> 3, 5, and other 7s usually understand the need for space.</li>
        <li><strong>Challenges:</strong> 2s and 6s might find the 7 too distant or emotionally unavailable.</li>
      </ul>

      <h3>The Spiritual Journey</h3>
      <p>Ultimately, the journey of the 7 is to find a bridge between the scientific and the spiritual. By learning to trust their intuition as much as their logic, 7s can achieve a state of profound wisdom that illuminates the path for others.</p>
    `,
    category: 'Numerology',
    date: 'Jan 24, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1666071083297-601c9b0701a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudW1lcm9sb2d5JTIwbnVtYmVycyUyMG1hdGhlbWF0aWNzJTIwc3BhY2UlMjBteXN0aWNhbHxlbnwxfHx8fDE3Njk0OTg2MTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    slug: 'meaning-of-life-path-7',
    author: 'Dr. Astra Nova',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'Twin Flames vs. Soulmates: A Cosmic Perspective',
    excerpt: 'Understanding the energetic differences between these profound connections and how to recognize them in your life.',
    content: `
      <p>The terms "Twin Flame" and "Soulmate" are often used interchangeably, but energetically, they represent very different types of connections. Understanding the distinction can help you navigate your relationships with greater clarity.</p>

      <h3>Soulmates: Your Spiritual Family</h3>
      <p>A soulmate is someone from your same soul group. You may have many soulmates in a lifetime—friends, family members, or romantic partners. These relationships feel comfortable, like coming home. They are here to help you grow, but often in a supportive, nurturing way.</p>

      <h3>Twin Flames: Your Mirror Soul</h3>
      <p>A Twin Flame connection is believed to be one soul split into two bodies. Meeting your Twin Flame is intense, often triggering a "dark night of the soul." This relationship is a catalyst for rapid spiritual awakening. It acts as a mirror, reflecting your deepest insecurities and shadow self so you can heal them.</p>

      <h3>Which One is Better?</h3>
      <p>Neither is "better." Soulmate relationships are often more stable and harmonious, making them excellent for long-term partnership and raising families. Twin Flame relationships are volatile and purposeful—they are about mission and spiritual evolution rather than domestic bliss.</p>
    `,
    category: 'Relationships',
    date: 'Jan 18, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1499353966104-ec5c73302e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBzaWxob3VldHRlJTIwc3RhcnMlMjBsb3ZlJTIwY29zbWljfGVufDF8fHx8MTc2OTQ5ODYxMHww&ixlib=rb-4.1.0&q=80&w=1080',
    slug: 'twin-flames-vs-soulmates',
    author: 'Luna Sol',
    readTime: '7 min read'
  },
  {
    id: '3',
    title: 'Navigating Retrogrades: A Guide for Sensitive Souls',
    excerpt: 'How planetary movements affect your personal vibrations and practical tips for staying grounded during turbulent times.',
    content: `
      <p>When a planet goes retrograde, it appears to move backward in the sky from our perspective on Earth. Energetically, this signals a time for review, reflection, and reassessment. For sensitive individuals, these periods can feel chaotic.</p>

      <h3>Mercury Retrograde</h3>
      <p>The most famous retrograde. It affects communication, technology, and travel.
      <strong>Tip:</strong> Double-check emails, back up your data, and practice patience.</p>

      <h3>Venus Retrograde</h3>
      <p>Affects love, beauty, and money. Ex-partners often return during this time.
      <strong>Tip:</strong> Avoid major makeovers or large financial investments. Use this time to heal past heartbreaks.</p>

      <h3>Mars Retrograde</h3>
      <p>Governs action, drive, and conflict. Energy levels may dip, or frustration may boil over.
      <strong>Tip:</strong> Don't force things. If you hit a wall, step back and rest.</p>
    `,
    category: 'Astrology',
    date: 'Jan 12, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1765120298918-e9932c6c0332?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYWxheHklMjBuZWJ1bGElMjBzdGFycyUyMGNvc21pYyUyMHB1cnBsZSUyMHNwYWNlfGVufDF8fHx8MTc2OTQ5ODYwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    slug: 'navigating-retrogrades',
    author: 'Orion Star',
    readTime: '4 min read'
  },
  {
    id: '4',
    title: 'The Science of Synastry: Why You Click with Certain People',
    excerpt: 'Exploring the mathematical patterns that underlie attraction and deep connection between individuals.',
    content: `
      <p>Synastry is the art of comparing two astrological charts to determine compatibility. It's not just about "Is my sign compatible with yours?" It's a complex geometric analysis of how planetary energies interact.</p>

      <h3>The Aspects</h3>
      <p>When planets in one chart form specific angles to planets in another chart, an "aspect" is formed.</p>
      <ul>
        <li><strong>Conjunction (0):</strong> Intense blending of energies. Can be overwhelming or unifying.</li>
        <li><strong>Trine (120):</strong> Flow and harmony. Things feel easy.</li>
        <li><strong>Square (90):</strong> Tension and friction. Creates sparks but requires work.</li>
        <li><strong>Opposition (180):</strong> Attraction of opposites. Can lead to "seesawing" dynamics.</li>
      </ul>

      <h3>The Houses</h3>
      <p>Where someone's planets fall in your chart (the houses) tells you <em>where</em> they will impact your life. Someone's Sun in your 7th House often indicates a significant partnership.</p>
    `,
    category: 'Compatibility',
    date: 'Jan 05, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1769095209985-346bf992a62e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwc3Bpcml0dWFsJTIwZW5lcmd5JTIwYXVyYXxlbnwxfHx8fDE3Njk0OTg2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    slug: 'science-of-synastry',
    author: 'Dr. Cosmos',
    readTime: '6 min read'
  },
  {
    id: '5',
    title: 'Master Numbers 11, 22, 33: The Power Trinity',
    excerpt: 'What does it mean to have a Master Number in your chart? Unlocking the potential of these high-vibration frequencies.',
    content: `
      <p>In Numerology, the numbers 11, 22, and 33 are considered "Master Numbers." They are not reduced to a single digit because they carry a higher vibrational frequency and potential.</p>

      <h3>Number 11: The Master Intuitive</h3>
      <p>11 is the most intuitive number. It represents illumination, subconscious insight, and sensitivity. Those with this number are often charismatic and visionary but can struggle with anxiety due to high nervous energy.</p>

      <h3>Number 22: The Master Builder</h3>
      <p>22 combines the intuition of the 11 with the practical nature of the 4. It has the potential to turn lofty dreams into concrete reality. It is the most powerful of all numbers but requires great discipline.</p>

      <h3>Number 33: The Master Teacher</h3>
      <p>33 is the number of altruism and spiritual devotion. It is rare to find a 33 life path. These individuals are focused on uplifting humanity and often sacrifice their own needs for the greater good.</p>
    `,
    category: 'Numerology',
    date: 'Dec 28, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1727522974621-c64b5ea90c0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdlb21ldHJ5JTIwbnVtYmVycyUyMG1hdGh8ZW58MXx8fHwxNzY5NDk4NjcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    slug: 'master-numbers-explained',
    author: 'Sage Wisdom',
    readTime: '5 min read'
  },
  {
    id: '6',
    title: 'Aligning Your Career with Your Cosmic Blueprint',
    excerpt: 'Using your numerology chart to find fulfilling work that resonates with your true purpose and natural talents.',
    content: `
      <p>Are you feeling stuck in your career? Your numerology chart, specifically your "Expression Number" and "Life Path Number," can offer profound clues about your ideal vocation.</p>

      <h3>Calculating Your Career Numbers</h3>
      <p>Your Life Path number outlines your main lesson, while your Expression number (derived from your full name) highlights your natural talents.</p>

      <h3>Examples</h3>
      <ul>
        <li><strong>Number 1:</strong> Leadership, entrepreneurship, innovation. Best as bosses or solo founders.</li>
        <li><strong>Number 4:</strong> Systems, architecture, accounting. Thrives with structure and building foundations.</li>
        <li><strong>Number 8:</strong> Finance, law, executive management. The powerhouse of material success.</li>
      </ul>

      <p>When you align your daily work with these inherent vibrations, you stop swimming upstream and start flowing with the current of your life's purpose.</p>
    `,
    category: 'Career',
    date: 'Dec 15, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1742046335792-060080d72460?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBkZXNrJTIwY3JlYXRpdmUlMjB3b3Jrc3BhY2UlMjBkYXJrfGVufDF8fHx8MTc2OTQ5ODY3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    slug: 'career-alignment',
    author: 'Job Star',
    readTime: '6 min read'
  }
];
