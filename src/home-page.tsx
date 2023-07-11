import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableHighlight, Image, Modal, Text } from "react-native";
import { Card } from 'react-native-elements'
import MapView, { Marker } from "react-native-maps";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import CameraComponent from "./camera-page";

export default function HomePage() {

  const [initialRegion, setInitialRegion] = useState(null);
  const navigation = useNavigation(); // Obter o objeto de navegação
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);


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
          latitude: -22.12229741001421,
          longitude: -43.209825170583635,
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

        <Marker
          description="Igreja Sao Sebastião"
          coordinate={{
            latitude: -22.1166235,
            longitude: -43.2099970,
          }} onPress={() => {
            setSelectedMarker({
              description: "Igreja Sao Sebastião",
              imageUri:
                "https://upload.wikimedia.org/wikipedia/commons/a/a8/Igreja_de_S%C3%A3o_Sebasti%C3%A3o.jpg",
            });
            setModalVisible(true);
          }}
        >
          <View style={styles.marker}>
            <Image style={styles.markerImage}
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Igreja_de_S%C3%A3o_Sebasti%C3%A3o.jpg' }}
            />
          </View>
        </Marker>

        <Marker
          description="Encontro dos Três Rios"
          coordinate={{
            latitude: -22.1283667,
            longitude: -43.135968,
          }}>
          <View style={styles.marker}>
            <Image style={styles.markerImage}
              source={{ uri: 'https://www.cachoeirasparaibadosul.net/uploads/1/2/5/0/125038699/published/foto-oficial-sugest-o-allan.jpg?1604972208' }}
            />
          </View>
        </Marker>
        <Marker
          description="Casa de Pedra"
          coordinate={{
            latitude: -22.115486663984644,
            longitude: -43.204658711350625,
          }}>
          <View style={styles.marker}>
            <Image style={styles.markerImage}
              source={{ uri: 'https://lh5.googleusercontent.com/p/AF1QipMbVLmWcbMs9iqX3WyvjkPG_j42HlWhmybMOh2C=w426-h240-k-no' }}
            />

          </View>
        </Marker>
        <Marker
          description="Ponte das Garças"
          coordinate={{
            latitude: -22.12006818802773,
            longitude: -43.165348303148304
          }}>
          <View style={styles.marker}>
            <Image style={styles.markerImage}
              source={{ uri: 'https://lh5.googleusercontent.com/p/AF1QipOCMPmqFbMxHFQQ5ydqzOAqR94VQ_6WrkWcilMd=w426-h240-k-no' }}
            />

          </View>
        </Marker>

      </MapView>
      <Card>
        <Card.Title>Modal Card</Card.Title>
        <Card.Divider />
        <View style={styles.modalContainer}>
          {selectedMarker && (
            <>
              <Image
                style={styles.modalImage}
                source={{ uri: selectedMarker.imageUri }}
              />
              <Text style={styles.modalDescription}>
                {selectedMarker.description}
              </Text>
            </>
          )}
          <TouchableHighlight
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableHighlight>
        </View>
      </Card>



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
  marker: {
    width: 100,
    height: 100,
  },

  markerImage: {
    width: 50,
    height: 50,
    borderRadius: 24,
    borderColor: 'red',
    borderWidth: 0.5,


  },
  modalContainer: {
    width: 'auto',
    height: '50%',
    alignItems: "center",
    backgroundColor: "#000000aa",
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#009688",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },

});
