import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {Feather} from '@expo/vector-icons'
import Animated, {FadeIn, FadeOut, Layout} from 'react-native-reanimated'
import {LinearGradient} from 'expo-linear-gradient'
import type {RootStackParamList} from '../navigation/types'
import {ScreenWrapper} from '../components/ScreenWrapper'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

interface QueueProfile {
  id: number
  name: string
  age: number
  matchPercentage: number
  expiresIn: number
  photo: string
  isRecalculated: boolean
}

const INITIAL_QUEUE: QueueProfile[] = [
  {
    id: 1,
    name: 'Elena',
    age: 26,
    matchPercentage: 92,
    expiresIn: 5,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    isRecalculated: false,
  },
  {
    id: 2,
    name: 'Julian',
    age: 30,
    matchPercentage: 88,
    expiresIn: 2,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    isRecalculated: true,
  },
  {
    id: 3,
    name: 'Aria',
    age: 24,
    matchPercentage: 78,
    expiresIn: 1,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    isRecalculated: false,
  },
]

type SortOption = 'Recent' | 'Match %' | 'Expiring Soon'

type MaybeLaterNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MaybeLaterQueue'>

export function MaybeLaterQueueScreen() {
  const navigation = useNavigation<MaybeLaterNavigationProp>()
  const insets = useSafeAreaInsets()
  const [queue, setQueue] = useState<QueueProfile[]>(INITIAL_QUEUE)
  const [activeSort, setActiveSort] = useState<SortOption>('Recent')

  const handleBack = () => {
    navigation.goBack()
  }

  const handleView = (id: number) => {
    navigation.navigate('FullProfile', {profileId: String(id)})
  }

  const handleResonate = (profile: QueueProfile) => {
    navigation.navigate('ResonateAction', {targetId: String(profile.id), targetName: profile.name})
  }

  const handleRemove = (id: number) => {
    Alert.alert(
      'Remove Profile',
      'Remove from Cosmic Timing queue?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setQueue(prev => prev.filter(item => item.id !== id)),
        },
      ]
    )
  }

  const sortedQueue = [...queue].sort((a, b) => {
    switch (activeSort) {
      case 'Match %':
        return b.matchPercentage - a.matchPercentage
      case 'Expiring Soon':
        return a.expiresIn - b.expiresIn
      case 'Recent':
      default:
        return 0
    }
  })

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return '#10B981'
    if (percentage >= 80) return '#F59E0B'
    return 'white'
  }

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Feather name="arrow-left" size={24} color="rgba(255, 255, 255, 0.8)" />
          </TouchableOpacity>
          <Text style={styles.title}>Cosmic Timing</Text>
          <View style={styles.backButton} />
        </View>
        <Text style={styles.subtitle}>Not aligned now, but the stars shift</Text>

        {/* Sort Bar */}
        <View style={styles.sortBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.sortOptions}>
              {(['Recent', 'Match %', 'Expiring Soon'] as SortOption[]).map(option => (
                <TouchableOpacity
                  key={option}
                  style={[styles.sortOption, activeSort === option && styles.sortOptionActive]}
                  onPress={() => setActiveSort(option)}>
                  <Text
                    style={[
                      styles.sortOptionText,
                      activeSort === option && styles.sortOptionTextActive,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <Text style={styles.queueCount}>{queue.length} of 20 saved</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {queue.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Feather name="clock" size={80} color="rgba(255, 255, 255, 0.2)" />
              <Feather
                name="star"
                size={30}
                color="rgba(139, 92, 246, 0.4)"
                style={styles.sparkleIcon}
              />
            </View>
            <Text style={styles.emptyTitle}>No saved profiles yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap 'Maybe Later' on a match to save them here
            </Text>
          </View>
        ) : (
          /* List */
          <View style={styles.list}>
            {sortedQueue.map(profile => (
              <Animated.View
                key={profile.id}
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(200)}
                layout={Layout.springify()}
                style={styles.card}>
                {/* Photo */}
                <Image source={{uri: profile.photo}} style={styles.cardPhoto} />

                {/* Info */}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>
                    {profile.name}, {profile.age}
                  </Text>

                  <View style={styles.matchRow}>
                    <Text style={[styles.matchPercent, {color: getMatchColor(profile.matchPercentage)}]}>
                      {profile.matchPercentage}%
                    </Text>
                    {profile.isRecalculated && (
                      <View style={styles.improvedBadge}>
                        <Feather name="trending-up" size={8} color="#10B981" />
                        <Text style={styles.improvedText}>Improved</Text>
                      </View>
                    )}
                  </View>

                  <Text
                    style={[
                      styles.expiresText,
                      profile.expiresIn < 2 && styles.expiresTextUrgent,
                    ]}>
                    Expires in {profile.expiresIn} days
                  </Text>
                </View>

                {/* Actions */}
                <View style={styles.cardActions}>
                  {/* View */}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleView(profile.id)}>
                    <Feather name="eye" size={16} color="rgba(255, 255, 255, 0.8)" />
                  </TouchableOpacity>

                  {/* Resonate */}
                  <TouchableOpacity
                    style={styles.resonateActionButton}
                    onPress={() => handleResonate(profile)}>
                    <LinearGradient
                      colors={['#8B5CF6', '#EC4899']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      style={StyleSheet.absoluteFill}
                    />
                    <Feather name="heart" size={14} color="white" />
                  </TouchableOpacity>

                  {/* Remove */}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemove(profile.id)}>
                    <Feather name="x" size={16} color="rgba(255, 255, 255, 0.3)" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginBottom: 24,
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sortOptionActive: {
    backgroundColor: colors.bgMid,
    borderColor: colors.accentViolet,
  },
  sortOptionText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  sortOptionTextActive: {
    color: 'white',
  },
  queueCount: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  sparkleIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  emptyTitle: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
  },
  list: {
    gap: 12,
  },
  card: {
    height: 100,
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardPhoto: {
    width: 76,
    height: 76,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  cardName: {
    fontFamily: fonts.serif,
    fontSize: 18,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matchPercent: {
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: '500',
  },
  improvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  improvedText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: '#10B981',
  },
  expiresText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  expiresTextUrgent: {
    color: '#F59E0B',
  },
  cardActions: {
    gap: 4,
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resonateActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
