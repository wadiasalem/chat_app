import { FC, useState } from "react";
import { ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import initFirebase from "../../shared/utils/firebase";
import { AuthError, User } from "@firebase/auth-types";

type RootStackParamList = {
  Main: { userId: string },
  SignUp: undefined,
  SignIn: undefined,
}

type SignInProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const SignIn: FC<SignInProps> = ({ navigation }) => {

  const auth = initFirebase.auth();

  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    setError("");
    if (email.includes("@")) {
      if (password.length > 6) {
        auth.signInWithEmailAndPassword(email, password)
          .then((result) => {
            if (result.user) {
              navigation.replace('Main', { userId: result.user.uid });
            }
          })
          .catch((error: AuthError) => {
            setError("Check your credentials");
          });
      } else {
        setError("Your password must be more than 6 characters");
      }
    } else {
      setError("Your email is wrong");
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={require("../../assets/auth-background.jpg")} resizeMode="cover" style={styles.image}>
        <View style={styles.auth}>
          <Text style={styles.title}>Authentification</Text>
          {
            error &&
            <Text style={styles.error}>{error}</Text>
          }
          <TextInput style={styles.input}
            editable
            autoComplete="email"
            onChangeText={setEmail}
            value={email}
            placeholder="email@gmail.com" />
          <TextInput style={styles.input}
            editable
            autoComplete="password"
            onChangeText={setPassword}
            value={password}
            placeholder="***"
            secureTextEntry={true} />
          <TouchableOpacity
            style={styles.button}
            onPress={login}
          >
            <Text style={styles.textButton}>Sign In</Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: "80%", padding: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={{ ...styles.textButton, textAlign: 'right', fontWeight: 'bold' }}>Create account</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
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


export default SignIn;