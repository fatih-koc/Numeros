import React from 'react'
import {StyleSheet, View, ActivityIndicator} from 'react-native'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {useFonts} from 'expo-font'
import {RootNavigator} from './src/navigation'
import {NumerologyProvider, EngineProvider} from './src/contexts'
import {colors} from './src/lib/colors'
import {fontAssets} from './src/lib/fonts'

export default function App() {
  const [fontsLoaded] = useFonts(fontAssets)

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accentViolet} />
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NumerologyProvider>
          <EngineProvider>
            <RootNavigator />
          </EngineProvider>
        </NumerologyProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
})
