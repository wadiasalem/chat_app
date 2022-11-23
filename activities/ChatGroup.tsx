import { RouteProp } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Main: undefined,
  Chat: { id: String },
}

type ProfileProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatGroup: FC<ProfileProps> = ({ route }) => {
  const { id } = route.params;
  return (
    <View>
      <Text>{id}</Text>
    </View>
  )
}

export default ChatGroup