import React from 'react'
import {StyleSheet, View, useWindowDimensions} from 'react-native'
import {
  Canvas,
  Rect,
  LinearGradient,
  RadialGradient,
  vec,
} from '@shopify/react-native-skia'
import {colors} from '../lib/colors'

export function Background() {
  const {width, height} = useWindowDimensions()

  return (
    <View style={styles.container} pointerEvents="none">
      <Canvas style={styles.canvas}>
        {/* Base vertical gradient */}
        <Rect x={0} y={0} width={width} height={height}>
          <LinearGradient
            start={vec(width / 2, 0)}
            end={vec(width / 2, height)}
            colors={[colors.bgDeep, colors.bgMid, colors.bgDeep]}
            positions={[0, 0.5, 1]}
          />
        </Rect>

        {/* Violet glow - center */}
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={vec(width * 0.5, height * 0.5)}
            r={width * 0.5}
            colors={['rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0)']}
            positions={[0, 1]}
          />
        </Rect>

        {/* Pink glow - top left */}
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={vec(width * 0.3, height * 0.2)}
            r={width * 0.4}
            colors={['rgba(236, 72, 153, 0.1)', 'rgba(236, 72, 153, 0)']}
            positions={[0, 1]}
          />
        </Rect>

        {/* Indigo glow - bottom right */}
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={vec(width * 0.7, height * 0.8)}
            r={width * 0.35}
            colors={['rgba(79, 70, 229, 0.1)', 'rgba(79, 70, 229, 0)']}
            positions={[0, 1]}
          />
        </Rect>
      </Canvas>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgDeep,
  },
  canvas: {
    flex: 1,
  },
})
