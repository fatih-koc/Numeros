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

interface FlippablePlanetCardProps {
  planetKey: string
  planet: {sign: string; degree_in_sign: number; house?: number | null}
  planetColor: string
  planetSymbol: string
  planetName: string
  planetMeaning: string
  signMeaning: string
  signSymbol?: string
  isApproximate?: boolean
  size?: 'small' | 'medium' | 'large'
}

const SIZE_CONFIG = {
  small: {height: 160, symbolSize: 24, padding: 16},
  medium: {height: 180, symbolSize: 32, padding: 20},
  large: {height: 220, symbolSize: 40, padding: 24},
}

export function FlippablePlanetCard({
  planetKey,
  planet,
  planetColor,
  planetSymbol,
  planetName,
  planetMeaning,
  signMeaning,
  signSymbol,
  isApproximate = false,
  size = 'medium',
}: FlippablePlanetCardProps) {
  const rotation = useSharedValue(0)
  const config = SIZE_CONFIG[size]

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
    <Pressable onPress={flip} style={[styles.container, {height: config.height}]}>
      {/* Front Face */}
      <Animated.View
        style={[
          styles.face,
          styles.frontFace,
          frontAnimatedStyle,
          {
            height: config.height,
            padding: config.padding,
            borderStyle: isApproximate ? 'dashed' : 'solid',
            borderColor: isApproximate
              ? 'rgba(255, 255, 255, 0.04)'
              : 'rgba(255, 255, 255, 0.06)',
          },
        ]}>
        <Text
          style={[
            styles.symbol,
            {
              fontSize: config.symbolSize,
              color: planetColor,
              textShadowColor: planetColor,
            },
          ]}>
          {planetSymbol}
        </Text>
        <Text style={styles.planetName}>{planetName}</Text>
        <View style={styles.signRow}>
          {signSymbol && (
            <Text style={[styles.signSymbol, {color: planetColor}]}>{signSymbol}</Text>
          )}
          <Text style={styles.sign}>{planet.sign}</Text>
        </View>
        <Text style={styles.degree}>
          {isApproximate && '~'}
          {Math.round(planet.degree_in_sign)}°
        </Text>
        {planet.house && <Text style={styles.house}>House {planet.house}</Text>}
      </Animated.View>

      {/* Back Face */}
      <Animated.View
        style={[
          styles.face,
          styles.backFace,
          backAnimatedStyle,
          {
            height: config.height,
            padding: config.padding,
            borderColor: `${planetColor}80`,
          },
        ]}>
        <LinearGradient
          colors={[`${planetColor}26`, `${planetColor}0D`]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.backContent}>
          <View style={styles.backHeaderRow}>
            <Text style={[styles.backHeaderSymbol, {color: planetColor}]}>{planetSymbol}</Text>
            <Text style={styles.backHeaderName}>{planetName}</Text>
          </View>
          <Text style={styles.backMeaning}>{planetMeaning}</Text>
          <View style={styles.backSignRow}>
            {signSymbol && (
              <Text style={[styles.backSignSymbol, {color: planetColor}]}>{signSymbol}</Text>
            )}
            <Text style={styles.backSignMeaning}>
              in {planet.sign}: {signMeaning}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  frontFace: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  backFace: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  backContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  symbol: {
    fontFamily: fonts.symbols,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 20,
    marginBottom: 8,
  },
  planetName: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 3,
    color: colors.textDim,
    marginBottom: 8,
  },
  signRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  signSymbol: {
    fontFamily: fonts.symbols,
    fontSize: 14,
  },
  sign: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    fontFamily: fonts.serif,
  },
  degree: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textDim,
  },
  house: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textDim,
    marginTop: 4,
  },
  backHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  backHeaderSymbol: {
    fontFamily: fonts.symbols,
    fontSize: 16,
  },
  backHeaderName: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.textDim,
    letterSpacing: 3,
  },
  backMeaning: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: fonts.serif,
  },
  backSignRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  backSignSymbol: {
    fontFamily: fonts.symbols,
    fontSize: 14,
    marginTop: 2,
  },
  backSignMeaning: {
    fontSize: 13,
    color: colors.textDim,
    lineHeight: 18,
    textAlign: 'center',
    fontFamily: fonts.serif,
    flex: 1,
  },
})
