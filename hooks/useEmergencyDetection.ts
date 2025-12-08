import { useRouter } from 'expo-router';
import { useEffect } from 'react';

const emergencyKeywords = [
  'потеря сознания',
  'остановка дыхания',
  'боли в груди',
  'кровотечение',
  'инфаркт',
  'паника',
];

export const useEmergencyDetection = (inputText: string) => {
  const router = useRouter();

  useEffect(() => {
    if (!inputText) return;
    try {
      const found = emergencyKeywords.some((keyword) =>
        inputText.toLowerCase().includes(keyword),
      );
      if (found) {
        // небольшая хака для обхода строгой типизации роутера
        (router as any).push('/screens/EmergencyModal');
      }
    } catch (err) {
      // не ломаем UI
      console.warn('Emergency detection failed', err);
    }
  }, [inputText, router]);
};
