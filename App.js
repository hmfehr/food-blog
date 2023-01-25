import { useEffect, useState } from 'react';
import { Camera, CameraType } from 'expo-camera';
import {  StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';


let cameraRef;

async function takePicture(){
  if(cameraRef){
    let photo = await cameraRef.takePictureAsync();
    console.log(photo);
    await savePicture(photo.uri);
  }
}

async function savePicture(uri){
  const name = new Date().getTime() + '.jpeg';
  const newUri = FileSystem.documentDirectory + name;
  await FileSystem.moveAsync({
    from: uri,
    to: newUri,
  });
}


export default function App() {
  const [permission, setPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);


  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setPermission(status === 'granted');
      } catch (err) {
        console.log('error while requesting camera permission:', err);
      }
    })();
  }, []);


  if (permission === null) {
    return <View />;
  }
  if (!permission) {
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  // export default function App() {
  return (
    <View style={styles.container}>
      <Camera ref={ref => (cameraRef = ref)} style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.takePicture} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  buttonContainer:{
    position: 'absolute',
    bottom: '5%',
    alignSelf: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  text:{
    color: 'white',
  },
  takePicture: {
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
    margin:10
  },
});
