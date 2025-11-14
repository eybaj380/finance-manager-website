import { Image } from 'expo-image';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import UserAvatar from '../../assets/images/user-avatar.svg';
import { InputField } from '../../components/input-field';

export default function HomeScreen() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  //change to be an array of strings
  const [expenseLabel, setExpenseLabel] = useState('');

  const handleSave = () => {
    console.log('Income: ', income);
    console.log('Expense recorded: ', expenses);
    console.log('Description: ', expenseLabel);

    alert(`Data saved: \nIncome - ${income}\nExpenses - ${expenses}\nDescription - ${expenseLabel}`); 

    setIncome('');
    setExpenses('');
  };

  return (
      <View style={styles.container}>
        <Image source={UserAvatar} style={styles.avatarContainer}/>
        <View style={styles.inputForm}>
          <Text style={styles.title}>Hello, User!</Text>
          <View>
            <InputField 
              label="Hourly Wage"
              placeholder="Enter a dollar amount..."
              value={income}
              onChangeText={setIncome}
            />
             <InputField 
              label="Salary"
              placeholder="Enter a dollar amount..."
              value={income}
              onChangeText={setIncome}
            /> 
            {/* only accept either hourly wage OR salary for income */}
            {/* need to change form types to only accept currency type */}
             <InputField 
              label="Expense"
              placeholder="Enter a dollar amount..."
              value={expenses}
              onChangeText={setExpenses}
            />
             <InputField 
              placeholder="Description..."
              value={expenseLabel}
              onChangeText={setExpenseLabel}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button title='Submit' onPress={handleSave} />
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  flexDirection: 'row',
  marginTop: 15,
  marginLeft: 35,
  marginRight: 50
 },
  avatarContainer: {
  width: 112,
  height: 110.78,
  marginRight: 35,
 },
 title: {
  color: '#BE5EAC',
  fontSize: 40,
  fontWeight: '500',
  fontFamily: 'AlikeAngular-Regular',
 },
 inputForm: {
  flexDirection: 'column',
  gap: 22
 },
 buttonContainer: {
  marginTop: 23
 },
 submitButton: {
  borderRadius: 22.14,
  backgroundColor: '#BE5EAC',
 }
});
