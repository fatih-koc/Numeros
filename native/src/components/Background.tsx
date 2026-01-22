import React from 'react'
import {StyleSheet, View, Dimensions} from 'react-native'
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Rect,
} from 'react-native-svg'
import {colors} from '../lib/colors'

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window')

export function Background() {
  return (
    <View style={styles.container}>
      <Svg
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        style={StyleSheet.absoluteFill}>
        <Defs>
          {/* Base vertical gradient */}
          <LinearGradient id="baseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={colors.bgDeep} stopOpacity="1" />
            <Stop offset="50%" stopColor={colors.bgMid} stopOpacity="1" />
            <Stop offset="100%" stopColor={colors.bgDeep} stopOpacity="1" />
          </LinearGradient>

          {/* Violet glow */}
          <RadialGradient id="glowViolet" cx="50%" cy="50%" rx="40%" ry="25%">
            <Stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </RadialGradient>

          {/* Pink glow */}
          <RadialGradient id="glowPink" cx="30%" cy="20%" rx="30%" ry="40%">
            <Stop offset="0%" stopColor="#EC4899" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
          </RadialGradient>

          {/* Indigo glow */}
          <RadialGradient id="glowIndigo" cx="70%" cy="80%" rx="25%" ry="30%">
            <Stop offset="0%" stopColor="#4F46E5" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Layers */}
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#baseGradient)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glowViolet)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glowPink)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glowIndigo)" />
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgDeep,
    zIndex: 0,
  },
})
