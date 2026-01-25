import React, {useCallback, useEffect} from 'react'
import {StyleSheet, View, Text, Pressable, useWindowDimensions} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  interpolate,
  Easing,
} from 'react-native-reanimated'
import Svg, {Defs, Pattern, Line, Rect, RadialGradient, Stop} from 'react-native-svg'
import {colors, sigilColors} from '../lib/colors'
import {fonts} from '../lib/fonts'
import type {ScanOutput} from '../lib/scanOutput'

// easeOutCubic for flip animation - matching prototype
const FLIP_DURATION = 800
const FLIP_EASING = Easing.bezier(0.215, 0.61, 0.355, 1)
const LAYOUT_DURATION = 700
const LAYOUT_EASING = Easing.bezier(0.77, 0, 0.175, 1)

interface BlueprintProps {
  data: ScanOutput
}

// Energy color mapping
const ENERGY_COLORS = {
  life_path: {
    color: sigilColors.life_path,
    glow: 'rgba(99, 102, 241, 0.4)',
    hoverBorder: 'rgba(99, 102, 241, 0.5)',
    expandedBg: 'rgba(99, 102, 241, 0.15)',
  },
  soul_urge: {
    color: sigilColors.soul_urge,
    glow: 'rgba(245, 158, 11, 0.4)',
    hoverBorder: 'rgba(245, 158, 11, 0.5)',
    expandedBg: 'rgba(245, 158, 11, 0.15)',
  },
  expression: {
    color: sigilColors.expression,
    glow: 'rgba(16, 185, 129, 0.4)',
    hoverBorder: 'rgba(16, 185, 129, 0.5)',
    expandedBg: 'rgba(16, 185, 129, 0.15)',
  },
  personality: {
    color: sigilColors.personality,
    glow: 'rgba(244, 114, 182, 0.4)',
    hoverBorder: 'rgba(244, 114, 182, 0.5)',
    expandedBg: 'rgba(244, 114, 182, 0.15)',
  },
}

// Detailed info
const DETAILED_INFO = {
  life_path: {
    subtitle: 'Life Path Number',
    details:
      "Your fundamental nature and life purpose. This is the essence of who you are and what you're meant to become. It influences every major decision and relationship in your life.",
    resonance:
      "In love, this number determines your core compatibility with others. It's the bedrock of lasting connections.",
  },
  soul_urge: {
    subtitle: 'Soul Urge Number',
    details:
      'Your innermost yearnings and motivations. This reveals what drives you at the deepest level and what you need to feel fulfilled in love and life.',
    resonance:
      "Understanding your desires helps you recognize when a partner can truly satisfy your soul's needs.",
  },
  expression: {
    subtitle: 'Expression Number',
    details:
      'How you connect and relate to others. This shows your natural attachment style and the ways you build emotional bonds with those you love.',
    resonance:
      'Your bonding style determines how you express love and what makes you feel connected to another person.',
  },
  personality: {
    subtitle: 'Personality Number',
    details:
      'How others perceive you at first impression. This reveals the outer mask you wear and how you present yourself to the world.',
    resonance:
      'Understanding your outward persona helps you attract compatible partners who see the real you.',
  },
}

type TileKey = 'life_path' | 'soul_urge' | 'expression' | 'personality'

const GRID_GAP = 24
const GRID_HEIGHT = 500

// Blueprint Grid Background
function BlueprintGrid() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="grid" width={24} height={24} patternUnits="userSpaceOnUse">
            <Line x1="0" y1="0" x2="24" y2="0" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="1" />
            <Line x1="0" y1="0" x2="0" y2="24" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="1" />
          </Pattern>
          <RadialGradient id="mask" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="white" stopOpacity="1" />
            <Stop offset="40%" stopColor="white" stopOpacity="0.8" />
            <Stop offset="80%" stopColor="white" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grid)" opacity={0.3} />
      </Svg>
    </View>
  )
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface TileProps {
  tileKey: TileKey
  index: number
  title: string
  number: number
  meaning: string
  gridWidth: number
  expandedKey: TileKey | null
  onPress: (key: TileKey) => void
}

