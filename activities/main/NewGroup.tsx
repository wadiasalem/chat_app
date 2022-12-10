import { useEffect, useState } from "react";
import {
  ScrollView, Image, StyleSheet, Text,
  TextInput, View, TouchableOpacity
} from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign'
import { DocumentData, DocumentReference } from "@firebase/firestore-types";
import initFirebase from "../../shared/utils/firebase";
import Input from "../../shared/components/Input";

interface NewGroupProps {
  onCreate: (id: string) => void,
  groupe?: DocumentData,
  groupID?: string,
}

const NewGroup = ({ onCreate, groupe, groupID }: NewGroupProps) => {

  const dataBase = initFirebase.firestore();
  const auth = initFirebase.auth();

  const [users, setUsers] = useState<Array<DocumentData>>([]);
  const [usersFiltred, setUsersFiltred] = useState<Array<DocumentData>>([]);
  const [usersSelected, setUsersSelected] = useState<Array<DocumentData>>([]);
  const [searchFocus, setsearchFocus] = useState(false);
  const [name, setName] = useState(groupe ? groupe.name : "");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setUsersSelected([]);
    if (groupe) {
      groupe.users.forEach(async (item: DocumentReference) => {
        if (item.id != auth.currentUser?.uid) {
          const userData = await item.get();
          setUsersSelected(old => [...old, userData]);
        }
      })
    }
    const collection = dataBase.collection("user");
    collection.get().then(result => {
      setUsers(result.docs);
    })
  }, [])

  useEffect(() => {
    if (search.length) {
      setUsersFiltred(
        users.filter(item => {
          const dataUser = item.data();
          return ((dataUser.firstName + " " + dataUser.lastName)
            .toLowerCase()
            .includes(search.toLowerCase())
            && !usersSelected.includes(item)
            && item.id != auth.currentUser?.uid
          );
        })
      )
    } else {
      setUsersFiltred([])
    }
  }, [search])

  const addUser = (user: DocumentData) => {
    if (!usersSelected.includes(user)) {
      setUsersSelected(oldValue => [...oldValue, user]);
    }
    setSearch("");
  }

  const removeUser = (user: DocumentData) => {
    setUsersSelected(oldValue => [...oldValue.filter(item => item.id != user.id)]);
  }

  const createGroup = () => {
    if (name.length < 3) {
      setError("Please insert the group name")
    } else if (usersSelected.length == 0) {
      setError("Please select at least one user")
    } else {
      dataBase.collection("user").doc(auth.currentUser?.uid).get()
        .then(user => {
          if (groupe) {
            if (groupID) {
              dataBase.collection("groups").doc(groupID).update({
                name: name,
                type: "group",
                messages: groupe.messages,
                users: [user.ref, ...usersSelected.map(item => item.ref)]
              }).then(result => {
                onCreate(groupe.id);
              })
            }
          } else {
            dataBase.collection("groups").add({
              name: name,
              type: "group",
              messages: [],
              lastUpdate: new Date(),
              users: [user.ref, ...usersSelected.map(item => item.ref)]
            }).then(result => {
              onCreate(result.id);
            })
          }
        })
    }
  }

  return (
    <View style={{ width: "100%" }}>
      <Text style={styles.title}>{groupe ? "Update group" : "New Group"}</Text>
      <Input placeholder="Group name"
        value={name}
        handleUpdate={(value) => { setName(value); setError("") }} />
      {
        usersSelected.length ?
          <ScrollView style={{ display: "flex" }} horizontal={true}>
            {
              usersSelected.map(item => {
                return (
                  <View key={item.id} style={styles.userSelected}>
                    <Text>
                      {
                        (item.data().firstName + item.data().lastName).length ?
                          item.data().firstName + " " + item.data().lastName :
                          "User"
                      }
                    </Text>
                    <TouchableOpacity onPress={() => removeUser(item)}>
                      <AntDesign name="close" size={20} />
                    </TouchableOpacity>
                  </View>
                )
              })
            }
          </ScrollView>
          : null
      }
      <View style={{ ...styles.searchContainer, borderBottomColor: searchFocus ? "#601775" : "#999999" }}>
        <Text>To: </Text>
        <TextInput style={styles.search} onFocus={() => setsearchFocus(true)}
          onBlur={() => setsearchFocus(false)} selectionColor="#601775" value={search}
          placeholder="Search ..." onChange={(value) => setSearch(value.nativeEvent.text)}></TextInput>
      </View>
      {
        usersFiltred.length ?
          <View style={{ maxHeight: 150 }}>
            <ScrollView>
              {
                usersFiltred.map(item => {
                  return (
                    <TouchableOpacity key={item.id} style={styles.userFiltred} onPress={() => { addUser(item); setError("") }}>
                      {
                        item.data().image ?
                          <Image source={{ uri: item.data().image }} resizeMode="cover" style={styles.image}></Image>
                          :
                          <Image source={require("../../assets/profile.webp")} resizeMode="cover" style={styles.image}></Image>
                      }
                      <Text>
                        {
                          (item.data().firstName + item.data().lastName).length ?
                            item.data().firstName + " " + item.data().lastName :
                            "User"
                        }
                      </Text>
                    </TouchableOpacity>
                  )
                })
              }
            </ScrollView>
          </View> : null
      }
      <TouchableOpacity
        style={styles.button}
        onPress={createGroup}
      >
        <Text style={styles.textButton}>{groupe ? "Update" : "Create"}</Text>
      </TouchableOpacity>
      {
        error.length ?
          <View>
            <Text style={styles.error}>
              {error}
            </Text>
          </View>
          : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    textAlign: "center",
  },
  nameInput: {
    height: 40,
    backgroundColor: '#22222222',
    borderRadius: 5,
    borderColor: '#33333333',
    borderWidth: 1,
    width: '100%',
    padding: 10,
  },
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  userSelected: {
    borderRadius: 5,
    backgroundColor: "#33333333",
    padding: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5
  },
  search: {
    flex: 1,
    height: 40,
    backgroundColor: "transparent",
    padding: 10,
  },
  userFiltred: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 20,
  },
  button: {
    backgroundColor: "#601775",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20
  },
  textButton: {
    color: "#FFF",
    textAlign: "center",
  },
  error: {
    textAlign: "center",
    color: "#FF0000",
    marginTop: 10
  }
})

export default NewGroup