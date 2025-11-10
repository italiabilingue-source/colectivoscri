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
import type { Itinerary } from '@/types';

const ItinerarySchema = z.object({
  id: z.string().optional(),
  origin: z.enum(['School', 'Farm']),
  destination: z.enum(['School', 'Farm']),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:mm'),
  day: z.string().min(1, 'Day is required'),
  status: z.string().min(1, 'Status is required'),
  notes: z.string().optional(),
});

export async function signUpWithEmail(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
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
    return { message: 'Success', status: 'success' };
  } catch (e: any) {
    return { message: e.message, status: 'error' };
  }
}

export async function signOutAction() {
  await signOut(auth);
  revalidatePath('/');
}

export async function addOrUpdateItinerary(data: Omit<Itinerary, 'id' | 'createdAt' | 'userId'> & { id?: string }) {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in to perform this action.');

    const validatedFields = ItinerarySchema.safeParse(data);
    if (!validatedFields.success) {
        throw new Error('Invalid data');
    }

    try {
        if (data.id) {
            const docRef = doc(db, 'itineraries', data.id);
            await updateDoc(docRef, {
                ...validatedFields.data,
            });
        } else {
            await addDoc(collection(db, 'itineraries'), {
                ...validatedFields.data,
                userId: user.uid,
                createdAt: serverTimestamp(),
            });
        }
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error adding/updating document: ", error);
        return { success: false, error: (error as Error).message };
    }
}


export async function deleteItinerary(id: string) {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in to perform this action.');
    
    try {
        await deleteDoc(doc(db, 'itineraries', id));
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error deleting document: ", error);
        return { success: false, error: (error as Error).message };
    }
}
