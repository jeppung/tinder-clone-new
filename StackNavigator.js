import { View, Text } from 'react-native'
import React from 'react'
import useAuth from './hooks/useAuth'
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ChatScreen from './screens/ChatScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ModalScreen from './screens/ModalScreen';
import MatchedScreen from './screens/MatchedScreen';
import MessageScreen from './screens/MessageScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {

    const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? (
            <>
                <Stack.Group>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Chat" component={ChatScreen} options={{animation: 'slide_from_right'}}/>
                    <Stack.Screen name="Message" component={MessageScreen} options={{animation: 'slide_from_right'}}/>
                </Stack.Group>
                <Stack.Group screenOptions={{presentation: 'modal', animation: 'slide_from_bottom'}}>
                    <Stack.Screen name='Modal' component={ModalScreen}/>
                </Stack.Group>
                <Stack.Group screenOptions={{presentation: 'transparentModal'}}>
                    <Stack.Screen name='Match' component={MatchedScreen}/>
                </Stack.Group>
            </>
        ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
        )}
    </Stack.Navigator>
  )
}

export default StackNavigator