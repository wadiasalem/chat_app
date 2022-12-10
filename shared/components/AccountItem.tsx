import React, { FC, useEffect, useState } from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
import { DocumentData, DocumentReference } from '@firebase/firestore-types';
import initFirebase from '../utils/firebase';

interface AccountItemProps {
  account: DocumentData,
  navigation: (id: string) => void,
  userId: string,

}

const AccountItem: FC<AccountItemProps> = ({ account, userId, navigation }) => {

  const dataBase = initFirebase.firestore();
  const rDataBase = initFirebase.database("https://tpmobile-7cc09-default-rtdb.europe-west1.firebasedatabase.app");

  const [active, setActive] = useState(false);

  useEffect(() => {
    const ref = rDataBase.ref("connection/" + account.id);
    ref.on('value', (snapshot) => {
      setActive(snapshot.val());
    }, (errorObject) => {
    });
  }, [])

  const createChat = (userRef: DocumentReference) => {
    dataBase.collection("user").doc(userId).get().then(user => {
      dataBase.collection("groups")
        .where(
          "users",
          "in",
          [[user.ref, userRef]]
        )
        .where(
          "type",
          "==",
          "convertion"
        )
        .get().then(groups => {
          if (groups.docs.length) {
            navigation(groups.docs[0].id)
          } else {
            dataBase.collection("groups").add({
              name: "",
              type: "convertion",
              messages: [],
              users: [user.ref, userRef],
              lastUpdate: new Date()
            }).then(value => {
              navigation(value.id)
            })
          }
        })
    })
  }

  return (
    <TouchableOpacity key={account.id} style={styles.userFiltred} onPress={() => { createChat(account.ref) }}>
      <View style={styles.imageContainer}>
        {
          account.data().image ?
            <Image source={{ uri: account.data().image }} resizeMode="cover" style={styles.image} />
            :
            <Image source={require("../../assets/profile.webp")} resizeMode="cover" style={styles.image} />
        }
        <View style={{ ...styles.activeBull, backgroundColor: active ? "#4C8D94" : "#D0CED6" }} />
      </View>
      <Text>
        {
          (account.data().firstName + account.data().lastName).length ?
            account.data().firstName + " " + account.data().lastName :
            "User"
        }
      </Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({

  userFiltred: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  imageContainer: {
    height: 60,
    width: 60,
    marginRight: 20,
    position: "relative"
  },
  activeBull: {
    position: "absolute",
    right: 0,
    bottom: 0,
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#FFF"
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
})

export default AccountItem