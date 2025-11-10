import type { Timestamp } from 'firebase/firestore';

export type Course = {
  id: string;
  level: 'Jardín' | 'Primaria' | 'Secundaria';
  courseName: string;
  time: string; // HH:mm format
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';
  lugar: 'Chacra' | 'Escuela';
  colectivo: 'Cachi' | 'CRI';
  movimiento: 'Llegada' | 'Salida';
  createdAt: Timestamp;
};
