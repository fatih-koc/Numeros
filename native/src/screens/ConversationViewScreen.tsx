import React, {useState, useRef, useEffect} from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
  Modal,
  Pressable,
} from 'react-native'
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {Feather} from '@expo/vector-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
} from 'react-native-reanimated'
import {LinearGradient} from 'expo-linear-gradient'
import type {RootStackParamList} from '../navigation/types'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface Message {
  id: string
  sender: 'me' | 'them'
  text: string
  timestamp: string
  type: 'text' | 'image' | 'voice'
  isInsight?: boolean
  insightType?: 'insight' | 'growth'
  insightText?: string
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'them',
    text: "Hey! I saw we're both Life Path numbers. That's intense energy to match with!",
    timestamp: '10:23 AM',
    type: 'text',
  },
  {
    id: '2',
    sender: 'me',
    text: "Tell me about it. I usually feel like I'm too much for people, but maybe not for you?",
    timestamp: '10:25 AM',
    type: 'text',
  },
  {
    id: '3',
    sender: 'them',
    text: 'Never too much. I thrive on that depth.',
    timestamp: '10:26 AM',
    type: 'text',
  },
  {
    id: 'insight-1',
    sender: 'them',
    text: '',
    timestamp: '',
    type: 'text',
    isInsight: true,
    insightType: 'insight',
    insightText: 'You both share a love for deep conversations. Ask about her philosophical views.',
  },
  {
    id: '4',
    sender: 'me',
    text: "What's the most philosophical thing you've thought about today?",
    timestamp: '10:30 AM',
    type: 'text',
  },
]

const COMPATIBILITY_ITEMS = [
  {label: 'Life Path', score: '18/20', color: '#F59E0B', pct: 90},
  {label: 'Soul Urge', score: '17/20', color: '#06B6D4', pct: 85},
  {label: 'Expression', score: '14/20', color: '#10B981', pct: 70},
  {label: 'Personality', score: '12/20', color: '#F472B6', pct: 60},
]

type ConversationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Conversation'>
type ConversationRouteProp = RouteProp<RootStackParamList, 'Conversation'>

