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
  className: z.string().min(1, 'La clase es requerida'),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido. Use HH:mm'),
  lugar: z.string().min(1, 'El lugar es requerido'),
  movimiento: z.string().min(1, 'El movimiento es requerido'),
  notes: z.string().optional(),
});

export async function addOrUpdateCourse(data: Omit<Course, 'id' | 'createdAt' | 'userId'> & { id?: string }) {
    // La validación de usuario se ha eliminado
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
                // userId ya no es necesario
                createdAt: serverTimestamp(),
            });
        }
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error("Error al agregar/actualizar el documento: ", error);
        return { success: false, error: (error as Error).message };
    }
}


export async function deleteCourse(id: string) {
    // La validación de usuario se ha eliminado
    try {
        await deleteDoc(doc(db, 'courses', id));
        revalidatePath('/');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error("Error al eliminar el documento: ", error);
        return { success: false, error: (error as Error).message };
    }
}
