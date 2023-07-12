import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableHighlight, Image, Text, TextInput } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import MarkerEntity from "../marker-entity";

export default function HomePage() {
  const [initialRegion, setInitialRegion] = useState(null);
  const navigation = useNavigation();
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [descriptionInput, setDescriptionInput] = useState("");
  const [markers, setMarkers] = useState([]);

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
    } catch (error) {
      console.log("Error getting current location:", error);
    }
  };

  const handleCameraButtonClick = () => {
    navigation.navigate('CameraComponent', {
      onPhotoCaptured: (coords) => {
        // Handle photo captured event
        // Update the necessary state or perform any other actions
      },
    });
  };

  const onPhotoCaptured = (photo, coords) => {
    setCapturedPhoto(photo);
    const newMarker = new MarkerEntity();
    newMarker.id = markers.length + 1;
    newMarker.image = photo.uri;
    newMarker.latitude = coords.latitude;
    newMarker.longitude = coords.longitude;
    newMarker.description = "";
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    setSelectedMarker(newMarker);
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
    // Save the description
    // You can add your logic here to save the description to a database or perform any other operations
    setDescriptionInput("");
    setSelectedMarker(null);
  };

  const renderMarker = (marker) => (
    <Marker
      key={marker.id}
      description={marker.description}
      coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
      onPress={() => handleMarkerClick(marker)}
    >
      <View style={styles.marker}>
        <Image style={styles.markerImage} source={{ uri: marker.image }} />
      </View>
    </Marker>
  );

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
        <MapView style={styles.map} initialRegion={initialRegion}>
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

      {selectedMarker && renderCard()}
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
    borderColor: "red",
    borderWidth: 0.5,
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