export function ConversationViewScreen() {
  const navigation = useNavigation<ConversationNavigationProp>()
  const route = useRoute<ConversationRouteProp>()
  const insets = useSafeAreaInsets()
  const scrollViewRef = useRef<ScrollView>(null)

  const {conversationId, name = 'Sarah', imageUrl} = route.params || {}
  const targetAge = 28
  const matchScore = 94
  const isOnline = true

  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isBannerExpanded, setIsBannerExpanded] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const handleBack = () => {
    navigation.goBack()
  }

  const handleViewProfile = () => {
    setIsMenuOpen(false)
    navigation.navigate('FullProfile', {profileId: conversationId})
  }

  const toggleBanner = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setIsBannerExpanded(!isBannerExpanded)
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true})
    }, 100)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isBannerExpanded])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
      type: 'text',
    }

    setMessages(prev => [...prev, newMsg])
    setInputValue('')

    // Simulate reply
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'them',
          text: "That's a fascinating perspective. I hadn't looked at it that way.",
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
          type: 'text',
        },
      ])
    }, 3000)
  }

  const renderMessage = (msg: Message, index: number) => {
    if (msg.isInsight) {
      return (
        <View key={msg.id} style={styles.insightCard}>
          <TouchableOpacity style={styles.insightClose}>
            <Feather name="x" size={14} color="rgba(255, 255, 255, 0.3)" />
          </TouchableOpacity>
          <View style={styles.insightIcon}>
            <Feather
              name={msg.insightType === 'growth' ? 'sun' : 'star'}
              size={18}
              color="#FBBF24"
            />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightLabel}>
              {msg.insightType === 'growth' ? 'GROWTH AREA' : 'NUMEROS INSIGHT'}
            </Text>
            <Text style={styles.insightText}>{msg.insightText}</Text>
          </View>
        </View>
      )
    }

    const isMe = msg.sender === 'me'
    const showAvatar =
      !isMe && (index === 0 || messages[index - 1].sender === 'me' || messages[index - 1].isInsight)

    return (
      <View key={msg.id} style={[styles.messageRow, isMe && styles.messageRowMe]}>
        {!isMe && (
          <View style={styles.avatarColumn}>
            {showAvatar ? (
              <Image
                source={{
                  uri:
                    imageUrl ||
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
                }}
                style={styles.messageAvatar}
              />
            ) : (
              <View style={styles.avatarSpacer} />
            )}
          </View>
        )}

        <View style={[styles.messageContainer, isMe && styles.messageContainerMe]}>
          {isMe ? (
            <LinearGradient
              colors={['#8B5CF6', '#6366F1']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={[styles.messageBubble, styles.messageBubbleMe]}>
              <Text style={styles.messageTextMe}>{msg.text}</Text>
            </LinearGradient>
          ) : (
            <View style={[styles.messageBubble, styles.messageBubbleThem]}>
              <Text style={styles.messageTextThem}>{msg.text}</Text>
            </View>
          )}
          <Text style={[styles.messageTime, isMe && styles.messageTimeMe]}>{msg.timestamp}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Feather name="arrow-left" size={24} color="rgba(255, 255, 255, 0.8)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerCenter} onPress={handleViewProfile}>
          <View style={styles.headerAvatar}>
            <Image
              source={{
                uri:
                  imageUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
              }}
              style={styles.headerPhoto}
            />
            {isOnline && <View style={styles.onlineIndicator} />}
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.headerNameRow}>
              <Text style={styles.headerName}>
                {name}, {targetAge}
              </Text>
              <Text style={styles.headerMatch}>{matchScore}%</Text>
            </View>
            <Text style={styles.headerStatus}>{isOnline ? 'Online now' : 'Active 2h ago'}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => setIsMenuOpen(true)}>
          <Feather name="more-vertical" size={24} color="rgba(255, 255, 255, 0.5)" />
        </TouchableOpacity>
      </View>

      {/* Compatibility Banner */}
      <View style={styles.bannerContainer}>
        <TouchableOpacity style={styles.bannerHeader} onPress={toggleBanner}>
          <View style={styles.bannerTitleRow}>
            <Feather name="star" size={14} color="#FBBF24" />
            <Text style={styles.bannerTitle}>Why You Resonate</Text>
          </View>
          <Feather
            name={isBannerExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="rgba(255, 255, 255, 0.4)"
          />
        </TouchableOpacity>

        {isBannerExpanded && (
          <View style={styles.bannerContent}>
            <View style={styles.compatibilityGrid}>
              {COMPATIBILITY_ITEMS.map((item, i) => (
                <View key={i} style={styles.compatibilityItem}>
                  <View style={styles.compatibilityHeader}>
                    <Text style={styles.compatibilityLabel}>{item.label}</Text>
                    <Text style={styles.compatibilityScore}>{item.score}</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[styles.progressFill, {width: `${item.pct}%`, backgroundColor: item.color}]}
                    />
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.tagsRow}>
              <View style={styles.tag}>
                <Text style={styles.tagStar}>✦</Text>
                <Text style={styles.tagText}>Your 5 grounds her 3</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagStar}>✦</Text>
                <Text style={styles.tagText}>Venus △ Moon harmony</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}>
          {/* Date Divider */}
          <View style={styles.dateDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>TODAY</Text>
            <View style={styles.dividerLine} />
          </View>

          {messages.map((msg, index) => renderMessage(msg, index))}

          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* Input Bar */}
        <View style={[styles.inputBar, {paddingBottom: Math.max(insets.bottom, 16)}]}>
          <View style={styles.inputContainer}>
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Type a message..."
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              style={styles.textInput}
              multiline
              maxLength={1000}
            />
          </View>

          <TouchableOpacity
            style={[styles.sendButton, inputValue.trim() && styles.sendButtonActive]}
            onPress={handleSend}
            disabled={!inputValue.trim()}>
            {inputValue.trim() ? (
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={StyleSheet.absoluteFill}
              />
            ) : null}
            <Feather name="send" size={18} color={inputValue.trim() ? 'white' : 'rgba(255, 255, 255, 0.3)'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Menu Modal */}
      <Modal visible={isMenuOpen} transparent animationType="fade" onRequestClose={() => setIsMenuOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setIsMenuOpen(false)}>
          <View style={[styles.menuContainer, {top: insets.top + 50}]}>
            <TouchableOpacity style={styles.menuItem} onPress={handleViewProfile}>
              <Text style={styles.menuItemText}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} onPress={() => setIsMenuOpen(false)}>
              <Text style={styles.menuItemText}>Mute Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setIsMenuOpen(false)}>
              <Text style={styles.menuItemTextDanger}>Unmatch & Report</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

