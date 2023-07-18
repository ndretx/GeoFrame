import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, StyleSheet, TouchableHighlight, Image, Text, TextInput } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Feather, EvilIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { FontAwesome5 } from '@expo/vector-icons'; 

export default function HomePage() {
  const [initialRegion, setInitialRegion] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [descriptionInput, setDescriptionInput] = useState("");
  const [markers, setMarkers] = useState([]);
  const [showDetailsCard, setShowDetailsCard] = useState(false);

  const navigation = useNavigation();
  const cameraRef = useRef(null);
  const mapRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(0);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;

      setInitialRegion({ latitude, longitude, latitudeDelta: 0.1, longitudeDelta: 0.1 });

      
      const userMarker = {
        id: 0,
        image: null,
        latitude,
        longitude,
        description: "User's Location",
      };
      setMarkers([userMarker]);
      setSelectedMarker(userMarker);

    } catch (error) {
      console.log("Error getting current location:", error);
    }
  }, []);

  const handleCameraButtonClick = () => {
    // Passa apenas o ID do marcador selecionado para a tela da câmera
    navigation.navigate('CameraComponent', {
      selectedMarkerId: selectedMarker?.id,
    });
  };

  const onPhotoCaptured = (photo, coords, marker) => {
    const newMarker = {
      id: markers.length + 1,
      image: photo.uri,
      latitude: coords.latitude,
      longitude: coords.longitude,
      description: "",
    };

    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    setSelectedMarker(newMarker);
    setCapturedPhoto(photo);
    setShowDetailsCard(true);
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleDescriptionChange = (text) => {
    setDescriptionInput(text);
    setSelectedMarker((prevMarker) => ({
      ...prevMarker,
      description: text,
    }));
  };

  const handleSaveDescription = () => {
    //Reservado para gravar no banco de dados
    setDescriptionInput("");
    setSelectedMarker(null);
    setShowDetailsCard(false);
  };

  // Atualiza ZoomLevel
  const handleRegionChangeComplete = useCallback((region) => {
    if (mapRef.current) {
      mapRef.current.getCamera().then((camera) => {
        setZoomLevel(camera.zoom);
      });
    }
  }, []);

  const renderMarker = (marker) => {
    const isSelectedMarker = selectedMarker?.id === marker.id;
  
    const markerIcon = marker.id === 0 ? (
      <FontAwesome5 name="map-marker-alt" size={24 + zoomLevel * 0.5} color="red" />
    ) : (
      <View>
        <Feather name="map-pin" size={24 + zoomLevel * 0.5} color="black" />
        {marker.image && <Image style={styles.markerImage} source={{ uri: marker.image }} />}
      </View>
    );
  
    return (
      <Marker
        key={marker.id}
        description={marker.description}
        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
        onPress={() => handleMarkerClick(marker)}
      >
        {markerIcon}
      </Marker>
    );
  };
  

  const renderCard = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{selectedMarker?.description}</Text>
      <Image style={styles.cardImage} source={{ uri: selectedMarker?.image }} />
      <View style={styles.inputContainer}>
        <Text>Add a description:</Text>
        <TextInput
          style={styles.input}
          placeholder="Add a description"
          value={descriptionInput}
          onChangeText={handleDescriptionChange}
        />
      </View>
      <TouchableHighlight onPress={handleSaveDescription} style={styles.button}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableHighlight>
    </View>
  );

  return (
    <View style={styles.container}>
      {initialRegion && (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          ref={mapRef}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          {markers.map(renderMarker)}
        </MapView>
      )}
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

      {showDetailsCard && selectedMarker && renderCard()}
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    margin: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  cardImage: {
    width: "100%",
    height: 200,
    marginBottom: 12,
    borderRadius: 10,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  markerImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderColor: "white",
    borderWidth: 1,
  },
});

