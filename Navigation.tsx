import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "./activities/auth/SignIn";
import SignUp from "./activities/auth/SignUp";
import ChatGroup from "./activities/ChatGroup";
import Main from "./activities/Main";

type RootStackParamList = {
  SignUp: undefined,
  SignIn: undefined,
  Main: { userId: string },
  Chat: { id: string, userId: string },
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
      <Stack.Screen name="Chat" component={ChatGroup} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default Navigation;