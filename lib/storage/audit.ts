import AsyncStorage from '@react-native-async-storage/async-storage';

export async function appendAudit(entry: any) {
  try {
    const raw = await AsyncStorage.getItem('audit');
    const list = raw ? JSON.parse(raw) : [];
    list.push(entry);
    await AsyncStorage.setItem('audit', JSON.stringify(list));
  } catch (err) {
    console.error("Audit store error:", err);
  }
}
