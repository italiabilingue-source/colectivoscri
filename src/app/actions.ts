'use server';

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch,
  query,
  where,
  getDocs,
  getDoc,
  deleteField,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Course } from '@/types';

const CourseSchema = z.object({
  id: z.string().optional(),
  level: z.enum(['Jardín', 'Primaria', 'Secundaria']),
  courseName: z.union([
    z.string().min(1, 'El curso/grado es requerido'),
    z.array(z.string()).min(1, 'Debe seleccionar al menos un curso'),
  ]),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido. Use HH:mm'),
  day: z.enum(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']),
  lugar: z.enum(['Chacra', 'Escuela']),
  colectivo: z.enum(['Cachi', 'Bili']),
  movimiento: z.enum(['Llegada', 'Salida']),
});

export async function addOrUpdateCourse(data: Omit<Course, 'id' | 'createdAt' | 'courseName'> & { id?: string, courseName: string | string[] }) {
    const validatedFields = CourseSchema.safeParse(data);
    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
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
        revalidatePath('/secundario');
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
        revalidatePath('/secundario');
        return { success: true };
    } catch (error)
        {
        console.error("Error al eliminar el documento: ", error);
        return { success: false, error: (error as Error).message };
    }
}

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
    revalidatePath('/secundario');
    return { success: true };
  } catch (error) {
    console.error("Error al agregar el curso de secundaria: ", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteSecondaryCourse(courseId: string) {
    try {
        const batch = writeBatch(db);

        const courseRef = doc(db, 'secondary_courses', courseId);
        batch.delete(courseRef);

        const studentsQuery = query(collection(db, 'students'), where('courseId', '==', courseId));
        const studentsSnapshot = await getDocs(studentsQuery);
        studentsSnapshot.forEach(studentDoc => {
            batch.delete(studentDoc.ref);
        });

        await batch.commit();
        revalidatePath('/secundario/admin');
        revalidatePath('/secundario');
        return { success: true };
    } catch (error) {
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
            createdAt: serverTimestamp(),
        });
        revalidatePath(`/secundario/admin`);
        revalidatePath(`/secundario`);
        return { success: true };
    } catch (error) {
        console.error("Error al agregar el alumno: ", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function deleteStudent(studentId: string) {
    try {
        await deleteDoc(doc(db, 'students', studentId));
        revalidatePath('/secundario/admin');
        revalidatePath('/secundario');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

// Nueva acción para registrar asistencia contextual
const AttendanceToggleSchema = z.object({
    studentId: z.string(),
    courseId: z.string(),
    tripId: z.string(),
    date: z.string(), // YYYY-MM-DD
    status: z.enum(['va', 'vuelve']),
    present: z.boolean(),
});

export async function toggleStudentAttendance(data: z.infer<typeof AttendanceToggleSchema>) {
    const validatedFields = AttendanceToggleSchema.safeParse(data);
    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        throw new Error('Datos de asistencia inválidos');
    }
    
    const { studentId, courseId, tripId, date, status, present } = validatedFields.data;
    
    // El ID del documento de asistencia será una combinación única para evitar duplicados
    const attendanceDocId = `${date}_${tripId}_${studentId}`;
    const attendanceRef = doc(db, 'attendance', attendanceDocId);

    try {
        const docSnap = await getDoc(attendanceRef);
        if (present) {
            // Si el alumno está presente, creamos o actualizamos el registro
             if (docSnap.exists()) {
                await updateDoc(attendanceRef, {
                    [status]: true,
                    studentId,
                    courseId,
                    tripId,
                    date,
                    updatedAt: serverTimestamp(),
                });
            } else {
                await addDoc(collection(db, "attendance"), {
                    studentId,
                    courseId,
                    tripId,
                    date,
                    [status]: true,
                    createdAt: serverTimestamp(),
                });
            }
        } else {
            // Si no está presente, actualizamos el campo a false o eliminamos el documento si ambos son false
            if (docSnap.exists()) {
                const currentData = docSnap.data();
                const otherStatus = status === 'va' ? 'vuelve' : 'va';
                if (currentData[otherStatus]) {
                     await updateDoc(attendanceRef, {
                        [status]: deleteField()
                    });
                } else {
                    await deleteDoc(attendanceRef);
                }
            }
        }
        revalidatePath(`/secundario`); 
        return { success: true };
    } catch (error) {
        console.error("Error al actualizar la asistencia: ", error);
        return { success: false, error: (error as Error).message };
    }
}


const NameUpdateSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'El nombre no puede estar vacío'),
});

export async function updateCourseName(data: { id: string, name: string }) {
    const validatedFields = NameUpdateSchema.safeParse(data);
    if (!validatedFields.success) {
        throw new Error('Datos inválidos');
    }
    try {
        const courseRef = doc(db, 'secondary_courses', data.id);
        await updateDoc(courseRef, { name: data.name });
        revalidatePath('/secundario/admin');
        revalidatePath('/secundario');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function updateStudentName(data: { id: string, name: string }) {
    const validatedFields = NameUpdateSchema.safeParse(data);
    if (!validatedFields.success) {
        throw new Error('Datos inválidos');
    }
    try {
        const studentRef = doc(db, 'students', data.id);
        await updateDoc(studentRef, { name: data.name });
        revalidatePath('/secundario/admin');
        revalidatePath('/secundario');
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

const CSVUploadSchema = z.object({
    courseId: z.string(),
    csvText: z.string().min(1, 'El texto CSV no puede estar vacío'),
});

export async function addStudentsFromCSV(data: { courseId: string, csvText: string }) {
    const validatedFields = CSVUploadSchema.safeParse(data);
    if (!validatedFields.success) {
        throw new Error('Datos inválidos');
    }

    const { courseId, csvText } = validatedFields.data;
    const studentNames = csvText.split('\n').map(name => name.trim()).filter(name => name);

    if (studentNames.length === 0) {
        return { success: false, error: "No se encontraron nombres de alumnos válidos en el texto." };
    }

    try {
        const batch = writeBatch(db);
        studentNames.forEach(name => {
            const studentRef = doc(collection(db, 'students'));
            batch.set(studentRef, {
                name,
                courseId,
                createdAt: serverTimestamp(),
            });
        });
        await batch.commit();
        revalidatePath('/secundario/admin');
        revalidatePath('/secundario');
        return { success: true, count: studentNames.length };
    } catch (error) {
        console.error("Error al agregar alumnos desde CSV: ", error);
        return { success: false, error: (error as Error).message };
    }
}
