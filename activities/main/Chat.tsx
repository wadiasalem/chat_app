import {
  NativeSyntheticEvent, ScrollView, VirtualizedList, StyleSheet, Text,
  TextInput,
  TextInputChangeEventData, View
} from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";
import IconEntypo from "react-native-vector-icons/Entypo";
import { useEffect, useState } from "react";
import initFirebase from "../../shared/utils/firebase";
import { DocumentData } from "@firebase/firestore-types"
import ChatItem from "../../shared/components/ChatItem";

interface ChatProps {
  navigation: (id: string) => void
}

const Chat = ({ navigation }: ChatProps) => {

  const auth = initFirebase.auth();
  const database = initFirebase.firestore();

  const [searchFocus, setsearchFocus] = useState(false);
  const [messageGroups, setMessageGroups] = useState<Array<DocumentData>>([]);
  const [messageGroupsFiltred, setMessageGroupsFiltred] = useState<Array<DocumentData>>([]);

  useEffect(() => {
    database.collection("groups").get().then(groups => {
      const docs = groups.docs.filter(doc => {
        const user = doc.data().users.find((user: any) => {
          return user.id == auth.currentUser?.uid
        })
        return user;
      })
      setMessageGroups(docs);
      setMessageGroupsFiltred(docs);
    })
  }, [])

  const search = (value: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setMessageGroupsFiltred(
      messageGroups.filter(group => {
        return (group.data().name as string).toLowerCase().includes(value.nativeEvent.text.toLowerCase());
      })
    )
  }


  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <View style={{ ...styles.searchContainer, borderBottomColor: searchFocus ? "#601775" : "#999999" }}>
          <Icon name="search" size={25} color="#999999"></Icon>
          <TextInput style={styles.search} onFocus={() => setsearchFocus(true)}
            onBlur={() => setsearchFocus(false)} selectionColor="#601775"
            placeholder="Search ..." onChange={search}></TextInput>
        </View>
        <IconEntypo name="new-message" size={25} color="#666666"></IconEntypo>
      </View>
      <VirtualizedList
        data={messageGroupsFiltred}
        initialNumToRender={4}
        renderItem={(item) => {
          const messageId = item.item.data().messages[item.item.data().messages.length - 1].id
          return <ChatItem onPress={navigation} name={item.item.data().name}
            id={item.item.id} lastMessage={messageId} />
        }}
        keyExtractor={(item: DocumentData) => item.id}
        getItemCount={(data) => data.length}
        getItem={(data, index) => data[index]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 20,
    marginVertical: 5,
    display: "flex",
    alignItems: "center",
    flexDirection: "row"
  },
  searchContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    marginRight: 20,

  },
  search: {
    flex: 1,
    height: 40,
    backgroundColor: "transparent",
    padding: 10,
  }
})

export default Chat;