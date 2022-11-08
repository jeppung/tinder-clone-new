import { View, Text, TextInput, Button, Touchable, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native'
import SenderMessage from '../components/SenderMessage'
import ReceiverMessage from '../components/ReceiverMessage'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import useAuth from '../hooks/useAuth'

const MessageScreen = () => {

    const navigation = useNavigation();
    const {user} = useAuth();
    const {params} = useRoute();
    const {matchedUserInfo, matchDetails} = params;
    const [input, setInput] = useState(null);
    const [messages, setMessages] = useState();

    useEffect(() => 
        onSnapshot(query(collection(db, 'matches', matchDetails.id, 'messages'), orderBy('timestamp', 'desc')), 
        snapshot => setMessages(snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))))
    , [matchDetails, db])
    
    console.log(messages);

    const sendMessage = () => {
        addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: matchDetails.users[user.uid].photoURL,
            message: input
        });

        setInput('');
    }


  return (
    <SafeAreaView className='flex-1'>
      <Header title={matchedUserInfo?.displayName} callEnabled/>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
        className='flex-1'
      >

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
           <FlatList
            inverted
            data={messages}
            className='pl-4'
            keyExtractor={item => item.id}
            renderItem={({item: message}) => 
                message.userId == user.uid ? (
                    <SenderMessage key={messages.id} messages={message}/>
                ):(
                    <ReceiverMessage key={messages.id} messages={message}/> 
                )
            }
           />
        </TouchableWithoutFeedback>
      

        <View className='flex-row bg-white justify-between items-center border-t border-gray-200 px-5 py-2'>
            <TextInput 
                placeholder='Send Message' 
                className='h-10 text-lg' 
                onChangeText={(text) => setInput(text)}
                onSubmitEditing={sendMessage}
                value={input}
            />
            <TouchableOpacity onPress={sendMessage}>
                <Text className='text-red-400'>Send</Text>
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default MessageScreen