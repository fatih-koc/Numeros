import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native'
import {Feather} from '@expo/vector-icons'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface IncomingProfile {
  id: string
  imageUrl: string
  lpNumber: number
  sunSign: string
  isNew: boolean
}

interface StarredProfile {
  id: string
  imageUrl: string
}

interface Conversation {
  id: string
  name: string
  age: number
  imageUrl: string
  lastMessage: string
  matchPercentage: number
  timestamp: string
  unreadCount: number
  isOnline: boolean
  isTyping: boolean
}

interface CosmicProfile {
  id: string
  imageUrl: string
  daysLeft: number
}

const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
]

const MOCK_INCOMING: IncomingProfile[] = [
  {id: 'i1', imageUrl: IMAGE_POOL[0], lpNumber: 5, sunSign: 'H', isNew: true},
  {id: 'i2', imageUrl: IMAGE_POOL[1], lpNumber: 7, sunSign: 'L', isNew: false},
  {id: 'i3', imageUrl: IMAGE_POOL[2], lpNumber: 3, sunSign: 'I', isNew: true},
  {id: 'i4', imageUrl: IMAGE_POOL[3], lpNumber: 9, sunSign: 'D', isNew: false},
]

const MOCK_STARRED: StarredProfile[] = Array.from({length: 8}).map((_, i) => ({
  id: `s${i}`,
  imageUrl: IMAGE_POOL[i % IMAGE_POOL.length],
}))

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    name: 'Sarah',
    age: 28,
    imageUrl: IMAGE_POOL[4],
    lastMessage: "That's so interesting! I've always felt that way too.",
    matchPercentage: 94,
    timestamp: '2m ago',
    unreadCount: 3,
    isOnline: true,
    isTyping: false,
  },
  {
    id: 'c2',
    name: 'Marcus',
    age: 31,
    imageUrl: IMAGE_POOL[5],
    lastMessage: '...',
    matchPercentage: 88,
    timestamp: '1h ago',
    unreadCount: 0,
    isOnline: false,
    isTyping: true,
  },
  {
    id: 'c3',
    name: 'Elena',
    age: 26,
    imageUrl: IMAGE_POOL[6],
    lastMessage: "Let's meet up when the moon is full.",
    matchPercentage: 82,
    timestamp: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    isTyping: false,
  },
]

const MOCK_COSMIC: CosmicProfile[] = [
  {id: 't1', imageUrl: IMAGE_POOL[0], daysLeft: 5},
  {id: 't2', imageUrl: IMAGE_POOL[1], daysLeft: 1},
  {id: 't3', imageUrl: IMAGE_POOL[2], daysLeft: 3},
]

interface MessagesTabProps {
  onChatSelect?: (id: string) => void
  onProfileSelect?: (id: string) => void
  onReveal?: (id: string) => void
}

