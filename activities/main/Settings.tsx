import { TextInput, Pressable, StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useState, useEffect } from 'react'
import { user, User } from "../../shared/interfaces/User";
import IconFeather from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import initFirebase from "../../shared/utils/firebase";


const Settings = () => {

  const database = initFirebase.database();

  const [me, setme] = useState(database.currentUser);
  const [name, setName] = useState<string>(me ? me.displayName ?? '' : '');
  const [image, setImage] = useState<string>();
  const [focus, setFocus] = useState<'fisrtName' | 'lastName' | 'email'>();

  useEffect(() => {

  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

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
                    <Image source={require("../../assets/profile.jpg")} resizeMode="cover" style={styles.image}></Image>
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
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First name</Text>
            <TextInput value={me.fisrtName} style={focus == 'fisrtName' ? styles.inputFocus : styles.input}
              onChange={(value) => setme({ ...me, fisrtName: value.nativeEvent.text })}
              onFocus={() => setFocus('fisrtName')} onBlur={() => setFocus(undefined)}></TextInput>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label} >Last name</Text>
            <TextInput value={me.lastName} style={focus == 'lastName' ? styles.inputFocus : styles.input}
              onChange={(value) => setme({ ...me, lastName: value.nativeEvent.text })}
              onFocus={() => setFocus('lastName')} onBlur={() => setFocus(undefined)}></TextInput>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email name</Text>
            <TextInput value={me.email} style={focus == 'email' ? styles.inputFocus : styles.input}
              textContentType="emailAddress"
              onChange={(value) => setme({ ...me, email: value.nativeEvent.text })}
              onFocus={() => setFocus('email')} onBlur={() => setFocus(undefined)}></TextInput>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.button}>
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