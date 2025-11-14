import React, { Dispatch, SetStateAction } from 'react';
import { StyleProp, StyleSheet, Text, TextInput, TextStyle, View } from 'react-native';

type InputFieldProps = {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: Dispatch<SetStateAction<string>>;
  style?: StyleProp<TextStyle>;
};

export const InputField = ({ label, placeholder, value, onChangeText, style, ...restProps}: InputFieldProps) => {
      return (
        <View style={styles.container}>
          {label && <Text style={styles.label}>{label}</Text>}
          <TextInput
            style={[styles.input, style]}
            placeholder={placeholder}
            onChangeText={onChangeText}
            {...restProps} //Pass through any other native TextInput props
          />
        </View>
      );
};

 const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontFamily: 'Amethysta-Regular',
    fontSize: 20,
    marginBottom: 8,
    color: '#7D28A4',
    fontWeight: '600'
  },
  input: {
    height: 40,
    fontSize: 20,
    color: '#9a9a9aff',
    borderColor: '#ccc',
    fontFamily: 'Amethysta-Regular',
    fontWeight: 'semibold',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
 });