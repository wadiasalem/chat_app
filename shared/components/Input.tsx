import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native'

interface InputProps {
  value: string,
  label?: string,
  placeholder?: string,
  handleUpdate: (value: string) => void,
  email?: boolean
}

const Input = ({ value, label, handleUpdate, email = false, placeholder }: InputProps) => {

  const [focus, setFocus] = useState(false);

  return (
    <View style={styles.inputContainer}>
      {
        label?.length &&
        <Text style={styles.label}>{label}</Text>
      }
      <TextInput value={value} style={focus ? styles.inputFocus : styles.input}
        onChange={(value) => handleUpdate(value.nativeEvent.text)}
        keyboardType={email ? 'email-address' : 'default'}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        placeholder={placeholder} placeholderTextColor="#33333333"
      ></TextInput>
    </View >
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    padding: 20
  },
  label: {
    marginBottom: 10
  },
  inputFocus: {
    height: 40,
    backgroundColor: '#60177522',
    borderRadius: 5,
    borderColor: '#60177533',
    borderWidth: 1,
    width: '100%',
    padding: 10,
  },
  input: {
    height: 40,
    backgroundColor: '#22222222',
    borderRadius: 5,
    borderColor: '#33333333',
    borderWidth: 1,
    width: '100%',
    padding: 10,
  },
});

export default Input