import React, {useState} from 'react'
import {StyleSheet, View, Text, Pressable} from 'react-native'
import Animated, {FadeIn} from 'react-native-reanimated'
import type {ScanOutput} from '../lib/scanOutput'
import {Blueprint} from './Blueprint'
import {Stars} from './Stars'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

interface ChartTabsProps {
  scanData: ScanOutput
  onYourDay: () => void
  onContinue: () => void
}

export function ChartTabs({scanData, onYourDay, onContinue}: ChartTabsProps) {
  const [activeTab, setActiveTab] = useState<'numbers' | 'stars'>('numbers')

  return (
    <View style={styles.container}>
      {/* Tab Headers */}
      <View style={styles.tabHeaders}>
        <Pressable
          onPress={() => setActiveTab('numbers')}
          style={[
            styles.tabButton,
            activeTab === 'numbers' && styles.tabButtonActive,
          ]}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'numbers' && styles.tabButtonTextActive,
            ]}>
            Your Numbers
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('stars')}
          style={[
            styles.tabButton,
            activeTab === 'stars' && styles.tabButtonActive,
          ]}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'stars' && styles.tabButtonTextActive,
            ]}>
            Your Stars
          </Text>
        </Pressable>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === 'numbers' && (
          <Animated.View key="numbers" entering={FadeIn.duration(800)}>
            <Blueprint data={scanData} />
          </Animated.View>
        )}

        {activeTab === 'stars' && (
          <Animated.View key="stars" entering={FadeIn.duration(800)}>
            <Stars data={scanData} />
          </Animated.View>
        )}
      </View>

      {/* Unified Bottom Actions */}
      <View style={styles.bottomActions}>
        {/* Forecast Button - Ghost Style */}
        <Pressable
          style={({pressed}) => [
            styles.actionButton,
            styles.forecastButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={onYourDay}>
          <Text style={styles.forecastButtonText}>Forecast</Text>
        </Pressable>

        {/* Continue Button - Primary Style */}
        <Pressable
          style={({pressed}) => [
            styles.actionButton,
            styles.continueButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={onContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  tabHeaders: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
    justifyContent: 'center',
  },
  tabButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.5)',
    shadowColor: '#8B5CF6',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  tabButtonText: {
    fontFamily: fonts.mono,
    fontSize: 10,  // 0.65rem = ~10px
    letterSpacing: 2,  // 0.2em at 10px
    color: colors.textDim,
    textTransform: 'uppercase',
  },
  tabButtonTextActive: {
    color: colors.textPrimary,
  },
  tabContent: {
    width: '100%',
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
    justifyContent: 'center',
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 50,
    borderWidth: 1,
  },
  actionButtonPressed: {
    transform: [{translateY: 0}, {scale: 0.98}],
  },
  forecastButton: {
    paddingHorizontal: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  forecastButtonText: {
    fontFamily: fonts.monoMedium,
    fontSize: 12,  // 0.75rem = ~12px
    letterSpacing: 2.4,  // 0.2em at 12px
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
  },
  continueButton: {
    paddingHorizontal: 48,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  continueButtonText: {
    fontFamily: fonts.mono,
    fontSize: 12,  // 0.75rem = ~12px
    letterSpacing: 2.4,  // 0.2em at 12px
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
})
