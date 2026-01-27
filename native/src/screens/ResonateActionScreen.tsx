import React, {useEffect, useState, useMemo} from 'react'
import {StyleSheet, View, Text, Dimensions, Image} from 'react-native'
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import Svg, {Path, Circle, Defs, LinearGradient, Stop, G} from 'react-native-svg'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated'
import type {RootStackParamList} from '../navigation/types'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window')

const AnimatedPath = Animated.createAnimatedComponent(Path)
const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const AnimatedG = Animated.createAnimatedComponent(G)

// Generate random background stars
const generateStars = (count: number) => {
  return Array.from({length: count}).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.4 + 0.2,
    delay: Math.random() * 2000,
  }))
}

// Constellation points (relative percentages)
const CONSTELLATION_POINTS = [
  {x: 20, y: 71},
  {x: 28, y: 65},
  {x: 35, y: 58},
  {x: 45, y: 52},
  {x: 50, y: 40},
  {x: 60, y: 35},
  {x: 70, y: 28},
  {x: 79, y: 23},
]

type ResonateNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResonateAction'>
type ResonateRouteProp = RouteProp<RootStackParamList, 'ResonateAction'>

export function ResonateActionScreen() {
  const navigation = useNavigation<ResonateNavigationProp>()
  const route = useRoute<ResonateRouteProp>()
  const {targetName = 'Sarah'} = route.params || {}

  const [phase, setPhase] = useState(0)
  const bgStars = useMemo(() => generateStars(80), [])

  const userNumber = 7
  const targetNumber = 5
  const targetPhoto = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'

  // Animation values
  const pathProgress = useSharedValue(0)
  const userAnchorGlow = useSharedValue(0)
  const targetAnchorOpacity = useSharedValue(0.4)
  const targetAnchorGlow = useSharedValue(0)
  const feedbackOpacity = useSharedValue(0)

  // Map percentage to screen coordinates
  const mapX = (p: number) => (p / 100) * SCREEN_WIDTH
  const mapY = (p: number) => (p / 100) * SCREEN_HEIGHT

  // Path string
  const pathD = `M ${mapX(20)} ${mapY(71)} Q ${mapX(30)} ${mapY(68)}, ${mapX(35)} ${mapY(58)} T ${mapX(50)} ${mapY(40)} T ${mapX(79)} ${mapY(23)}`

  const handleComplete = () => {
    navigation.goBack()
  }

  useEffect(() => {
    // Phase 1: Starfield Settles (0-400ms)
    setPhase(1)

    // Phase 2: First Star Ignites (400ms)
    const t2 = setTimeout(() => setPhase(2), 400)

    // Phase 3: Thread Begins (700ms)
    const t3 = setTimeout(() => {
      setPhase(3)
      pathProgress.value = withTiming(0.8, {duration: 1500, easing: Easing.inOut(Easing.ease)})
      userAnchorGlow.value = withTiming(1, {duration: 500})
    }, 700)

    // Phase 4: Weaving (1200ms)
    const t4 = setTimeout(() => setPhase(4), 1200)

    // Phase 5: Final Connection (2200ms)
    const t5 = setTimeout(() => {
      setPhase(5)
      pathProgress.value = withTiming(1, {duration: 500, easing: Easing.out(Easing.ease)})
      targetAnchorOpacity.value = withTiming(1, {duration: 500})
      targetAnchorGlow.value = withTiming(1, {duration: 500})
    }, 2200)

    // Phase 6: Constellation Reveal (2600ms)
    const t6 = setTimeout(() => {
      setPhase(6)
      feedbackOpacity.value = withTiming(1, {duration: 500})
    }, 2600)

    // Complete (3500ms)
    const tEnd = setTimeout(() => {
      runOnJS(handleComplete)()
    }, 3500)

    return () => {
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearTimeout(t6)
      clearTimeout(tEnd)
    }
  }, [])

  const animatedPathProps = useAnimatedProps(() => ({
    strokeDashoffset: interpolate(pathProgress.value, [0, 1], [500, 0]),
  }))

  const userAnchorStyle = useAnimatedStyle(() => ({
    shadowOpacity: userAnchorGlow.value * 0.5,
    shadowRadius: userAnchorGlow.value * 15,
  }))

  const targetAnchorStyle = useAnimatedStyle(() => ({
    opacity: targetAnchorOpacity.value,
    shadowOpacity: targetAnchorGlow.value * 0.6,
    shadowRadius: targetAnchorGlow.value * 20,
  }))

  const feedbackStyle = useAnimatedStyle(() => ({
    opacity: feedbackOpacity.value,
    transform: [{translateY: interpolate(feedbackOpacity.value, [0, 1], [10, 0])}],
  }))

  return (
    <View style={styles.container}>
      {/* Background Stars */}
      <View style={styles.starsContainer}>
        {bgStars.map(star => (
          <Star key={star.id} star={star} />
        ))}
      </View>

      {/* SVG Layer */}
      <Svg style={styles.svgLayer}>
        <Defs>
          <LinearGradient id="threadGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#F59E0B" />
            <Stop offset="100%" stopColor="#FBBF24" />
          </LinearGradient>
        </Defs>

        {/* Thread Path */}
        {phase >= 3 && (
          <AnimatedPath
            d={pathD}
            fill="none"
            stroke="url(#threadGradient)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={500}
            animatedProps={animatedPathProps}
          />
        )}

        {/* Constellation Stars */}
        {CONSTELLATION_POINTS.map((pt, i) => (
          <ConstellationStar key={i} point={pt} index={i} phase={phase} mapX={mapX} mapY={mapY} />
        ))}
      </Svg>

      {/* User Anchor (Bottom Left) */}
      <Animated.View style={[styles.userAnchor, userAnchorStyle]}>
        <Text style={styles.anchorNumber}>{userNumber}</Text>
        <View style={styles.userPhoto} />
      </Animated.View>

      {/* Target Anchor (Top Right) */}
      <Animated.View style={[styles.targetAnchor, targetAnchorStyle]}>
        <View style={styles.targetPhotoContainer}>
          <Image source={{uri: targetPhoto}} style={styles.targetPhoto} />
          {phase >= 5 && <View style={styles.targetRing} />}
        </View>
        <Text style={styles.anchorNumber}>{targetNumber}</Text>
      </Animated.View>

      {/* Feedback Text */}
      <Animated.View style={[styles.feedback, feedbackStyle]}>
        <Text style={styles.feedbackTitle}>Resonance Sent</Text>
        <Text style={styles.feedbackSubtitle}>Your constellation reaches {targetName}</Text>
      </Animated.View>
    </View>
  )
}

