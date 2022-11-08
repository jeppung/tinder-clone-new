import { View, Text } from 'react-native'
import React from 'react'

const SenderMessage = ({messages}) => {
  return (
    <View className='bg-purple-600 rounded-lg rounded-tr-none px-5 py-3 mx-3 my-2 ml-auto flex-start'>
      <Text className='text-white'>{messages.message}</Text>
    </View>
  )
}

export default SenderMessage