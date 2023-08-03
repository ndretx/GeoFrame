import { useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";

export default function chatPage({navigation, route}) {
    useEffect(() => {


    }, [])


    return (
        <View style={ styles.container } >
            <View style={ styles.containerMessage }>
            <View style={{backgroundColor:'white', width : 200}}>
                <Image source={{ uri: ""}} />
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

    },
    containerMessage: {

    }

})