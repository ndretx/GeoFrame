import React, { useRef, useEffect, useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library"



export default function CameraComponent({ route}) {
  const cameraRef = useRef(null);

  useEffect(() => {
    
    MediaLibrary.requestPermissionsAsync()
   
  }, []);

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => {
            if (cameraRef.current) {
              route.params.registrarLocal(cameraRef)
            }
          }}>
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
