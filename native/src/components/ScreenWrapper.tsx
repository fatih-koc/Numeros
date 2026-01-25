import React, {ReactNode} from 'react'
import {StyleSheet, View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {Background} from './Background'
import {Particles} from './Particles'
import {colors} from '../lib/colors'

interface ScreenWrapperProps {
  children: ReactNode
  edges?: ('top' | 'bottom' | 'left' | 'right')[]
}

export function ScreenWrapper({children, edges = ['top', 'bottom']}: ScreenWrapperProps) {
  return (
    <View style={styles.container}>
      {/* Background layer */}
      <Background />

      {/* Particles layer */}
      <View style={styles.particlesLayer} pointerEvents="none">
        <Particles />
      </View>

      {/* Content layer with safe area */}
      <SafeAreaView style={styles.safeArea} edges={edges}>
        {children}
      </SafeAreaView>
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
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
})
