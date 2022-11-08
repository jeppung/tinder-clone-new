import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAuth from '../hooks/useAuth'
import { db } from '../firebase'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useNavigation } from '@react-navigation/native'

const ModalScreen = () => {
    
    const navigation = useNavigation();
    const { user } =  useAuth();
    const [image, setImage] = useState(null);
    const [job, setJob] = useState(null);
    const [age, setAge] =  useState(null);

    const incompleteForm = !image || !job || !age;

    const updateUserProfile = () => {
        setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image,
            job: job,
            age: age,
            timestamp: serverTimestamp()
        }).then(() => {
            navigation.navigate('Home')
        }).catch((err) => {
            alert(err.message);
        });
    }

  return (
    <SafeAreaView className='flex-1 items-center'>
      <Image source={{uri: 'https://1000logos.net/wp-content/uploads/2018/07/Tinder-logo.png'}} className='h-20 w-full' resizeMode='contain'/>
      <Text className='text-xl text-gray-500 p-2 font-bold'>
        Welcome, {user.displayName}
      </Text>
      <Text className='text-center p-4 font-bold text-red-400'>
         Step 1: The Profile Pic
      </Text>
      <TextInput placeholder='Enter a Profile Pic URL' className='text-center text-xl pb-2' value={image} onChangeText={(text) => setImage(text)}/>
      <Text className='text-center p-4 font-bold text-red-400'>
         Step 2: The Job
      </Text>
      <TextInput placeholder='Enter your occupation' className='text-center text-xl pb-2' value={job} onChangeText={(text) => setJob(text)}/>
      <Text className='text-center p-4 font-bold text-red-400'>
         Step 3: The Age
      </Text>
      <TextInput placeholder='Enter your age' className='text-center text-xl pb-2' value={age} onChangeText={(text) => setAge(text)}/>

      <TouchableOpacity className={`w-64 p-3 rounded-xl absolute bottom-10 ${incompleteForm ? 'bg-gray-400' : 'bg-red-400'}`}
        disabled={incompleteForm} onPress={updateUserProfile}
      >
        <Text className='text-center text-white text-xl'>Update Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default ModalScreen