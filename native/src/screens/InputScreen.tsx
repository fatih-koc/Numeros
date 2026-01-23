import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import Animated, {FadeIn} from 'react-native-reanimated'
import {ScreenWrapper} from '../components/ScreenWrapper'
import {InputForm} from '../components/InputForm'
import {useEngine} from '../contexts'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'
import type {UserInput} from '../lib/scanOutput'

export function InputScreen() {
  const navigation = useNavigation()
  const {setExtractionParams} = useEngine()

  const handleFormSubmit = (userInput: UserInput) => {
    // Store params for extraction, then go back to Idle
    setExtractionParams(userInput)
    navigation.goBack()
  }

  const handleLogoPress = () => {
    navigation.goBack()
  }

  return (
    <ScreenWrapper>
      <View style={styles.content}>
        {/* Logo */}
        <TouchableOpacity
          onPress={handleLogoPress}
          activeOpacity={0.7}
          style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/numeros_text.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Animated.View entering={FadeIn.duration(500)} style={styles.screenContainer}>
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>IDENTITY INPUT</Text>
            <Text style={styles.statusText}>Enter your human signature</Text>
            <Text style={styles.subStatus}>These values encode how you love</Text>
          </View>

          <InputForm onSubmit={handleFormSubmit} />
        </Animated.View>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  logoContainer: {
    marginBottom: 24,
    opacity: 0.4,
  },
  logo: {
    width: 96,
    height: 32,
    tintColor: colors.textPrimary,
  },
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    width: '100%',
  },
  statusContainer: {
    alignItems: 'center',
    gap: 12,
  },
  statusLabel: {
    fontFamily: fonts.mono,
    fontSize: 14,
    letterSpacing: 4,
    color: colors.textDim,
  },
  statusText: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.textSecondary,
    fontFamily: fonts.serif,
  },
  subStatus: {
    fontSize: 16,
    color: colors.textDim,
    fontFamily: fonts.serifItalic,
  },
})
