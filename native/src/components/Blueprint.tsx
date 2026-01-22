import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'
import { colors, sigilColors } from '../lib/colors'
import { fonts } from '../lib/fonts'
import type { NumerologyData } from '../lib/numerology'

interface BlueprintProps {
  data: NumerologyData
  onSearch: () => void
}

interface TileProps {
  label: string
  value: number
  meaning: string
  color: string
  delay: number
}

function Tile({ label, value, meaning, color, delay }: TileProps) {
  // Create a softer glow by using reduced opacity for shadow
  const glowColor = color + '80' // 50% opacity for softer glow

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(600)}
      style={styles.tile}>
      <Text style={styles.tileLabel}>{label.toUpperCase()}</Text>
      <View style={styles.tileValueContainer}>
        <Text
          style={[
            styles.tileValue,
            {
              color,
              textShadowColor: glowColor,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 15,
            },
          ]}>
          {value}
        </Text>
      </View>
      <Text style={styles.tileMeaning}>{meaning}</Text>
    </Animated.View>
  )
}

export function Blueprint({ data, onSearch }: BlueprintProps) {
  return (
    <Animated.View entering={FadeIn.duration(800)} style={styles.container}>
      <Text style={styles.title}>Your Signature</Text>

      <View style={styles.grid}>
        <Tile
          label="Core"
          value={data.core}
          meaning={data.meanings.core}
          color={sigilColors.core}
          delay={100}
        />
        <Tile
          label="Desire"
          value={data.desire}
          meaning={data.meanings.desire}
          color={sigilColors.desire}
          delay={200}
        />
        <Tile
          label="Bond"
          value={data.bond}
          meaning={data.meanings.bond}
          color={sigilColors.bond}
          delay={300}
        />
        <Tile
          label="Friction"
          value={data.friction}
          meaning={data.meanings.friction}
          color={sigilColors.friction}
          delay={400}
        />
      </View>

      <Animated.View entering={FadeInDown.delay(500).duration(600)}>
        <TouchableOpacity
          style={styles.button}
          onPress={onSearch}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>SEARCH FOR RESONANCE</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '300',
    color: colors.textSecondary,
    letterSpacing: 2,
    marginBottom: 32,
    fontFamily: fonts.serif,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    marginBottom: 32,
  },
  tile: {
    width: '45%',
    minWidth: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  tileLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 4,
    color: colors.textDim,
    marginBottom: 12,
  },
  tileValueContainer: {
    marginBottom: 8,
  },
  tileValue: {
    fontSize: 40,
    fontWeight: '300',
    fontFamily: fonts.serif,
  },
  tileMeaning: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: fonts.serif,
  },
  button: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 50,
    paddingHorizontal: 48,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 3,
    color: colors.textPrimary,
  },
})