function Tile({tileKey, index, title, number, meaning, gridWidth, expandedKey, onPress}: TileProps) {
  const tileColors = ENERGY_COLORS[tileKey]
  const details = DETAILED_INFO[tileKey]

  const row = Math.floor(index / 2)
  const col = index % 2

  const tileWidth = (gridWidth - GRID_GAP) / 2
  const tileHeight = (GRID_HEIGHT - GRID_GAP) / 2
  const normalLeft = col * (tileWidth + GRID_GAP / 2) + (col === 1 ? GRID_GAP / 2 : 0)
  const normalTop = row * (tileHeight + GRID_GAP / 2) + (row === 1 ? GRID_GAP / 2 : 0)

  // Animation values
  const layoutProgress = useSharedValue(0) // 0 = normal, 1 = expanded, -1 = other expanded
  const flipProgress = useSharedValue(0) // 0 = front, 1 = back (180deg)
  const entrance = useSharedValue(0)

  // Shimmer animations for back face content
  const shimmerTitle = useSharedValue(0)
  const shimmerSubtitle = useSharedValue(0)
  const shimmerNumber = useSharedValue(0)
  const shimmerMeaning = useSharedValue(0)
  const shimmerDetails = useSharedValue(0)
  const shimmerResonance = useSharedValue(0)

  const isExpanded = expandedKey === tileKey
  const isOtherExpanded = expandedKey !== null && expandedKey !== tileKey

  // Animate on state change
  useEffect(() => {
    if (isExpanded) {
      layoutProgress.value = withTiming(1, {duration: LAYOUT_DURATION, easing: LAYOUT_EASING})
      flipProgress.value = withTiming(1, {duration: FLIP_DURATION, easing: FLIP_EASING})

      // Shimmer entrance animations for back face content
      shimmerTitle.value = 0
      shimmerSubtitle.value = 0
      shimmerNumber.value = 0
      shimmerMeaning.value = 0
      shimmerDetails.value = 0
      shimmerResonance.value = 0

      shimmerTitle.value = withDelay(FLIP_DURATION * 0.5, withTiming(1, {duration: 600, easing: FLIP_EASING}))
      shimmerSubtitle.value = withDelay(FLIP_DURATION * 0.6, withTiming(1, {duration: 600, easing: FLIP_EASING}))
      shimmerNumber.value = withDelay(FLIP_DURATION * 0.7, withTiming(1, {duration: 800, easing: FLIP_EASING}))
      shimmerMeaning.value = withDelay(FLIP_DURATION * 0.8, withTiming(1, {duration: 600, easing: FLIP_EASING}))
      shimmerDetails.value = withDelay(FLIP_DURATION * 1.0, withTiming(1, {duration: 700, easing: FLIP_EASING}))
      shimmerResonance.value = withDelay(FLIP_DURATION * 1.2, withTiming(1, {duration: 600, easing: FLIP_EASING}))
    } else if (isOtherExpanded) {
      layoutProgress.value = withTiming(-1, {duration: LAYOUT_DURATION, easing: LAYOUT_EASING})
      flipProgress.value = withTiming(0, {duration: FLIP_DURATION, easing: FLIP_EASING})
    } else {
      layoutProgress.value = withTiming(0, {duration: LAYOUT_DURATION, easing: LAYOUT_EASING})
      flipProgress.value = withTiming(0, {duration: FLIP_DURATION, easing: FLIP_EASING})
    }
  }, [isExpanded, isOtherExpanded])

  // Entrance animation
  useEffect(() => {
    entrance.value = withDelay(index * 100, withTiming(1, {duration: 600, easing: LAYOUT_EASING}))
  }, [])

  // Container style (position and size)
  const containerStyle = useAnimatedStyle(() => {
    const p = layoutProgress.value

    if (p >= 0) {
      return {
        position: 'absolute' as const,
        left: interpolate(p, [0, 1], [normalLeft, 0]),
        top: interpolate(p, [0, 1], [normalTop, 0]),
        width: interpolate(p, [0, 1], [tileWidth, gridWidth]),
        height: interpolate(p, [0, 1], [tileHeight, GRID_HEIGHT]),
        opacity: entrance.value,
        transform: [
          {translateY: interpolate(entrance.value, [0, 1], [20, 0])},
          {scale: interpolate(entrance.value, [0, 1], [0.95, 1])},
        ],
        zIndex: p > 0.1 ? 20 : 1,
      }
    }

    return {
      position: 'absolute' as const,
      left: normalLeft,
      top: normalTop,
      width: tileWidth,
      height: tileHeight,
      opacity: interpolate(p, [0, -1], [1, 0]),
      transform: [{scale: interpolate(p, [0, -1], [1, 0.8])}],
      zIndex: 1,
    }
  })

  // Front face style - rotates from 0 to 90 then hides
  const frontFaceStyle = useAnimatedStyle(() => {
    const rotation = interpolate(flipProgress.value, [0, 0.5, 1], [0, 90, 90])
    const opacity = interpolate(flipProgress.value, [0, 0.5], [1, 0], 'clamp')
    return {
      transform: [{perspective: 1000}, {rotateY: `${rotation}deg`}],
      opacity,
    }
  })

  // Back face style - starts at -90, rotates to 0
  const backFaceStyle = useAnimatedStyle(() => {
    const rotation = interpolate(flipProgress.value, [0, 0.5, 1], [-90, -90, 0])
    const opacity = interpolate(flipProgress.value, [0.5, 1], [0, 1], 'clamp')
    return {
      transform: [{perspective: 1000}, {rotateY: `${rotation}deg`}],
      opacity,
    }
  })

  // Shimmer styles for back face content
  const shimmerTitleStyle = useAnimatedStyle(() => ({
    opacity: shimmerTitle.value,
    transform: [{translateY: interpolate(shimmerTitle.value, [0, 1], [10, 0])}],
  }))

  const shimmerSubtitleStyle = useAnimatedStyle(() => ({
    opacity: shimmerSubtitle.value,
    transform: [{translateY: interpolate(shimmerSubtitle.value, [0, 1], [10, 0])}],
  }))

  const shimmerNumberStyle = useAnimatedStyle(() => ({
    opacity: shimmerNumber.value,
    transform: [{scale: interpolate(shimmerNumber.value, [0, 1], [0.8, 1])}],
  }))

  const shimmerMeaningStyle = useAnimatedStyle(() => ({
    opacity: shimmerMeaning.value,
    transform: [{translateY: interpolate(shimmerMeaning.value, [0, 1], [10, 0])}],
  }))

  const shimmerDetailsStyle = useAnimatedStyle(() => ({
    opacity: shimmerDetails.value,
    transform: [{translateY: interpolate(shimmerDetails.value, [0, 1], [10, 0])}],
  }))

  const shimmerResonanceStyle = useAnimatedStyle(() => ({
    opacity: shimmerResonance.value,
    transform: [{translateY: interpolate(shimmerResonance.value, [0, 1], [10, 0])}],
  }))

  // Close button style
  const closeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flipProgress.value, [0.7, 1], [0, 1]),
    transform: [{scale: interpolate(flipProgress.value, [0.7, 1], [0.5, 1])}],
  }))

  return (
    <Animated.View style={containerStyle}>
      <Pressable onPress={() => onPress(tileKey)} style={{flex: 1}}>
        <View style={styles.cardContainer}>
          {/* Front Face */}
          <Animated.View style={[styles.face, styles.frontFace, frontFaceStyle]}>
            <View style={styles.frontContent}>
              {/* Title */}
              <Text style={styles.frontLabel} numberOfLines={1}>{title}</Text>

              {/* Number */}
              <Text
                style={[
                  styles.frontNumber,
                  {color: tileColors.color, textShadowColor: tileColors.glow},
                ]}>
                {number}
              </Text>

              {/* Meaning */}
              <Text style={styles.frontMeaning} numberOfLines={2}>{meaning}</Text>

              {/* Click hint */}
              <Text style={styles.clickHint}>Tap to reveal</Text>
            </View>
          </Animated.View>

          {/* Back Face */}
          <Animated.View
            style={[
              styles.face,
              styles.backFace,
              {
                backgroundColor: tileColors.expandedBg,
                borderColor: tileColors.hoverBorder,
                shadowColor: tileColors.color,
              },
              backFaceStyle,
            ]}>
            {/* Close button */}
            <Animated.View style={[styles.closeButton, closeStyle]}>
              <Pressable
                onPress={e => {
                  e.stopPropagation?.()
                  onPress(tileKey)
                }}
                hitSlop={15}
                style={styles.closeButtonInner}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </Animated.View>

            <View style={styles.backContent}>
              {/* Title */}
              <Animated.Text
                style={[styles.backLabel, {color: tileColors.color}, shimmerTitleStyle]}
                numberOfLines={1}>
                {title}
              </Animated.Text>

              {/* Subtitle */}
              <Animated.Text style={[styles.backSubtitle, shimmerSubtitleStyle]}>
                {details.subtitle}
              </Animated.Text>

              {/* Number */}
              <Animated.Text
                style={[
                  styles.backNumber,
                  {
                    color: tileColors.color,
                    textShadowColor: tileColors.glow,
                  },
                  shimmerNumberStyle,
                ]}>
                {number}
              </Animated.Text>

              {/* Meaning */}
              <Animated.Text style={[styles.backMeaning, shimmerMeaningStyle]}>
                {meaning}
              </Animated.Text>

              {/* Details section */}
              <Animated.View style={[styles.detailsSection, shimmerDetailsStyle]}>
                <View style={[styles.detailsBorder, {borderColor: tileColors.hoverBorder}]}>
                  <Text style={styles.detailsText}>{details.details}</Text>
                </View>
              </Animated.View>

              {/* Resonance */}
              <Animated.Text
                style={[styles.resonanceText, {color: tileColors.color}, shimmerResonanceStyle]}>
                {details.resonance}
              </Animated.Text>
            </View>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  )
}

