// app/constants/emergency.ts
export const EMERGENCY_NUMBERS = {
  RU: {
    police: '102',
    ambulance: '103',
    fire: '101',
    psychological: '8-800-2000-122',
    name: 'Россия',
  },
  UA: {
    police: '102',
    ambulance: '103',
    fire: '101',
    psychological: '7333',
    name: 'Украина',
  },
  BY: {
    police: '102',
    ambulance: '103',
    fire: '101',
    psychological: '8-801-100-1611',
    name: 'Беларусь',
  },
  KZ: {
    police: '102',
    ambulance: '103',
    fire: '101',
    psychological: '150',
    name: 'Казахстан',
  },
  default: {
    police: '112',
    ambulance: '112',
    fire: '112',
    psychological: '116123',
    name: 'Международный',
  },
} as const;

export type CountryCode = keyof typeof EMERGENCY_NUMBERS;
