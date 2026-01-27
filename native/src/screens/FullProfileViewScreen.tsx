import React, {useState, useRef} from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native'
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {Feather} from '@expo/vector-icons'
import Animated, {FadeIn} from 'react-native-reanimated'
import {LinearGradient} from 'expo-linear-gradient'
import type {RootStackParamList} from '../navigation/types'
import {ScreenWrapper} from '../components/ScreenWrapper'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const {width: SCREEN_WIDTH} = Dimensions.get('window')

// Mock profile data
const MOCK_PROFILE = {
  name: 'Sarah',
  age: 28,
  verified: true,
  distance: '2.4 km away',
  location: 'Kadikoy, Istanbul',
  bio: "Mystic soul wandering through the cosmos. Seeking a connection that transcends the physical realm and vibrates on a higher frequency.\n\nLover of ancient texts, midnight coffee, and the silence between notes.",
  matchPercentage: 94,
  matchLabel: 'Magnetic Stability',
  compatibility: [
    {label: 'LP', val1: 5, val2: 3, score: 18, max: 20, color: '#F59E0B'},
    {label: 'SU', val1: 7, val2: 9, score: 16, max: 20, color: '#06B6D4'},
    {label: 'EX', val1: 1, val2: 5, score: 19, max: 20, color: '#10B981'},
    {label: 'PE', val1: 2, val2: 6, score: 14, max: 20, color: '#F472B6'},
  ],
  synergies: [
    'Your 5 adventure meets her 3 creativity',
    'Venus trine Moon: Emotional harmony',
    'Low conflict potential',
  ],
  prompts: [
    {question: "I'm most grateful for...", answer: 'The way the light hits the ocean at sunrise.'},
    {question: 'My simple pleasure is...', answer: 'Reading poetry in a busy cafe while it rains.'},
    {question: "We'll get along if...", answer: 'You believe that coincidences are actually synchronicities.'},
  ],
  blueprint: {
    lifePath: '5',
    soulUrge: '7',
    expression: '1',
    personality: '2',
    planets: {
      sun: 'Scorpio',
      moon: 'Pisces',
      venus: 'Libra',
      mars: 'Capricorn',
    },
  },
  photos: [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
  ],
}

type FullProfileNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FullProfile'>

