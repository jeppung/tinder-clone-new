import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Foundation } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Header = (props) => {
    
    const navigation = useNavigation();
    const {title, callEnabled} = props;
    
    return (
    <View className='p-2 flex-row items-center justify-between'>
        <View className='flex-row items-center'>
            <TouchableOpacity onPress={() => navigation.goBack()} className='p-2'>
                <Ionicons name='chevron-back-outline' size={34} color='#FF5864'/>
            </TouchableOpacity>
            <Text className='text-2xl font-bold pl-2'>
                {title}
            </Text>
        </View>

        {callEnabled && (
            <TouchableOpacity className='rounded-full bg-red-200 p-3 mr-4'>
                <Foundation className='' name='telephone' size={20} color='red'/>
            </TouchableOpacity>
        )}
    </View>
  )
}

export default Header