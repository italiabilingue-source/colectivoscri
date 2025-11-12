'use server';

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Course } from '@/types';

const CourseSchema = z.object({
  id: z.string().optional(),
  level: z.enum(['Jardín', 'Primaria', 'Secundaria']),
  courseName: z.string().min(1, 'El curso/grado es requerido'),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido. Use HH:mm'),
  day: z.enum(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']),
  lugar: z.enum(['Chacra', 'Escuela']),
  colectivo: z.enum(['Cachi', 'Bili']),
  movimiento: z.enum(['Llegada', 'Salida']),
});

export async function addOrUpdateCourse(data: Omit<Course, 'id' | 'createdAt'> & { id?: string }) {
    const validatedFields = CourseSchema.safeParse(data);
    if (!validatedFields.success) {
        throw new Error('Datos inválidos');
    }

    try {
        if (data.id) {
            const docRef = doc(db, 'courses', data.id);
            await updateDoc(docRef, {
                ...validatedFields.data,
            });
        } else {
            await addDoc(collection(db, 'courses'), {
                ...validatedFields.data,
                createdAt: serverTimestamp(),
            });
        }
        revalidatePath('/');
        revalidatePath('/dashboard');
        revalidatePath('/secundario/admin');
        return { success: true };
    } catch (error) {
        console.error("Error al agregar/actualizar el documento: ", error);
        return { success: false, error: (error as Error).message };
    }
}


export async function deleteCourse(id: string) {
    try {
        await deleteDoc(doc(db, 'courses', id));
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error)
        {
        console.error("Error al eliminar el documento: ", error);
        return { success: false, error: (error as Error).message };
    }
}

// Acciones para la gestión de asistencia de secundaria

const SecondaryCourseSchema = z.object({
  name: z.string().min(1, 'El nombre del curso es requerido'),
});

export async function addSecondaryCourse(data: { name: string }) {
  const validatedFields = SecondaryCourseSchema.safeParse(data);
  if (!validatedFields.success) {
    throw new Error('Datos inválidos');
  }

  try {
    await addDoc(collection(db, 'secondary_courses'), {
      ...validatedFields.data,
      createdAt: serverTimestamp(),
    });
    revalidatePath('/secundario/admin');
    return { success: true };
  } catch (error) {
    console.error("Error al agregar el curso de secundaria: ", error);
    return { success: false, error: (error as Error).message };
  }
}

const StudentSchema = z.object({
    name: z.string().min(1, 'El nombre del alumno es requerido'),
    courseId: z.string().min(1, 'El ID del curso es requerido'),
});

export async function addStudentToCourse(data: { name: string, courseId: string }) {
    const validatedFields = StudentSchema.safeParse(data);
    if (!validatedFields.success) {
        throw new Error('Datos inválidos');
    }

    try {
        await addDoc(collection(db, 'students'), {
            ...validatedFields.data,
            va: false,
            vuelve: false,
            createdAt: serverTimestamp(),
        });
        revalidatePath(`/secundario/admin`);
        return { success: true };
    } catch (error) {
        console.error("Error al agregar el alumno: ", error);
        return { success: false, error: (error as Error).message };
    }
}


const AttendanceUpdateSchema = z.object({
    studentId: z.string(),
    field: z.enum(['va', 'vuelve']),
    value: z.boolean(),
});

export async function updateStudentAttendance(data: { studentId: string; field: 'va' | 'vuelve'; value: boolean }) {
    const validatedFields = AttendanceUpdateSchema.safeParse(data);
    if (!validatedFields.success) {
        throw new Error('Datos de asistencia inválidos');
    }
    
    const { studentId, field, value } = validatedFields.data;

    try {
        const studentRef = doc(db, 'students', studentId);
        await updateDoc(studentRef, { [field]: value });
        revalidatePath(`/secundario/admin`); 
        // No retornamos nada para una respuesta más rápida, el cambio se verá por UI
    } catch (error) {
        console.error("Error al actualizar la asistencia: ", error);
        // Devolvemos un error para que el cliente pueda manejarlo si es necesario
        return { success: false, error: (error as Error).message };
    }
}
