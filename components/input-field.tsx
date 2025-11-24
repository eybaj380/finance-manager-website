import React, { Dispatch, SetStateAction } from 'react';
import { Image, Pressable, StyleProp, StyleSheet, Text, TextInput, TextStyle, View } from 'react-native';

type InputFieldProps = {
  label?: string;
  isButtonPresent?: boolean;
  //this button is used to generate more expenses inside the scrollview
  placeholder: string;
  value: string;
  onChangeText: Dispatch<SetStateAction<string>>;
  style?: StyleProp<TextStyle>;
};

const addNewExpense = ({placeholder, onChangeText, ...restProps}: InputFieldProps) => {
  console.log('Add expense button was pressed.');
  return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder={'Enter a dollar amount...'}
          onChangeText={onChangeText}
          {...restProps} 
        />
        <TextInput
          style={styles.input}
          placeholder={'Description...'}
          onChangeText={onChangeText}
          {...restProps} 
        />
      </View>
  );
};

export const InputField = ({ label, isButtonPresent, placeholder, value, onChangeText, style, ...restProps}: InputFieldProps) => {
      return (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            {label && <Text style={styles.label}>{label}</Text>}
            {isButtonPresent && 
              (<Pressable onPress={() => {addNewExpense({placeholder, value, onChangeText, ...restProps})}}>
                <Image source={require('../assets/images/plus_button.svg')} style={styles.plusButtonContainer}/>
              </Pressable>)} 
          </View>
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
  headerContainer: {
    flexDirection: 'row',
  },
  label: {
    flex: 1,
    fontFamily: 'Amethysta-Regular',
    fontSize: 20,
    marginBottom: 8,
    color: '#7D28A4',
    fontWeight: '600'
  },
  plusButtonContainer: {
    width: 25,
    height: 25
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