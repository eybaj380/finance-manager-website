import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import TimelinePin from '@/components/ui/timeline-pin';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

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
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Budget Timeline</ThemedText>

        <ThemedText style={styles.label}>Savings Goal</ThemedText>
        <TextInput value={savingsGoal} onChangeText={setSavingsGoal} keyboardType="numeric" style={styles.input} placeholder="0.00" placeholderTextColor="#9a9a9a" />
        <ThemedText>Split into 5: ${split.toFixed(2)}</ThemedText>

        <ThemedText type="subtitle" style={{ marginTop: 12 }}>Add Pin</ThemedText>
        <ThemedText style={styles.label}>Date (YYYY-MM-DD)</ThemedText>
        <TextInput value={date} onChangeText={setDate} style={styles.input} placeholderTextColor="#9a9a9a" />
        <ThemedText style={styles.label}>Amount</ThemedText>
        <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} placeholderTextColor="#9a9a9a" />
        <ThemedText style={styles.label}>Note</ThemedText>
        <TextInput value={note} onChangeText={setNote} style={styles.input} placeholderTextColor="#9a9a9a" />
        <TouchableOpacity style={styles.button} onPress={addPin}><ThemedText type="defaultSemiBold" style={styles.buttonText}>Pin</ThemedText></TouchableOpacity>

        <ThemedText type="subtitle" style={{ marginTop: 18 }}>Timeline</ThemedText>
        {pins.length === 0 ? <ThemedText style={{ marginTop: 8 }}>No pins yet.</ThemedText> : pins.map((p, i) => <TimelinePin key={String(i)} date={p.date} amount={p.amount} note={p.note} />)}
      </ScrollView>
    </ThemedView>
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
