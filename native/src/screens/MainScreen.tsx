import React, {useState} from 'react'
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import type {RootStackParamList, TabId} from '../navigation/types'
import {MainShell, OrbState} from './MainShell'
import {YourDayTab, DiscoverTab, MessagesTab, ProfileTab} from '../components'

type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>
type MainScreenRouteProp = RouteProp<RootStackParamList, 'Main'>

export function MainScreen() {
  const navigation = useNavigation<MainScreenNavigationProp>()
  const route = useRoute<MainScreenRouteProp>()

  const [activeTab, setActiveTab] = useState<TabId>(route.params?.initialTab || 'your_day')
  const [orbState, setOrbState] = useState<OrbState>('idle')

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab)
  }

  const handleOrbClick = () => {
    if (orbState === 'idle') {
      setOrbState('scanning')
      // Simulate scan
      setTimeout(() => {
        setOrbState('cooldown')
        // Navigate to results or show matches
        navigation.navigate('ResonanceResults')
      }, 2000)
    }
  }

  const handleNavigateToProfile = (profileId: string) => {
    navigation.navigate('FullProfile', {profileId})
  }

  const handleNavigateToConversation = (conversationId: string, name: string, imageUrl: string) => {
    navigation.navigate('Conversation', {conversationId, name, imageUrl})
  }

  const handleNavigateToMaybeLater = () => {
    navigation.navigate('MaybeLaterQueue')
  }

  const handleNavigateToSettings = () => {
    navigation.navigate('Settings')
  }

  const handleNavigateToProfileEditor = () => {
    navigation.navigate('ProfileEditor')
  }

  const handleChatSelect = (id: string) => {
    // Find conversation details from mock data or state
    handleNavigateToConversation(id, 'User', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'your_day':
        return <YourDayTab />
      case 'discover':
        return (
          <DiscoverTab
            onViewProfile={handleNavigateToProfile}
          />
        )
      case 'messages':
        return (
          <MessagesTab
            onChatSelect={handleChatSelect}
            onProfileSelect={handleNavigateToProfile}
          />
        )
      case 'profile':
        return (
          <ProfileTab
            onEditProfile={handleNavigateToProfileEditor}
            onSettings={handleNavigateToSettings}
          />
        )
      default:
        return <YourDayTab />
    }
  }

  return (
    <MainShell
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onOrbClick={handleOrbClick}
      orbState={orbState}
      badges={{your_day: true, messages: 3, discover: false}}>
      {renderTabContent()}
    </MainShell>
  )
}
