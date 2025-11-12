'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type {
  Course,
  SecondaryCourse,
  Student,
  AttendanceRecord,
} from '@/types';
import { Loader2, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StudentAttendanceRow } from '@/components/secundario/student-attendance-row';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PublicHeader } from '@/components/public-header';
import { format } from 'date-fns';

const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function SecondaryAttendancePage() {
  const [trips, setTrips] = useState<Course[]>([]);
  const [secondaryCourses, setSecondaryCourses] = useState<SecondaryCourse[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [dayFilter, setDayFilter] = useState('');
  const [colectivoFilter, setColectivoFilter] = useState('Todos');
  const currentDate = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    const today = new Date();
    const dayName = days[today.getDay()];
    if (dayName === 'Sábado' || dayName === 'Domingo') {
      setDayFilter('Lunes');
    } else {
      setDayFilter(dayName);
    }
  }, []);

  // Listener for trips (courses collection)
  useEffect(() => {
    if (!dayFilter) return;
    setLoading(true);

    const tripsQuery = query(
      collection(db, 'courses'),
      where('level', '==', 'Secundaria'),
      where('day', '==', dayFilter),
      ...(colectivoFilter !== 'Todos'
        ? [where('colectivo', '==', colectivoFilter)]
        : []),
      orderBy('time', 'asc')
    );

    const unsubscribeTrips = onSnapshot(tripsQuery, (snapshot) => {
      const tripsData = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Course)
      );
      setTrips(tripsData);
    }, (error) => {
      console.error("Error fetching trips: ", error);
    });

    return () => unsubscribeTrips();
  }, [dayFilter, colectivoFilter]);
  
  // Listener for all secondary courses, students and attendance
  useEffect(() => {
    setLoading(true);
    const coursesQuery = query(
      collection(db, 'secondary_courses'),
      orderBy('name', 'asc')
    );
    const unsubscribeCourses = onSnapshot(coursesQuery, (snapshot) => {
        setSecondaryCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SecondaryCourse)));
    });

    const studentsQuery = query(collection(db, 'students'), orderBy('name', 'asc'));
    const unsubscribeStudents = onSnapshot(studentsQuery, (snapshot) => {
        setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student)));
    });

    const attendanceQuery = query(collection(db, 'attendance'), where('date', '==', currentDate));
    const unsubscribeAttendance = onSnapshot(attendanceQuery, (snapshot) => {
        setAttendance(snapshot.docs.map(doc => doc.data() as AttendanceRecord));
        setLoading(false);
    });
    
    return () => {
        unsubscribeCourses();
        unsubscribeStudents();
        unsubscribeAttendance();
    }
  }, [currentDate]);


  const handleClearFilters = () => {
    const today = new Date();
    const dayName = days[today.getDay()];
    if (dayName === 'Sábado' || dayName === 'Domingo') {
      setDayFilter('Lunes');
    } else {
      setDayFilter(dayName);
    }
    setColectivoFilter('Todos');
  };

  const getFilteredAttendance = (tripId: string, studentId: string) => {
    const vaRecord = attendance.find(
      (att) =>
        att.tripId === tripId &&
        att.studentId === studentId &&
        att.status === 'va'
    );
    const vuelveRecord = attendance.find(
      (att) =>
        att.tripId === tripId &&
        att.studentId === studentId &&
        att.status === 'vuelve'
    );
    return {
      va: !!vaRecord,
      vuelve: !!vuelveRecord,
    };
  };

  const relevantCourseNames = useMemo(() => {
    return new Set(trips.flatMap(trip => trip.courseName));
  }, [trips]);

  const coursesToShow = useMemo(() => {
    return secondaryCourses
      .filter(sc => relevantCourseNames.has(sc.name))
      .map(sc => ({
        ...sc,
        students: students.filter(s => s.courseId === sc.id)
      }));
  }, [secondaryCourses, students, relevantCourseNames]);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader
        title="Gestión de Asistencia - Secundaria"
        dayFilter={dayFilter}
        lugarFilter="Todos"
        colectivoFilter={colectivoFilter}
        movimientoFilter="Todos"
        onDayChange={setDayFilter}
        onLugarChange={() => {}}
        onColectivoChange={setColectivoFilter}
        onMovimientoChange={() => {}}
        onClearFilters={handleClearFilters}
        hideLugarMovimiento={true}
      />
      <header className="flex items-center justify-end p-4 border-b">
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
          <div className="space-y-8">
            {trips.length > 0 ? (
                trips.map(trip => (
                    <Card key={trip.id}>
                        <CardHeader>
                            <CardTitle className='text-xl'>
                                Viaje: {trip.time} - {trip.lugar} ({trip.movimiento})
                            </CardTitle>
                            <CardDescription>
                               Cursos: {(trip.courseName as string[]).join(', ')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {coursesToShow
                                .filter(course => (trip.courseName as string[]).includes(course.name))
                                .map(course => (
                                <div key={course.id}>
                                    <h3 className="font-bold text-lg mb-2">{course.name}</h3>
                                    {course.students && course.students.length > 0 ? (
                                        <div className="border rounded-md">
                                            <div className="grid grid-cols-[1fr_100px_100px] items-center p-2 bg-muted/50 font-bold">
                                                <span>Nombre del Alumno</span>
                                                <span className="text-center">Va</span>
                                                <span className="text-center">Vuelve</span>
                                            </div>
                                            <div className="space-y-1">
                                                {course.students.map((student) => {
                                                    const studentAttendance = getFilteredAttendance(trip.id, student.id);
                                                    return (
                                                        <StudentAttendanceRow
                                                            key={student.id}
                                                            student={student}
                                                            tripId={trip.id}
                                                            currentDate={currentDate}
                                                            attendance={studentAttendance}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="p-4 text-center text-sm text-muted-foreground">
                                            No hay alumnos en este curso.
                                        </p>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No hay viajes de secundaria programados para la selección actual.</p>
                     <p>
                        Asegúrate de haber creado los horarios en el{' '}
                        <Link href="/dashboard" className="text-primary underline">
                            dashboard de horarios
                        </Link>.
                    </p>
                </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
