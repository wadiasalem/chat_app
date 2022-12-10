import {
  View, Text, StyleSheet, Image, VirtualizedList, TextInput, TouchableOpacity,
  SafeAreaView, KeyboardAvoidingView
} from 'react-native';
import { DocumentData, DocumentReference } from "@firebase/firestore-types";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { FC, useEffect, useState, useRef } from 'react';
import { Platform } from 'expo-modules-core';

import FeatherIcon from 'react-native-vector-icons/Feather';
import { Message } from '../shared/interfaces/Message';
import initFirebase from '../shared/utils/firebase';
import Popup from '../shared/components/Popup';
import NewGroup from './main/NewGroup';
import MessageItem from '../shared/components/MessageItem';
import { DotTypingAnimation } from 'react-native-dot-typing';

type RootStackParamList = {
  Main: { userId: string },
  Chat: { id: string, userId: string },
}

type ProfileProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatGroup: FC<ProfileProps> = ({ navigation, route }) => {

  const { id, userId } = route.params;
  const scroll = useRef<VirtualizedList<Message>>(null)

  const database = initFirebase.firestore();
  const rDataBase = initFirebase.database("https://tpmobile-7cc09-default-rtdb.europe-west1.firebasedatabase.app");

  const [group, setgroup] = useState<DocumentData>();
  const [groupNextUser, setgroupNextUser] = useState<DocumentData>();
  const [groupName, setgroupName] = useState("");
  const [userRef, setUserRef] = useState<DocumentReference>();
  const [userTyping, setUserTyping] = useState<Array<DocumentData>>([]);
  const [messageToSend, setMessageToSend] = useState("");
  const [messagesGroup, setmessagesGroup] = useState<Array<Message>>([]);
  const [active, setActive] = useState(false);

  const [openModal, setopenModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      scroll.current?.scrollToEnd();
    }, 10);
  }, [messagesGroup])

  useEffect(() => {
    if (userTyping.length) {
      setTimeout(() => {
        scroll.current?.scrollToEnd();
      }, 10);
    }
  }, [messagesGroup, userTyping])

  useEffect(() => {
    rDataBase.ref("typing/" + id + "/" + userId).onDisconnect().remove();
    getMessages();
    database.collection('user').doc(userId).get().then(result => {
      setUserRef(result.ref);
    })
    const typingRef = rDataBase.ref("typing/" + id);
    typingRef.on("value", (value) => {
      setUserTyping([]);
      if (value.exists()) {
        value.forEach(item => {
          if (item.key != userId) {
            database.collection('user').doc(item.key ?? undefined).get().then(result => {
              setUserTyping(old => [...old, result]);
            })
          }
        })
      }
    });
  }, []);

  const sendMessage = async () => {
    if (group) {
      const messageCollection = database.collection('messages');
      const messageResult = await messageCollection.add({
        msg: messageToSend,
        time: new Date(),
        user: userRef
      })
      const groupCollection = database.collection('groups');
      const newGroup = { ...group, messages: [...group.messages, messageResult], lastUpdate: new Date() };
      setgroup(newGroup);
      await groupCollection.doc(id).update(newGroup);
      setMessageToSend("");
    }
  }

  const getMessages = async () => {
    const collection = database.collection('groups');
    collection.doc(id).onSnapshot(async (result) => {
      const data = result.data();
      if (data) {
        setgroup(data);
        if (data.type == "group") {
          setgroupName(data.name);
          setActive(true);
        } else {
          const otherUserRef = data.users.filter((item: DocumentReference) => item.id != userId)[0];
          const otherUserData = await otherUserRef.get();
          setgroupNextUser(otherUserData.data());
          (otherUserData.data().firstName + otherUserData.data().lastName).length ?
            setgroupName(otherUserData.data().firstName + " " + otherUserData.data().lastName) :
            setgroupName("User")
          const ref = rDataBase.ref("connection/" + otherUserRef.id);
          ref.on('value', (snapshot) => {
            setActive(snapshot.val());
          }, (errorObject) => {
          });
        }
        let messages: Array<Message> = [];
        for (const messageId of data.messages) {
          const message = await messageId.get();
          const msg = message.data();
          if (msg) {
            const user = await msg.user.get();
            messages.push({
              id: message.id,
              text: msg.msg,
              date: msg.time.toDate(),
              user: { ...user.data(), id: user.id },
            });
          }
        }
        setmessagesGroup(messages);
      }
    })
  }

  const typing = () => {
    rDataBase.ref("typing/" + id + "/" + userId).set(true);
  }


  const stopTyping = () => {
    rDataBase.ref("typing/" + id + "/" + userId).remove();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#FFF" }}>
      <SafeAreaView style={{ flex: 1 }}>
        {
          group &&
          <View style={{ height: "100%", display: "flex", justifyContent: "space-between", backgroundColor: "#F7F7F7" }}>
            <View style={styles.header}>
              <Popup openPopup={openModal} closePopup={() => setopenModal(false)}>
                <NewGroup groupe={group} groupID={id}
                  onCreate={(id) => { setopenModal(false); getMessages() }} />
              </Popup>
              <View style={{ flex: .20, display: 'flex', flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => { stopTyping(); navigation.replace("Main", { userId: userId }) }}>
                  <SimpleLineIcons name='arrow-left' size={18} color="#999" />
                </TouchableOpacity>
                <View style={styles.imageContainer}>
                  <TouchableOpacity onPress={() => { if (group.type == "group") setopenModal(true) }}>
                    {
                      group.type == "convertion" && groupNextUser?.image ?
                        <Image source={{ uri: groupNextUser.image }} resizeMode="cover" style={styles.image} />
                        :
                        <Image source={require("../assets/profile.webp")} resizeMode="cover" style={styles.image} />
                    }
                  </TouchableOpacity>
                  <View style={{ ...styles.activeBull, backgroundColor: active ? "#4C8D94" : "#D0CED6" }} />
                </View>
              </View>
              <View style={styles.headerContent}>
                <View>
                  <Text style={styles.title}>{groupName}</Text>
                  <Text style={{ ...styles.onlineText, color: active ? "#4C8D94" : "#D0CED6" }}>
                    {active ? "Online" : "Offline"}
                  </Text>
                </View>
                <View style={styles.headerCalls}>
                  <FeatherIcon name='video' size={24} color="#999" style={{ marginLeft: 15 }} />
                  <FeatherIcon name='phone' size={24} color="#999" style={{ marginLeft: 15 }} />
                </View>
              </View>
            </View>
            <View style={styles.messages}>
              <VirtualizedList
                ref={scroll}
                ListFooterComponent={
                  userTyping.length ?
                    <View style={{ height: 33, paddingHorizontal: 30, marginVertical: 10 }}>
                      <DotTypingAnimation dotSpeed={0.1} dotAmplitude={3} dotMargin={10} />
                    </View>
                    : null
                }

                data={messagesGroup}
                initialNumToRender={10}
                keyExtractor={(item: Message) => item.id}
                getItemCount={(data) => data.length}
                getItem={(data, index) => data[index]}
                renderItem={item => {
                  const date = item.item.date;
                  return (
                    <MessageItem myMessage={userId == item.item.user.id} message={item.item}
                      date={date} showImage={group.type == "group"}/>
                  )
                }}
              />
            </View>
            <View style={styles.bottomBar}>
              <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Type here..."
                  value={messageToSend} onFocus={typing} onBlur={stopTyping}
                  onChangeText={setMessageToSend} />
                <TouchableOpacity onPress={sendMessage}>
                  <Ionicons name='ios-send-outline' style={{ marginLeft: 10, marginRight: 5 }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  imageContainer: {
    borderRadius: 50,
    position: "relative",
    flex: 1,
    marginLeft: 10,
    aspectRatio: 1 / 1,

  },
  activeBull: {
    position: "absolute",
    right: 0,
    bottom: 0,
    height: '30%',
    width: '30%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFF"
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%'
  },
  headerContent: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: .8,
    paddingLeft: 20
  },
  headerCalls: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    color: "#333333",
    fontSize: 14
  },
  onlineText: {
    fontSize: 12
  },
  messages: {
    marginBottom: 135,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFF",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
  },
  inputContainer: {
    backgroundColor: "#F7F7F7",
    display: 'flex',
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    height: 40,
    padding: 10,
  },
  input: {
    flex: 1,
    borderRightWidth: 1,
  }
})

export default ChatGroup