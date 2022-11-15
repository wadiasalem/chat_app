import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "./activities/auth/SignIn";
import SignUp from "./activities/auth/SignUp";
import Main from "./activities/Main";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default Navigation;