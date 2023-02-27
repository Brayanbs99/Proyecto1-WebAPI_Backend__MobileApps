import { StatusBar } from 'expo-status-bar';
import { Camera, CameraType } from 'expo-camera'
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as MediaLibrary from  'expo-media-library'
import { useState, useRef, useEffect } from 'react';


export default function Camara() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setflash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  //function toggleCameraType() {
    //setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  //}

  const takePicture = async () => {
    if(cameraRef) {
      try{
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch(e) {
        console.log(e);
      }
    }
  }

  if(hasCameraPermission === false) {
    return <Text> No tiene acceso a la cámara.</Text>
  }

  
  return (
    <View style={styles.container}>
      {!image ?
      <Camera
        style={styles.camera}
        type={type}
        FlashMode={flash}
        ref ={cameraRef}
        >
      </Camera>
      :
      <Image source={{uri: image}} style={styles.camera}></Image>
    }
      <View>
        {image ?
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 50

        }}>
            <Button title={"Tomar otra foto"} icon="retweet" onPress={() => setImage(null)}></Button>
            <Button title={"Guardar la foto"} icon="save"></Button>
        </View> 
        :
        <Button title={'Tomar foto'} icon="camera" onPress={takePicture}></Button>
        }
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingBottom: 15
  },

  camera: {
    flex:1,
    borderRadius: 20,
  }
});

