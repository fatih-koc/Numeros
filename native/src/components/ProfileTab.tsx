import React, {useState} from 'react'
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, Image} from 'react-native'
import {Feather} from '@expo/vector-icons'
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated'
import {LinearGradient} from 'expo-linear-gradient'
import {colors, energyColors} from '../lib/colors'
import {fonts} from '../lib/fonts'
import {ZODIAC_SYMBOLS, PLANET_SYMBOLS} from '../lib/planetMeanings'

interface UserProfile {
  name: string
  age: number
  location: string
  imageUrl: string
  isVerified: boolean
  isPremium: boolean
}

const MOCK_USER: UserProfile = {
  name: 'Alex',
  age: 29,
  location: 'Kadikoy, Istanbul',
  imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  isVerified: true,
  isPremium: false,
}

interface NumberCardData {
  label: string
  number: number
  meaning: string
  color: string
  symbol: string
}

const YOUR_NUMBERS: NumberCardData[] = [
  {label: 'Life Path', number: 7, meaning: 'The Seeker', color: '#F59E0B', symbol: 'O'},
  {label: 'Soul Urge', number: 11, meaning: 'The Visionary', color: '#06B6D4', symbol: 'V'},
  {label: 'Expression', number: 5, meaning: 'The Catalyst', color: '#10B981', symbol: 'W'},
  {label: 'Personality', number: 9, meaning: 'The Humanist', color: '#F472B6', symbol: 'X'},
]

interface PlanetData {
  planet: string
  sign: string
  planetSymbol: string
  signSymbol: string
}

const YOUR_STARS: PlanetData[] = [
  {planet: 'Sun', sign: 'Leo', planetSymbol: 'Q', signSymbol: 'E'},
  {planet: 'Moon', sign: 'Sagittarius', planetSymbol: 'R', signSymbol: 'I'},
  {planet: 'Mercury', sign: 'Virgo', planetSymbol: 'S', signSymbol: 'F'},
  {planet: 'Venus', sign: 'Libra', planetSymbol: 'T', signSymbol: 'G'},
  {planet: 'Mars', sign: 'Scorpio', planetSymbol: 'U', signSymbol: 'H'},
  {planet: 'Jupiter', sign: 'Pisces', planetSymbol: 'V', signSymbol: 'L'},
  {planet: 'Saturn', sign: 'Aquarius', planetSymbol: 'W', signSymbol: 'K'},
]

interface ProfileTabProps {
  onEditProfile?: () => void
  onPreviewProfile?: () => void
  onShareDay?: () => void
  onSettings?: () => void
  onPremiumClick?: () => void
}

