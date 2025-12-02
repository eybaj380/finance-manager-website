import SimpleBarChart from '@/components/ui/simple-bar-chart';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
    return true;
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
      <ScrollView contentContainerStyle={styles.content}>
        <Text>Budget Planner</Text>

        <Text style={styles.label}>Monthly Income</Text>
        <TextInput
          keyboardType="numeric"
          value={income}
          onChangeText={setIncome}
          placeholder="0.00"
          style={styles.input}
          placeholderTextColor="#9a9a9a"
        />

        <Text style={{ marginTop: 12 }}>
          Add Category
        </Text>

        <Text style={styles.label}>Name</Text>
        <TextInput value={catName} onChangeText={setCatName} placeholder="Groceries" style={styles.input} />

        <Text style={styles.label}>Planned Amount</Text>
        <TextInput
          keyboardType="numeric"
          value={catPlanned}
          onChangeText={setCatPlanned}
          placeholder="0.00"
          style={styles.input}
          placeholderTextColor="#9a9a9a"
        />

        <Text style={styles.label}>Already Spent</Text>
        <TextInput
          keyboardType="numeric"
          value={catSpent}
          onChangeText={setCatSpent}
          placeholder="0.00"
          style={styles.input}
          placeholderTextColor="#9a9a9a"
        />

        <TouchableOpacity
          onPress={() => {
            const ok = addCategory();
            if (ok) Alert.alert('Category added', 'Category added successfully');
          }}
          style={styles.addButton}
          accessibilityRole="button"
        >
          <Text style={styles.addButtonText}>
            Add Category
          </Text>
        </TouchableOpacity>

        <Text  style={{ marginTop: 16 }}>
          Categories
        </Text>

        {categories.length === 0 ? (
          <Text style={{ marginTop: 8 }}>No categories yet. Add one above.</Text>
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            style={{ marginTop: 8 }}
            renderItem={({ item }) => (
              <View style={styles.catRow}>
                <View style={{ flex: 1 }}>
                  <Text>{item.name}</Text>
                  <Text>Planned: ${item.planned.toFixed(2)}</Text>
                  <Text>Spent: ${item.spent.toFixed(2)}</Text>
                  <Text>
                    Remaining: ${(item.planned - item.spent).toFixed(2)} ({
                    item.planned > 0 ? ((item.spent / item.planned) * 100).toFixed(0) : '0'}%)
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeCategory(item.id)} style={styles.removeBtn}>
                  <Text>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        {/* Chart */}
        <Text style={{ marginTop: 18 }}>
          Charts
        </Text>

        {categories.length === 0 ? (
          <Text style={{ marginTop: 8 }}>Add categories to see charts.</Text>
        ) : (
          <SimpleBarChart
            data={categories.map((c) => ({ label: c.name, planned: c.planned, spent: c.spent }))}
          />
        )}

        <Text style={{ marginTop: 18 }}>
          Summary
        </Text>
        <Text>Total Planned: ${totals.totalPlanned.toFixed(2)}</Text>
        <Text>Total Spent: ${totals.totalSpent.toFixed(2)}</Text>
        <Text>Income: ${totals.income.toFixed(2)}</Text>
        <Text>Remaining (Income - Spent): ${totals.remaining.toFixed(2)}</Text>

        <TouchableOpacity onPress={calculateOnServer} style={[styles.addButton, { marginTop: 12 }]}> 
          <Text>{loadingServer ? 'Calculating...' : 'Calculate (server)'}</Text>
        </TouchableOpacity>

        {serverResult && (
          <>
            <Text style={{ marginTop: 12 }}>
              Server Result
            </Text>
            <Text style={styles.payload}>{serverResult}</Text>
          </>
        )}
      </ScrollView>
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
    color: '#ffffff',
    marginTop: 6,
  },
  addButton: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#4b9df8',
  },
  addButtonText: {
    color: '#ffffff',
  },
  catRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 10,
    borderRadius: 6,
    backgroundColor: Platform.select({ web: '#262626', default: '#2a2a2a' }),
    marginBottom: 8,
  },
  removeBtn: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  payload: {
    marginTop: 8,
    fontFamily: Platform.select({ web: 'monospace', default: undefined }),
    backgroundColor: 'transparent',
    color: '#ffffff',
    padding: 8,
    borderRadius: 6,
  },
});
