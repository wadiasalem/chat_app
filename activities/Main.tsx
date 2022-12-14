import { SafeAreaView, StatusBar, StyleSheet, Pressable, View, Platform } from "react-native";
import { useState, ReactNode, createElement, FC, useEffect } from "react";
import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import IconFeather from 'react-native-vector-icons/Feather';
import Chat from "./main/Chat";
import Accounts from "./main/Accounts";
import Settings from "./main/Settings";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { User } from "@firebase/auth-types";
import initFirebase from "../shared/utils/firebase";

type RootStackParamList = {
  Main: { userId: string },
  Chat: { id: String, userId: string },
}

type MainProps = NativeStackScreenProps<RootStackParamList, 'Main'>;

type activities = 'chat' | 'accounts' | 'settings';

const Main: FC<MainProps> = ({ navigation, route }) => {

  const userId = route.params.userId;
  const [activity, setActivity] = useState<activities>('chat');

  const renderContent = (): ReactNode => {
    switch (activity) {
      case 'chat':
        return createElement(Chat, { navigation: openChat, userId: userId });
      case 'accounts':
        return createElement(Accounts, { navigation: openChat, userId: userId });
      case 'settings':
        return createElement(Settings);
    }
  }

  const openChat = (id: string) => {
    navigation.push('Chat', { id, userId });
  }

  return (
    <View style={styles.view}>
      <MyStatusBar />
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#601775" />
        <View style={styles.pageContent}>
          {
            renderContent()
          }
        </View>
        <View style={styles.nav}>
          <Pressable onPress={() => setActivity('accounts')}>
            <IconIonicons name="people-outline" color="#FFF" size={30}></IconIonicons>
          </Pressable>
          <Pressable style={styles.centerIcon} onPress={() => setActivity('chat')}>
            <View style={styles.centerIconBackground}>
              <IconFontisto name="hipchat" color="#FFF" size={26}></IconFontisto>
            </View>
          </Pressable>
          <Pressable onPress={() => setActivity('settings')}>
            <IconFeather name="settings" color="#FFF" size={26}></IconFeather>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const MyStatusBar = () => (
  <View style={styles.statusBar}>
    <SafeAreaView>
      <StatusBar barStyle="light-content" />
    </SafeAreaView>
  </View>
);

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: "#FFF"
  },
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    backgroundColor: "#FFF"
  },
  pageContent: {
    flex: 1
  },
  nav: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    padding: 15,
    paddingBottom: Platform.OS == "ios" ? 25 : 15,
    backgroundColor: "#601775"
  },
  centerIcon: {
    marginTop: -40,
    borderRadius: 50,
    borderColor: "#FFF",
    borderWidth: 6,
  },
  centerIconBackground: {
    padding: 20,
    borderRadius: 50,
    backgroundColor: "#601775",
  }
})

export default Main;