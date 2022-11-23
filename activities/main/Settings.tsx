import { Pressable, StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useState, useEffect } from 'react'
import { defaultUser } from "../../shared/interfaces/User";
import IconFeather from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import initFirebase from "../../shared/utils/firebase";
import Input from "../../shared/components/Input";


const Settings = () => {

  const auth = initFirebase.auth();
  const database = initFirebase.firestore();
  const storage = initFirebase.storage();


  const [me, setme] = useState(defaultUser);
  const [dbUser, setDbUser] = useState(defaultUser);
  const [email, setEmail] = useState('');
  const [name, setName] = useState<string>('');
  const [image, setImage] = useState<string>();

  useEffect(() => {
    setEmail(auth.currentUser?.email ?? '');
    const collection = database.collection("user");
    collection.doc(auth.currentUser?.uid).get().then(value => {
      const user = value.data();
      if (user) {
        setme(lastValue => { return { ...lastValue, ...user } })
        setDbUser(lastValue => { return { ...lastValue, ...user } })
        setName(user.firstName + (user.lastName?.length ? ' ' + user.lastName : ''));
        if (user.image) {
          setImage(user.image)
        }
      }
    })
  }, [auth.currentUser])

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      const imageType = result.uri.split('.')[result.uri.split('.').length - 1];
      const imageNameToSave = auth.currentUser?.uid + '.' + imageType;
      const imageResult = await uploadImage(result.uri, imageNameToSave);
      setImage(result.uri);

      if (me.image)
        storage.ref(me.image).delete();
      const collection = database.collection("user");
      await collection.doc(auth.currentUser?.uid).set({ ...dbUser, image: imageResult })
        .then(async (resultUser) => {

        });
    }
  };

  const uploadImage = async (uri: string, name: string) => {
    const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'arraybuffer';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    const ref = storage.ref().child("profile/" + name);
    await ref.put(arrayBuffer, { contentType: "image/jpeg" });

    return await ref.getDownloadURL();
  }

  const update = () => {
    if (auth.currentUser?.email != email) {
      auth.currentUser?.updateEmail(email);
    }
    const collection = database.collection("user");
    collection.doc(auth.currentUser?.uid).set(me).then(result => {
      setName(me.firstName + (me.lastName?.length ? ' ' + me.lastName : ''));
      setDbUser(me);
    });
  }

  return (
    <KeyboardAwareScrollView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.header}>
          <Pressable style={styles.pressable} onPress={pickImage}>
            <View style={styles.profileImage}>
              <View style={styles.imageContainer}>
                {
                  image ?
                    <Image source={{ uri: image }} resizeMode="cover" style={styles.image}></Image>
                    :
                    <Image source={require("../../assets/profile.webp")} resizeMode="cover" style={styles.image}></Image>
                }
              </View>
            </View>
            <View style={styles.edit}>
              <IconFeather name="edit-2" color={'#FFF'} size={15}></IconFeather>
            </View>
          </Pressable>
          <Text style={styles.profileName}>{name}</Text>
        </View>
        <View>
          <Input value={me.firstName} label="First name"
            handleUpdate={(value) => setme({ ...me, firstName: value })}></Input>
          <Input value={me.lastName} label="Last name"
            handleUpdate={(value) => setme({ ...me, lastName: value })}></Input>
          <Input value={email} label="Email" email={true}
            handleUpdate={(value) => setEmail(value)}></Input>
        </View>
        <View>
          <TouchableOpacity style={styles.button} onPress={update}>
            <Text style={styles.textButton}>Valider</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    alignItems: "center",
    padding: 20
  },
  pageTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 20
  },
  pressable: {
    marginTop: 20,
    marginBottom: 20,
    display: "flex",
    alignItems: "center"
  },

  profileImage: {
    borderRadius: 50,
    borderColor: "#33333333",
    borderWidth: 2,
    width: 100,
    height: 100,
    overflow: 'hidden',
  },
  imageContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    height: '100%',
    width: '100%'

  },
  image: {
    height: '100%',
    width: '100%'
  },
  edit: {
    backgroundColor: "#601775",
    height: 30,
    width: 30,
    marginTop: -15,
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  profileName: {
    fontWeight: "bold",
    fontSize: 23,
  },
  inputContainer: {
    padding: 20
  },
  label: {
    marginBottom: 10
  },
  inputFocus: {
    height: 40,
    backgroundColor: '#60177522',
    borderRadius: 5,
    borderColor: '#60177533',
    borderWidth: 1,
    width: '100%',
    padding: 10,
  },
  input: {
    height: 40,
    backgroundColor: '#22222222',
    borderRadius: 5,
    borderColor: '#33333333',
    borderWidth: 1,
    width: '100%',
    padding: 10,
  },
  button: {
    backgroundColor: "#601775",
    margin: 20,
    padding: 15,
    borderRadius: 5,
  },
  textButton: {
    textAlign: "center",
    color: "#FFFFFF"
  }

});

export default Settings;