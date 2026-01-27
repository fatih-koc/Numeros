import React, {useState, useRef, useCallback} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  PanResponder,
  Alert,
} from 'react-native'
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import type {RootStackParamList} from '../navigation/types'
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated'
import {LinearGradient} from 'expo-linear-gradient'
import Svg, {Path, Circle, Defs, Stop, LinearGradient as SvgLinearGradient} from 'react-native-svg'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window')
const EASING = Easing.bezier(0.4, 0, 0.2, 1)

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

// Icons
function ArrowLeftIcon({size = 20, color = 'rgba(255, 255, 255, 0.9)'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function XIcon({size = 20, color = 'rgba(255, 255, 255, 0.7)'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function ClockIcon({size = 20, color = 'rgba(255, 255, 255, 0.7)'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function UserIcon({size = 20, color = 'rgba(255, 255, 255, 0.7)'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={12} cy={7} r={4} stroke={color} strokeWidth={2} />
    </Svg>
  )
}

function StarIcon({size = 28, color = 'rgba(255, 255, 255, 0.95)'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </Svg>
  )
}

function CheckCircleIcon({size = 12, color = '#10B981'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M22 4L12 14.01l-3-3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function MoreVerticalIcon({size = 20, color = 'rgba(255, 255, 255, 0.9)'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={5} r={1} fill={color} />
      <Circle cx={12} cy={12} r={1} fill={color} />
      <Circle cx={12} cy={19} r={1} fill={color} />
    </Svg>
  )
}

function ChevronRightIcon({size = 14, color = 'rgba(255, 255, 255, 0.5)'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

interface CompatibilityBar {
  label: string
  score: number
  maxScore: number
  color: string
}

function CompatibilityBarComponent({item}: {item: CompatibilityBar}) {
  const percentage = (item.score / item.maxScore) * 100

  return (
    <View style={barStyles.container}>
      <Text style={barStyles.label}>{item.label}</Text>
      <View style={barStyles.track}>
        <View style={[barStyles.fill, {width: `${percentage}%`, backgroundColor: item.color}]} />
      </View>
      <Text style={barStyles.score}>
        {item.score}/{item.maxScore}
      </Text>
    </View>
  )
}

const barStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    width: 70,
  },
  track: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
  score: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    width: 35,
    textAlign: 'right',
  },
})

type HumanRevealNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HumanReveal'>
type HumanRevealRouteProp = RouteProp<RootStackParamList, 'HumanReveal'>

export function HumanRevealScreen() {
  const navigation = useNavigation<HumanRevealNavigationProp>()
  const route = useRoute<HumanRevealRouteProp>()
  const insets = useSafeAreaInsets()
  const {match} = route.params

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Mock data for the match (would come from params or API in real app)
  const person = {
    name: match.name,
    age: match.age,
    distance: '2.4 km',
    photos: [
      match.photoUrl,
      'https://images.unsplash.com/photo-1734764627105-b5ff03f02b2d?w=800',
      'https://images.unsplash.com/photo-1557800524-cad48017137d?w=800',
    ],
    verified: true,
    matchPercentage: match.matchPercentage,
    matchLabel: 'Magnetic Stability',
    compatibility: [
      {label: 'Life Path', score: 17, maxScore: 20, color: '#F59E0B'},
      {label: 'Soul Urge', score: 19, maxScore: 20, color: '#06B6D4'},
      {label: 'Expression', score: 15, maxScore: 20, color: '#10B981'},
      {label: 'Personality', score: 16, maxScore: 20, color: '#F472B6'},
    ],
    reasons: ['Your 7 grounds her 5', 'Mutual desire for depth', 'Low conflict potential'],
  }

  // Swipe refs
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  // Animation values
  const textContainerY = useSharedValue(0)
  const textContainerOpacity = useSharedValue(1)

  // Get match color based on percentage
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return {color: '#10B981', glow: 'rgba(16, 185, 129, 0.4)'}
    if (percentage >= 80) return {color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.4)'}
    return {color: 'rgba(255, 255, 255, 0.95)', glow: 'rgba(255, 255, 255, 0.2)'}
  }

  const matchStyle = getMatchColor(person.matchPercentage)

  // Photo pan responder
  const photoPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        touchStartX.current = evt.nativeEvent.pageX
        touchStartY.current = evt.nativeEvent.pageY
      },
      onPanResponderRelease: evt => {
        const deltaX = evt.nativeEvent.pageX - touchStartX.current
        const deltaY = evt.nativeEvent.pageY - touchStartY.current

        // If more vertical, ignore
        if (Math.abs(deltaY) > Math.abs(deltaX)) return

        const threshold = 50
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            // Swipe right - previous
            setCurrentPhotoIndex(prev => (prev - 1 + person.photos.length) % person.photos.length)
          } else {
            // Swipe left - next
            setCurrentPhotoIndex(prev => (prev + 1) % person.photos.length)
          }
        }
      },
    })
  ).current

  // Text pan responder for collapse/expand
  const textPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        touchStartY.current = evt.nativeEvent.pageY
      },
      onPanResponderRelease: evt => {
        const deltaY = evt.nativeEvent.pageY - touchStartY.current
        const threshold = 50

        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0) {
            // Swipe down - collapse
            setIsCollapsed(true)
            textContainerY.value = withTiming(SCREEN_HEIGHT * 0.5, {duration: 500, easing: EASING})
            textContainerOpacity.value = withTiming(0, {duration: 500, easing: EASING})
          } else {
            // Swipe up - expand
            setIsCollapsed(false)
            textContainerY.value = withTiming(0, {duration: 500, easing: EASING})
            textContainerOpacity.value = withTiming(1, {duration: 500, easing: EASING})
          }
        }
      },
    })
  ).current

  const textContainerStyle = useAnimatedStyle(() => ({
    transform: [{translateY: textContainerY.value}],
    opacity: textContainerOpacity.value,
  }))

  // Handlers
  const handleBack = () => {
    navigation.goBack()
  }

  const handlePass = () => {
    // Would trigger pass action
    navigation.goBack()
  }

  const handleMaybeLater = () => {
    Alert.alert('Maybe Later', 'This match has been saved for later.')
  }

  const handleViewProfile = () => {
    // Would navigate to full profile view
    Alert.alert('View Profile', 'Full profile view coming soon.')
  }

  const handleResonate = () => {
    // Would trigger resonate animation
    Alert.alert('Resonance Sent!', `You've resonated with ${person.name}.`)
    navigation.goBack()
  }

  const handleViewBreakdown = () => {
    // Would navigate to full breakdown screen (premium feature)
    Alert.alert('Full Breakdown', 'Detailed compatibility breakdown coming soon.')
  }

  return (
    <View style={styles.container}>
      {/* Full Screen Photo */}
      <View style={styles.photoContainer} {...photoPanResponder.panHandlers}>
        <Image source={{uri: person.photos[currentPhotoIndex]}} style={styles.photo} />

        {/* Photo pagination dots */}
        <View style={[styles.paginationContainer, {top: insets.top + 56}]}>
          {person.photos.map((_, index) => (
            <View key={index} style={[styles.paginationDot, index === currentPhotoIndex && styles.paginationDotActive]} />
          ))}
        </View>

        {/* Gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(12, 10, 29, 0.3)', 'rgba(12, 10, 29, 0.9)']}
          locations={[0.3, 0.5, 1]}
          style={styles.photoGradient}
        />
      </View>

      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <Pressable style={styles.headerButton} onPress={handleBack}>
          <ArrowLeftIcon />
        </Pressable>

        <Pressable style={styles.headerButton} onPress={() => setShowMenu(!showMenu)}>
          <MoreVerticalIcon />
        </Pressable>

        {/* Dropdown menu */}
        {showMenu && (
          <View style={styles.dropdown}>
            <Pressable
              style={styles.dropdownItem}
              onPress={() => {
                Alert.alert('Report User')
                setShowMenu(false)
              }}>
              <Text style={styles.dropdownText}>Report user</Text>
            </Pressable>
            <Pressable
              style={styles.dropdownItem}
              onPress={() => {
                Alert.alert('Block User')
                setShowMenu(false)
              }}>
              <Text style={[styles.dropdownText, {color: '#EF4444'}]}>Block user</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Text Content - starts at 50% */}
      <Animated.View style={[styles.textContainer, textContainerStyle]} {...textPanResponder.panHandlers}>
        {/* Swipe handle */}
        <View style={styles.swipeHandle}>
          <View style={styles.swipeHandleBar} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Identity section */}
          <View style={styles.identityRow}>
            <View>
              <Text style={styles.nameAge}>
                {person.name}, {person.age}
              </Text>
              <Text style={styles.distance}>{person.distance} away</Text>
            </View>

            {/* Badges */}
            <View style={styles.badges}>
              {person.verified && (
                <View style={styles.badgeVerified}>
                  <CheckCircleIcon />
                  <Text style={styles.badgeVerifiedText}>Verified</Text>
                </View>
              )}
            </View>
          </View>

          {/* Match Score Card */}
          <View style={styles.matchCard}>
            <View style={styles.matchCardContent}>
              {/* Left - Match % */}
              <View style={styles.matchPercentContainer}>
                <Text style={[styles.matchPercent, {color: matchStyle.color, textShadowColor: matchStyle.glow}]}>
                  {person.matchPercentage}%
                </Text>
                <Text style={styles.matchLabel}>{person.matchLabel}</Text>
                <Pressable style={styles.breakdownLink} onPress={handleViewBreakdown}>
                  <Text style={styles.breakdownLinkText}>Full breakdown</Text>
                  <ChevronRightIcon />
                </Pressable>
              </View>

              {/* Right - Bars */}
              <View style={styles.barsContainer}>
                {person.compatibility.map((item, index) => (
                  <CompatibilityBarComponent key={index} item={item} />
                ))}
              </View>
            </View>
          </View>

          {/* Why You Match */}
          <View style={styles.reasonsSection}>
            <Text style={styles.reasonsTitle}>Why you match</Text>
            {person.reasons.map((reason, index) => (
              <View key={index} style={styles.reasonItem}>
                <View style={styles.reasonBorder} />
                <Text style={styles.reasonText}>{reason}</Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Action Buttons - Fixed at bottom */}
      <View style={[styles.actionsContainer, {paddingBottom: insets.bottom + 16}]}>
        {/* Pass */}
        <Pressable style={styles.actionButton} onPress={handlePass}>
          <XIcon />
        </Pressable>

        {/* Maybe Later */}
        <Pressable style={styles.actionButton} onPress={handleMaybeLater}>
          <ClockIcon />
        </Pressable>

        {/* View Profile */}
        <Pressable style={styles.actionButton} onPress={handleViewProfile}>
          <UserIcon />
        </Pressable>

        {/* Resonate - Primary */}
        <Pressable style={styles.resonateButton} onPress={handleResonate}>
          <LinearGradient colors={['#8B5CF6', '#EC4899']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.resonateGradient}>
            <StarIcon />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  photoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  paginationContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  paginationDotActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 20,
  },
  photoGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 30,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute',
    right: 16,
    top: 52,
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  textContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
  },
  swipeHandle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  swipeHandleBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 140,
  },
  identityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  nameAge: {
    fontFamily: fonts.serif,
    fontSize: 28,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  distance: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.textSecondary,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    maxWidth: 140,
    justifyContent: 'flex-end',
  },
  badgeVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
  },
  badgeVerifiedText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: '#10B981',
  },
  matchCard: {
    backgroundColor: 'rgba(26, 21, 51, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  matchCardContent: {
    flexDirection: 'row',
    gap: 16,
  },
  matchPercentContainer: {
    flexShrink: 0,
  },
  matchPercent: {
    fontFamily: fonts.serif,
    fontSize: 42,
    fontWeight: '600',
    lineHeight: 48,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 20,
    marginBottom: 8,
  },
  matchLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textSecondary,
  },
  breakdownLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  breakdownLinkText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  barsContainer: {
    flex: 1,
    gap: 8,
  },
  reasonsSection: {
    marginTop: 8,
  },
  reasonsTitle: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reasonBorder: {
    width: 2,
    height: '100%',
    minHeight: 20,
    marginRight: 12,
    backgroundColor: colors.accentViolet,
  },
  reasonText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 21,
    flex: 1,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 40,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resonateButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: colors.accentViolet,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  resonateGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
