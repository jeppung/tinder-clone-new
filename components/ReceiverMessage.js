import { View, Text, Image } from 'react-native'
import React from 'react'

const ReceiverMessage = ({messages}) => {
  return (
    <View className='bg-red-400 rounded-lg rounded-tl-none px-5 py-3 mx-3 my-2 ml-14' style={{alignSelf: 'flex-start'}}>
      <Image source={{uri: messages.photoURL}} className='h-12 w-12 rounded-full absolute -left-14 top-0'/>
      <Text className='text-white'>{messages.message}</Text>
    </View>
  )
}

export default ReceiverMessage