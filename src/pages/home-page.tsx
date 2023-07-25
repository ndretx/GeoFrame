import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, StyleSheet, TouchableHighlight, Image, Text, TextInput } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import MarkerEntity from "../entity/marker-entity";
import { db } from "../../firebase-config";
import { onValue, ref } from "firebase/database";


export default function HomePage({ navigation }) {
  const [initialRegion, setInitialRegion] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [descriptionInput, setDescriptionInput] = useState("");
  const [markers, setMarkers] = useState([]);
  const [showDetailsCard, setShowDetailsCard] = useState(false);
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(0);

  useEffect(() => {
    getCurrentLocation();
    getPlaces();
  }, []);

  async function getPlaces() {
    return onValue(ref(db, '/places'), (snapshot) => {
        console.log("dados do realtime", snapshot);
    });
  }

  const getCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      setLocation({ coords: { latitude, longitude } });

      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });

      const userMarker = new MarkerEntity();
      userMarker.id = "user_location";
      userMarker.coords = { latitude, longitude };
      userMarker.description = "User's Location";
      userMarker.photoDate = Date.now().toString();

      setMarkers([userMarker]);
      setSelectedMarker(userMarker);
    } catch (error) {
      console.log("Error getting current location:", error);
    }
  }, []);

  const handleCameraButtonClick = async (cameraRef) => {
    console.log("chegou aqui");
    await getCurrentLocation();
    console.log(location);

    if (location && location.coords) {
      const { latitude, longitude } = location.coords;
      const photo = await cameraRef.current.takePictureAsync();
      await MediaLibrary.saveToLibraryAsync(photo.uri);

      const newMarker = new MarkerEntity();
      newMarker.id = `marker_${Math.random().toString()}`;
      newMarker.imagePath = photo.uri;
      newMarker.coords = { latitude, longitude };
      newMarker.description = "";
      newMarker.photoDate = Date.now().toString();

      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      setSelectedMarker(newMarker);
      setCapturedPhoto(photo);
      setShowDetailsCard(true);
      navigation.goBack();
    } else {
      console.log("Location not available.");
    }
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setShowDetailsCard(true);
  };

  const handleDescriptionChange = (text) => {
    setDescriptionInput(text);
    setSelectedMarker((prevMarker) => ({
      ...prevMarker,
      description: text,
    }));
  };

  const handleSaveDescription = () => {
    // Reservado para gravar no banco de dados
    setDescriptionInput("");
    setSelectedMarker(null);
    setShowDetailsCard(false);
  };

  const handleDeleteDescription = () => {
    // Reseta a descrição no estado do selectedMarker para uma string vazia (ou null)
    setSelectedMarker((prevMarker) => ({
      ...prevMarker,
      description: "",
    }));

    // Lógica para persistir a exclusão no backend (se necessário)
    // Aqui você pode fazer uma chamada para sua API de backend para atualizar o registro do selectedMarker no banco de dados.
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

    const markerIcon =
      marker.id === "user_location" ? (
        <FontAwesome5 name="map-marker-alt" size={24 + zoomLevel * 0.5} color="red" />
      ) : (
        <View>
          <Feather name="map-pin" size={24 + zoomLevel * 0.5} color="black" />
          {marker.imagePath && <Image style={styles.markerImage} source={{ uri: marker.imagePath }} />}
        </View>
      );

    return (
      <Marker
        key={marker.id}
        description={marker.description}
        coordinate={{
          latitude: marker.coords.latitude,
          longitude: marker.coords.longitude,
        }}
        onPress={() => handleMarkerClick(marker)}
      >
        {markerIcon}
      </Marker>
    );
  };

  const renderCard = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{selectedMarker?.description}</Text>
      <Image style={styles.cardImage} source={{ uri: selectedMarker?.imagePath }} />
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
      <TouchableHighlight onPress={handleDeleteDescription} style={styles.button}>
        <Text style={styles.buttonText}>Delete</Text>
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
          onPress={() => {
            navigation.navigate("CameraComponent", {
              registrarLocal: (cameraRef) => handleCameraButtonClick(cameraRef),
            });
          }}
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
  markerPoint: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    color: "green",
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
