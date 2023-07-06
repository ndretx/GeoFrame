import React, { useRef, useState } from "react";
import { TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import MapView, { Marker } from "react-native-maps";

export default function CameraComponent({ onPhotoCaptured }) {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const handleCameraButtonClick = async () => {
    if (cameraRef.current) {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      if (status === "granted") {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedPhoto(photo);
        savePhotoToGallery(photo);
        onPhotoCaptured(photo.coords);
      }
    }
  };

  const savePhotoToGallery = async (photo) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        console.log("Photo saved to gallery successfully!");
      } else {
        console.log("Permission denied to save photo to gallery");
      }
    } catch (error) {
      console.log("Error saving photo to gallery:", error);
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
      {capturedPhoto && (
        <MapView style={styles.map}>
          <Marker coordinate={capturedPhoto.coords}>
            <View style={styles.markerContainer}>
              <Image
                source={{ uri: capturedPhoto.uri }}
                style={styles.markerImage}
              />
            </View>
          </Marker>
        </MapView>
      )}
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
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    backgroundColor: "white",
    borderRadius: 50,
    padding: 5,
  },
  markerImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