// Individual twinkling star
function Star({star}: {star: {id: number; x: number; y: number; size: number; opacity: number; delay: number}}) {
  const opacity = useSharedValue(star.opacity)

  useEffect(() => {
    opacity.value = withDelay(
      star.delay,
      withRepeat(
        withSequence(
          withTiming(star.opacity * 0.3, {duration: 1500}),
          withTiming(star.opacity, {duration: 1500})
        ),
        -1,
        true
      )
    )
  }, [])

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: `${star.x}%`,
          top: `${star.y}%`,
          width: star.size,
          height: star.size,
        },
        style,
      ]}
    />
  )
}

// Constellation star point
function ConstellationStar({
  point,
  index,
  phase,
  mapX,
  mapY,
}: {
  point: {x: number; y: number}
  index: number
  phase: number
  mapX: (p: number) => number
  mapY: (p: number) => number
}) {
  const scale = useSharedValue(0)
  const opacity = useSharedValue(0)
  const pulseScale = useSharedValue(1)

  const isFirst = index === 0
  const isLast = index === CONSTELLATION_POINTS.length - 1

  useEffect(() => {
    let shouldShow = false
    let delay = 0

    if (isFirst && phase >= 2) shouldShow = true
    else if (!isFirst && !isLast && phase >= 4) {
      shouldShow = true
      delay = (index - 1) * 150
    } else if (isLast && phase >= 5) shouldShow = true
    if (phase >= 6) {
      shouldShow = true
      delay = 0
    }

    if (shouldShow) {
      scale.value = withDelay(delay, withTiming(1, {duration: 300}))
      opacity.value = withDelay(delay, withTiming(1, {duration: 300}))
      pulseScale.value = withDelay(
        delay + 300,
        withRepeat(withTiming(1.2, {duration: 1000}), -1, true)
      )
    }
  }, [phase])

  const circleProps = useAnimatedProps(() => ({
    r: 3 * scale.value,
    opacity: opacity.value,
  }))

  const glowProps = useAnimatedProps(() => ({
    r: 6 * pulseScale.value,
    opacity: 0.3 * opacity.value,
  }))

  return (
    <G>
      <AnimatedCircle
        cx={mapX(point.x)}
        cy={mapY(point.y)}
        fill="#FBBF24"
        animatedProps={circleProps}
      />
      <AnimatedCircle
        cx={mapX(point.x)}
        cy={mapY(point.y)}
        fill="#FBBF24"
        animatedProps={glowProps}
      />
    </G>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  star: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  svgLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  userAnchor: {
    position: 'absolute',
    left: 40,
    top: SCREEN_HEIGHT * 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 20,
    shadowColor: '#F59E0B',
    shadowOffset: {width: 0, height: 0},
  },
  targetAnchor: {
    position: 'absolute',
    right: 60,
    top: SCREEN_HEIGHT * 0.18,
    alignItems: 'center',
    gap: 8,
    zIndex: 20,
    shadowColor: '#F59E0B',
    shadowOffset: {width: 0, height: 0},
  },
  anchorNumber: {
    fontFamily: fonts.serif,
    fontSize: 48,
    fontWeight: '600',
    color: '#F59E0B',
  },
  userPhoto: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  targetPhotoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.5)',
    padding: 2,
    position: 'relative',
  },
  targetPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    resizeMode: 'cover',
  },
  targetRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#FBBF24',
    opacity: 0.5,
  },
  feedback: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 30,
  },
  feedbackTitle: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  feedbackSubtitle: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
})
