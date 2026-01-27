import React from 'react'
import {StyleSheet, View, Text, Pressable, StatusBar} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {Feather} from '@expo/vector-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated'
import {LinearGradient} from 'expo-linear-gradient'
import {Background} from '../components/Background'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

export type TabId = 'your_day' | 'discover' | 'messages' | 'profile'
export type OrbState = 'idle' | 'ready' | 'scanning' | 'cooldown'

interface MainShellProps {
  children: React.ReactNode
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  onOrbClick: () => void
  orbState?: OrbState
  badges?: {
    your_day?: boolean
    messages?: number
    discover?: boolean
  }
}

export function MainShell({
  children,
  activeTab,
  onTabChange,
  onOrbClick,
  orbState = 'idle',
  badges = {your_day: true, messages: 3, discover: false},
}: MainShellProps) {
  const insets = useSafeAreaInsets()

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Background />

      {/* Content Area */}
      <View style={[styles.contentArea, {paddingTop: insets.top}]}>
        {/* Ambient Glow from Orb */}
        <LinearGradient
          colors={['transparent', 'rgba(139, 92, 246, 0.1)']}
          style={styles.ambientGlow}
          pointerEvents="none"
        />
        {children}
      </View>

      {/* Tab Bar */}
      <View style={[styles.tabBar, {paddingBottom: insets.bottom || 8}]}>
        {/* Tab Bar Gradient Background */}
        <LinearGradient
          colors={['transparent', colors.bgDeep]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        <View style={styles.tabBarContent}>
          {/* Your Day Tab */}
          <TabItem
            label="Your Day"
            icon="sun"
            isActive={activeTab === 'your_day'}
            badge={badges.your_day}
            badgeColor="#FBBF24"
            onPress={() => onTabChange('your_day')}
          />

          {/* Discover Tab */}
          <TabItem
            label="Discover"
            icon="compass"
            isActive={activeTab === 'discover'}
            badge={badges.discover}
            badgeColor="#10B981"
            onPress={() => onTabChange('discover')}
          />

          {/* Orb Button (Center) */}
          <View style={styles.orbContainer}>
            <OrbButton state={orbState} onPress={onOrbClick} />
          </View>

          {/* Messages Tab */}
          <TabItem
            label="Messages"
            icon="message-circle"
            isActive={activeTab === 'messages'}
            badge={badges.messages}
            badgeColor="#EC4899"
            onPress={() => onTabChange('messages')}
          />

          {/* Profile Tab */}
          <TabItem
            label="Profile"
            icon="user"
            isActive={activeTab === 'profile'}
            onPress={() => onTabChange('profile')}
          />
        </View>
      </View>
    </View>
  )
}

interface TabItemProps {
  label: string
  icon: keyof typeof Feather.glyphMap
  isActive: boolean
  onPress: () => void
  badge?: boolean | number
  badgeColor?: string
}

function TabItem({label, icon, isActive, onPress, badge, badgeColor}: TabItemProps) {
  const scale = useSharedValue(1)

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.9, {duration: 50}),
      withTiming(1, {duration: 100})
    )
    onPress()
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }))

  const hasBadge = badge !== undefined && badge !== false && badge !== 0

  return (
    <Pressable style={styles.tabItem} onPress={handlePress}>
      <Animated.View style={[styles.tabIconContainer, animatedStyle]}>
        {/* Active Glow */}
        {isActive && <View style={styles.activeGlow} />}

        <Feather
          name={icon}
          size={24}
          color={isActive ? colors.accentViolet : 'rgba(255, 255, 255, 0.4)'}
        />

        {/* Badge */}
        {hasBadge && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: badgeColor || 'red',
                width: typeof badge === 'number' ? 18 : 8,
                height: typeof badge === 'number' ? 18 : 8,
                top: typeof badge === 'number' ? -6 : -2,
                right: typeof badge === 'number' ? -6 : -2,
              },
            ]}>
            {typeof badge === 'number' && (
              <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
            )}
          </View>
        )}
      </Animated.View>

      <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  )
}

interface OrbButtonProps {
  state: OrbState
  onPress: () => void
}

