import React from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated'
import {LinearGradient} from 'expo-linear-gradient'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'
import {ZODIAC_SYMBOLS, ANGLE_MEANINGS, ZODIAC_INFO} from '../lib/planetMeanings'

interface FlippableAngleCardProps {
  angleKey: 'ascendant' | 'midheaven'
  angle: {sign: string; degree_in_sign: number}
  angleName: string
  angleColor?: string
}

const ANGLE_COLOR = '#10B981'

// Arrow prefixes matching prototype
const ANGLE_ARROWS: Record<string, string> = {
  ascendant: '→',
  midheaven: '↑',
}

// Short descriptions matching prototype
const ANGLE_SHORT_DESC: Record<string, string> = {
  ascendant: 'Self & Appearance',
  midheaven: 'Career & Legacy',
}

export function FlippableAngleCard({
  angleKey,
  angle,
  angleName,
  angleColor = ANGLE_COLOR,
}: FlippableAngleCardProps) {
  const rotation = useSharedValue(0)

  const zodiacInfo = ZODIAC_INFO[angle.sign] || {
    element: 'Unknown',
    quality: 'Unknown',
    meaning: 'Mystical energy',
  }

  const flip = () => {
    rotation.value = withTiming(rotation.value === 0 ? 180 : 0, {
      duration: 600,
      easing: Easing.bezier(0.215, 0.61, 0.355, 1),
    })
  }

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{perspective: 1000}, {rotateY: `${rotation.value}deg`}],
      backfaceVisibility: 'hidden',
      opacity: interpolate(rotation.value, [0, 90, 180], [1, 0, 0]),
    }
  })

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{perspective: 1000}, {rotateY: `${rotation.value + 180}deg`}],
      backfaceVisibility: 'hidden',
      opacity: interpolate(rotation.value, [0, 90, 180], [0, 0, 1]),
    }
  })

  return (
    <Pressable onPress={flip} style={styles.container}>
      {/* Front Face */}
      <Animated.View style={[styles.face, styles.frontFace, frontAnimatedStyle]}>
        <View style={styles.frontLabelRow}>
          <Text style={[styles.frontArrow, {color: angleColor}]}>
            {ANGLE_ARROWS[angleKey]}
          </Text>
          <Text style={styles.frontLabel}>{angleName}</Text>
        </View>
        <View style={styles.frontSignRow}>
          <Text style={[styles.frontSignSymbol, {color: angleColor, textShadowColor: angleColor}]}>
            {ZODIAC_SYMBOLS[angle.sign]}
          </Text>
          <Text style={[styles.frontSign, {color: angleColor, textShadowColor: angleColor}]}>
            {angle.sign}
          </Text>
        </View>
        <Text style={styles.frontDegree}>{Math.round(angle.degree_in_sign)}°</Text>
        <Text style={styles.frontShortDesc}>{ANGLE_SHORT_DESC[angleKey]}</Text>
      </Animated.View>

      {/* Back Face */}
      <Animated.View style={[styles.face, styles.backFace, backAnimatedStyle]}>
        <LinearGradient
          colors={[`${angleColor}26`, `${angleColor}0D`]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.backContent}>
          <Text style={styles.backElementQuality}>
            {zodiacInfo.element} · {zodiacInfo.quality}
          </Text>
          <Text style={styles.backMeaning}>
            {ANGLE_MEANINGS[angleKey]}
          </Text>
          <Text style={[styles.backZodiacMeaning, {color: angleColor}]}>
            {angle.sign}: {zodiacInfo.meaning}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 140,
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 14,
  },
  frontFace: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  backFace: {
    borderColor: 'rgba(16, 185, 129, 0.5)',
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  frontLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  frontArrow: {
    fontSize: 14,
    fontFamily: fonts.monoMedium,
  },
  frontLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.textDim,
    textTransform: 'uppercase',
  },
  frontSignRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  frontSignSymbol: {
    fontFamily: fonts.symbols,
    fontSize: 22,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 15,
  },
  frontSign: {
    fontSize: 22,
    fontFamily: fonts.serif,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 15,
  },
  frontDegree: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textDim,
    marginBottom: 8,
  },
  frontShortDesc: {
    fontSize: 12,
    color: colors.textDim,
    fontStyle: 'italic',
    fontFamily: fonts.serif,
  },
  backContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    paddingHorizontal: 4,
  },
  backElementQuality: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textDim,
    letterSpacing: 2,
    marginBottom: 8,
  },
  backMeaning: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: fonts.serif,
  },
  backZodiacMeaning: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: fonts.serif,
  },
})
