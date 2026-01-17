// app/lib/database/local.ts
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

const DATABASE_NAME = 'mindcare.db';

export interface MoodEntry {
  id?: number;
  mood: string;
  date: string;
  note?: string;
}

export interface JournalEntry {
  id?: number;
  content: string;
  date: string;
  mood?: string;
  tags?: string;
}

export interface PracticeEntry {
  id?: number;
  practiceId: string;
  completed: boolean;
  date: string;
  duration?: number;
}

class LocalDatabase {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    if (Platform.OS === 'web') {
      // Для веба используем IndexedDB
      return;
    }

    this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS moods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mood TEXT NOT NULL,
        date TEXT NOT NULL,
        note TEXT
      );
      
      CREATE TABLE IF NOT EXISTS journal (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        mood TEXT,
        tags TEXT
      );
      
      CREATE TABLE IF NOT EXISTS practices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        practiceId TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        date TEXT NOT NULL,
        duration INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS saved_content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        contentId TEXT NOT NULL,
        data TEXT NOT NULL,
        savedAt TEXT NOT NULL
      );
    `);
  }

  async saveMood(entry: MoodEntry): Promise<void> {
    if (!this.db) return;

    await this.db.runAsync(
      'INSERT INTO moods (mood, date, note) VALUES (?, ?, ?)',
      [entry.mood, entry.date, entry.note || null],
    );
  }

  async getMoods(limit: number = 30): Promise<MoodEntry[]> {
    if (!this.db) return [];

    const result = await this.db.getAllAsync<MoodEntry>(
      'SELECT * FROM moods ORDER BY date DESC LIMIT ?',
      [limit],
    );
    return result;
  }

  async saveJournalEntry(entry: JournalEntry): Promise<void> {
    if (!this.db) return;

    await this.db.runAsync(
      'INSERT INTO journal (content, date, mood, tags) VALUES (?, ?, ?, ?)',
      [entry.content, entry.date, entry.mood || null, entry.tags || null],
    );
  }

  // ... остальные методы
}

export const localDB = new LocalDatabase();
