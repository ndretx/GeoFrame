import { uuidv4 } from "@firebase/util";
import { onValue, push, ref } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import { View, FlatList, StyleSheet, Text, Image, TextInput, TouchableNativeFeedback } from "react-native";
import { Icon } from 'react-native-elements';
import { db } from "../../firebase-config";
import chatEntity from "../entity/chat-entity";
import { getStoredData } from "../shared/secure-store-service";
import { formatId } from "../utils/id-formats";
import { timeFormatBR } from "../utils/time-format";

export default function ChatPage({ navigation, route }) {
    const [author, setAuthor] = useState('');
    const [messages, setMessages] = useState<chatEntity[]>([])
    const listRef = useRef(null);
    const [message, setMessage] = useState('')


    async function getMessages() {
        return onValue(ref(db, `/messages/${route.params.markers.id}`), (snapshot) => {
            try {
                setMessages([]);
                if (snapshot !== undefined) {
                    snapshot.forEach((childSnapshot) => {
                        const childkey = childSnapshot.key;
                        let childValue = childSnapshot.val();
                        childValue.id = childkey;
                        setMessages((messages) => [...messages, (childValue as chatEntity)])
                    });
                }
            } catch (e) {
                console.log(e);
            }
        });
    }
    async function sendMessage() {
        const newMessage: chatEntity = {
            id: formatId(uuidv4()),
            date: timeFormatBR(new Date()),
            message: message,
            sender: author
        }

        push(ref(db, `/messages/${route.params.markers.id}`), newMessage)
        setMessage("")

    }


    useEffect(() => {
        getMessages();
        getAuthor();
    }, [])

    useEffect(() => {
        if (listRef) {
            if (messages.length > 0) {
                listRef.current.scrollToEnd({ animated: true })
            }
        }
    }, [messages])




    async function getAuthor() {
        const author = await getStoredData('author');
        setAuthor(author)

    }


    return (
        <View style={{
            justifyContent: 'center', backgroundColor: 'white',
            height: '100%', width: '100%'
        }} >
            <FlatList
                ref={listRef}
                data={messages}
                renderItem={({ item }) => {
                    return (
                        item.sender === author ?
                            <View style={styles.container}>
                                <View style={styles.containerMessage}>
                                    <View style={{
                                        backgroundColor: '#ccc', width: 'auto',
                                        borderRadius: 7,
                                        paddingVertical: 2,
                                        paddingHorizontal: 4
                                    }}>
                                        <Image
                                            style={{
                                                backgroundColor: '#ccc', width: 40,
                                                height: 40, marginRight: 8, borderRadius: 20
                                            }}
                                            source={{ uri: `https://robohash.org/${item.sender}.png?set=set2` }} />
                                        <View style={{
                                            backgroundColor: '#ccc', width: 'auto',
                                            borderRadius: 7,
                                            paddingVertical: 2,
                                            paddingHorizontal: 4
                                        }}>
                                            <Text style={{ fontSize: 13, fontWeight: '700' }}> {item.sender}</Text>
                                            <Text> {item.message}</Text>
                                            <Text style={{ textAlign: 'left', fontSize: 8 }}>{timeFormatBR(item.date)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View> :
                            <View style={styles.reverseContainer}>
                                <View style={styles.reverseContainerMessage}>
                                    <View style={{
                                        backgroundColor: '#ccc', width: 'auto',
                                        borderRadius: 7,
                                        paddingVertical: 2,
                                        paddingHorizontal: 4
                                    }}>
                                        <Image
                                            style={{
                                                backgroundColor: '#ccc', width: 40,
                                                height: 40, marginRight: 8, borderRadius: 20
                                            }}
                                            source={{ uri: `https://robohash.org/${item.sender}.png?set=set2` }} />
                                        <View style={{
                                            backgroundColor: '#ccc', width: 'auto',
                                            borderRadius: 7,
                                            paddingVertical: 2,
                                            paddingHorizontal: 4
                                        }}>
                                            <Text style={{ fontSize: 13, fontWeight: '700' }}> {item.sender}</Text>
                                            <Text> {item.message}</Text>
                                            <Text style={{ textAlign: 'left', fontSize: 8 }}>{timeFormatBR(item.date)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                    )
                }}
                keyExtractor={(item) => item.id}
            />
            <View style={{ flexDirection: 'row', paddingHorizontal: 8, alignItems: 'center', paddingVertical: 8, marginBottom: 8 }}>
                <TextInput
                    placeholder="Digite aqui a mensagem"
                    numberOfLines={1}
                    value={message}
                    onChangeText={setMessage}
                    style={{
                        backgroundColor: '#ccc',
                        flex: 4,
                        borderRadius: 7,
                        paddingVertical: 2,
                        paddingHorizontal: 8,
                        maxHeight: 80,
                        marginRight: 8
                    }}
                />
                <TouchableNativeFeedback onPress={sendMessage}>
                    <Icon name="send" type="google" size={25} color="black"></Icon>
                </TouchableNativeFeedback>

            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        justifyContent: 'flex-end',
        padding: 16,

    },
    containerMessage: {
        
        backgroundColor: 'trasparent',
        justifyContent: 'flex-end',
        padding: 16, 
        marginVertical: 4

    },
    reverseContainer: {
        backgroundColor: "transparent",
        justifyContent: 'flex-start',
        
        padding: 16,
        width: '100%',

    },
    reverseContainerMessage: {
        backgroundColor: 'trasparent',
        justifyContent: 'flex-end',
        width: '100%',
        marginVertical: 4

    }


})