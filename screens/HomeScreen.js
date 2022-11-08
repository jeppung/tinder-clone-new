import { View, Text, Button, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-deck-swiper';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import generateId from '../lib/generateId';


const HomeScreen = () => {
    const { user, logout } = useAuth();
    const navigation = useNavigation();
    const [profiles, setProfiles] = useState([]);
    const swipeRef = useRef(null); 

    useLayoutEffect(() => onSnapshot(doc(db, 'users', user.uid), snapshot => {
            if(!snapshot.exists()) {
                navigation.navigate('Modal');
            }
        })
    , []);

    useEffect(() => {
        const fetchCards = async () => {

            const passes = await getDocs(collection(db, 'users', user.uid, 'passes'))
            .then((snapshot) => snapshot.docs.map((doc) => doc.id));

            const swipes = await getDocs(collection(db, 'users', user.uid, 'swipes'))
            .then((snapshot) => snapshot.docs.map((doc) => doc.id));

            const passedUserIds = passes.length > 0 ? passes : ['test'];
            const swipedUserIds = swipes.length > 0 ? swipes : ['test'];

            onSnapshot(query(collection(db, 'users'), where('id', 'not-in', [...passedUserIds, ...swipedUserIds])), snapshot => {
                setProfiles(snapshot.docs.filter(doc => doc.id !== user.uid).map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }))
                )
            });
        }

        fetchCards();
    }, [db]);

    const swipeLeft = async (cardIndex) => {
        if(!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        console.log(`You swiped PASS on ${userSwiped.displayName}`);

        setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped);
    }

    const swipeRight = async (cardIndex) => {
        if(!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        const loggedInProfile = await (await getDoc(doc(db, 'users', user.uid))).data();

        // if matched
        getDoc(doc(db, 'users', userSwiped.id, "swipes", user.uid)).then(
            (documentSnapshot) => {
                if(documentSnapshot.exists()){
                    console.log(`Hooray, you MATCHED with ${userSwiped.displayName}`)

                    setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);

                    // create a match
                    setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
                        users: {
                            [user.uid]: loggedInProfile,
                            [userSwiped.id]: userSwiped
                        },
                        usersMatched: [user.uid, userSwiped.id],
                        timestamp: serverTimestamp()
                    })

                    navigation.navigate('Match', {
                        loggedInProfile, userSwiped
                    });
                }else{
                    console.log(`You swiped MATCH on ${userSwiped.displayName}`);
                    setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);
                }
            }
        )
    }

  return (
    <SafeAreaView className='flex-1'>
        {/* Header */}
        <View className='items-center flex-row justify-between px-5'>
            <TouchableOpacity onPress={logout}>
                <Image source={{uri: user.photoURL}} className='h-10 w-10 rounded-full'/>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
                <Image source={require('../logo2.png')} className='h-14 w-14'/>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
                <Ionicons name='chatbubbles-sharp' size={30} color='#FF5864'/>
            </TouchableOpacity>
        </View>

        {/* Cards */}
        <View className='flex-1'>
            <Swiper
                ref={swipeRef}
                containerStyle={{backgroundColor: 'transparent'}}
                cards={profiles}
                overlayLabels={{
                    left: {
                        title: "NOPE",
                        style: {
                            label: {
                                textAlign: "right",
                                color: "red"
                            }
                        }
                    },
                    right: {
                        title: "MATCH",
                        style: {
                            label: {
                                textAlign: "left",
                                color: "#4DED30"
                            }
                        }
                    },
                }}
                renderCard={card => card ? (
                    <View className='bg-red-500 h-3/4 rounded-xl relative'>
                        <Image source={{uri: card.photoURL}} className='h-full w-full rounded-xl' resizeMode='cover'/>
                        <View className='bg-white absolute bottom-0 w-full h-20 flex-row justify-between items-center px-6 py-2 rounded-b-xl shadow-md shadow-black'>
                            <View>
                                <Text className='text-xl font-bold'>{card.displayName}</Text>
                                <Text>{card.job}</Text>
                            </View>
                            <Text className='text-2xl font-bold'>{card.age}</Text>
                        </View>
                    </View>
                ) : (
                    <View className='relative bg-white h-3/4 rounded-xl justify-center items-center'>
                        <Text className='font-bold pb-5'>No more profiles</Text>
                        <Image  source={{uri: 'https://links.papareact.com/6gb'}} style={{height:100, width:100}} className='h-20 w-full'/>
                    </View>
                )}
                onSwipedLeft={(cardIndex) => swipeLeft(cardIndex)}
                onSwipedRight={(cardIndex) => swipeRight(cardIndex)}
                verticalSwipe={false}
                cardIndex={0}
                stackSize={5}
                
            />
        </View>
        
        {/* 2 Buttons */}
        <View className='flex-row justify-evenly py-10'>
            <TouchableOpacity className='items-center justify-center rounded-full w-16 h-16 bg-red-200'
                onPress={() => swipeRef.current.swipeLeft()}
            >
                <Entypo name='cross' size={24} color='red'/>
            </TouchableOpacity>
            <TouchableOpacity className='items-center justify-center rounded-full w-16 h-16 bg-green-200'
                onPress={() => swipeRef.current.swipeRight()}
            >
                <AntDesign name='heart' size={24} color='green'/>
            </TouchableOpacity>
        </View>
        
    </SafeAreaView>
  )
}

export default HomeScreen