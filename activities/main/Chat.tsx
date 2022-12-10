import {
  NativeSyntheticEvent, VirtualizedList, StyleSheet, RefreshControl,
  TextInput, TextInputChangeEventData, View, TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";
import IconEntypo from "react-native-vector-icons/Entypo";
import { useEffect, useState } from "react";
import initFirebase from "../../shared/utils/firebase";
import { DocumentData } from "@firebase/firestore-types"
import ChatItem from "../../shared/components/ChatItem";
import Popup from "../../shared/components/Popup";
import NewGroup from "./NewGroup";

interface ChatProps {
  userId: string
  navigation: (id: string) => void
}

const Chat = ({ navigation, userId }: ChatProps) => {

  const database = initFirebase.firestore();

  const [searchFocus, setsearchFocus] = useState(false);
  const [messageGroups, setMessageGroups] = useState<Array<DocumentData>>([]);
  const [messageGroupsFiltred, setMessageGroupsFiltred] = useState<Array<DocumentData>>([]);
  const [refreshing, setRefreshing] = useState(true);

  const [openModal, setopenModal] = useState(false);

  useEffect(() => {
    getGroups();
  }, [])

  const getGroups = () => {
    setRefreshing(true)
    database.collection("user").doc(userId).get().then(user => {
      database.collection("groups")
        .where(
          "users",
          "array-contains",
          user.ref
        )
        .orderBy('lastUpdate', 'desc')
        .onSnapshot(groups => {
          setRefreshing(false);
          setMessageGroups(groups.docs);
          setMessageGroupsFiltred(groups.docs);
        })
    })
  }

  const search = (value: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setMessageGroupsFiltred(
      messageGroups.filter(group => {
        return (group.data().name as string).toLowerCase().includes(value.nativeEvent.text.toLowerCase());
      })
    )
  }


  return (
    <View style={{ flex: 1 }}>
      <Popup openPopup={openModal} closePopup={() => setopenModal(false)}>
        <NewGroup onCreate={(id) => { setopenModal(false); navigation(id) }} />
      </Popup>
      <View style={styles.header}>
        <View style={{ ...styles.searchContainer, borderBottomColor: searchFocus ? "#601775" : "#999999" }}>
          <Icon name="search" size={25} color="#999999"></Icon>
          <TextInput style={styles.search} onFocus={() => setsearchFocus(true)}
            onBlur={() => setsearchFocus(false)} selectionColor="#601775"
            placeholder="Search ..." onChange={search}></TextInput>
        </View>
        <TouchableOpacity onPress={() => setopenModal(true)}>
          <IconEntypo name="new-message" size={25} color="#666666"></IconEntypo>
        </TouchableOpacity>
      </View>
      <VirtualizedList
        data={messageGroupsFiltred}
        initialNumToRender={4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={getGroups}
          />
        }
        renderItem={(item) => {
          return <ChatItem onPress={navigation} userID={userId}
            group={item.item} />
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