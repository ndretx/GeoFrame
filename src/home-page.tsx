import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableHighlight } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import CameraComponent from "./camera-page";

export default function HomePage() {
  const [showCamera, setShowCamera] = useState(false);
  const [initialRegion, setInitialRegion] = useState(null);
  const navigation = useNavigation(); // Obter o objeto de navegação
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const onPhotoCaptured = (photo) => {
    setCapturedPhoto(photo);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    } catch (error) {
      console.log("Error getting current location:", error);
    }
  };

  const handleCameraButtonClick = () => {
    navigation.navigate('CameraComponent'); 
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -22.15867,
          longitude: -43.20917,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker
          description="Primeiro ponto"
          coordinate={{
            latitude: -22.15867,
            longitude: -43.20917,
          }}
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          onPress={handleCameraButtonClick}
          activeOpacity={0.5}
          underlayColor="#009688"
          style={styles.button}
        >
          <Feather name="camera" size={24} color="#009688" />
        </TouchableHighlight>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 100,
    right: 50,
    borderRadius: 25,
    backgroundColor: "#455A64",
  },
  button: {
    borderRadius: 24,
    padding: 8,
  },
});
