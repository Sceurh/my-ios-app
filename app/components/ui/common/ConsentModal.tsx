import { appendAudit } from '@/app/lib/storage/audit';
import React from 'react';
import { Button, Modal, ScrollView, StyleSheet, Text } from 'react-native';

type Props = {
  visible: boolean;
  onAccept: (rec: any) => void;
};

export default function ConsentModal({ visible, onAccept }: Props) {
  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Согласие</Text>
        <Text style={styles.text}>
          вы соглашаетесь с тем, что информация образовательная...
        </Text>
        <Button
          title="Я согласен"
          onPress={async () => {
            const rec = {
              id: Date.now().toString(),
              acceptedAt: new Date().toISOString(),
              textHash: 'v1',
            };
            await appendAudit({
              action: 'consent.accept',
              details: rec,
              timestamp: rec.acceptedAt,
            });
            onAccept(rec);
          }}
        />
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  text: { fontSize: 14, marginBottom: 18 },
});
