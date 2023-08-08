import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, Image } from "react-native";
import chatEntity from "../entity/chat-entity";

export default function chatPage({ navigation, route }) {
    const [author, setAuthor] = useState('');
    const [messages, setMessages] = useState<chatEntity[]>([ ])
    const [listRef, setListRef] = useState (null);
    const [mensages, setMessages] = useState('')
    useEffect(() => {


    }, [])


    return (
        <View style={styles.container} >
            <FlatList
                ref={(ref)=> {setListRef(ref)}}
                data={messages}
                renderItem={({ item }) => {
                    return (
                        item.sender === author ?
                            <View>
                                {/* Area de mensagem recebida */}
                            </View> :
                            <View>
                                {/* Area de mensagem enviada */}
                            </View>
                    )
                }} />
            <View style={styles.containerMessage}>
                <View style={{ backgroundColor: 'white', width: 200 }}>
                    <Image source={{ uri: "" }} />
                    <Text> Chat</Text>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',

    },
    containerMessage: {

    }

})