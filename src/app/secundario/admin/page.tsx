// src/app/secundario/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SecondaryCourse, Student } from '@/types';
import { Loader2, Flag, Users } from 'lucide-react';
import { AddSecondaryCourseForm } from '@/components/secundario/add-secondary-course-form';
import { SecondaryCourseAdmin } from '@/components/secundario/secondary-course-admin';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SecondaryAdminPage() {
    const [courses, setCourses] = useState<SecondaryCourse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const coursesQuery = query(collection(db, 'secondary_courses'), orderBy('name', 'asc'));

        const unsubscribeCourses = onSnapshot(coursesQuery, async (coursesSnapshot) => {
            const coursesData = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SecondaryCourse));
            
            // Ordenamos los alumnos por nombre
            const studentsQuery = query(collection(db, 'students'), orderBy('name', 'asc'));
            const unsubscribeStudents = onSnapshot(studentsQuery, (studentsSnapshot) => {
                const studentsData = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
                
                const coursesWithStudents = coursesData.map(course => ({
                    ...course,
                    students: studentsData.filter(student => student.courseId === course.id)
                }));
                
                setCourses(coursesWithStudents);
                setLoading(false);
            });

            return () => unsubscribeStudents();
        }, (error) => {
            console.error("Error fetching secondary courses: ", error);
            setLoading(false);
        });

        return () => unsubscribeCourses();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl font-bold">Gestión de Asistencia - Secundaria</h1>
                </div>
                <div className='flex items-center gap-2'>
                    <AddSecondaryCourseForm />
                     <Button variant="outline" asChild>
                        <Link href="/dashboard">Volver al Dashboard</Link>
                    </Button>
                </div>
            </header>
            <main className="flex-1 p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {courses.length > 0 ? (
                            courses.map(course => (
                                <SecondaryCourseAdmin key={course.id} course={course} />
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>No hay cursos de secundaria creados.</p>
                                <p>Crea el primer curso para empezar a añadir alumnos y gestionar la asistencia.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