function TypingIndicator() {
  const dot1Opacity = useSharedValue(0.3)
  const dot2Opacity = useSharedValue(0.3)
  const dot3Opacity = useSharedValue(0.3)

  useEffect(() => {
    dot1Opacity.value = withRepeat(
      withSequence(withTiming(1, {duration: 400}), withTiming(0.3, {duration: 400})),
      -1,
      false
    )
    dot2Opacity.value = withDelay(
      200,
      withRepeat(withSequence(withTiming(1, {duration: 400}), withTiming(0.3, {duration: 400})), -1, false)
    )
    dot3Opacity.value = withDelay(
      400,
      withRepeat(withSequence(withTiming(1, {duration: 400}), withTiming(0.3, {duration: 400})), -1, false)
    )
  }, [])

  const dot1Style = useAnimatedStyle(() => ({opacity: dot1Opacity.value}))
  const dot2Style = useAnimatedStyle(() => ({opacity: dot2Opacity.value}))
  const dot3Style = useAnimatedStyle(() => ({opacity: dot3Opacity.value}))

  return (
    <View style={styles.typingRow}>
      <View style={styles.avatarColumn}>
        <View style={styles.avatarSpacer} />
      </View>
      <View style={styles.typingBubble}>
        <Animated.View style={[styles.typingDot, dot1Style]} />
        <Animated.View style={[styles.typingDot, dot2Style]} />
        <Animated.View style={[styles.typingDot, dot3Style]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    position: 'relative',
  },
  headerPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.4)',
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
  headerInfo: {
    alignItems: 'flex-start',
  },
  headerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerName: {
    fontFamily: fonts.serif,
    fontSize: 18,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  headerMatch: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: '#10B981',
  },
  headerStatus: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContainer: {
    backgroundColor: colors.bgMid,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.2)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerTitle: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  bannerContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  compatibilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  compatibilityItem: {
    width: '47%',
  },
  compatibilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  compatibilityLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  compatibilityScore: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
  },
  tagStar: {
    color: '#FBBF24',
    fontSize: 10,
  },
  tagText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  chatContainer: {
    flex: 1,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  dateDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    width: 64,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 12,
    letterSpacing: 1,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  avatarColumn: {
    width: 32,
    marginRight: 8,
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarSpacer: {
    width: 24,
    height: 24,
  },
  messageContainer: {
    maxWidth: '75%',
    alignItems: 'flex-start',
  },
  messageContainerMe: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  messageBubbleMe: {
    borderTopRightRadius: 4,
  },
  messageBubbleThem: {
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: 4,
  },
  messageTextMe: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },
  messageTextThem: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  messageTime: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.3)',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  messageTimeMe: {
    textAlign: 'right',
  },
  insightCard: {
    marginVertical: 16,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    position: 'relative',
  },
  insightClose: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  insightIcon: {
    marginTop: 2,
  },
  insightContent: {
    flex: 1,
    paddingRight: 20,
  },
  insightLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: '#FBBF24',
    letterSpacing: 1,
    marginBottom: 4,
  },
  insightText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  typingRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.bgMid,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
  },
  textInput: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'white',
    padding: 0,
    minHeight: 24,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 2,
  },
  sendButtonActive: {
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    right: 16,
    width: 192,
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemBorder: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuItemText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  menuItemTextDanger: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: '#EF4444',
  },
})
