import React, {useEffect} from 'react'
import {StyleSheet, TouchableOpacity, Image, Alert, ScrollView} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import Animated, {FadeIn} from 'react-native-reanimated'
import {ScreenWrapper} from '../components/ScreenWrapper'
import {ChartTabs} from '../components/ChartTabs'
import {useNumerology, useEngine} from '../contexts'
import {colors} from '../lib/colors'
import type {RootStackParamList} from '../navigation/types'

type BlueprintNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Blueprint'>

export function BlueprintScreen() {
  const navigation = useNavigation<BlueprintNavigationProp>()
  const {scanOutput, clearScanOutput} = useNumerology()
  const {resetEngine} = useEngine()

  const handleSearchResonance = () => {
    Alert.alert(
      'Coming Soon',
      'Universe scan would begin here...\n\nThis prototype shows the extraction ritual. The full app would continue to the scanning and matching screens.',
      [{text: 'OK'}],
    )
  }

  const handleUpgradeChart = () => {
    clearScanOutput()
    resetEngine()
    navigation.navigate('Input')
  }

  const handleLogoPress = () => {
    clearScanOutput()
    resetEngine()
    navigation.popToTop()
  }

  // Navigate back if no data (must be in useEffect to avoid setState during render)
  useEffect(() => {
    if (!scanOutput) {
      navigation.goBack()
    }
  }, [scanOutput, navigation])

  if (!scanOutput) {
    return null
  }

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
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
          <ChartTabs
            scanData={scanOutput}
            onSearch={handleSearchResonance}
            onUpgrade={handleUpgradeChart}
          />
        </Animated.View>
      </ScrollView>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
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
    alignItems: 'center',
    width: '100%',
  },
})
