import type {NativeStackScreenProps} from '@react-navigation/native-stack'

export type RootStackParamList = {
  Idle: undefined
  Input: undefined
  Blueprint: undefined
}

export type IdleScreenProps = NativeStackScreenProps<RootStackParamList, 'Idle'>
export type InputScreenProps = NativeStackScreenProps<RootStackParamList, 'Input'>
export type BlueprintScreenProps = NativeStackScreenProps<RootStackParamList, 'Blueprint'>

// For useNavigation hook type safety
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
