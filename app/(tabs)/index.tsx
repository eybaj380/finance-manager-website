import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import HandWave from '../../assets/images/hand_wave.svg';
import UserAvatar from '../../assets/images/user-avatar.svg';
import { InputField } from '../../components/input-field';

export default function HomeScreen() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  //change to be an array of strings
  const [expenseLabel, setExpenseLabel] = useState('');
  const [isMessageDismissed, setIsMessageDismissed] = useState(false);
  const [isInputSaved, setIsInputSaved] = useState(false);

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
          <ScrollView>
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
            <View>
              <InputField 
                label="Expense"
                isButtonPresent={true}
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
            <Pressable style={styles.buttonContainer} onPress={handleSave}>
              <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
          </ScrollView>
        </View>
        <View style={styles.messagesContainer}>
          {!isMessageDismissed ? (
            <View style={styles.welcomeContainer}>
              <Image source={HandWave} style={styles.handWaveContainer}/>
              <View style={styles.internalTextContainer}>
                <Text style={styles.welcomeMessage}>Welcome to your personal financial dashboard! To get started, enter your hourly wage or yearly salary as well as adding monthly expenses. Click the plus button to continue adding expenses. Once you have filled out the form, press the Submit button to continue.</Text>
                <Pressable onPress={() => setIsMessageDismissed(true)}>
                  <Text style={styles.dismissText}>Dismiss message</Text>
                </Pressable>
              </View>
            </View> 
          ) : null}
          <View style={styles.financeReportContainer}>
            <Text style={[styles.title, {textAlign: 'center'}]}>Financial Report</Text>
            {!isInputSaved ? (<Text style={styles.noData}>No financial goals set or data given. Please submit income and expenses to generate the report.</Text>) : null}
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
  marginBottom: 24,
 },
 inputForm: {
  flexDirection: 'column',
  marginRight: 30,
 },
 buttonContainer: {
  borderRadius: 30,
  backgroundColor: '#7D28A4',
  paddingVertical: 10,
 },
 buttonText: {
   fontFamily: 'Amethysta-Regular',
   color: '#F5F5F5',
   fontSize: 25,
   alignSelf: 'center'
 },
 messagesContainer: {
  flex: 1, 
  flexDirection: 'column', 
  gap: 20,
  paddingBottom: 25
 },
 welcomeContainer: {
  flexDirection: 'row',
  width: 450,
  height: 150,
  backgroundColor: '#D0FFF5',
  borderRadius: 20,
  paddingLeft: 15,
  paddingTop: 10,
  paddingRight: 20,
 },
 internalTextContainer: {
  flex: 1, 
  gap: 10
 },
 handWaveContainer: {
  width: 37,
  height: 37,
  marginRight: 15,
 },
  welcomeMessage: {
  fontFamily: 'Amethysta-Regular', 
  fontSize: 16,
  color: '#757575'
 },
 dismissText: {
  fontFamily: 'Amethysta-Regular', 
  fontWeight: 'bold',
  fontSize: 17,
  color: '#BE5EAC'
 },
 financeReportContainer: {
  flex: 1,
  flexDirection: 'column',
  width: 450,
  height: 300,
  backgroundColor: '#FFEBEB',
  borderRadius: 15,
  paddingHorizontal: 30,
  paddingTop: 10,
  paddingBottom: 15,
 },
 noData: {
  fontFamily: 'Amethysta-Regular', 
  fontSize: 16,
  color: '#757575'
 }
});
