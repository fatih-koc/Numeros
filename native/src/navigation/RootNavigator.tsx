import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {SplashScreen, IdleScreen, InputScreen, BlueprintScreen, YourDayPreviewScreen} from '../screens'
import type {RootStackParamList} from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 300,
          contentStyle: {backgroundColor: 'transparent'},
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Idle" component={IdleScreen} />
        <Stack.Screen name="Input" component={InputScreen} />
        <Stack.Screen name="Blueprint" component={BlueprintScreen} />
        <Stack.Screen name="YourDayPreview" component={YourDayPreviewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
