import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {Feather} from '@expo/vector-icons'
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated'
import type {RootStackParamList} from '../navigation/types'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

type SettingsNavigationProp = NativeStackNavigationProp<RootStackParamList>

export function SettingsScreen() {
  const navigation = useNavigation<SettingsNavigationProp>()
  const insets = useSafeAreaInsets()

  const [toggles, setToggles] = useState({
    womenFirst: false,
    onlyVerified: false,
    pushNotifications: true,
    newMatches: true,
    newMessages: true,
    dailyForecast: true,
    emailNotifications: false,
  })

  const handleBack = () => {
    navigation.goBack()
  }

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({...prev, [key]: !prev[key]}))
  }

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Log Out', style: 'destructive', onPress: () => console.log('Logged out')},
    ])
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => console.log('Account deleted'),
        },
      ]
    )
  }

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Feather name="arrow-left" size={20} color="rgba(255, 255, 255, 0.6)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsGroup>
            <SettingsRow icon="mail" label="Email" value="alex@email.com" onPress={() => {}} />
            <SettingsRow
              icon="phone"
              label="Phone"
              value="+90 555 *** **42"
              onPress={() => {}}
              hasDivider
            />
            <SettingsRow
              icon="lock"
              label="Password"
              value="••••••••"
              onPress={() => {}}
              hasDivider
            />
            <SettingsRow
              icon="link"
              label="Linked Accounts"
              value="Google, Apple"
              onPress={() => {}}
              hasDivider
            />
          </SettingsGroup>
        </SettingsSection>

        {/* Conversation Control */}
        <SettingsSection title="Conversation Control">
          <SettingsGroup>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleLeft}>
                <Feather name="shield" size={20} color="rgba(255, 255, 255, 0.5)" />
                <Text style={styles.toggleLabel}>Only I can start conversations</Text>
              </View>
              <Switch
                value={toggles.womenFirst}
                onValueChange={() => handleToggle('womenFirst')}
                trackColor={{false: 'rgba(255, 255, 255, 0.1)', true: colors.accentViolet}}
                thumbColor="white"
              />
            </View>
            <Text style={styles.toggleDescription}>
              When enabled, matches must wait for you to message first
            </Text>
          </SettingsGroup>
        </SettingsSection>

        {/* Dating Preferences */}
        <SettingsSection title="Dating Preferences">
          <SettingsGroup>
            <SettingsRow icon="users" label="Show Me" value="Women" onPress={() => {}} />
            <SettingsRow
              icon="calendar"
              label="Age Range"
              value="24 - 35"
              onPress={() => {}}
              hasDivider
            />
            <SettingsRow
              icon="map-pin"
              label="Maximum Distance"
              value="25 km"
              onPress={() => {}}
              hasDivider
            />
            <View style={[styles.toggleContainer, styles.toggleContainerWithDivider]}>
              <View style={styles.toggleLeft}>
                <Feather name="shield" size={20} color="rgba(255, 255, 255, 0.5)" />
                <Text style={styles.toggleLabel}>Only show verified profiles</Text>
              </View>
              <Switch
                value={toggles.onlyVerified}
                onValueChange={() => handleToggle('onlyVerified')}
                trackColor={{false: 'rgba(255, 255, 255, 0.1)', true: colors.accentViolet}}
                thumbColor="white"
              />
            </View>
          </SettingsGroup>
        </SettingsSection>

        {/* Privacy */}
        <SettingsSection title="Privacy">
          <SettingsGroup>
            <SettingsRow icon="eye" label="Profile Visibility" value="Visible" onPress={() => {}} />
            <SettingsRow
              icon="slash"
              label="Blocked Users"
              value="3 blocked"
              onPress={() => {}}
              hasDivider
            />
          </SettingsGroup>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications">
          <SettingsGroup>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleLeft}>
                <Feather name="bell" size={20} color="rgba(255, 255, 255, 0.5)" />
                <Text style={styles.toggleLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={toggles.pushNotifications}
                onValueChange={() => handleToggle('pushNotifications')}
                trackColor={{false: 'rgba(255, 255, 255, 0.1)', true: colors.accentViolet}}
                thumbColor="white"
              />
            </View>

            {toggles.pushNotifications && (
              <>
                <SubToggleRow
                  icon="heart"
                  label="New Matches"
                  isOn={toggles.newMatches}
                  onToggle={() => handleToggle('newMatches')}
                />
                <SubToggleRow
                  icon="message-circle"
                  label="New Messages"
                  isOn={toggles.newMessages}
                  onToggle={() => handleToggle('newMessages')}
                />
                <SubToggleRow
                  icon="sun"
                  label="Daily Forecast"
                  isOn={toggles.dailyForecast}
                  onToggle={() => handleToggle('dailyForecast')}
                />
              </>
            )}

            <View style={[styles.toggleContainer, styles.toggleContainerWithDivider]}>
              <View style={styles.toggleLeft}>
                <Feather name="mail" size={20} color="rgba(255, 255, 255, 0.5)" />
                <Text style={styles.toggleLabel}>Email Notifications</Text>
              </View>
              <Switch
                value={toggles.emailNotifications}
                onValueChange={() => handleToggle('emailNotifications')}
                trackColor={{false: 'rgba(255, 255, 255, 0.1)', true: colors.accentViolet}}
                thumbColor="white"
              />
            </View>

            <SettingsRow
              icon="moon"
              label="Quiet Hours"
              value="11 PM - 7 AM"
              onPress={() => {}}
              hasDivider
            />
          </SettingsGroup>
        </SettingsSection>

        {/* Support & Legal */}
        <SettingsSection title="Support & Legal">
          <SettingsGroup>
            <SettingsRow icon="help-circle" label="Help Center" onPress={() => {}} />
            <SettingsRow icon="headphones" label="Contact Support" onPress={() => {}} hasDivider />
            <SettingsRow
              icon="file-text"
              label="Privacy Policy"
              onPress={() => {}}
              hasDivider
              isExternal
            />
            <SettingsRow
              icon="file-text"
              label="Terms of Service"
              onPress={() => {}}
              hasDivider
              isExternal
            />
          </SettingsGroup>
        </SettingsSection>

        {/* Danger Zone */}
        <View style={styles.dangerZone}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Numeros v4.0.1 (build 142)</Text>
        </View>
      </ScrollView>
    </View>
  )
}