export function MessagesTab({onChatSelect, onProfileSelect, onReveal}: MessagesTabProps) {
  const [starredExpanded, setStarredExpanded] = useState(true)
  const [cosmicExpanded, setCosmicExpanded] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)

  const toggleStarred = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setStarredExpanded(!starredExpanded)
  }

  const toggleCosmic = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setCosmicExpanded(!cosmicExpanded)
  }

  const handleLongPress = (id: string) => {
    setSelectedChatId(id)
    setMenuVisible(true)
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      {/* Section 1: Incoming Resonances */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>People who resonate with you</Text>
          <Text style={styles.sectionCount}>({MOCK_INCOMING.length})</Text>
        </View>

        {MOCK_INCOMING.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}>
            {MOCK_INCOMING.map(profile => (
              <TouchableOpacity
                key={profile.id}
                style={styles.incomingCard}
                onPress={() => onReveal?.(profile.id)}
                activeOpacity={0.8}>
                <Image
                  source={{uri: profile.imageUrl}}
                  style={styles.incomingImage}
                  blurRadius={2}
                />
                <View style={styles.incomingGradient} />

                {/* LP Badge */}
                <View style={styles.lpBadge}>
                  <Text style={styles.lpBadgeText}>{profile.lpNumber}</Text>
                </View>

                {/* Sun Sign */}
                <Text style={styles.sunSign}>{profile.sunSign}</Text>

                {/* New Indicator */}
                {profile.isNew && <View style={styles.newIndicator} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptySection}>
            <Feather name="heart" size={32} color="white" />
            <Text style={styles.emptyText}>No incoming resonances yet</Text>
          </View>
        )}
      </View>

      {/* Section 2: Starred */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.collapsibleHeader} onPress={toggleStarred}>
          <View style={styles.collapsibleLeft}>
            <Feather name="star" size={12} color="#FBBF24" />
            <Text style={styles.sectionTitle}>Starred</Text>
            <Text style={styles.sectionCountDim}>({MOCK_STARRED.length})</Text>
          </View>
          <Feather
            name={starredExpanded ? 'chevron-up' : 'chevron-down'}
            size={14}
            color="rgba(255, 255, 255, 0.3)"
          />
        </TouchableOpacity>

        {starredExpanded && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}>
            {MOCK_STARRED.map(profile => (
              <TouchableOpacity
                key={profile.id}
                style={styles.starredItem}
                onPress={() => onProfileSelect?.(profile.id)}
                activeOpacity={0.8}>
                <Image source={{uri: profile.imageUrl}} style={styles.starredImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Section 3: Mutual Resonances */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mutual Resonances</Text>
        </View>

        {MOCK_CONVERSATIONS.length > 0 ? (
          MOCK_CONVERSATIONS.map(chat => (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatItem}
              onPress={() => onChatSelect?.(chat.id)}
              onLongPress={() => handleLongPress(chat.id)}
              activeOpacity={0.7}>
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                <View style={styles.avatarBorder}>
                  <Image source={{uri: chat.imageUrl}} style={styles.avatar} />
                </View>
                {chat.isOnline && <View style={styles.onlineIndicator} />}
              </View>

              {/* Info */}
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text
                    style={[
                      styles.chatName,
                      chat.unreadCount > 0 && styles.chatNameBold,
                    ]}>
                    {chat.name}, {chat.age}
                  </Text>
                  <Text style={styles.chatTimestamp}>{chat.timestamp}</Text>
                </View>
                <View style={styles.chatFooter}>
                  <Text
                    style={[
                      styles.chatMessage,
                      chat.unreadCount > 0 && styles.chatMessageUnread,
                    ]}
                    numberOfLines={1}>
                    {chat.isTyping ? '...' : chat.lastMessage}
                  </Text>
                  <View style={styles.chatMeta}>
                    <Text style={styles.matchPercent}>{chat.matchPercentage}%</Text>
                    {chat.unreadCount > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{chat.unreadCount}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptySectionLarge}>
            <Feather name="message-circle" size={48} color="white" />
            <Text style={styles.emptyTitleLarge}>
              Start a conversation when the stars align
            </Text>
            <Text style={styles.emptyText}>Mutual resonances will appear here</Text>
          </View>
        )}
      </View>

      {/* Section 4: Cosmic Timing */}
      <View style={[styles.section, styles.lastSection]}>
        <TouchableOpacity style={styles.collapsibleHeader} onPress={toggleCosmic}>
          <View style={styles.collapsibleLeft}>
            <Feather name="clock" size={12} color="rgba(255, 255, 255, 0.5)" />
            <Text style={styles.sectionTitle}>Cosmic Timing</Text>
            <Text style={styles.sectionCountDim}>({MOCK_COSMIC.length})</Text>
          </View>
          <Feather
            name={cosmicExpanded ? 'chevron-up' : 'chevron-down'}
            size={14}
            color="rgba(255, 255, 255, 0.3)"
          />
        </TouchableOpacity>

        {cosmicExpanded && (
          <View style={styles.cosmicContent}>
            {MOCK_COSMIC.map(profile => (
              <View key={profile.id} style={styles.cosmicItem}>
                <View style={styles.cosmicImageContainer}>
                  <Image source={{uri: profile.imageUrl}} style={styles.cosmicImage} />
                </View>
                <Text
                  style={[
                    styles.cosmicDays,
                    profile.daysLeft < 2 && styles.cosmicDaysUrgent,
                  ]}>
                  {profile.daysLeft}d left
                </Text>
              </View>
            ))}
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See all →</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Context Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem}>
              <Feather name="user" size={14} color="rgba(255, 255, 255, 0.9)" />
              <Text style={styles.menuText}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Feather name="volume-x" size={14} color="rgba(255, 255, 255, 0.9)" />
              <Text style={styles.menuText}>Mute Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Feather name="archive" size={14} color="rgba(255, 255, 255, 0.9)" />
              <Text style={styles.menuText}>Archive Chat</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem}>
              <Feather name="flag" size={14} color="#EF4444" />
              <Text style={[styles.menuText, styles.menuTextDanger]}>Report User</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  section: {
    marginTop: 8,
  },
  lastSection: {
    marginBottom: 120,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionCount: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(139, 92, 246, 0.8)',
    fontWeight: 'bold',
  },
  sectionCountDim: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  collapsibleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  horizontalScroll: {
    paddingHorizontal: 24,
    gap: 12,
    paddingBottom: 16,
  },
  incomingCard: {
    width: 80,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  incomingImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  incomingGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  lpBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lpBadgeText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  sunSign: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    fontFamily: fonts.symbols,
    fontSize: 14,
    color: 'white',
  },
  newIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EC4899',
  },
  emptySection: {
    alignItems: 'center',
    paddingVertical: 16,
    opacity: 0.6,
  },
  emptySectionLarge: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
    opacity: 0.6,
  },
  emptyTitleLarge: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: 'white',
    marginTop: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'white',
    marginTop: 8,
  },
  starredItem: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(251, 191, 36, 0.4)',
    padding: 2,
  },
  starredImage: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
    resizeMode: 'cover',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarBorder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    resizeMode: 'cover',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: colors.bgDeep,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  chatName: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.textPrimary,
  },
  chatNameBold: {
    fontWeight: '600',
  },
  chatTimestamp: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessage: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  chatMessageUnread: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  chatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matchPercent: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: '#10B981',
  },
  unreadBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EC4899',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  cosmicContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 16,
  },
  cosmicItem: {
    alignItems: 'center',
    gap: 4,
  },
  cosmicImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 2,
    opacity: 0.6,
  },
  cosmicImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    resizeMode: 'cover',
  },
  cosmicDays: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  cosmicDaysUrgent: {
    color: '#F59E0B',
  },
  seeAllButton: {
    justifyContent: 'center',
    height: 48,
  },
  seeAllText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.accentViolet,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: colors.bgMid,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 180,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  menuTextDanger: {
    color: '#EF4444',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
})
