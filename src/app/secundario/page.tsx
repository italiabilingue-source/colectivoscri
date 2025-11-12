'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SecondaryCourse, Student } from '@/types';
import { Loader2, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StudentAttendanceRow } from '@/components/secundario/student-attendance-row';
import { EditableName } from '@/components/secundario/editable-name';
import { updateCourseName } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SecondaryAttendancePage() {
  const [courses, setCourses] = useState<SecondaryCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const coursesQuery = query(
      collection(db, 'secondary_courses'),
      orderBy('name', 'asc')
    );

    const unsubscribeCourses = onSnapshot(
      coursesQuery,
      async (coursesSnapshot) => {
        const coursesData = coursesSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as SecondaryCourse)
        );

        const studentsQuery = query(
          collection(db, 'students'),
          orderBy('name', 'asc')
        );
        const unsubscribeStudents = onSnapshot(
          studentsQuery,
          (studentsSnapshot) => {
            const studentsData = studentsSnapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as Student)
            );

            const coursesWithStudents = coursesData.map((course) => ({
              ...course,
              students: studentsData.filter(
                (student) => student.courseId === course.id
              ),
            }));

            setCourses(coursesWithStudents);
            setLoading(false);
          }
        );

        return () => unsubscribeStudents();
      },
      (error) => {
        console.error('Error fetching secondary courses: ', error);
        setLoading(false);
      }
    );

    return () => unsubscribeCourses();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">Gestión de Asistencia - Secundaria</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Volver al Dashboard</Link>
          </Button>
           <Button variant="outline" asChild>
            <Link href="/secundario/admin">Gestionar Cursos</Link>
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
              courses.map((course) => (
                 <Card key={course.id}>
                    <CardHeader>
                        <CardTitle>{course.name}</CardTitle>
                        <CardDescription>
                        {course.students?.length ?? 0} alumno(s) en este curso.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-md">
                        <div className="grid grid-cols-[1fr_100px_100px] items-center p-2 bg-muted/50 font-bold">
                            <span>Nombre del Alumno</span>
                            <span className="text-center">Va</span>
                            <span className="text-center">Vuelve</span>
                        </div>
                        <div className="space-y-1">
                            {course.students && course.students.length > 0 ? (
                            course.students.map((student) => (
                                <StudentAttendanceRow
                                key={student.id}
                                student={student}
                                />
                            ))
                            ) : (
                            <p className="p-4 text-center text-sm text-muted-foreground">
                                No hay alumnos en este curso.
                            </p>
                            )}
                        </div>
                        </div>
                    </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No hay cursos de secundaria creados.</p>
                <p>
                  Ve a{' '}
                  <Link href="/secundario/admin" className="text-primary underline">
                    gestión de cursos
                  </Link>{' '}
                  para empezar.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}