import { FC, useEffect, useState } from "react";
import { ImageBackground, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"
import { newUser, NewUser, User } from "../../shared/interfaces/User";
import { AuthError } from "@firebase/auth-types"
import initFirebase from "../../shared/utils/firebase";

type RootStackParamList = {
  Main: { userId: string },
  SignUp: undefined,
  SignIn: undefined,
}

type SignUpProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const SignUp: FC<SignUpProps> = ({ navigation }) => {

  const auth = initFirebase.auth();
  const database = initFirebase.firestore();

  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<NewUser>(newUser);

  const createAccount = () => {
    setError("");
    if (user.email.includes("@")) {
      if (user.password.length > 6) {
        if (user.password == user.confirmPassword) {
          auth.createUserWithEmailAndPassword(user.email, user.password)
            .then((result) => {
              const collection = database.collection("user");
              collection.doc(result.user?.uid).set({
                firstName: "",
                lastName: "",
              }).then(userDoc => {
                if (result.user) {
                  navigation.replace('Main', { userId: result.user.uid });
                }
              })
            })
            .catch((error: AuthError) => {
              setError("Check your credentials");
            });
        } else {
          setError("Your confirm password and password not the same");
        }
      } else {
        setError("Your password must be more than 6 characters");
      }
    } else {
      setError("Your email is wrong");
    }
  }

  const updateUser = () => {

  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={require("../../assets/auth-background.jpg")} resizeMode="cover" style={styles.image}>
        <View style={styles.auth}>
          <Text style={styles.title}>Create your account</Text>
          {
            error &&
            <Text style={styles.error}>{error}</Text>
          }
          <TextInput style={styles.input}
            editable
            onChangeText={(event) => setUser(value => { return { ...value, email: event } })}
            value={user.email}
            placeholder="email@gmail.com" />
          <TextInput style={styles.input}
            editable
            onChangeText={(event) => setUser(value => { return { ...value, password: event } })}
            value={user.password}
            placeholder="Password"
            secureTextEntry={true} />
          <TextInput style={styles.input}
            editable
            onChangeText={(event) => setUser(value => { return { ...value, confirmPassword: event } })}
            value={user.confirmPassword}
            placeholder="Confirm password"
            secureTextEntry={true} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => createAccount()}
          >
            <Text style={styles.textButton}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: "80%", padding: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={{ ...styles.textButton, textAlign: 'right', fontWeight: 'bold' }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  auth: {
    width: '80%',
    backgroundColor: '#33333333',
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15
  },
  title: {
    fontWeight: 'bold',
    color: "#FFF",
    fontSize: 20,
    marginBottom: 10
  },
  error: {
    fontSize: 12,
    color: "#FFFFFF"

  },
  input: {
    height: 40,
    margin: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    width: '100%',
    padding: 10,
  },
  button: {
    backgroundColor: "#601775",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5
  },
  textButton: {
    color: "#FFF"
  }
});


export default SignUp;