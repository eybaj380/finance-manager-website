import TimelinePin from '@/components/ui/timeline-pin';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TimelinePage() {
  const [pins, setPins] = useState<{ date: string; amount: number; note?: string }[]>([]);
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');

  function addPin() {
    const amt = parseFloat(amount) || 0;
    if (!date) return;
    setPins((p) => [{ date, amount: amt, note }, ...p]);
    setDate('');
    setAmount('');
    setNote('');
  }

  const goal = parseFloat(savingsGoal) || 0;
  const split = goal ? (goal / 5) : 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text>Budget Timeline</Text>

        <Text style={styles.label}>Savings Goal</Text>
        <TextInput value={savingsGoal} onChangeText={setSavingsGoal} keyboardType="numeric" style={styles.input} placeholder="0.00" placeholderTextColor="#9a9a9a" />
        <Text>Split into 5: ${split.toFixed(2)}</Text>

        <Text style={{ marginTop: 12 }}>Add Pin</Text>
        <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
        <TextInput value={date} onChangeText={setDate} style={styles.input} placeholderTextColor="#9a9a9a" />
        <Text style={styles.label}>Amount</Text>
        <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} placeholderTextColor="#9a9a9a" />
        <Text style={styles.label}>Note</Text>
        <TextInput value={note} onChangeText={setNote} style={styles.input} placeholderTextColor="#9a9a9a" />
        <TouchableOpacity style={styles.button} onPress={addPin}><Text style={styles.buttonText}>Pin</Text></TouchableOpacity>

        <Text style={{ marginTop: 18 }}>Timeline</Text>
        {pins.length === 0 ? <Text style={{ marginTop: 8 }}>No pins yet.</Text> : pins.map((p, i) => <TimelinePin key={String(i)} date={p.date} amount={p.amount} note={p.note} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  label: { marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginTop: 6, color: '#ffffff' },
  button: { marginTop: 12, padding: 10, borderRadius: 8, backgroundColor: '#4b9df8', alignItems: 'center' },
  buttonText: { color: '#fff' },
});
