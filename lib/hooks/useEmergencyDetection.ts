import { useRouter } from 'expo-router';
import { useEffect } from 'react';

const emergencyKeywords = [
  'потеря сознания',
  'остановка дыхания',
  'боли в груди',
  'кровотечение',
  'инфаркт',
  'паника'
];

export const useEmergencyDetection = (inputText: string) => {
  const router = useRouter();

  useEffect(() => {
    const found = emergencyKeywords.some(keyword =>
      inputText.toLowerCase().includes(keyword)
    );
    if (found) {
      router.push('/screens/EmergencyModal');
    }
  }, [inputText]);
};
