import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';


type UserProfile = {
id?: string;
email?: string;
name?: string;
dob?: string;
sex?: string;
weight?: number;
chronicConditions?: string[];
medications?: string[];
};


type AuthContextType = {
user: UserProfile | null;
login: (userData: UserProfile) => Promise<void>;
logout: () => Promise<void>;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [user, setUser] = useState<UserProfile | null>(null);


useEffect(() => {
(async () => {
try {
const stored = await SecureStore.getItemAsync('user');
if (stored) setUser(JSON.parse(stored));
} catch (err) {
console.warn('Failed to load user from secure store', err);
}
})();
}, []);


const login = async (userData: UserProfile) => {
await SecureStore.setItemAsync('user', JSON.stringify(userData));
setUser(userData);
};


const logout = async () => {
await SecureStore.deleteItemAsync('user');
setUser(null);
};


return (
<AuthContext.Provider value={{ user, login, logout }}>
{children}
</AuthContext.Provider>
);
};


export const useAuth = () => {
const ctx = useContext(AuthContext);
if (!ctx) throw new Error('useAuth must be used within AuthProvider');
return ctx;
};