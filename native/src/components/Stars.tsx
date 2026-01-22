import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'
import Animated, {FadeIn} from 'react-native-reanimated'
import type {ScanOutput} from '../lib/scanOutput'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'
import {
  PLANET_MEANINGS,
  SIGN_MEANINGS,
  PLANET_COLORS,
  PLANET_SYMBOLS,
  ZODIAC_SYMBOLS,
} from '../lib/planetMeanings'
import {FlippablePlanetCard} from './FlippablePlanetCard'
import {FlippableAngleCard} from './FlippableAngleCard'

interface StarsProps {
  data: ScanOutput
  onUpgrade?: () => void
}

// Chart level display
const CHART_LEVEL_DISPLAY: Record<number, string> = {
  1: 'Basic',
  2: 'Enhanced',
  3: 'Full Chart',
  4: 'Complete',
}

const CHART_LEVEL_COLOR: Record<number, string> = {
  1: '#666666',
  2: '#CD7F32',
  3: '#C0C0C0',
  4: '#FFD700',
}

const CHART_LEVEL_ICON: Record<number, string> = {
  1: '\u25D4', // ◔
  2: '\u25D1', // ◑
  3: '\u25D5', // ◕
  4: '\u25CF', // ●
}

function getPlanetCardProps(planetKey: string, planet: {sign: string; degree_in_sign: number; house?: number | null}) {
  return {
    planetKey,
    planet,
    planetColor: PLANET_COLORS[planetKey] || '#FFFFFF',
    planetSymbol: PLANET_SYMBOLS[planetKey] || '?',
    planetName: planetKey.toUpperCase(),
    planetMeaning: PLANET_MEANINGS[planetKey] || 'Unique expression',
    signMeaning: SIGN_MEANINGS[planet.sign]?.[planetKey] || 'Unique expression',
    signSymbol: ZODIAC_SYMBOLS[planet.sign],
  }
}

// Chart Level Indicator component
function ChartLevelIndicator({chart_level}: {chart_level: number}) {
  return (
    <View style={styles.levelIndicator}>
      <Text style={[styles.levelIcon, {color: CHART_LEVEL_COLOR[chart_level], textShadowColor: CHART_LEVEL_COLOR[chart_level]}]}>
        {CHART_LEVEL_ICON[chart_level]}
      </Text>
      <Text style={[styles.levelText, {color: CHART_LEVEL_COLOR[chart_level]}]}>
        {CHART_LEVEL_DISPLAY[chart_level]}
      </Text>
    </View>
  )
}

// Upgrade Button component
function UpgradeButton({chart_level, onUpgrade}: {chart_level: number; onUpgrade?: () => void}) {
  if (!onUpgrade) return null

  return (
    <Pressable style={styles.upgradeButton} onPress={onUpgrade}>
      <Text style={styles.upgradeText}>
        {chart_level === 1
          ? 'Add birth time for precise Moon and Enhanced chart'
          : chart_level === 2
          ? 'Add birth place for Full Chart with houses and angles'
          : 'Add birth place for houses and angles'}
      </Text>
    </Pressable>
  )
}

