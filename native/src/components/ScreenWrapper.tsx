import React, {ReactNode} from 'react'
import {StyleSheet, View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {Background} from './Background'
import {Particles} from './Particles'
import {colors} from '../lib/colors'

interface ScreenWrapperProps {
  children: ReactNode
}

export function ScreenWrapper({children}: ScreenWrapperProps) {
  return (
    <View style={styles.container}>
      {/* Background layer - z-index 0 */}
      <Background />

      {/* Particles layer - z-index 1 */}
      <View style={styles.particlesLayer}>
        <Particles />
      </View>

      {/* Content layer - z-index 10 */}
      <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  particlesLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    elevation: 1,
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
    elevation: 10,
  },
})
