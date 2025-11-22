import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

type Item = { label: string; planned: number; spent: number };

type Props = {
  data: Item[];
  barHeight?: number;
};

export default function SimpleBarChart({ data, barHeight = 18 }: Props) {
  if (!data || data.length === 0) return null;

  const max = Math.max(
    1,
    ...data.map((d) => Math.max(d.planned || 0, d.spent || 0)),
  );

  return (
    <View style={styles.wrapper}>
      {data.map((d) => {
        const plannedPct = Math.round(((d.planned || 0) / max) * 100);
        const spentPct = Math.round(((d.spent || 0) / max) * 100);
        return (
          <View key={d.label} style={styles.row}>
            <View style={styles.labelCol}>
              <ThemedText type="defaultSemiBold" numberOfLines={1}>
                {d.label}
              </ThemedText>
            </View>

            <View style={styles.chartCol}>
              <View style={[styles.barBase, { height: barHeight }]}> 
                <View style={[styles.plannedBar, { width: `${plannedPct}%`, height: barHeight }]} />
                <View style={[styles.spentBar, { width: `${spentPct}%`, height: barHeight }]} />
              </View>
              <View style={styles.numbersRow}>
                <ThemedText style={styles.numText}>Planned: ${d.planned.toFixed(2)}</ThemedText>
                <ThemedText style={styles.numText}>Spent: ${d.spent.toFixed(2)}</ThemedText>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelCol: {
    flex: 1,
    paddingRight: 8,
  },
  chartCol: {
    flex: 2,
  },
  barBase: {
    width: '100%',
    backgroundColor: Platform.select({ web: '#eee', default: '#f0f0f0' }),
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  plannedBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: '#cfcfcf',
  },
  spentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: '#4b9df8',
    opacity: 0.95,
  },
  numbersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  numText: {
    fontSize: 12,
  },
});
