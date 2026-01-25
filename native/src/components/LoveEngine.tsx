import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {
  Canvas,
  Circle,
  Group,
  Path,
  Skia,
  BlurMask,
  RadialGradient,
  vec,
} from '@shopify/react-native-skia'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  useDerivedValue,
  SharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'
import {ShaderCanvas} from './ShaderCanvas'
import {colors, sigilColors} from '../lib/colors'
import {fonts} from '../lib/fonts'

interface LoveEngineProps {
  isCalculating: boolean
  resultNumber: number | null
  // Shared values from EngineContext
  currentPhase: SharedValue<number>
  intensity: SharedValue<number>
  extractionProgress: SharedValue<number>
  resultOpacity: SharedValue<number>
  resultScale: SharedValue<number>
}

const TRACK_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const ANGLE_STEP = 360 / TRACK_NUMBERS.length

// Engine dimensions - matching prototype
const ENGINE_SIZE = 320
const TRACK_SIZE = ENGINE_SIZE * 0.9 // 90% of container like prototype
const NUMBER_RADIUS_PERCENT = 45 // percentage of track container

// Create triangle path for soul_urge sigil
const createTrianglePath = (size: number) => {
  const path = Skia.Path.Make()
  const height = size
  const width = size * 0.8
  const cx = ENGINE_SIZE / 2
  const cy = ENGINE_SIZE / 2

  path.moveTo(cx, cy - height / 2) // Top point
  path.lineTo(cx - width / 2, cy + height / 2) // Bottom left
  path.lineTo(cx + width / 2, cy + height / 2) // Bottom right
  path.close()
  return path
}

// Create diamond path for sigils
const createDiamondPath = (size: number, scale: number = 1) => {
  const path = Skia.Path.Make()
  const cx = ENGINE_SIZE / 2
  const cy = ENGINE_SIZE / 2
  const half = (size * scale) / 2

  path.moveTo(cx, cy - half) // Top
  path.lineTo(cx + half, cy) // Right
  path.lineTo(cx, cy + half) // Bottom
  path.lineTo(cx - half, cy) // Left
  path.close()
  return path
}

