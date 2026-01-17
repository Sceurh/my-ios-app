// app/contexts/MoodContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MoodType } from '../constants/themes';

interface MoodEntry {
  mood: MoodType;
  date: string;
  note?: string;
}

interface MoodContextType {
  currentMood: MoodType;
  moodHistory: MoodEntry[];
  setMood: (mood: MoodType, note?: string) => Promise<void>;
  getTodayMood: () => MoodEntry | null;
  getWeekStats: () => { [key in MoodType]: number };
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: React.ReactNode }) {
  const [currentMood, setCurrentMood] = useState<MoodType>('calm');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = async () => {
    try {
      // Загружаем историю
      const savedHistory = await AsyncStorage.getItem('mood_history');
      if (savedHistory) {
        setMoodHistory(JSON.parse(savedHistory));
      }

      // Загружаем текущее настроение
      const savedMood = await AsyncStorage.getItem('current_mood');
      const savedDate = await AsyncStorage.getItem('mood_date');
      const today = new Date().toDateString();

      if (savedMood && savedDate === today) {
        setCurrentMood(savedMood as MoodType);
      }
    } catch (error) {
      console.error('Error loading mood data:', error);
    } finally {
      setIsReady(true);
    }
  };

  const saveMoodData = async (history: MoodEntry[]) => {
    try {
      await AsyncStorage.setItem('mood_history', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving mood data:', error);
    }
  };

  const setMood = async (mood: MoodType, note?: string) => {
    const today = new Date();
    const todayString = today.toDateString();

    const newEntry: MoodEntry = {
      mood,
      date: today.toISOString(),
      note,
    };

    // Обновляем текущее настроение
    setCurrentMood(mood);
    await AsyncStorage.setItem('current_mood', mood);
    await AsyncStorage.setItem('mood_date', todayString);

    // Добавляем в историю
    const updatedHistory = [...moodHistory, newEntry];
    setMoodHistory(updatedHistory);
    await saveMoodData(updatedHistory);
  };

  const getTodayMood = () => {
    const today = new Date().toDateString();
    return (
      moodHistory.find(
        (entry) => new Date(entry.date).toDateString() === today,
      ) || null
    );
  };

  const getWeekStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weekEntries = moodHistory.filter(
      (entry) => new Date(entry.date) > weekAgo,
    );

    const stats = {
      calm: 0,
      energy: 0,
      focus: 0,
      rest: 0,
    };

    weekEntries.forEach((entry) => {
      stats[entry.mood]++;
    });

    return stats;
  };

  if (!isReady) {
    return null;
  }

  return (
    <MoodContext.Provider
      value={{
        currentMood,
        moodHistory,
        setMood,
        getTodayMood,
        getWeekStats,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
}

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within MoodProvider');
  }
  return context;
};
