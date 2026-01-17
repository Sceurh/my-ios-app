// app/hooks/useStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export const useStorage = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Инициализируем хранилище
    setIsReady(true);
  }, []);

  const getItem = useCallback(async (key: string): Promise<any> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }, []);

  const setItem = useCallback(
    async (key: string, value: any): Promise<void> => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving to storage:', error);
      }
    },
    [],
  );

  const removeItem = useCallback(async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  }, []);

  const clearAll = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }, []);

  return {
    isReady,
    getItem,
    setItem,
    removeItem,
    clearAll,
  };
};
