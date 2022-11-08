import { View, Text, Button, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {

    const {promptAsync, setLoading, setError} = useAuth();

  return (
    <View className='flex-1'>
      <ImageBackground source={{uri: 'https://tinder.com/static/tinder.png'}} className='flex-1' resizeMode='cover'>
        <TouchableOpacity style={{marginHorizontal: '25%'}} className='absolute bottom-40 w-52 bg-white p-4 rounded-2xl'
            onPress={() => {
                setLoading(true);
                promptAsync({showInRecents: true}).catch((err) => Promise.reject()).finally(() => setLoading(false));
            }}
        >
            <Text className='text-center font-semibold'>Sign in & get swiping</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  )
}

export default LoginScreen