export function LoveEngine({
  isCalculating,
  resultNumber,
  currentPhase,
  intensity,
  extractionProgress,
  resultOpacity,
  resultScale,
}: LoveEngineProps) {
  // Internal animation values for continuous effects
  const idleRotation = useSharedValue(0)
  const coreScale = useSharedValue(1)
  const coreOpacity = useSharedValue(0.8)

  // Derive rotation speed from extraction state
  // Idle: 30s, Calculating: 6s, Intense: 2s
  const rotationDuration = useDerivedValue(() => {
    if (intensity.value > 0.5) return 2000
    if (extractionProgress.value > 0) return 6000
    return 30000
  })

  // Start idle rotation on mount
  React.useEffect(() => {
    idleRotation.value = withRepeat(
      withTiming(360, {duration: 30000, easing: Easing.linear}),
      -1,
      false,
    )
  }, [idleRotation])

  // Derive actual rotation from progress and idle rotation
  const rotation = useDerivedValue(() => {
    // When extracting, add extra rotation based on progress
    const extraRotation = extractionProgress.value * 360 * 2
    // During intense phase, even faster
    const intenseRotation = intensity.value * 360
    return (idleRotation.value + extraRotation + intenseRotation) % 360
  })

  // Core pulse - faster when calculating
  React.useEffect(() => {
    const duration = isCalculating ? 1000 : 2000
    const scaleTo = isCalculating ? 1.1 : 1.05

    coreScale.value = withRepeat(
      withSequence(
        withTiming(scaleTo, {
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    )

    coreOpacity.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.8, {
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    )
  }, [isCalculating, coreScale, coreOpacity])

  // Derive active number from current phase
  const activeNumber = useDerivedValue(() => {
    return currentPhase.value >= 0 ? Math.floor(currentPhase.value) : null
  })

  // Sigil opacities derived from current phase
  const sigilLifePathOpacity = useDerivedValue(() => {
    // Show during phase 0
    if (currentPhase.value < 0) return 0
    return interpolate(
      currentPhase.value,
      [-0.5, 0, 0.5, 1],
      [0, 1, 1, 0],
      Extrapolation.CLAMP,
    )
  })

  const sigilSoulUrgeOpacity = useDerivedValue(() => {
    // Show during phase 1
    if (currentPhase.value < 0.5) return 0
    return interpolate(
      currentPhase.value,
      [0.5, 1, 1.5, 2],
      [0, 1, 1, 0],
      Extrapolation.CLAMP,
    )
  })

  const sigilExpressionOpacity = useDerivedValue(() => {
    // Show during phase 2
    if (currentPhase.value < 1.5) return 0
    return interpolate(
      currentPhase.value,
      [1.5, 2, 2.5, 3],
      [0, 1, 1, 0],
      Extrapolation.CLAMP,
    )
  })

  const sigilPersonalityOpacity = useDerivedValue(() => {
    // Show during phase 3
    if (currentPhase.value < 2.5) return 0
    return interpolate(
      currentPhase.value,
      [2.5, 3, 3.5, 4],
      [0, 1, 1, 0],
      Extrapolation.CLAMP,
    )
  })

  // Shader ID derived from current phase
  const shaderId = useDerivedValue(() => {
    if (currentPhase.value < 0) return 2 // Default ether
    return Math.floor(currentPhase.value) + 1
  })

  // Animated styles
  const trackStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }))

  const coreStyle = useAnimatedStyle(() => ({
    transform: [{scale: coreScale.value}],
    opacity: coreOpacity.value,
  }))

  const resultStyle = useAnimatedStyle(() => ({
    transform: [{scale: resultScale.value}],
    opacity: resultOpacity.value,
  }))

  // Calculate position for each number using percentage like prototype
  const getNumberPosition = (index: number) => {
    const angle = index * ANGLE_STEP - 90 // -90 to start at top
    const radian = (angle * Math.PI) / 180
    // Calculate percentage position within track container (like prototype)
    const xPercent = 50 + NUMBER_RADIUS_PERCENT * Math.cos(radian)
    const yPercent = 50 + NUMBER_RADIUS_PERCENT * Math.sin(radian)
    return {
      x: (xPercent / 100) * TRACK_SIZE,
      y: (yPercent / 100) * TRACK_SIZE,
    }
  }

  // Counter-rotation for numbers to keep them upright
  const NumberItem = ({num, index}: {num: number; index: number}) => {
    const pos = getNumberPosition(index)

    const counterStyle = useAnimatedStyle(() => ({
      transform: [{rotate: `${-rotation.value}deg`}],
    }))

    // Use opacity to switch between inactive and active text
    const inactiveOpacity = useDerivedValue(() =>
      activeNumber.value === index ? 0 : 1
    )
    const activeOpacityValue = useDerivedValue(() =>
      activeNumber.value === index ? 1 : 0
    )

    const inactiveStyle = useAnimatedStyle(() => ({
      opacity: inactiveOpacity.value,
    }))

    const activeStyle = useAnimatedStyle(() => ({
      opacity: activeOpacityValue.value,
    }))

    return (
      <Animated.View
        style={[
          styles.numberContainer,
          {
            left: pos.x,
            top: pos.y,
          },
          counterStyle,
        ]}>
        {/* Inactive number */}
        <Animated.Text style={[styles.number, styles.numberInactive, inactiveStyle]}>
          {num}
        </Animated.Text>
        {/* Active number with glow (positioned absolutely on top) */}
        <Animated.Text style={[styles.number, styles.numberActive, activeStyle]}>
          {num}
        </Animated.Text>
      </Animated.View>
    )
  }

  // Skia paths
  const trianglePath = createTrianglePath(60)
  const expressionDiamondPath = createDiamondPath(55, 0.8) // scale-80 like prototype
  const personalityDiamondPath = createDiamondPath(45)

  return (
    <View style={styles.container}>
      {/* WebGL Shader Canvas - the main visual */}
      <View style={styles.shaderWrapper}>
        <ShaderCanvas
          size={ENGINE_SIZE}
          shaderId={shaderId}
          isCalculating={isCalculating}
        />
      </View>

      {/* Number Track - Rotating Container */}
      <Animated.View style={[styles.numbersTrack, trackStyle]}>
        {TRACK_NUMBERS.map((num, idx) => (
          <NumberItem key={num} num={num} index={idx} />
        ))}
      </Animated.View>

      {/* Skia Canvas for Sigils with Glow Effects */}
      <Canvas style={styles.sigilCanvas}>
        {/* Inner Core with complex radial gradient - matching prototype */}
        <Circle cx={ENGINE_SIZE / 2} cy={ENGINE_SIZE / 2} r={ENGINE_SIZE * 0.2}>
          <RadialGradient
            c={vec(ENGINE_SIZE * 0.35, ENGINE_SIZE * 0.35)}
            r={ENGINE_SIZE * 0.25}
            colors={[
              'rgba(255, 255, 255, 0.1)',
              'rgba(139, 92, 246, 0.3)',
              'rgba(79, 70, 229, 0.4)',
              'transparent',
            ]}
            positions={[0, 0.3, 0.7, 1]}
          />
        </Circle>

        {/* Life Path Sigil - Circle with glow */}
        <Group opacity={sigilLifePathOpacity}>
          {/* Outer glow */}
          <Circle
            cx={ENGINE_SIZE / 2}
            cy={ENGINE_SIZE / 2}
            r={42}
            color={sigilColors.life_path}
            style="stroke"
            strokeWidth={3}>
            <BlurMask blur={20} style="solid" />
          </Circle>
          {/* Main circle */}
          <Circle
            cx={ENGINE_SIZE / 2}
            cy={ENGINE_SIZE / 2}
            r={40}
            color={sigilColors.life_path}
            style="stroke"
            strokeWidth={2}
          />
        </Group>

        {/* Soul Urge Sigil - Triangle with glow */}
        <Group opacity={sigilSoulUrgeOpacity}>
          {/* Outer glow */}
          <Path
            path={trianglePath}
            color={sigilColors.soul_urge}
            style="stroke"
            strokeWidth={3}>
            <BlurMask blur={15} style="solid" />
          </Path>
          {/* Main triangle */}
          <Path
            path={trianglePath}
            color={sigilColors.soul_urge}
            style="stroke"
            strokeWidth={2}
          />
        </Group>

        {/* Expression Sigil - Diamond with glow */}
        <Group opacity={sigilExpressionOpacity}>
          {/* Outer glow */}
          <Path
            path={expressionDiamondPath}
            color={sigilColors.expression}
            style="stroke"
            strokeWidth={3}>
            <BlurMask blur={20} style="solid" />
          </Path>
          {/* Main diamond */}
          <Path
            path={expressionDiamondPath}
            color={sigilColors.expression}
            style="stroke"
            strokeWidth={2}
          />
        </Group>

        {/* Personality Sigil - Smaller Diamond with glow */}
        <Group opacity={sigilPersonalityOpacity}>
          {/* Outer glow */}
          <Path
            path={personalityDiamondPath}
            color={sigilColors.personality}
            style="stroke"
            strokeWidth={3}>
            <BlurMask blur={20} style="solid" />
          </Path>
          {/* Main diamond */}
          <Path
            path={personalityDiamondPath}
            color={sigilColors.personality}
            style="stroke"
            strokeWidth={2}
          />
        </Group>
      </Canvas>

      {/* Inner pulsing core glow (animated) */}
      <Animated.View style={[styles.innerCore, coreStyle]} />

      {/* Result Number */}
      <Animated.View style={[styles.resultContainer, resultStyle]}>
        <Text style={styles.resultNumber}>{resultNumber}</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: ENGINE_SIZE,
    height: ENGINE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shaderWrapper: {
    position: 'absolute',
    width: ENGINE_SIZE,
    height: ENGINE_SIZE,
    borderRadius: ENGINE_SIZE / 2,
    overflow: 'hidden',
  },
  numbersTrack: {
    position: 'absolute',
    width: TRACK_SIZE,
    height: TRACK_SIZE,
    zIndex: 10,
  },
  numberContainer: {
    position: 'absolute',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -15, // Center horizontally (translate -50%)
    marginTop: -15, // Center vertically (translate -50%)
  },
  number: {
    fontFamily: fonts.mono,
    position: 'absolute',
  },
  numberInactive: {
    fontSize: 24,
    color: colors.textDim,
  },
  numberActive: {
    fontSize: 28,
    color: colors.textPrimary,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 20,
  },
  sigilCanvas: {
    position: 'absolute',
    width: ENGINE_SIZE,
    height: ENGINE_SIZE,
    zIndex: 15,
  },
  innerCore: {
    position: 'absolute',
    width: ENGINE_SIZE * 0.4,
    height: ENGINE_SIZE * 0.4,
    borderRadius: ENGINE_SIZE * 0.2,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8B5CF6',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 40,
  },
  resultContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  resultNumber: {
    fontSize: 62,
    color: colors.textPrimary,
    textShadowColor: 'rgba(139, 92, 246, 0.6)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 40,
    fontFamily: fonts.serifLight,
  },
})
