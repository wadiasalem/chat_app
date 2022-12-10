import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import initFirebase from '../utils/firebase';
import { DocumentData, DocumentReference } from '@firebase/firestore-types';

interface ChatItemProps {
  group: DocumentData,
  userID: string,
  onPress: (id: string) => void
}

const ChatItem = ({ group, userID, onPress }: ChatItemProps) => {

  const rDataBase = initFirebase.database("https://tpmobile-7cc09-default-rtdb.europe-west1.firebasedatabase.app");

  const [active, setActive] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [groupNextUser, setgroupNextUser] = useState<DocumentData>();
  const [messageDate, setMessageDate] = useState("");

  useEffect(() => {
    prepareName();
    const data = group.data();
    const date = data.lastUpdate;
    if (date) {
      const toDay = new Date();
      const dateConverted = new Date(date.toDate());
      if (toDay.getDate() == dateConverted.getDate() && toDay.getFullYear() == dateConverted.getFullYear()) {
        setMessageDate(dateConverted.getHours() + ':' +
          (dateConverted.getMinutes() > 9 ? dateConverted.getMinutes() : '0' + dateConverted.getMinutes()))
      } else {
        setMessageDate(dateConverted.getHours() + ':' +
          (dateConverted.getMinutes() > 9 ? dateConverted.getMinutes() : '0' + dateConverted.getMinutes()) + ' ' +
          dateConverted.getDate() + '/' + dateConverted.getMonth() + '/' + dateConverted.getFullYear())
      }
    }
    (data.messages[data.messages.length - 1] as DocumentReference)?.get()
      .then(value => {
        const msg = value.data()?.msg
        if (msg) {
          setMessage(msg);
        }
      });
  }, [group])

  const prepareName = async () => {
    const data = group.data();
    if (data.type == "group") {
      setName(group.data().name)
      setActive(true);
    } else {
      const otherUserRef = data.users.filter((item: DocumentReference) => item.id != userID)[0];
      const otherUserData = await otherUserRef.get();
      setgroupNextUser(otherUserData.data());
      const ref = rDataBase.ref("connection/" + otherUserRef.id);
      ref.on('value', (snapshot) => {
        setActive(snapshot.val());
      }, (errorObject) => {
      });
      (otherUserData.data().firstName + otherUserData.data().lastName).length ?
        setName(otherUserData.data().firstName + " " + otherUserData.data().lastName) :
        setName("User")
    }
  }


  return (
    <TouchableOpacity style={styles.cintainer} onPress={() => onPress(group.id)}>
      <View style={{ flex: .18 }}>
        <View style={styles.imageContainer}>
          {
            group.data().type == "convertion" && groupNextUser?.image ?
              <Image source={{ uri: groupNextUser.image }} resizeMode="cover" style={styles.image} /> :
              <Image source={require("../../assets/profile.webp")} resizeMode="cover" style={styles.image} />
          }
          <View style={{ ...styles.activeBull, backgroundColor: active ? "#4C8D94" : "#D0CED6" }} />
        </View>
      </View>
      <View style={{ flex: .8, paddingLeft: 20 }}>
        <View style={styles.header}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.date}>{messageDate}</Text>
        </View>
        <Text>{message}</Text>
      </View>
    </TouchableOpacity >
  )
}

const styles = StyleSheet.create({
  cintainer: {
    padding: 10,
    margin: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC"
  },
  imageContainer: {
    borderRadius: 50,
    width: '100%',
    aspectRatio: 1 / 1,

  },
  activeBull: {
    position: "absolute",
    right: 0,
    bottom: 0,
    height: "30%",
    width: "30%",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFF"
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%'
  },
  header: {
    display: "flex",
    flexDirection: "row",
  },
  title: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 14
  },
  date: {
    fontSize: 12,
    color: "#CCCCCC"
  }
})

export default ChatItem