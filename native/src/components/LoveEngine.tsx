import React, {useEffect} from 'react'
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
  Paint,
} from '@shopify/react-native-skia'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
  useDerivedValue,
  interpolate,
} from 'react-native-reanimated'
import {ShaderCanvas} from './ShaderCanvas'
import {colors, sigilColors} from '../lib/colors'
import {fonts} from '../lib/fonts'

interface LoveEngineProps {
  isCalculating: boolean
  isIntense: boolean
  resultNumber: number | null
  showResult: boolean
  activeNumber: number | null
  currentPhase: number | null
  showSigils: {
    core: boolean
    desire: boolean
    bond: boolean
    friction: boolean
  }
}

const TRACK_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const ANGLE_STEP = 360 / TRACK_NUMBERS.length

// Engine dimensions - matching prototype
const ENGINE_SIZE = 320
const TRACK_SIZE = ENGINE_SIZE * 0.9 // 90% of container like prototype
const NUMBER_RADIUS_PERCENT = 45 // percentage of track container

// Create triangle path for desire sigil
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
  isIntense,
  resultNumber,
  showResult,
  activeNumber,
  currentPhase,
  showSigils,
}: LoveEngineProps) {
  // Animation values
  const rotation = useSharedValue(0)
  const coreScale = useSharedValue(1)
  const coreOpacity = useSharedValue(0.8)
  const resultScale = useSharedValue(0.5)
  const resultOpacity = useSharedValue(0)

  // Sigil animation values
  const sigilCoreOpacity = useSharedValue(0)
  const sigilDesireOpacity = useSharedValue(0)
  const sigilBondOpacity = useSharedValue(0)
  const sigilFrictionOpacity = useSharedValue(0)

  // Map phase to shader ID
  const getShaderForPhase = (): number => {
    if (currentPhase !== null && isCalculating) {
      return currentPhase + 1
    }
    return 2 // Default to Ether
  }

  // Track rotation animation
  useEffect(() => {
    cancelAnimation(rotation)
    const duration = isIntense ? 2000 : isCalculating ? 6000 : 30000

    rotation.value = withRepeat(
      withTiming(360, {duration, easing: Easing.linear}),
      -1,
      false,
    )
  }, [isCalculating, isIntense, rotation])

  // Core pulse animation
  useEffect(() => {
    cancelAnimation(coreScale)
    cancelAnimation(coreOpacity)

    const scaleTo = isCalculating ? 1.1 : 1.05
    const duration = isCalculating ? 1000 : 2000

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

  // Sigil animations
  useEffect(() => {
    sigilCoreOpacity.value = withTiming(showSigils.core ? 1 : 0, {
      duration: 800,
      easing: Easing.inOut(Easing.cubic),
    })
  }, [showSigils.core, sigilCoreOpacity])

  useEffect(() => {
    sigilDesireOpacity.value = withTiming(showSigils.desire ? 1 : 0, {
      duration: 800,
      easing: Easing.inOut(Easing.cubic),
    })
  }, [showSigils.desire, sigilDesireOpacity])

  useEffect(() => {
    sigilBondOpacity.value = withTiming(showSigils.bond ? 1 : 0, {
      duration: 800,
      easing: Easing.inOut(Easing.cubic),
    })
  }, [showSigils.bond, sigilBondOpacity])

  useEffect(() => {
    sigilFrictionOpacity.value = withTiming(showSigils.friction ? 1 : 0, {
      duration: 800,
      easing: Easing.inOut(Easing.cubic),
    })
  }, [showSigils.friction, sigilFrictionOpacity])

  // Result number animation
  useEffect(() => {
    if (showResult) {
      resultScale.value = withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
      })
      resultOpacity.value = withTiming(1, {duration: 400})
    } else {
      resultScale.value = withTiming(0.5, {duration: 300})
      resultOpacity.value = withTiming(0, {duration: 300})
    }
  }, [showResult, resultScale, resultOpacity])

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
    const isActive = activeNumber === index

    const counterStyle = useAnimatedStyle(() => ({
      transform: [{rotate: `${-rotation.value}deg`}],
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
        <Text style={[styles.number, isActive && styles.numberActive]}>
          {num}
        </Text>
      </Animated.View>
    )
  }

  // Skia sigil opacity values
  const coreOp = useDerivedValue(() => sigilCoreOpacity.value)
  const desireOp = useDerivedValue(() => sigilDesireOpacity.value)
  const bondOp = useDerivedValue(() => sigilBondOpacity.value)
  const frictionOp = useDerivedValue(() => sigilFrictionOpacity.value)

  // Skia paths
  const trianglePath = createTrianglePath(60)
  const bondDiamondPath = createDiamondPath(55, 0.8) // scale-80 like prototype
  const frictionDiamondPath = createDiamondPath(45)

  return (
    <View style={styles.container}>
      {/* WebGL Shader Canvas - the main visual */}
      <View style={styles.shaderWrapper}>
        <ShaderCanvas
          size={ENGINE_SIZE}
          shaderId={getShaderForPhase()}
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

        {/* Core Sigil - Circle with glow */}
        <Group opacity={coreOp}>
          {/* Outer glow */}
          <Circle
            cx={ENGINE_SIZE / 2}
            cy={ENGINE_SIZE / 2}
            r={42}
            color={sigilColors.core}
            style="stroke"
            strokeWidth={3}>
            <BlurMask blur={20} style="solid" />
          </Circle>
          {/* Main circle */}
          <Circle
            cx={ENGINE_SIZE / 2}
            cy={ENGINE_SIZE / 2}
            r={40}
            color={sigilColors.core}
            style="stroke"
            strokeWidth={2}
          />
        </Group>

        {/* Desire Sigil - Triangle with glow */}
        <Group opacity={desireOp}>
          {/* Outer glow */}
          <Path
            path={trianglePath}
            color={sigilColors.desire}
            style="stroke"
            strokeWidth={3}>
            <BlurMask blur={15} style="solid" />
          </Path>
          {/* Main triangle */}
          <Path
            path={trianglePath}
            color={sigilColors.desire}
            style="stroke"
            strokeWidth={2}
          />
        </Group>

        {/* Bond Sigil - Diamond with glow */}
        <Group opacity={bondOp}>
          {/* Outer glow */}
          <Path
            path={bondDiamondPath}
            color={sigilColors.bond}
            style="stroke"
            strokeWidth={3}>
            <BlurMask blur={20} style="solid" />
          </Path>
          {/* Main diamond */}
          <Path
            path={bondDiamondPath}
            color={sigilColors.bond}
            style="stroke"
            strokeWidth={2}
          />
        </Group>

        {/* Friction Sigil - Smaller Diamond with glow */}
        <Group opacity={frictionOp}>
          {/* Outer glow */}
          <Path
            path={frictionDiamondPath}
            color={sigilColors.friction}
            style="stroke"
            strokeWidth={3}>
            <BlurMask blur={20} style="solid" />
          </Path>
          {/* Main diamond */}
          <Path
            path={frictionDiamondPath}
            color={sigilColors.friction}
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
    fontSize: 20,
    fontWeight: '300',
    color: colors.textDim,
  },
  numberActive: {
    fontSize: 24,
    fontWeight: '400',
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
    fontSize: 60,
    fontWeight: '300',
    color: colors.textPrimary,
    textShadowColor: 'rgba(139, 92, 246, 0.6)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 40,
    fontFamily: fonts.serif,
  },
})