export function Blueprint({data}: BlueprintProps) {
  const {width: screenWidth} = useWindowDimensions()
  const gridWidth = Math.min(screenWidth - 48, 600)

  const [expandedKey, setExpandedKey] = React.useState<TileKey | null>(null)

  const handlePress = useCallback((key: TileKey) => {
    setExpandedKey(prev => (prev === key ? null : key))
  }, [])

  // Generate meanings from number values
  const getMeaning = (num: number, type: string): string => {
    const meanings: Record<string, Record<number, string>> = {
      life_path: {
        1: 'The Independent Leader',
        2: 'The Sensitive Mediator',
        3: 'The Creative Expresser',
        4: 'The Stable Builder',
        5: 'The Free Spirit',
        6: 'The Nurturing Lover',
        7: 'The Deep Seeker',
        8: 'The Powerful Achiever',
        9: 'The Universal Healer',
        11: 'The Illuminated Visionary',
        22: 'The Master Builder',
        33: 'The Master Teacher',
      },
      soul_urge: {
        1: 'You crave independence',
        2: 'You crave harmony',
        3: 'You crave self-expression',
        4: 'You crave security',
        5: 'You crave freedom',
        6: 'You crave love',
        7: 'You crave knowledge',
        8: 'You crave power',
        9: 'You crave service',
      },
      expression: {
        1: 'You attach through admiration',
        2: 'You attach through safety',
        3: 'You attach through creativity',
        4: 'You attach through reliability',
        5: 'You attach through excitement',
        6: 'You attach through devotion',
        7: 'You attach through intellect',
        8: 'You attach through ambition',
        9: 'You attach through depth',
      },
      personality: {
        1: 'Others see you as a leader',
        2: 'Others see you as diplomatic',
        3: 'Others see you as creative',
        4: 'Others see you as reliable',
        5: 'Others see you as dynamic',
        6: 'Others see you as nurturing',
        7: 'Others see you as mysterious',
        8: 'Others see you as powerful',
        9: 'Others see you as compassionate',
      },
    }
    return meanings[type]?.[num] || meanings[type]?.[num % 10] || 'Unique expression'
  }

  const numerology = data.numerology
  const tiles: {key: TileKey; title: string; number: number; meaning: string}[] = [
    {key: 'life_path', title: 'LIFE PATH', number: numerology.life_path, meaning: getMeaning(numerology.life_path, 'life_path')},
    {key: 'soul_urge', title: 'SOUL URGE', number: numerology.soul_urge, meaning: getMeaning(numerology.soul_urge, 'soul_urge')},
    {key: 'expression', title: 'EXPRESSION', number: numerology.expression, meaning: getMeaning(numerology.expression, 'expression')},
    {key: 'personality', title: 'PERSONALITY', number: numerology.personality, meaning: getMeaning(numerology.personality, 'personality')},
  ]

  return (
    <View style={styles.container}>
      {/* Grid background */}
      <View style={[styles.gridBg, {width: gridWidth, height: GRID_HEIGHT + 80}]}>
        <BlueprintGrid />
      </View>

      {/* Grid */}
      <View style={[styles.grid, {width: gridWidth, height: GRID_HEIGHT}]}>
        {tiles.map((tile, index) => (
          <Tile
            key={tile.key}
            tileKey={tile.key}
            index={index}
            title={tile.title}
            number={tile.number}
            meaning={tile.meaning}
            gridWidth={gridWidth}
            expandedKey={expandedKey}
            onPress={handlePress}
          />
        ))}
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  gridBg: {
    position: 'absolute',
    top: -20,
    opacity: 0.5,
  },
  grid: {
    position: 'relative',
    marginBottom: 40,
  },
  cardContainer: {
    flex: 1,
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  frontFace: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  frontContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  frontLabel: {
    fontFamily: fonts.mono,
    fontSize: 14,
    letterSpacing: 3,
    color: colors.textDim,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 12,
  },
  frontNumber: {
    fontSize: 48,
    fontFamily: fonts.serifLight,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 30,
    marginBottom: 8,
  },
  frontMeaning: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: fonts.serif,
  },
  clickHint: {
    position: 'absolute',
    bottom: 16,
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.textDim,
    textAlign: 'center',
    opacity: 0.5,
  },
  backFace: {
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 20,
  },
  backContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  backLabel: {
    fontFamily: fonts.mono,
    fontSize: 14,
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 8,
  },
  backSubtitle: {
    fontFamily: fonts.mono,
    fontSize: 14,
    letterSpacing: 2,
    color: colors.textDim,
    textAlign: 'center',
    marginBottom: 24,
  },
  backNumber: {
    fontSize: 82,
    fontFamily: fonts.serifLight,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 50,
    marginBottom: 24,
    lineHeight: 80,
  },
  backMeaning: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: fonts.serif,
    maxWidth: '80%',
    marginBottom: 24,
  },
  detailsSection: {
    width: '85%',
    marginTop: 24,
  },
  detailsBorder: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 20,
    marginBottom: 20,
  },
  detailsText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 26,
    fontStyle: 'italic',
    fontFamily: fonts.serif,
    textAlign: 'center',
  },
  resonanceText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.serif,
    textAlign: 'center',
    maxWidth: '85%',
  },
  closeButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 30,
  },
  closeButtonInner: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  closeText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
  },
})
