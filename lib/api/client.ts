export const apiClient = async (path: string, opts: RequestInit = {}) => {
const base = process.env.EXPO_PUBLIC_API_URL ?? 'https://your-backend.com';
const res = await fetch(`${base}${path}`, opts);
if (!res.ok) throw new Error('API error');
return res.json();
};