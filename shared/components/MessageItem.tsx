import { FC, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Message } from '../interfaces/Message';

interface MessageItemProps {
  message: Message,
  showImage: boolean,
  date: Date,
  myMessage: boolean,
}

const MessageItem: FC<MessageItemProps> = ({ date, message, myMessage, showImage }) => {

  const [open, setopen] = useState(false);

  return (
    <View style={{
      ...styles.messageContainer,
      alignItems: myMessage ? "flex-end" : "flex-start"
    }}>
      <View style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", marginBottom: 5 }}>
        {
          myMessage || !showImage ?
            null
            :
            message.user.image ?
              <Image source={{ uri: message.user.image }} resizeMode="cover" style={styles.profileImage} />
              :
              <Image source={require("../../assets/profile.webp")} resizeMode="cover" style={styles.profileImage} />
        }
        <TouchableOpacity
          onPress={() => setopen(oldVal => !oldVal)}
          style={{ ...styles.message, ...(myMessage ? styles.mymessage : null) }}>
          <Text style={myMessage ? { color: "#FFF" } : null}>
            {message.text}
          </Text>
        </TouchableOpacity>
      </View>
      {
        open &&
        <Text style={styles.messageDate}>
          {
            (date.getHours() + ':' +
              (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()) + ' ' +
              date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear())
          }
        </Text>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
  },
  messageContainer: {
    display: "flex",
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  mymessage: {
    backgroundColor: "#601775",
  },
  message: {
    maxWidth: "60%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 10,
  },
  messageDate: {
    fontSize: 10,
    color: "#999"
  },
})

export default MessageItem