function OrbButton({state, onPress}: OrbButtonProps) {
  const isCooldown = state === 'cooldown'
  const isScanning = state === 'scanning'

  // Breathing animation for glow
  const glowScale = useSharedValue(1)
  const glowOpacity = useSharedValue(0.3)
  const orbScale = useSharedValue(1)
  const rotation = useSharedValue(0)

  React.useEffect(() => {
    if (state === 'idle') {
      glowScale.value = withRepeat(
        withTiming(1.1, {duration: 3000, easing: Easing.inOut(Easing.ease)}),
        -1,
        true
      )
      glowOpacity.value = withTiming(0.3)
      orbScale.value = withRepeat(
        withTiming(1.03, {duration: 3000, easing: Easing.inOut(Easing.ease)}),
        -1,
        true
      )
      rotation.value = withTiming(0)
    } else if (state === 'ready') {
      glowScale.value = withRepeat(
        withTiming(1.2, {duration: 2000, easing: Easing.inOut(Easing.ease)}),
        -1,
        true
      )
      glowOpacity.value = withTiming(0.5)
      orbScale.value = withRepeat(
        withTiming(1.05, {duration: 2000, easing: Easing.inOut(Easing.ease)}),
        -1,
        true
      )
    } else if (state === 'scanning') {
      glowOpacity.value = withTiming(0.6)
      rotation.value = withRepeat(
        withTiming(360, {duration: 8000, easing: Easing.linear}),
        -1,
        false
      )
    } else if (state === 'cooldown') {
      glowOpacity.value = withTiming(0.15)
      glowScale.value = withTiming(1)
      orbScale.value = withTiming(1)
    }
  }, [state])

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{scale: glowScale.value}],
    opacity: glowOpacity.value,
  }))

  const orbStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: orbScale.value},
      {rotate: `${rotation.value}deg`},
    ],
  }))

  const handlePress = () => {
    if (!isCooldown && !isScanning) {
      onPress()
    }
  }

  return (
    <Pressable onPress={handlePress} style={styles.orbButton}>
      {/* Scanning Rings */}
      {isScanning && (
        <>
          <ScanningRing delay={0} />
          <ScanningRing delay={500} />
        </>
      )}

      {/* Glow */}
      <Animated.View style={[styles.orbGlow, glowStyle]} />

      {/* The Orb */}
      <Animated.View style={[styles.orb, isCooldown && styles.orbCooldown, orbStyle]}>
        <LinearGradient
          colors={['#8B5CF6', '#EC4899']}
          style={StyleSheet.absoluteFill}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1}}
        />

        {/* Internal highlight */}
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.1)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        />

        {/* Sparkles for Ready state */}
        {state === 'ready' && <ReadySparkles />}

        {/* Cooldown overlay */}
        {isCooldown && (
          <View style={styles.cooldownOverlay}>
            <Text style={styles.cooldownText}>18h</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  )
}

function ScanningRing({delay}: {delay: number}) {
  const scale = useSharedValue(1)
  const opacity = useSharedValue(0.6)

  React.useEffect(() => {
    const startAnimation = () => {
      scale.value = 1
      opacity.value = 0.6
      scale.value = withRepeat(
        withTiming(1.625, {duration: 2000, easing: Easing.out(Easing.ease)}),
        -1,
        false
      )
      opacity.value = withRepeat(
        withTiming(0, {duration: 2000, easing: Easing.out(Easing.ease)}),
        -1,
        false
      )
    }

    const timeout = setTimeout(startAnimation, delay)
    return () => clearTimeout(timeout)
  }, [delay])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }))

  return <Animated.View style={[styles.scanningRing, animatedStyle]} />
}

function ReadySparkles() {
  const opacity = useSharedValue(0.5)

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {duration: 750, easing: Easing.inOut(Easing.ease)}),
      -1,
      true
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <Animated.View style={[styles.sparklesContainer, animatedStyle]}>
      <View style={[styles.sparkle, {top: 12, left: 16, width: 4, height: 4}]} />
      <View style={[styles.sparkle, {bottom: 16, right: 12, width: 6, height: 6}]} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  contentArea: {
    flex: 1,
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 10,
  },
  tabBar: {
    height: 83,
    width: '100%',
    backgroundColor: colors.bgDeep,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    zIndex: 20,
  },
  tabBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  tabItem: {
    width: '20%',
    alignItems: 'center',
    gap: 6,
    paddingTop: 6,
  },
  tabIconContainer: {
    position: 'relative',
  },
  activeGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 20,
  },
  badge: {
    position: 'absolute',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.bgDeep,
  },
  badgeText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  tabLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: -0.3,
  },
  tabLabelActive: {
    color: 'white',
  },
  orbContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
  },
  orbButton: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbGlow: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accentViolet,
  },
  orb: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
    shadowColor: colors.accentViolet,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  orbCooldown: {
    opacity: 0.5,
  },
  cooldownOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cooldownText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  scanningRing: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.accentViolet,
  },
  sparklesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  sparkle: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: 'white',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 4,
  },
})
