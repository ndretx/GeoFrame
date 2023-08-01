import React, { useRef, useEffect, useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export default function CameraComponent({ route }) {
  const cameraRef = useRef(null);
  const [isCameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    // Check camera permissions and request if not granted
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Camera permission required to use the camera.");
      }
    })();
  }, []);

  const handleCameraReady = () => {
    setCameraReady(true);
  };

  const takePicture = async () => {
    if (!isCameraReady) {
      console.log("Camera is not ready.");
      return;
    }

    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        route.params.registrarLocal(cameraRef);
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} onCameraReady={handleCameraReady}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
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
  map: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: "center",
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
