import React, { FC, ReactNode } from 'react';
import {
  StyleSheet, Text,
  KeyboardAvoidingView, View, Modal, Alert, TouchableOpacity
} from "react-native";

interface PopupProps {
  closePopup: () => void,
  openPopup: boolean,
  children: ReactNode
}

const Popup: FC<PopupProps> = ({ openPopup, closePopup, children }) => {
  return (

    <Modal
      animationType="fade"
      transparent={true}
      visible={openPopup}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");

      }}
    >
      <KeyboardAvoidingView style={styles.centeredView}>
        <TouchableOpacity onPress={closePopup} style={styles.backgroundModel}>
        </TouchableOpacity>
        <View style={styles.modalView}>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    position: "relative",
    backgroundColor: "#33333333",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundModel: {
    position: "absolute",
    height: "100%",
    width: "100%"
  },
  modalView: {
    width: "80%",
    maxWidth: 300,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
})

export default Popup