export function ProfileTab({
  onEditProfile,
  onSettings,
}: ProfileTabProps) {
  const [blueprintTab, setBlueprintTab] = useState<'numbers' | 'stars'>('numbers')

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        {/* Photo */}
        <View style={styles.photoContainer}>
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.photoBorder}>
            <Image source={{uri: MOCK_USER.imageUrl}} style={styles.photo} />
          </LinearGradient>

          {/* Edit Button */}
          <TouchableOpacity
            style={styles.editPhotoButton}
            onPress={onEditProfile}
            activeOpacity={0.7}>
            <Feather name="edit-2" size={12} color="white" />
          </TouchableOpacity>
        </View>

        {/* Name & Verification */}
        <View style={styles.nameRow}>
          <Text style={styles.name}>
            {MOCK_USER.name}, {MOCK_USER.age}
          </Text>
          {MOCK_USER.isVerified && (
            <View style={styles.verifiedBadge}>
              <Feather name="check" size={12} color="#10B981" />
            </View>
          )}
        </View>

        {/* Location */}
        <Text style={styles.location}>{MOCK_USER.location}</Text>
      </View>

      {/* Blueprint Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Blueprint</Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setBlueprintTab('numbers')}
            activeOpacity={0.7}>
            <Text style={[styles.tabText, blueprintTab === 'numbers' && styles.tabTextActive]}>
              Your Numbers
            </Text>
            {blueprintTab === 'numbers' && (
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.tabIndicator}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setBlueprintTab('stars')}
            activeOpacity={0.7}>
            <Text style={[styles.tabText, blueprintTab === 'stars' && styles.tabTextActive]}>
              Your Stars
            </Text>
            {blueprintTab === 'stars' && (
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.tabIndicator}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {blueprintTab === 'numbers' ? (
            <Animated.View entering={FadeIn.duration(300)} style={styles.numbersGrid}>
              {YOUR_NUMBERS.map(item => (
                <TouchableOpacity key={item.label} style={styles.numberCard} activeOpacity={0.8}>
                  <View style={styles.numberCardIcon}>
                    <View style={[styles.numberIcon, {backgroundColor: `${item.color}20`}]}>
                      <View style={[styles.numberIconDot, {backgroundColor: item.color}]} />
                    </View>
                  </View>
                  <Text style={styles.numberLabel}>{item.label}</Text>
                  <Text
                    style={[
                      styles.numberValue,
                      {color: item.color, textShadowColor: `${item.color}66`},
                    ]}>
                    {item.number}
                  </Text>
                  <Text style={styles.numberMeaning}>{item.meaning}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn.duration(300)} style={styles.starsGrid}>
              {YOUR_STARS.map(item => (
                <TouchableOpacity key={item.planet} style={styles.starCard} activeOpacity={0.8}>
                  <Text style={styles.planetSymbol}>{item.planetSymbol}</Text>
                  <View style={styles.signRow}>
                    <Text style={styles.signName}>{item.sign}</Text>
                    <Text style={styles.signSymbol}>{item.signSymbol}</Text>
                  </View>
                  <Text style={styles.planetName}>{item.planet}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}
        </View>
      </View>

      {/* Quick Actions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <ActionCard
          icon="user"
          title="Edit Profile"
          subtitle="Photos, bio, prompts"
          onPress={onEditProfile}
        />
      </View>

      {/* Settings Section */}
      <View style={[styles.section, styles.lastSection]}>
        <ActionCard
          icon="settings"
          title="Settings"
          subtitle="Account, preferences, notifications"
          onPress={onSettings}
        />
      </View>
    </ScrollView>
  )
}

interface ActionCardProps {
  icon: keyof typeof Feather.glyphMap
  title: string
  subtitle: string
  onPress?: () => void
}

function ActionCard({icon, title, subtitle, onPress}: ActionCardProps) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.actionLeft}>
        <View style={styles.actionIconContainer}>
          <Feather name={icon} size={20} color={colors.accentViolet} />
        </View>
        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={18} color="rgba(255, 255, 255, 0.3)" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    alignItems: 'center',
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  photoBorder: {
    width: 106,
    height: 106,
    borderRadius: 53,
    padding: 3,
    shadowColor: colors.accentViolet,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.bgDeep,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 26,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  location: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 4,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  lastSection: {
    marginBottom: 120,
  },
  sectionTitle: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    paddingBottom: 12,
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
  },
  tabContent: {
    minHeight: 220,
    marginTop: 16,
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  numberCard: {
    width: '48%',
    height: 100,
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  numberCardIcon: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  numberIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberIconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  numberLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  numberValue: {
    fontFamily: fonts.serif,
    fontSize: 36,
    fontWeight: '600',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 15,
  },
  numberMeaning: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  starsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  starCard: {
    width: '31%',
    height: 80,
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planetSymbol: {
    fontFamily: fonts.symbols,
    fontSize: 20,
    color: '#FBBF24',
    marginBottom: 4,
  },
  signRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  signName: {
    fontFamily: fonts.serif,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  signSymbol: {
    fontFamily: fonts.symbols,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  planetName: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.3)',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  actionCard: {
    height: 72,
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {},
  actionTitle: {
    fontFamily: fonts.serif,
    fontSize: 17,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  actionSubtitle: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 2,
  },
})
