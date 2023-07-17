import React, { useRef } from "react";
import { TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Camera } from "expo-camera";

// Adicione os parâmetros que a função espera receber
export default function CameraComponent({ route, navigation, onPhotoCaptured }) {
  const cameraRef = useRef(null);

  const handleCameraButtonClick = async () => {
    if (cameraRef.current) {
      const { status } = await Camera.requestCameraPermissionsAsync();

      if (status === "granted") {
        const photo = await cameraRef.current.takePictureAsync();
        // Supondo que você tenha acesso às coordenadas aqui (substitua com as coordenadas reais)
        const coords = { latitude: 0, longitude: 0 };
        onPhotoCaptured(photo, coords);
        navigation.goBack();
      }
    }
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCameraButtonClick}
          >
            <Feather name="camera" size={50} color="#009688" />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    alignItems: "center",
    borderRadius: 25,
    bottom: 100,
    left: 150,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 50,
    width: 100,
    height: 100,
  },
});
