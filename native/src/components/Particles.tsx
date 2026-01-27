import React, {useEffect, useMemo} from 'react'
import {StyleSheet, View, useWindowDimensions} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated'

const PARTICLE_COUNT = 30

interface ParticleData {
  id: number
  xPercent: number // Use percentage instead of absolute position
  duration: number
  delay: number
  size: number
}

// Pre-generate particle data with percentages
const generateParticleData = (): ParticleData[] => {
  return Array.from({length: PARTICLE_COUNT}, (_, i) => ({
    id: i,
    xPercent: Math.random(), // 0-1 percentage of screen width
    duration: 10000 + Math.random() * 10000, // 10-20s (matching prototype)
    delay: Math.random() * 15000, // 0-15s delay
    size: 2, // Fixed 2px (matching prototype)
  }))
}

interface ParticleProps {
  data: ParticleData
  screenHeight: number
  screenWidth: number
}

function Particle({data, screenHeight, screenWidth}: ParticleProps) {
  const translateY = useSharedValue(screenHeight + 50)
  const opacity = useSharedValue(0)

  useEffect(() => {
    // Reset animation when screen dimensions change
    translateY.value = screenHeight + 50

    // Animate from bottom to top
    translateY.value = withDelay(
      data.delay,
      withRepeat(
        withTiming(-50, {
          duration: data.duration,
          easing: Easing.linear,
        }),
        -1,
        false,
      ),
    )

    // Fade in/out animation
    opacity.value = withDelay(
      data.delay,
      withRepeat(
        withTiming(0.7, {
          duration: data.duration * 0.1,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        false,
      ),
    )
  }, [translateY, opacity, data.delay, data.duration, screenHeight])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        styles.particle,
        animatedStyle,
        {
          left: data.xPercent * screenWidth,
          width: data.size,
          height: data.size,
          shadowRadius: data.size * 2,
        },
      ]}
    />
  )
}

export function Particles() {
  const {width, height} = useWindowDimensions()
  const particleData = useMemo(() => generateParticleData(), [])

  return (
    <View style={styles.container} pointerEvents="none">
      {particleData.map((data) => (
        <Particle
          key={data.id}
          data={data}
          screenWidth={width}
          screenHeight={height}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 10,
    shadowColor: 'rgba(200, 180, 255, 1)',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
  },
})
