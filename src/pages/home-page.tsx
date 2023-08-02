import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, StyleSheet, TouchableHighlight, Image, Text, TextInput, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import MarkerEntity from "../entity/marker-entity";
import { app, db } from "../../firebase-config";
import { onValue, push, ref, remove, update } from "firebase/database";
import * as firebaseStorage from "@firebase/storage";

export default function HomePage({ navigation }) {
  const [initialRegion, setInitialRegion] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [descriptionInput, setDescriptionInput] = useState("");
  const [markers, setMarkers] = useState([]);
  const [showDetailsCard, setShowDetailsCard] = useState(null);
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
    getPlaces();
  }, []);

  async function getPlaces() {
    return onValue(ref(db, '/places'), (snapshot) => {
      try {
        setMarkers([]);
        if (snapshot !== undefined) {
          snapshot.forEach((childSnapshot) => {
            const childkey = childSnapshot.key;
            let childValue = childSnapshot.val();
            childValue.id = childkey;
            setMarkers((markers) => [...markers, (childValue as MarkerEntity)])
          });
        }
      } catch (e) {
        console.log(e);
      }
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
      userMarker.id = `marker_${Math.random().toString()}`;
      userMarker.imagePath = capturedPhoto;
      userMarker.coords = { latitude, longitude };
      userMarker.description = "";
      userMarker.photoDate = Date.now().toString();
      userMarker.title = "";

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
      newMarker.title = "";

      setIsUploading(true);
      console.log(newMarker, "marker sendo salvo no banco de dados");
      try {
        const uploadedImageUrl = await uploadImage(photo.uri);
        console.log(uploadedImageUrl, "image uploaded");
        newMarker.imagePath = uploadedImageUrl; 
        push(ref(db, "places"), newMarker);

        
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
        setSelectedMarker(newMarker);
        setCapturedPhoto(photo);
        setShowDetailsCard(true);
        navigation.goBack();
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false); 
      }
    } else {
      console.log("Location not available.");
    }
  };
  async function uploadImage(imageUrl): Promise<string> {
    setIsUploading(true);
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const storage = firebaseStorage.getStorage(app);
    const storageRef = firebaseStorage.ref(
      storage,
      'images/' + imageUrl.replace(/^.*[\\\/]/, '')
    );
    const upload = await firebaseStorage.uploadBytes(storageRef, blob);
    const uploadedImageUrl = await firebaseStorage.getDownloadURL(storageRef);
    console.log(uploadedImageUrl);
    setIsUploading(false);
    return uploadedImageUrl;
  }
  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setShowDetailsCard(true);
  };
  const handleDescriptionChange = async (text) => {
    try {
      const cleanedDescription = text.replace(/^.*[\\\/]/, '');
      setDescriptionInput(cleanedDescription);
      setSelectedMarker((prevMarker) => ({
        ...prevMarker,
        description: cleanedDescription,
      }));
    } catch (error) {
      console.error("Error occurred:", error);
     
    }
  };
  async function updateItem() {
    selectedMarker.description = descriptionInput;
    update(ref(db, '/places/' + selectedMarker.id), selectedMarker);
    setShowDetailsCard({ showDetailsCard: false });
    setDescriptionInput('');

  }
  async function removeItem() {
    remove(ref(db, '/places/' + selectedMarker.id));
    setShowDetailsCard(false);
    setSelectedMarker(null);
  }
  function showConfirmDialog() {
    return Alert.alert(
      "Deseja remover o local?",
      "Essa ação não poderá ser desfeita",
      [
        {
          text: "Sim ",
          onPress: () => removeItem(),
        },
        { text: "Não", }

      ]
    )
  }

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
        <FontAwesome5 name="map-marker-alt" size={12 + zoomLevel * 0.5} color="red" />
      ) : (
        <View>
          {/* <Feather name="map-pin" size={12 + zoomLevel * 0.5} color="black" /> */}
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
      <TouchableHighlight onPress={updateItem} style={styles.button}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={showConfirmDialog} style={styles.button}>
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
          onPress={() => {
            setSelectedMarker(null);
            setShowDetailsCard(false);
          }}>
          {markers.map(renderMarker)}
        </MapView>
      )}
      <View style={styles.buttonContainer}>
        {isUploading ?
          <View style={{
            width: '100%', height: '100%',
            backgroundColor: 'black', opacity: 0.8,
            justifyContent: 'center', alignItems: 'center'}}>
            <Image style={{ width: "100%", height: "80%" }}
              source={{ uri: 'https://gifs.eco.br/wp-content/uploads/2021/08/imagens-e-gifs-de-loading-0.gif' }} />
            <Text style={{ color: "white" }}> Aguarde...</Text>
          </View>
          :
          <></>
        }
        <TouchableHighlight
          onPress={() => {
            navigation.navigate("CameraComponent", {
              registrarLocal: (cameraRef) => handleCameraButtonClick(cameraRef),
            });
          }}
          activeOpacity={0.5}
          underlayColor="#009688"
          style={styles.button}>
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
    width: 150,
    height: 150,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "white",
    borderWidth: 1,
  },


});
