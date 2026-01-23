import React, {useState} from 'react'
import {StyleSheet, View, Text, Pressable, Alert} from 'react-native'
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
  onShare?: () => void
}

export function ChartTabs({scanData, onSearch, onUpgrade, onShare}: ChartTabsProps) {
  const [activeTab, setActiveTab] = useState<'numbers' | 'stars'>('numbers')

  const handleShare = () => {
    if (onShare) {
      onShare()
    } else {
      Alert.alert(
        'Share',
        'Share functionality would allow you to share your cosmic blueprint with others.'
      )
    }
  }

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
            <Stars data={scanData} onUpgrade={onUpgrade} />
          </Animated.View>
        )}
      </View>

      {/* Unified Bottom Actions - visible on both tabs */}
      <View style={styles.bottomActions}>
        <Pressable
          style={({pressed}) => [
            styles.actionButton,
            styles.shareButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={handleShare}>
          <Text style={styles.actionButtonText}>Share</Text>
        </Pressable>

        <Pressable
          style={({pressed}) => [
            styles.actionButton,
            styles.resonanceButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={onSearch}>
          <Text style={styles.actionButtonText}>Resonance</Text>
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
    fontSize: 14,
    letterSpacing: 3,
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
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 50,
    borderWidth: 1,
  },
  actionButtonPressed: {
    transform: [{translateY: 0}, {scale: 0.98}],
  },
  shareButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  resonanceButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  actionButtonText: {
    fontFamily: fonts.mono,
    fontSize: 15,
    letterSpacing: 3,
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
})
