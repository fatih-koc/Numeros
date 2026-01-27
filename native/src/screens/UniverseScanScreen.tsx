import React, {useState, useEffect} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import type {RootStackParamList} from '../navigation/types'
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import {ScreenWrapper} from '../components/ScreenWrapper'
import {ShaderCanvas} from '../components/ShaderCanvas'
import {useNumerology} from '../contexts'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

interface FeedItem {
  id: number
  type: 'reject' | 'match'
  text: string
}

const STATUS_MESSAGES = [
  'Scanning for compatible energies...',
  'Analyzing Life Path harmonics...',
  'Checking Venus-Moon connections...',
  'Filtering friction patterns...',
  'Mapping Mars-Venus dynamics...',
  'Finalizing resonance field...',
]

const NUMEROLOGY_PATTERNS: Array<{type: 'reject' | 'match'; text: string}> = [
  {type: 'reject', text: 'Life Path 4 × 8: High friction... ✗'},
  {type: 'match', text: 'Life Path 3 × 5: Creative synergy... ✓'},
  {type: 'match', text: 'Soul Urge 7 × 9: Spiritual depth... ✓'},
  {type: 'reject', text: 'Expression 2 × 5: Unstable rhythm... ✗'},
  {type: 'reject', text: 'Life Path 1 × 8: Power struggle... ✗'},
  {type: 'match', text: 'Soul Urge 2 × 4: Stable harmony... ✓'},
  {type: 'reject', text: 'Life Path 6 × 9: Different paths... ✗'},
  {type: 'match', text: 'Expression 1 × 5: Dynamic flow... ✓'},
  {type: 'reject', text: 'Life Path 5 × 4: Friction detected... ✗'},
  {type: 'match', text: 'Life Path 2 × 6: Balanced energy... ✓'},
]

const ASTROLOGY_PATTERNS: Array<{type: 'reject' | 'match'; text: string}> = [
  {type: 'match', text: 'Venus △ Moon: Emotional harmony... ✓'},
  {type: 'reject', text: 'Moon □ Mars: Emotional clash... ✗'},
  {type: 'reject', text: 'Sun ☍ Sun: Identity opposition... ✗'},
  {type: 'match', text: 'Mars △ Mars: Passionate alignment... ✓'},
  {type: 'reject', text: 'Venus □ Saturn: Love restricted... ✗'},
  {type: 'match', text: 'Mercury △ Venus: Sweet talk... ✓'},
  {type: 'reject', text: 'Mars ☍ Venus: Desire conflict... ✗'},
  {type: 'match', text: 'Sun △ Moon: Core resonance... ✓'},
  {type: 'reject', text: 'Saturn □ Venus: Cold distance... ✗'},
  {type: 'match', text: 'Jupiter △ Sun: Expansive joy... ✓'},
]

const ALL_PATTERNS = [...NUMEROLOGY_PATTERNS, ...ASTROLOGY_PATTERNS]

const SCAN_DURATION = 12500 // 12.5 seconds

type UniverseScanNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UniverseScan'>

export function UniverseScanScreen() {
  const navigation = useNavigation<UniverseScanNavigationProp>()
  const {scanOutput} = useNumerology()

  const [statusIndex, setStatusIndex] = useState(0)
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [nextFeedId, setNextFeedId] = useState(0)

  // Navigate back if no scan data
  useEffect(() => {
    if (!scanOutput) {
      navigation.goBack()
    }
  }, [scanOutput, navigation])

  // Update status text every 2 seconds
  useEffect(() => {
    if (!scanOutput) return
    const interval = setInterval(() => {
      setStatusIndex(prev => {
        const next = prev + 1
        if (next >= STATUS_MESSAGES.length) {
          return prev // Stay on last message
        }
        return next
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [scanOutput])

  // Add feed items continuously (3-4 items/second)
  useEffect(() => {
    if (!scanOutput) return
    const interval = setInterval(() => {
      const pattern = ALL_PATTERNS[Math.floor(Math.random() * ALL_PATTERNS.length)]

      const newItem: FeedItem = {
        id: nextFeedId,
        type: pattern.type,
        text: pattern.text,
      }

      setFeedItems(prev => [...prev, newItem].slice(-8)) // Keep last 8 items
      setNextFeedId(prev => prev + 1)
    }, 300) // Add item every 300ms (~3.3 items/second)

    return () => clearInterval(interval)
  }, [nextFeedId, scanOutput])

  // Complete scan after 12.5 seconds
  useEffect(() => {
    if (!scanOutput) return
    const completeTimeout = setTimeout(() => {
      navigation.navigate('ResonanceResults')
    }, SCAN_DURATION)

    return () => clearTimeout(completeTimeout)
  }, [scanOutput, navigation])

  // Show last 4 feed items
  const visibleFeedItems = feedItems.slice(-4).reverse()

  // Don't render anything if no scan data
  if (!scanOutput) {
    return null
  }

  return (
    <ScreenWrapper>
      <Animated.View
        entering={FadeIn.duration(400)}
        style={styles.container}>
        {/* Layered Shaders */}
        <View style={styles.shaderContainer}>
          {/* Layer 1: Ether shader (base) */}
          <View style={styles.shaderLayer}>
            <ShaderCanvas size={320} shaderId={2} isCalculating={true} />
          </View>

          {/* Layer 2: Radar Scan (overlay with screen blend) */}
          <View style={[styles.shaderLayer, styles.radarOverlay]}>
            <ShaderCanvas size={320} shaderId={6} isCalculating={true} />
          </View>
        </View>

        {/* Text Container */}
        <View style={styles.textContainer}>
          {/* Title */}
          <Text style={styles.title}>UNIVERSE SCAN</Text>

          {/* Status Text */}
          <Animated.Text
            key={statusIndex}
            entering={FadeIn.duration(300)}
            style={styles.statusText}>
            {STATUS_MESSAGES[statusIndex]}
          </Animated.Text>
        </View>

        {/* Scrolling Feed */}
        <View style={styles.feedContainer}>
          {visibleFeedItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.duration(300)}
              style={[
                styles.feedItem,
                item.type === 'match' && styles.feedItemMatch,
                {opacity: 1 - index * 0.2},
              ]}>
              <Text
                style={[
                  styles.feedText,
                  item.type === 'match'
                    ? styles.feedTextMatch
                    : styles.feedTextReject,
                ]}>
                {item.text}
              </Text>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    gap: 32,
  },
  shaderContainer: {
    width: 320,
    height: 320,
    position: 'relative',
  },
  shaderLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 320,
    height: 320,
  },
  radarOverlay: {
    // React Native doesn't support mix-blend-mode directly
    // We'll rely on the shader's alpha blending
    opacity: 0.8,
  },
  textContainer: {
    alignItems: 'center',
    minHeight: 80,
  },
  title: {
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 4,
    color: colors.textDim,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  statusText: {
    fontFamily: fonts.serif,
    fontSize: 21,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
    paddingHorizontal: 24,
  },
  feedContainer: {
    width: '100%',
    maxWidth: 420,
    height: 100,
    paddingHorizontal: 16,
    gap: 4,
  },
  feedItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  feedItemMatch: {
    backgroundColor: 'rgba(77, 230, 128, 0.05)',
  },
  feedText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
  feedTextMatch: {
    color: 'rgba(77, 230, 128, 1)',
  },
  feedTextReject: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
})
