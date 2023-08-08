import { View, Image, Button, TextInput, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import { getStoredData, setStoredData } from "../shared/secure-store-service";

export default function LoginPage({ navigation }) {
  const [author, setAuthor ] = useState ("");

  useEffect(() => {
    getAuthor();
   
  }, [])
  

async function getAuthor(){
  const localAuthor = await getStoredData('author');
  if(localAuthor){
    navigation.navigate('HomePage')
  }
}

  function login(){
    setStoredData('author', author);
    navigation.navigate('HomePage')

  }
  


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require("../../assets/image/icon.png")} style={{ width: 200, height: 200 }} />
        <Text style={styles.title}> GeoFrame</Text>
      </View>
      <View style={styles.containerButton}>
        <TextInput
          onChangeText={setAuthor}
          value={author}
          style={styles.textInput}
          placeholder='Digite seu nome'
        />
           <TouchableOpacity
        style={styles.customButton}
        onPress={login}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#485865"
  },
  title: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 20,
    color: "white",
    padding: 50,
    fontFamily: 'SpaceGrotesk-Bold'
  },
  headerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
    justifyContent: 'space-between'
  },
  containerButton: {
    width: '100%',
    justifyContent: 'space-around',  
  },
  customButton: {
    borderRadius: 12,
    marginBottom: 32,
    padding: 8,
    backgroundColor: '#009788',
    elevation: Platform.OS === 'android' ? 2 : 0,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  textInput: {
    borderRadius: 12,
    marginBottom: 32,
    padding: 8,
    color: "white",
    backgroundColor: "#009788",
    elevation: Platform.OS === 'android' ? 2 : 0,
  },
});
