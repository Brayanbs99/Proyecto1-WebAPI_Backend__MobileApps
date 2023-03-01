//import { StatusBar } from 'expo-status-bar';
import { Camera, CameraType } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as MediaLibrary from  'expo-media-library';
import { useState, useRef, useEffect } from 'react';
import Constants from 'expo-constants';


export default function Camara() {
  //Constatntes que se van a utilizar en el proyecto
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setflash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  //Permisos de poder acceder a las imagenes del dispositivo.
  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'Tiene permisos');
    })();
  }, []);

  //Aquí esta el código donde se va a tomar la foto
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
//Aquí esta el código donde se va a guardar la foto en la galeria del dispositivo.
  const saveImage = async () => {
    if(image) {
      try{
        await MediaLibrary.createAssetAsync(image); //La guarda en la galeria del dispositivo.
        console.info('Foto Guardada!')
        setImage(null);
      } catch(e) {
        console.log(e)
      }
    }
  }
  //Permiso a acceder la cámara.
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
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 30,
          }}>
            
            <Button title="Volver" icon="retweet"
              onPress={() => {
                setType(
                  type === CameraType.back ? CameraType.front : CameraType.back
                );
              }}
            />

            <Button title='Flash' 
            onPress={() => 
              setflash(flash === Camera.Constants.FlashMode.off
                ? Camera.Constants.FlashMode.on
                : Camera.Constants.FlashMode.off
                )
            }
            icon={'flash'} 
            color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#f1f1f1'}
            />
          </View>    
      </Camera>
      :
      <Image source={{uri: image}} style={styles.camera}></Image>
    }
      <View>
        {image ?
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 50

        }}>
            <Button title={"Tomar otra foto"} icon="retweet" onPress={() => setImage(null)}></Button>
            <Button title={"Guardar la foto"} icon="save" onPress={saveImage}></Button>
        </View> 
        :
        <Button title={"Tomar foto"} icon="camera" onPress={takePicture}></Button>
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
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#E9730F',
    marginLeft: 10,
  },
  camera: {
    flex:3,
    borderRadius: 20,
  },
  button: {
    height: 40,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

