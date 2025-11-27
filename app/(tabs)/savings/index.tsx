import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type SavingsForm = {
  title: string;
  startDate: string;
  endDate: string;
  amount: string;
};

export default function SavingsPage() {
  const [form, setForm] = useState<SavingsForm>({ title: '', startDate: '', endDate: '', amount: '' });
  const [submissions, setSubmissions] = useState<SavingsForm[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const colorScheme = useColorScheme();

  function validateAndSubmit() {
    // basic required fields
    if (!form.title.trim()) return Alert.alert('Validation', 'Please enter a budget title');
    if (!form.startDate || !form.endDate) return Alert.alert('Validation', 'Start and end dates required');
    if (form.startDate === form.endDate) return Alert.alert('Validation', 'Start and end dates must be unique');

    // date range validation (assume YYYY-MM-DD)
    const s = new Date(form.startDate);
    const e = new Date(form.endDate);
    const diffDays = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    if (Number.isNaN(diffDays) || diffDays < 7) return Alert.alert('Validation', 'Date range must be at least 7 days');

    // prevent double-submit
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmissions((prev) => [form, ...prev]);
    setForm({ title: '', startDate: '', endDate: '', amount: '' });
    setTimeout(() => setIsSubmitting(false), 300);
    Alert.alert('Saved', 'Budget saved locally');
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Savings Page</ThemedText>

        <ThemedText style={styles.label}>Budget Title</ThemedText>
        <TextInput value={form.title} onChangeText={(t) => setForm({ ...form, title: t })} style={styles.input} />

        <ThemedText style={styles.label}>Start Date (YYYY-MM-DD)</ThemedText>
        <TextInput value={form.startDate} onChangeText={(t) => setForm({ ...form, startDate: t })} style={styles.input} />

        <ThemedText style={styles.label}>End Date (YYYY-MM-DD)</ThemedText>
        <TextInput value={form.endDate} onChangeText={(t) => setForm({ ...form, endDate: t })} style={styles.input} />

        <ThemedText style={styles.label}>Amount</ThemedText>
        <TextInput keyboardType="numeric" value={form.amount} onChangeText={(t) => setForm({ ...form, amount: t })} style={styles.input} />

        <TouchableOpacity style={styles.button} onPress={validateAndSubmit}>
          <ThemedText type="defaultSemiBold" style={styles.buttonText}>Submit Budget</ThemedText>
        </TouchableOpacity>

        <ThemedText type="subtitle" style={{ marginTop: 18 }}>Analytics</ThemedText>
        {submissions.length === 0 ? (
          <ThemedText style={{ marginTop: 8 }}>No data present</ThemedText>
        ) : (
          submissions.map((s, i) => (
            <View
              key={String(i)}
              style={[
                styles.subRow,
                { backgroundColor: colorScheme === 'dark' ? '#222' : styles.subRow.backgroundColor },
              ]}
            >
              <ThemedText type="defaultSemiBold">{s.title}</ThemedText>
              <ThemedText>{s.startDate} → {s.endDate} • ${s.amount || '0'}</ThemedText>
            </View>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  label: { marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginTop: 6 },
  button: { marginTop: 12, padding: 10, borderRadius: 8, backgroundColor: '#4b9df8', alignItems: 'center' },
  buttonText: { color: '#fff' },
  subRow: { padding: 8, borderRadius: 6, backgroundColor: '#f2f2f2', marginTop: 8 },
});
