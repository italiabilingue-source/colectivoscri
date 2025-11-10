'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from '@/lib/firebase';
import type { Course } from '@/types';
import { CourseBoard } from './course-board';
import { DashboardHeader } from './dashboard-header';
import { BookCopy, School, GraduationCap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

export default function DashboardClient({ user }: { user: User | null }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for filters
  const [dayFilter, setDayFilter] = useState('Todos');
  const [lugarFilter, setLugarFilter] = useState('Todos');
  const [colectivoFilter, setColectivoFilter] = useState('Todos');
  const [movimientoFilter, setMovimientoFilter] = useState('Todos');


  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'courses'),
      orderBy('day', 'asc'),
      orderBy('time', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const coursesData: Course[] = [];
      querySnapshot.forEach((doc) => {
        coursesData.push({ id: doc.id, ...doc.data() } as Course);
      });
      setCourses(coursesData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching courses: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
        const dayMatch = dayFilter === 'Todos' || course.day === dayFilter;
        const lugarMatch = lugarFilter === 'Todos' || course.lugar === lugarFilter;
        const colectivoMatch = colectivoFilter === 'Todos' || course.colectivo === colectivoFilter;
        const movimientoMatch = movimientoFilter === 'Todos' || course.movimiento === movimientoFilter;
        return dayMatch && lugarMatch && colectivoMatch && movimientoMatch;
    });
  }, [courses, dayFilter, lugarFilter, colectivoFilter, movimientoFilter]);

  const jardinCourses = filteredCourses.filter(it => it.level === 'Jardín');
  const primariaCourses = filteredCourses.filter(it => it.level === 'Primaria');
  const secundariaCourses = filteredCourses.filter(it => it.level === 'Secundaria');

  const handleClearFilters = () => {
    setDayFilter('Todos');
    setLugarFilter('Todos');
    setColectivoFilter('Todos');
    setMovimientoFilter('Todos');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader 
        dayFilter={dayFilter}
        lugarFilter={lugarFilter}
        colectivoFilter={colectivoFilter}
        movimientoFilter={movimientoFilter}
        onDayChange={setDayFilter}
        onLugarChange={setLugarFilter}
        onColectivoChange={setColectivoFilter}
        onMovimientoChange={setMovimientoFilter}
        onClearFilters={handleClearFilters}
      />
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        {loading ? (
             <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
             </div>
        ) : (
            <div className="flex flex-col xl:flex-row gap-8 h-full">
                <div className="flex flex-col lg:flex-row gap-8 flex-1">
                    <CourseBoard
                        title="JARDÍN"
                        icon={<BookCopy className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
                        courses={jardinCourses}
                    />
                    <Separator orientation="vertical" className="hidden lg:block bg-border/50" />
                     <CourseBoard
                        title="PRIMARIA"
                        icon={<School className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
                        courses={primariaCourses}
                    />
                </div>
                <Separator orientation="vertical" className="hidden xl:block bg-border/50" />
                 <div className="flex flex-col lg:flex-row gap-8 flex-1">
                    <CourseBoard
                        title="SECUNDARIA"
                        icon={<GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
                        courses={secundariaCourses}
                    />
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