export function Stars({data, onUpgrade}: StarsProps) {
  const astro = data.astrology
  const chart_level = data.chart_level

  // Level 1-2: Single column layout with flippable cards
  if (chart_level === 1 || chart_level === 2) {
    return (
      <Animated.View entering={FadeIn.duration(800)} style={styles.container}>
        <ChartLevelIndicator chart_level={chart_level} />

        {/* Luminaries */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LUMINARIES</Text>
          <View style={styles.luminariesRow}>
            <View style={styles.halfWidth}>
              <FlippablePlanetCard
                {...getPlanetCardProps('sun', astro.planets.sun)}
                size="medium"
              />
            </View>
            {astro.planets.moon && (
              <View style={styles.halfWidth}>
                <FlippablePlanetCard
                  {...getPlanetCardProps('moon', astro.planets.moon)}
                  isApproximate={chart_level === 1}
                  size="medium"
                />
              </View>
            )}
          </View>
        </View>

        {/* Personal Planets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PERSONAL PLANETS</Text>
          <View style={styles.personalRow}>
            <View style={styles.thirdWidth}>
              <FlippablePlanetCard
                {...getPlanetCardProps('mercury', astro.planets.mercury)}
                size="small"
              />
            </View>
            <View style={styles.thirdWidth}>
              <FlippablePlanetCard
                {...getPlanetCardProps('venus', astro.planets.venus)}
                size="small"
              />
            </View>
            <View style={styles.thirdWidth}>
              <FlippablePlanetCard
                {...getPlanetCardProps('mars', astro.planets.mars)}
                size="small"
              />
            </View>
          </View>
        </View>

        {/* Social Planets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SOCIAL PLANETS</Text>
          <View style={styles.socialRow}>
            <View style={styles.halfWidth}>
              <FlippablePlanetCard
                {...getPlanetCardProps('jupiter', astro.planets.jupiter)}
                size="small"
              />
            </View>
            <View style={styles.halfWidth}>
              <FlippablePlanetCard
                {...getPlanetCardProps('saturn', astro.planets.saturn)}
                size="small"
              />
            </View>
          </View>
        </View>

        <UpgradeButton chart_level={chart_level} onUpgrade={onUpgrade} />
      </Animated.View>
    )
  }

  // Level 3: Bento box layout
  if (chart_level === 3) {
    return (
      <Animated.View entering={FadeIn.duration(800)} style={styles.container}>
        <ChartLevelIndicator chart_level={chart_level} />

        {/* Bento Grid Layout */}
        <View style={styles.bentoGrid}>
          {/* Sun & Moon - Large row */}
          <View style={styles.bentoLuminariesRow}>
            <View style={styles.halfWidth}>
              <FlippablePlanetCard
                {...getPlanetCardProps('sun', astro.planets.sun)}
                size="large"
              />
            </View>
            {astro.planets.moon && (
              <View style={styles.halfWidth}>
                <FlippablePlanetCard
                  {...getPlanetCardProps('moon', astro.planets.moon)}
                  size="large"
                />
              </View>
            )}
          </View>

          {/* Personal Planets - 3 columns */}
          <View style={styles.personalRow}>
            <View style={styles.thirdWidth}>
              <FlippablePlanetCard
                {...getPlanetCardProps('mercury', astro.planets.mercury)}
                size="small"
              />
            </View>
            <View style={styles.thirdWidth}>
              <FlippablePlanetCard
                {...getPlanetCardProps('venus', astro.planets.venus)}
                size="small"
              />
            </View>
            <View style={styles.thirdWidth}>
              <FlippablePlanetCard
                {...getPlanetCardProps('mars', astro.planets.mars)}
                size="small"
              />
            </View>
          </View>

          {/* Social Planets */}
          <View style={styles.socialRow}>
            <View style={styles.halfWidth}>
              <FlippablePlanetCard
                {...getPlanetCardProps('jupiter', astro.planets.jupiter)}
                size="small"
              />
            </View>
            <View style={styles.halfWidth}>
              <FlippablePlanetCard
                {...getPlanetCardProps('saturn', astro.planets.saturn)}
                size="small"
              />
            </View>
          </View>
        </View>

        <UpgradeButton chart_level={chart_level} onUpgrade={onUpgrade} />
      </Animated.View>
    )
  }

  // Level 4: Advanced bento with angles
  return (
    <Animated.View entering={FadeIn.duration(800)} style={styles.container}>
      <ChartLevelIndicator chart_level={chart_level} />

      {/* Advanced Bento Grid */}
      <View style={styles.bentoGrid}>
        {/* Sun & Moon - Large row */}
        <View style={styles.bentoLuminariesRow}>
          <View style={styles.halfWidth}>
            <FlippablePlanetCard
              {...getPlanetCardProps('sun', astro.planets.sun)}
              size="large"
            />
          </View>
          {astro.planets.moon && (
            <View style={styles.halfWidth}>
              <FlippablePlanetCard
                {...getPlanetCardProps('moon', astro.planets.moon)}
                size="large"
              />
            </View>
          )}
        </View>

        {/* Angles Row */}
        {astro.angles.ascendant && (
          <View style={styles.anglesRow}>
            <View style={styles.halfWidth}>
              <FlippableAngleCard
                angleKey="ascendant"
                angle={astro.angles.ascendant}
                angleName="ASCENDANT"
              />
            </View>
            {astro.angles.midheaven && (
              <View style={styles.halfWidth}>
                <FlippableAngleCard
                  angleKey="midheaven"
                  angle={astro.angles.midheaven}
                  angleName="MIDHEAVEN"
                />
              </View>
            )}
          </View>
        )}

        {/* Personal Planets - 3 columns */}
        <View style={styles.personalRow}>
          <View style={styles.thirdWidth}>
            <FlippablePlanetCard
              {...getPlanetCardProps('mercury', astro.planets.mercury)}
              size="small"
            />
          </View>
          <View style={styles.thirdWidth}>
            <FlippablePlanetCard
              {...getPlanetCardProps('venus', astro.planets.venus)}
              size="small"
            />
          </View>
          <View style={styles.thirdWidth}>
            <FlippablePlanetCard
              {...getPlanetCardProps('mars', astro.planets.mars)}
              size="small"
            />
          </View>
        </View>

        {/* Social Planets */}
        <View style={styles.socialRow}>
          <View style={styles.halfWidth}>
            <FlippablePlanetCard
              {...getPlanetCardProps('jupiter', astro.planets.jupiter)}
              size="small"
            />
          </View>
          <View style={styles.halfWidth}>
            <FlippablePlanetCard
              {...getPlanetCardProps('saturn', astro.planets.saturn)}
              size="small"
            />
          </View>
        </View>
      </View>

      {/* Complete Status */}
      <Text style={styles.completeText}>
        {'\u2728'} Full natal chart with houses and angles
      </Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 24,
  },
  levelIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelIcon: {
    fontSize: 19,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 12,
  },
  levelText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  section: {
    width: '100%',
    gap: 16,
  },
  sectionTitle: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 3,
    color: colors.textDim,
    textAlign: 'center',
  },
  bentoGrid: {
    width: '100%',
    gap: 16,
  },
  bentoLuminariesRow: {
    flexDirection: 'row',
    gap: 16,
  },
  luminariesRow: {
    flexDirection: 'row',
    gap: 16,
  },
  personalRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 16,
  },
  anglesRow: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  thirdWidth: {
    flex: 1,
  },
  upgradeButton: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    alignItems: 'center',
  },
  upgradeText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: fonts.serif,
  },
  completeText: {
    fontSize: 12,
    color: '#10B981',
    fontStyle: 'italic',
    textAlign: 'center',
    fontFamily: fonts.serif,
  },
})
