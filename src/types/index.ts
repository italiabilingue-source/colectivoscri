import type { Timestamp } from 'firebase/firestore';

export type Course = {
  id: string;
  userId?: string; // userId es ahora opcional
  level: 'Jardín' | 'Primaria' | 'Secundaria';
  className: string;
  time: string; // HH:mm format
  lugar: string;
  notes?: string;
  movimiento: string;
  createdAt: Timestamp;
};
