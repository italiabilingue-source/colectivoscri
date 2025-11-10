import type { Timestamp } from 'firebase/firestore';

export type Itinerary = {
  id: string;
  userId: string;
  origin: 'School' | 'Farm';
  destination: 'School' | 'Farm';
  time: string; // HH:mm format
  day: string;
  notes?: string;
  status: string;
  createdAt: Timestamp;
};