function SettingsSection({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  )
}

function SettingsGroup({children}: {children: React.ReactNode}) {
  return <View style={styles.group}>{children}</View>
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  hasDivider = false,
  isExternal = false,
}: {
  icon: string
  label: string
  value?: string
  onPress: () => void
  hasDivider?: boolean
  isExternal?: boolean
}) {
  return (
    <TouchableOpacity
      style={[styles.row, hasDivider && styles.rowWithDivider]}
      onPress={onPress}>
      <View style={styles.rowLeft}>
        <Feather name={icon as any} size={20} color="rgba(255, 255, 255, 0.5)" />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        <Feather
          name={isExternal ? 'external-link' : 'chevron-right'}
          size={16}
          color="rgba(255, 255, 255, 0.3)"
        />
      </View>
    </TouchableOpacity>
  )
}

function SubToggleRow({
  icon,
  label,
  isOn,
  onToggle,
}: {
  icon: string
  label: string
  isOn: boolean
  onToggle: () => void
}) {
  return (
    <View style={styles.subToggleContainer}>
      <View style={styles.subToggleLeft}>
        <Feather name={icon as any} size={16} color="rgba(255, 255, 255, 0.4)" />
        <Text style={styles.subToggleLabel}>{label}</Text>
      </View>
      <Switch
        value={isOn}
        onValueChange={onToggle}
        trackColor={{false: 'rgba(255, 255, 255, 0.1)', true: colors.accentViolet}}
        thumbColor="white"
        style={styles.subToggleSwitch}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 60,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 1,
    marginBottom: 8,
    paddingLeft: 4,
  },
  group: {
    backgroundColor: colors.bgMid,
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    minHeight: 52,
  },
  rowWithDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rowLabel: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 52,
  },
  toggleContainerWithDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  toggleLabel: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  toggleDescription: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 48,
    paddingBottom: 16,
    lineHeight: 16,
  },
  subToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingRight: 16,
    paddingLeft: 48,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  subToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subToggleLabel: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  subToggleSwitch: {
    transform: [{scale: 0.85}],
  },
  dangerZone: {
    marginTop: 32,
    paddingHorizontal: 16,
    gap: 12,
  },
  logoutButton: {
    height: 52,
    backgroundColor: colors.bgMid,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  deleteButton: {
    height: 52,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: '#EF4444',
  },
  footer: {
    marginTop: 32,
    marginBottom: 16,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.3)',
  },
})
