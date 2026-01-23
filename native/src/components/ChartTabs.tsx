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
  onSearch: () => void
  onUpgrade?: () => void
}

export function ChartTabs({scanData, onSearch, onUpgrade}: ChartTabsProps) {
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
            YOUR NUMBERS
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
            YOUR STARS
          </Text>
        </Pressable>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === 'numbers' && (
          <Animated.View key="numbers" entering={FadeIn.duration(800)}>
            <Blueprint data={scanData} onSearch={onSearch} />
          </Animated.View>
        )}

        {activeTab === 'stars' && (
          <Animated.View key="stars" entering={FadeIn.duration(800)}>
            <Stars data={scanData} onUpgrade={onUpgrade} />
          </Animated.View>
        )}
      </View>

      {/* Search for Resonance Button (only on Stars tab) */}
      {activeTab === 'stars' && (
        <Pressable style={styles.searchButton} onPress={onSearch}>
          <Text style={styles.searchButtonText}>SEARCH FOR RESONANCE</Text>
        </Pressable>
      )}
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
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 3,
    color: colors.textDim,
  },
  tabButtonTextActive: {
    color: colors.textPrimary,
  },
  tabContent: {
    width: '100%',
  },
  searchButton: {
    marginTop: 40,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  searchButtonText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 3,
    color: colors.textSecondary,
  },
})
