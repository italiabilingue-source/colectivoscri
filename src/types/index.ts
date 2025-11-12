import type { Timestamp } from 'firebase/firestore';

export type Course = {
  id: string;
  level: 'Jardín' | 'Primaria' | 'Secundaria';
  courseName: string;
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
    createdAt: Timestamp;
};

export type SecondaryCourse = {
    id: string;
    name: string;
    createdAt: Timestamp;
    students?: Student[];
};
