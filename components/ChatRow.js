import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import { db } from '../firebase';
import { collection, onSnapshot, orderBy, query, snapshotEqual, where } from 'firebase/firestore';

const ChatRow = ({matchDetails}) => {
    
    const navigation = useNavigation();
    const { user } = useAuth();
    const [matchedUserInfo, setMatchedUserInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState(null);

    useEffect(() => {
        setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
    },[matchDetails, user]);

    useEffect(() => {
        onSnapshot(query(collection(db, 'matches', matchDetails.id, 'messages'), orderBy('timestamp', 'desc')), 
        snapshot => setLastMessage(snapshot.docs[0]?.data()?.message));
    }, [db, matchDetails]);


  return (
    <TouchableOpacity className='flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg space-x-4'
        onPress={() => navigation.navigate('Message', {
            matchedUserInfo, matchDetails
        })}
    >
      <Image source={{uri: matchedUserInfo?.photoURL}} className='rounded-full h-16 w-16'/>
      <View>
        <Text className='text-lg font-semibold'>{matchedUserInfo?.displayName}</Text>
        <Text>{lastMessage || "Say Hi!"}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default ChatRow