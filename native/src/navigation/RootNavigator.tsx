import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {IdleScreen, InputScreen, BlueprintScreen} from '../screens'
import type {RootStackParamList} from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Idle"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 300,
          contentStyle: {backgroundColor: 'transparent'},
        }}>
        <Stack.Screen name="Idle" component={IdleScreen} />
        <Stack.Screen name="Input" component={InputScreen} />
        <Stack.Screen name="Blueprint" component={BlueprintScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
