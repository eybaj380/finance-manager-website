import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Category = { id: string; name: string; planned: number; spent: number };

export default function BudgetTrackerScreen() {
  const [income, setIncome] = useState('');
  const [catName, setCatName] = useState('');
  const [catPlanned, setCatPlanned] = useState('');
  const [catSpent, setCatSpent] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  function addCategory() {
    if (!catName.trim()) {
      Alert.alert('Validation', 'Please enter a category name.');
      return;
    }
    const planned = parseFloat(catPlanned) || 0;
    const spent = parseFloat(catSpent) || 0;
    const newCat: Category = { id: String(Date.now()), name: catName.trim(), planned, spent };
    setCategories((c) => [newCat, ...c]);
    setCatName('');
    setCatPlanned('');
    setCatSpent('');
  }

  function removeCategory(id: string) {
    setCategories((c) => c.filter((x) => x.id !== id));
  }

  const totals = useMemo(() => {
    const totalPlanned = categories.reduce((s, c) => s + c.planned, 0);
    const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
    const inc = parseFloat(income) || 0;
    const remaining = inc - totalSpent;
    return { totalPlanned, totalSpent, income: inc, remaining };
  }, [categories, income]);

  const payload = useMemo(() => {
    return JSON.stringify({ income: totals.income, categories }, null, 2);
  }, [totals.income, categories]);

  const [serverResult, setServerResult] = useState<string | null>(null);
  const [loadingServer, setLoadingServer] = useState(false);

  async function calculateOnServer() {
    setLoadingServer(true);
    setServerResult(null);
    try {
      const resp = await fetch('http://localhost:8000/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ income: totals.income, categories }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        Alert.alert('Server error', `${resp.status}: ${text}`);
        return;
      }

      const json = await resp.json();
      setServerResult(JSON.stringify(json, null, 2));
    } catch (err: any) {
      Alert.alert('Network error', err.message ?? String(err));
    } finally {
      setLoadingServer(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Budget Planner</ThemedText>

        <ThemedText style={styles.label}>Monthly Income</ThemedText>
        <TextInput
          keyboardType="numeric"
          value={income}
          onChangeText={setIncome}
          placeholder="0.00"
          style={styles.input}
        />

        <ThemedText type="subtitle" style={{ marginTop: 12 }}>
          Add Category
        </ThemedText>

        <ThemedText style={styles.label}>Name</ThemedText>
        <TextInput value={catName} onChangeText={setCatName} placeholder="Groceries" style={styles.input} />

        <ThemedText style={styles.label}>Planned Amount</ThemedText>
        <TextInput
          keyboardType="numeric"
          value={catPlanned}
          onChangeText={setCatPlanned}
          placeholder="0.00"
          style={styles.input}
        />

        <ThemedText style={styles.label}>Already Spent</ThemedText>
        <TextInput
          keyboardType="numeric"
          value={catSpent}
          onChangeText={setCatSpent}
          placeholder="0.00"
          style={styles.input}
        />

        <TouchableOpacity onPress={addCategory} style={styles.addButton}>
          <ThemedText type="defaultSemiBold">Add Category</ThemedText>
        </TouchableOpacity>

        <ThemedText type="subtitle" style={{ marginTop: 16 }}>
          Categories
        </ThemedText>

        {categories.length === 0 ? (
          <ThemedText style={{ marginTop: 8 }}>No categories yet. Add one above.</ThemedText>
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            style={{ marginTop: 8 }}
            renderItem={({ item }) => (
              <View style={styles.catRow}>
                <View style={{ flex: 1 }}>
                  <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                  <ThemedText>Planned: ${item.planned.toFixed(2)}</ThemedText>
                  <ThemedText>Spent: ${item.spent.toFixed(2)}</ThemedText>
                  <ThemedText>
                    Remaining: ${(item.planned - item.spent).toFixed(2)} ({
                    item.planned > 0 ? ((item.spent / item.planned) * 100).toFixed(0) : '0'}%)
                  </ThemedText>
                </View>
                <TouchableOpacity onPress={() => removeCategory(item.id)} style={styles.removeBtn}>
                  <ThemedText>Remove</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <ThemedText type="subtitle" style={{ marginTop: 18 }}>
          Summary
        </ThemedText>
        <ThemedText>Total Planned: ${totals.totalPlanned.toFixed(2)}</ThemedText>
        <ThemedText>Total Spent: ${totals.totalSpent.toFixed(2)}</ThemedText>
        <ThemedText>Income: ${totals.income.toFixed(2)}</ThemedText>
        <ThemedText>Remaining (Income - Spent): ${totals.remaining.toFixed(2)}</ThemedText>

        <ThemedText type="subtitle" style={{ marginTop: 18 }}>
          QR-ready Payload
        </ThemedText>
        <ThemedText style={styles.payload}>{payload}</ThemedText>

        <TouchableOpacity onPress={calculateOnServer} style={[styles.addButton, { marginTop: 12 }]}> 
          <ThemedText type="defaultSemiBold">{loadingServer ? 'Calculating...' : 'Calculate (server)'}</ThemedText>
        </TouchableOpacity>

        {serverResult && (
          <>
            <ThemedText type="subtitle" style={{ marginTop: 12 }}>
              Server Result
            </ThemedText>
            <ThemedText style={styles.payload}>{serverResult}</ThemedText>
          </>
        )}

        <ThemedText style={{ marginTop: 12 }}>
          The JSON above is ready to be encoded as a QR code. If you want me to add an in-app
          QR generator (so the app shows the QR image), I can add that — it requires a small
          dependency like <ThemedText type="defaultSemiBold">react-native-qrcode-svg</ThemedText>.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  label: {
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: Platform.select({ web: 8, default: 10 }),
    marginTop: 6,
  },
  addButton: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
  },
  catRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#f6f6f6',
    marginBottom: 8,
  },
  removeBtn: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  payload: {
    marginTop: 8,
    fontFamily: Platform.select({ web: 'monospace', default: undefined }),
    backgroundColor: '#fff0',
  },
});
