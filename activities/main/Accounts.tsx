import { FC, useEffect, useState } from "react";
import {
  KeyboardAvoidingView, TextInput, StyleSheet, Text, View, TouchableOpacity, Image,
  VirtualizedList, RefreshControl
} from "react-native";
import { DocumentData, DocumentReference } from "@firebase/firestore-types";
import initFirebase from "../../shared/utils/firebase";
import AccountItem from "../../shared/components/AccountItem";
interface AccountsProps {
  userId: string,
  navigation: (id: string) => void
}

const Accounts: FC<AccountsProps> = ({ navigation, userId }) => {

  const dataBase = initFirebase.firestore();
  const auth = initFirebase.auth();

  const [users, setusers] = useState<Array<DocumentData>>([]);
  const [usersFiltred, setUsersFiltred] = useState<Array<DocumentData>>([]);
  const [search, setSearch] = useState("");
  const [searchFocus, setsearchFocus] = useState(false);
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    getUsers();
  }, [])

  useEffect(() => {
    if (!refreshing) {
      filter(users);
    }
  }, [search])


  const getUsers = async () => {
    setRefreshing(true)
    const collection = dataBase.collection("user");
    collection.get().then(result => {
      const usersResult = result.docs.filter(item => item.id != auth.currentUser?.uid)
      setusers(usersResult);
      filter(usersResult);
      setRefreshing(false);
    })
  }


  const filter = (list: Array<DocumentData>) => {
    if (search.length) {
      setUsersFiltred(
        list.filter(item => {
          const dataUser = item.data();
          return ((dataUser.firstName + " " + dataUser.lastName)
            .toLowerCase()
            .includes(search.toLowerCase()));
        })
      )
    } else {
      setUsersFiltred(list)
    }
  }

  return (
    <KeyboardAvoidingView style={{ marginHorizontal: 20, marginVertical: 5, }}>
      {
        usersFiltred.length ?
          <View style={{ height: "100%" }}>
            <VirtualizedList
              stickyHeaderIndices={[0]}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={getUsers}
                />
              }
              ListHeaderComponent={
                <View style={{ ...styles.searchContainer, borderBottomColor: searchFocus ? "#601775" : "#999999" }}>
                  <Text>Users: </Text>
                  <TextInput style={styles.search} onFocus={() => setsearchFocus(true)}
                    onBlur={() => setsearchFocus(false)} selectionColor="#601775" value={search}
                    placeholder="Search ..." onChange={(value) => setSearch(value.nativeEvent.text)}></TextInput>
                </View>
              }
              data={usersFiltred}
              initialNumToRender={10}
              keyExtractor={(item: DocumentData) => item.id}
              getItemCount={(data) => data.length}
              getItem={(data, index) => data[index]}
              renderItem={item => {
                return (
                  <AccountItem account={item.item} userId={userId} navigation={navigation} />
                )
              }}
            />
          </View> :
          !refreshing &&
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>0 User Found.</Text>

      }
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    backgroundColor: "#FFF"
  },
  search: {
    flex: 1,
    height: 40,
    backgroundColor: "transparent",
    padding: 10,
  },
})

export default Accounts;