import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = { date: string; amount: number; note?: string };

export default function TimelinePin({ date, amount, note }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.dot} />
      <View style={styles.content}>
        <ThemedText type="defaultSemiBold">{date}</ThemedText>
        <ThemedText>${amount.toFixed(2)} {note ? `• ${note}` : ''}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#4b9df8', marginTop: 6 },
  content: { flex: 1 },
});
