import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, StyleSheet, TouchableHighlight, Image, Text, TextInput } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Feather, EvilIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { FontAwesome5 } from '@expo/vector-icons'; 

export default function HomePage() {
  const [initialRegion, setInitialRegion] = useState(null);
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

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;

      setInitialRegion({ latitude, longitude, latitudeDelta: 0.1, longitudeDelta: 0.1 });

      // Optionally, you can also create a marker for the user's location
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
  };

  const handleCameraButtonClick = async () => {
    if (cameraRef.current) {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const photo = await cameraRef.current.takePictureAsync();
        // Assuming you have access to the coordinates here (replace with actual coordinates)
        const coords = { latitude: 0, longitude: 0 };
        onPhotoCaptured(photo, coords);
      }
    }
  };

  const onPhotoCaptured = (photo, coords) => {
    const newMarker = {
      id: markers.length + 1,
      image: photo.uri,
      latitude: coords.latitude,
      longitude: coords.longitude,
      description: "",
    };

    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    setSelectedMarker(newMarker);
    setShowDetailsCard(true);
  };

  // Update the zoomLevel state whenever the region changes
  const handleRegionChangeComplete = useCallback((region) => {
    if (mapRef.current) {
      mapRef.current.getCamera().then((camera) => {
        setZoomLevel(camera.zoom);
      });
    }
  }, []);

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
    // Save the description
    // You can add your logic here to save the description to a database or perform any other operations
    setDescriptionInput("");
    setSelectedMarker(null);
    setShowDetailsCard(false);
  };

  const renderMarker = (marker) => {
    const isSelectedMarker = selectedMarker?.id === marker.id;

    // Use a custom icon for the user marker and the default marker icon for others
    const markerIcon = marker.id === 0 ? (
      <FontAwesome5 name="map-marker-alt"size={24 + zoomLevel * 2} color="red" />
    ) : (
      <FontAwesome5 name="map-marker-alt" size={24} color="black" />
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
});
