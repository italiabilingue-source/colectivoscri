'use server';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Course } from '@/types';

const CourseSchema = z.object({
  id: z.string().optional(),
  level: z.enum(['Jardín', 'Primaria', 'Secundaria']),
  className: z.string().min(1, 'La clase es requerida'),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido. Use HH:mm'),
  day: z.string().min(1, 'El día es requerido'),
  status: z.string().min(1, 'El estado es requerido'),
  notes: z.string().optional(),
});

export async function signUpWithEmail(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { message: 'Success', status: 'success' };
  } catch (e: any) {
    return { message: e.message, status: 'error' };
  }
}

export async function signInWithEmail(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    revalidatePath('/dashboard');
    return { message: 'Success', status: 'success' };
  } catch (e: any) {
    return { message: e.message, status: 'error' };
  }
}

export async function signOutAction() {
  await signOut(auth);
  redirect('/');
}

export async function addOrUpdateCourse(data: Omit<Course, 'id' | 'createdAt' | 'userId'> & { id?: string }) {
    const user = auth.currentUser;
    if (!user) throw new Error('Debes iniciar sesión para realizar esta acción.');

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
                userId: user.uid,
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
    const user = auth.currentUser;
    if (!user) throw new Error('Debes iniciar sesión para realizar esta acción.');
    
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