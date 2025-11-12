import type { Timestamp } from 'firebase/firestore';

export type Course = {
  id: string;
  level: 'Jardín' | 'Primaria' | 'Secundaria';
  courseName: string | string[]; // Can be a single string or an array of strings
  time: string; // HH:mm format
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';
  lugar: 'Chacra' | 'Escuela';
  colectivo: 'Cachi' | 'Bili';
  movimiento: 'Llegada' | 'Salida';
  createdAt: Timestamp;
};

// Nuevos tipos para la gestión de asistencia de secundaria
export type Student = {
    id: string;
    courseId: string;
    name: string;
    va: boolean; // Asistencia a la ida
    vuelve: boolean; // Asistencia a la vuelta
    order?: number; // Opcional para orden personalizado
    createdAt: Timestamp;
};

export type SecondaryCourse = {
    id: string;
    name: string;
    createdAt: Timestamp;
    students?: Student[];
};
