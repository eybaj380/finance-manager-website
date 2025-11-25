import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import HandWave from '../../assets/images/hand_wave.svg';
import UserAvatar from '../../assets/images/user-avatar.svg';
import { InputField } from '../../components/input-field';

export default function HomeScreen() {
  const [wage, setWage] = useState('');
  const [salary, setSalary] = useState('');
  const [expenses, setExpenses] = useState(''); //TODO: change expenses to be an object array
  const [expenseLabel, setExpenseLabel] = useState('');
  const [isMessageDismissed, setIsMessageDismissed] = useState(false);
  const [isInputSaved, setIsInputSaved] = useState(false);

  const handleSubmit = () => {
    //input data type validation
    let regex = new RegExp("^(\$)?(([1-9]\d{0,2}(\,\d{3})*)|([1-9]\d*)|(0))(\.\d{2})?$"); //validating US dollars, including zero dollars
    if (regex.test(wage && salary && expenses) === true) { //both income & expenses must match data type
      return wage && salary && expenses;
    } 
    if (regex.test(wage || salary || expenses) === false) { //if either income or expenses are not the correct data type, show user message
      alert('Error - Input field must contain monetary amount.');
    }

    //make all input fields required
    if(expenses.trim() === '' || expenseLabel.trim() === '') {
      alert('Error - Input fields cannot be empty.');
    } 
    else {
      alert(`Data saved: \nIncome - ${wage}\nExpenses - ${expenses}\nDescription - ${expenseLabel}`); 
      setWage('');
      setSalary('');
      setExpenses('');
      setExpenseLabel('');
      setIsInputSaved(true);
    }
  }; 

  return (
      <View style={styles.container}>
        <Image source={UserAvatar} style={styles.avatarContainer}/>
        <View style={styles.inputForm}>
          <Text style={styles.title}>Hello, User!</Text>
          <ScrollView>
            <Text style={styles.header}>Income (only enter one field)</Text>
            <InputField 
              label="Hourly Wage"
              placeholder="$0.00..."
              value={wage}
              onChangeText={setWage}
              editable={!salary}
            />
            <InputField 
              label="Salary"
              placeholder="$0.00..."
              value={salary}
              onChangeText={setSalary}
              editable={!wage}
            /> 
            <View>
              <InputField 
                label="Expense"
                isButtonPresent={true}
                placeholder="$0.00..."
                value={expenses}
                onChangeText={setExpenses}
              />
              <InputField 
                placeholder="Description..."
                value={expenseLabel}
                onChangeText={setExpenseLabel}
              />
            </View>
            <Pressable style={styles.buttonContainer} onPress={handleSubmit}>
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
 header: {
  flex: 1,
  fontFamily: 'AlikeAngular-Regular',
  fontSize: 25,
  marginBottom: 10,
  color: '#4fa428ff',
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
