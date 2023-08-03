import { View, Image, Button, TextInput, Text, StyleSheet } from "react-native";
import * as SecureStore from 'expo-secure-store';
import React from "react";

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  return result; 
}

export default function LoginRegister({ navigation }) {
  const [key, onChangeKey] = React.useState('Your key here');
  const [value, onChangeValue] = React.useState('Your value here');

  async function handleLogin() {
    const savedValue = await getValueFor(key);
    if (savedValue) {
      navigation.navigate('HomePage');
    } else {
      save(key, value);
      navigation.navigate('HomePage');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require("./assets/icon.png")} style={{ width: 100, height: 100 }} />
        <Text style={styles.title}> GeoFrame</Text>
      </View>
      <View style={styles.containerButton}>
        <TextInput
          style={styles.textInput}
          placeholder='Digite seu nome'
          value={key}
          onChangeText={onChangeKey}
          onSubmitEditing={handleLogin} 
        />
        <Button
          color="#009788"
          title="Login"
          onPress={() => {
            save(key, value);
            onChangeKey('Your key here');
            onChangeValue('Your value here');
          }}
        />
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
    justifyContent: "center",
    fontSize: 20,
    color: "white",
    padding: 50
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 100,
    justifyContent: 'space-between'
  },
  containerButton: {
    justifyContent: "space-between",
    padding: 16,
    margin: 16,
  },
  textInput: {
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "white",
    width: "100%",
    marginBottom: 10,
    color: "white",
    backgroundColor: "#009788"

  },
});
