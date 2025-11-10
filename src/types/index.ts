import type { Timestamp } from 'firebase/firestore';

export type Course = {
  id: string;
  level: 'Jardín' | 'Primaria' | 'Secundaria';
  courseName: string;
  time: string; // HH:mm format
  lugar: 'Llegada' | 'Salida';
  createdAt: Timestamp;
};
