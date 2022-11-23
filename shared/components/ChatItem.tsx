import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import initFirebase from '../utils/firebase';

interface ChatItemProps {
  name: string,
  id: string,
  lastMessage: string,
  onPress: (id: string) => void
}

const ChatItem = ({ name, id, lastMessage, onPress }: ChatItemProps) => {

  const database = initFirebase.firestore();

  const [message, setMessage] = useState("");
  const [messageDate, setMessageDate] = useState("");

  useEffect(() => {
    database.collection('messages').doc(lastMessage).get().then(value => {
      const msg = value.data()?.msg
      if (msg) {
        setMessage(msg);
      }
      const date = value.data()?.time;
      if(date){
        const toDay = new Date();
        const dateConverted = new Date(date.toDate());
        if(toDay.getDate() == dateConverted.getDate() && toDay.getFullYear() == dateConverted.getFullYear()){
          setMessageDate(dateConverted.getHours()+':'+dateConverted.getMinutes())
        }else{
          setMessageDate(dateConverted.getHours()+':'+dateConverted.getMinutes()+' '+
          dateConverted.getDate()+'/'+dateConverted.getMonth()+'/'+dateConverted.getFullYear())
        }
      }
    });
  }, [])


  return (
    <TouchableOpacity style={styles.cintainer} onPress={() => onPress(id)}>
      <View style={{ flex: .18 }}>
        <View style={styles.imageContainer}>
          <Image source={require("../../assets/profile.webp")} resizeMode="cover" style={styles.image}></Image>
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
    overflow: 'hidden',
    width: '100%',
    aspectRatio: 1 / 1,

  },
  image: {
    height: '100%',
    width: '100%'
  },
  header : {
    display : "flex",
    flexDirection : "row",
  },
  title: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 14
  },
  date : {
    fontSize : 12,
    color : "#CCCCCC"
  }
})

export default ChatItem