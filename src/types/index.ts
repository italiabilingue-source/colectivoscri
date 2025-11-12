import type { Timestamp } from 'firebase/firestore';

export type Course = {
  id: string;
  level: 'Jardín' | 'Primaria' | 'Secundaria';
  courseName: string | string[];
  time: string; // HH:mm format
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';
  lugar: 'Chacra' | 'Escuela';
  colectivo: 'Cachi' | 'Bili';
  movimiento: 'Llegada' | 'Salida';
  createdAt: Timestamp;
};

export type Student = {
    id: string;
    courseId: string;
    name: string;
    order?: number;
    createdAt: Timestamp;
};

export type SecondaryCourse = {
    id: string;
    name: string;
    createdAt: Timestamp;
    students?: Student[];
};

export type AttendanceRecord = {
    id: string;
    studentId: string;
    courseId: string;
    tripId: string; // Corresponds to a Course document ID
    date: string; // YYYY-MM-DD
    status: 'va' | 'vuelve';
    createdAt: Timestamp;
};
