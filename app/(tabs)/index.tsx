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
  const [report, setReport] = useState<any | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const handleSubmit = () => {
    // parse monetary inputs like "$1,000.00" or "1000"
    const parseMoney = (s: string) => {
      if (!s) return NaN;
      const cleaned = String(s).replace(/[^0-9.\-]/g, '').trim();
      if (cleaned === '') return NaN;
      const n = Number(cleaned);
      return Number.isFinite(n) ? n : NaN;
    };

    const wageVal = parseMoney(wage);
    const salaryVal = parseMoney(salary);
    const expenseVal = parseMoney(expenses);

    // require exactly one income field (hourly wage OR salary)
    if ((Number.isNaN(wageVal) || wageVal <= 0) && (Number.isNaN(salaryVal) || salaryVal <= 0)) {
      alert('Please enter either an hourly wage or a salary (a positive number).');
      return;
    }
    if (wage && salary) {
      alert('Please enter only one of Hourly Wage or Salary, not both.');
      return;
    }

    // validate expense
    if (Number.isNaN(expenseVal) || expenseVal <= 0) {
      alert('Please enter a valid expense amount (e.g. 10.00 or $10.00).');
      return;
    }

    if (!expenseLabel || expenseLabel.trim() === '') {
      alert('Please enter a description for the expense.');
      return;
    }

    // build payload for backend
    const payload: any = { expenses: [{ name: expenseLabel.trim(), amount: Number(expenseVal) }] };
    if (salaryVal && !Number.isNaN(salaryVal) && salaryVal > 0) payload.salary_monthly = salaryVal;
    else if (wageVal && !Number.isNaN(wageVal) && wageVal > 0) payload.hourly_rate = wageVal;

    // send to backend and render report
    setLoadingReport(true);
    setReportError(null);
    fetch('http://127.0.0.1:8000/financial-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (r) => {
        if (!r.ok) {
          const txt = await r.text();
          throw new Error(`${r.status}: ${txt}`);
        }
        return r.json();
      })
      .then((data) => {
        setReport(data);
        setIsInputSaved(true);
        // clear inputs
        setWage('');
        setSalary('');
        setExpenses('');
        setExpenseLabel('');
      })
      .catch((err) => {
        console.error('Report error', err);
        setReportError(String(err.message ?? err));
        alert('Unable to fetch report: ' + String(err.message ?? err));
      })
      .finally(() => setLoadingReport(false));
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
              keyboardType="numeric"
              editable={!salary}
            />
            <InputField 
              label="Salary"
              placeholder="$0.00..."
              value={salary}
              onChangeText={setSalary}
              keyboardType="numeric"
              editable={!wage}
            /> 
            <View>
              <InputField 
                label="Expense"
                isButtonPresent={true}
                placeholder="$0.00..."
                value={expenses}
                onChangeText={setExpenses}
                keyboardType="numeric"
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
            {loadingReport ? (
              <Text style={styles.noData}>Generating report…</Text>
            ) : reportError ? (
              <Text style={styles.noData}>Error: {reportError}</Text>
            ) : !isInputSaved || !report ? (
              <Text style={styles.noData}>No financial goals set or data given. Please submit income and expenses to generate the report.</Text>
            ) : (
              // render report
              <View style={{ marginTop: 8 }}>
                <Text style={{ fontWeight: '600' }}>Gross Monthly: ${report.gross_monthly.toFixed(2)}</Text>
                <Text>Total Expenses: ${report.total_expenses.toFixed(2)}</Text>
                <Text>Net Monthly: ${report.net_monthly.toFixed(2)}</Text>
                <Text>Savings Rate: {report.savings_rate_pct}%</Text>
                <Text style={{ marginTop: 8, fontWeight: '600' }}>Expenses</Text>
                {Array.isArray(report.expenses) && report.expenses.length ? (
                  report.expenses.map((e: any, i: number) => (
                    <View key={i} style={{ marginTop: 6 }}>
                      <Text>{e.name}: ${Number(e.amount).toFixed(2)}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={{ marginTop: 6 }}>No expenses listed.</Text>
                )}
              </View>
            )}
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