export function FullProfileViewScreen() {
  const navigation = useNavigation<FullProfileNavigationProp>()
  const insets = useSafeAreaInsets()
  const scrollViewRef = useRef<ScrollView>(null)

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isBioExpanded, setIsBioExpanded] = useState(false)
  const [isBlueprintExpanded, setIsBlueprintExpanded] = useState(false)

  const handlePhotoScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x
    const index = Math.round(offsetX / SCREEN_WIDTH)
    setCurrentPhotoIndex(index)
  }

  const toggleBio = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setIsBioExpanded(!isBioExpanded)
  }

  const toggleBlueprint = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setIsBlueprintExpanded(!isBlueprintExpanded)
  }

  const handleBack = () => {
    navigation.goBack()
  }

  const handlePass = () => {
    navigation.goBack()
  }

  const handleMessage = () => {
    // Navigate to conversation
  }

  const handleResonate = () => {
    // Navigate to resonate animation
  }

  const matchColor = MOCK_PROFILE.matchPercentage >= 90 ? '#10B981' : '#F59E0B'

  return (
    <View style={styles.container}>
      <ScreenWrapper>
        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 120}}>

          {/* Photo Carousel */}
          <View style={styles.photoCarousel}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handlePhotoScroll}
              scrollEventThrottle={16}>
              {MOCK_PROFILE.photos.map((photo, index) => (
                <Image key={index} source={{uri: photo}} style={styles.photo} />
              ))}
            </ScrollView>

            {/* Gradient Overlay */}
            <LinearGradient
              colors={['transparent', colors.bgDeep]}
              style={styles.photoGradient}
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
              {MOCK_PROFILE.photos.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.paginationDot,
                    idx === currentPhotoIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Sticky Header */}
          <View style={[styles.header, {paddingTop: insets.top + 8}]}>
            <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
              <Feather name="arrow-left" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Feather name="more-horizontal" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            {/* Basic Info */}
            <View style={styles.basicInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>
                  {MOCK_PROFILE.name}, {MOCK_PROFILE.age}
                </Text>
                {MOCK_PROFILE.verified && (
                  <Feather name="shield" size={18} color="#10B981" />
                )}
              </View>
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={12} color="rgba(255, 255, 255, 0.5)" />
                <Text style={styles.distance}>{MOCK_PROFILE.distance}</Text>
                <Text style={styles.location}>{MOCK_PROFILE.location}</Text>
              </View>
            </View>

            {/* Compatibility Card */}
            <View style={styles.compatibilityCard}>
              {/* Match Percentage */}
              <View style={styles.matchSection}>
                <Text style={[styles.matchPercent, {color: matchColor}]}>
                  {MOCK_PROFILE.matchPercentage}%
                </Text>
                <Text style={styles.matchLabel}>{MOCK_PROFILE.matchLabel}</Text>
              </View>

              {/* Compatibility Bars */}
              <View style={styles.barsGrid}>
                {MOCK_PROFILE.compatibility.map((item, i) => (
                  <View key={i} style={styles.barItem}>
                    <Text style={styles.barLabel}>{item.label}</Text>
                    <Text style={styles.barValues}>
                      {item.val1}x{item.val2}
                    </Text>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            width: `${(item.score / item.max) * 100}%`,
                            backgroundColor: item.color,
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>

              {/* Synergies */}
              <View style={styles.synergies}>
                {MOCK_PROFILE.synergies.map((syn, i) => (
                  <View key={i} style={styles.synergyItem}>
                    <LinearGradient
                      colors={['#8B5CF6', '#EC4899']}
                      style={styles.synergyCheck}>
                      <Feather name="check" size={10} color="white" />
                    </LinearGradient>
                    <Text style={styles.synergyText}>{syn}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Bio Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text
                style={styles.bioText}
                numberOfLines={isBioExpanded ? undefined : 3}>
                {MOCK_PROFILE.bio}
              </Text>
              <TouchableOpacity onPress={toggleBio}>
                <Text style={styles.readMore}>
                  {isBioExpanded ? 'Read less' : 'Read more'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Prompts Section */}
            <View style={styles.promptsSection}>
              {MOCK_PROFILE.prompts.map((prompt, i) => (
                <View key={i} style={styles.promptCard}>
                  <Text style={styles.promptQuestion}>{prompt.question}</Text>
                  <Text style={styles.promptAnswer}>{prompt.answer}</Text>
                </View>
              ))}
            </View>

            {/* Blueprint Section */}
            <View style={styles.blueprintSection}>
              <TouchableOpacity style={styles.blueprintHeader} onPress={toggleBlueprint}>
                <Text style={styles.blueprintTitle}>View Blueprint</Text>
                <Feather
                  name={isBlueprintExpanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="rgba(255, 255, 255, 0.5)"
                />
              </TouchableOpacity>

              {isBlueprintExpanded && (
                <Animated.View entering={FadeIn.duration(300)} style={styles.blueprintContent}>
                  {/* Numerology Grid */}
                  <View style={styles.numGrid}>
                    {[
                      {val: MOCK_PROFILE.blueprint.lifePath, label: 'Life Path'},
                      {val: MOCK_PROFILE.blueprint.soulUrge, label: 'Soul Urge'},
                      {val: MOCK_PROFILE.blueprint.expression, label: 'Express.'},
                      {val: MOCK_PROFILE.blueprint.personality, label: 'Person.'},
                    ].map((num, i) => (
                      <View key={i} style={styles.numItem}>
                        <Text style={styles.numValue}>{num.val}</Text>
                        <Text style={styles.numLabel}>{num.label}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Planetary Signs */}
                  <View style={styles.planetsGrid}>
                    {Object.entries(MOCK_PROFILE.blueprint.planets).map(([planet, sign]) => (
                      <View key={planet} style={styles.planetRow}>
                        <Text style={styles.planetName}>{planet}</Text>
                        <Text style={styles.planetSign}>{sign}</Text>
                      </View>
                    ))}
                  </View>
                </Animated.View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Action Bar */}
        <LinearGradient
          colors={['transparent', colors.bgDeep, colors.bgDeep]}
          style={[styles.actionBar, {paddingBottom: insets.bottom + 16}]}>
          <View style={styles.actionButtons}>
            {/* Pass Button */}
            <TouchableOpacity style={styles.passButton} onPress={handlePass}>
              <Feather name="x" size={24} color="rgba(255, 255, 255, 0.8)" />
            </TouchableOpacity>

            {/* Message Button */}
            {MOCK_PROFILE.verified ? (
              <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
                <Feather name="message-circle" size={18} color="white" />
                <Text style={styles.messageText}>MESSAGE</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.messageButton, styles.messageButtonDisabled]}>
                <Text style={styles.messageTextDisabled}>Verify to message</Text>
              </View>
            )}

            {/* Resonate Button */}
            <TouchableOpacity style={styles.resonateButton} onPress={handleResonate}>
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={StyleSheet.absoluteFill}
              />
              <Feather name="heart" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScreenWrapper>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  scrollView: {
    flex: 1,
  },
  photoCarousel: {
    width: SCREEN_WIDTH,
    height: 400,
    position: 'relative',
  },
  photo: {
    width: SCREEN_WIDTH,
    height: 400,
    resizeMode: 'cover',
  },
  photoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 128,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  paginationDotActive: {
    backgroundColor: 'white',
    transform: [{scale: 1.1}],
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    marginTop: -24,
  },
  basicInfo: {
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 28,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distance: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  location: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  compatibilityCard: {
    backgroundColor: colors.bgMid,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: 16,
    marginBottom: 24,
  },
  matchSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  matchPercent: {
    fontFamily: fonts.serif,
    fontSize: 40,
    fontWeight: '600',
    marginBottom: 4,
  },
  matchLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  barsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  barLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  barValues: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  barTrack: {
    width: '90%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  synergies: {
    gap: 8,
  },
  synergyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  synergyCheck: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  synergyText: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  bioText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  readMore: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.accentViolet,
    marginTop: 4,
  },
  promptsSection: {
    gap: 12,
    marginBottom: 24,
  },
  promptCard: {
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 16,
  },
  promptQuestion: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 8,
  },
  promptAnswer: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  blueprintSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  blueprintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  blueprintTitle: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  blueprintContent: {
    paddingTop: 16,
  },
  numGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  numItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  numValue: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: '500',
    color: colors.accentViolet,
  },
  numLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  planetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  planetRow: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  planetName: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'capitalize',
  },
  planetSign: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  passButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButton: {
    height: 48,
    paddingHorizontal: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  messageButtonDisabled: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
  messageText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    letterSpacing: 1,
  },
  messageTextDisabled: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  resonateButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: colors.accentViolet,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
})
