import React, {useEffect, useMemo} from 'react'
import {StyleSheet, View, Dimensions} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated'

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window')
const PARTICLE_COUNT = 25

interface ParticleData {
  id: number
  x: number
  duration: number
  delay: number
  size: number
}

// Pre-generate particle data
const generateParticleData = (): ParticleData[] => {
  return Array.from({length: PARTICLE_COUNT}, (_, i) => ({
    id: i,
    x: Math.random() * SCREEN_WIDTH,
    duration: 12000 + Math.random() * 12000, // 12-24s
    delay: Math.random() * 15000, // 0-15s delay
    size: 2 + Math.random() * 2, // 2-4px
  }))
}

interface ParticleProps {
  data: ParticleData
}

function Particle({data}: ParticleProps) {
  const translateY = useSharedValue(SCREEN_HEIGHT + 50)
  const opacity = useSharedValue(0)

  useEffect(() => {
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
  }, [translateY, opacity, data.delay, data.duration])

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
          left: data.x,
          width: data.size,
          height: data.size,
          // Glow effect using shadow
          shadowRadius: data.size * 2,
        },
      ]}
    />
  )
}

export function Particles() {
  const particleData = useMemo(() => generateParticleData(), [])

  return (
    <View style={styles.container} pointerEvents="none">
      {particleData.map((data) => (
        <Particle key={data.id} data={data} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    // Star glow effect
    shadowColor: 'rgba(200, 180, 255, 1)',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
  },
})
