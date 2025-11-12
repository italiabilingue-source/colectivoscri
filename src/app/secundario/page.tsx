'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Course } from '@/types';
import { CourseBoard } from '@/components/dashboard/course-board';
import { PublicHeader } from '@/components/public-header';
import { GraduationCap } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function SecundariaPage() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // State for filters
  const [dayFilter, setDayFilter] = useState('');
  const [lugarFilter, setLugarFilter] = useState('Todos');
  const [colectivoFilter, setColectivoFilter] = useState('Todos');
  const [movimientoFilter, setMovimientoFilter] = useState('Todos');

  useEffect(() => {
    // Set initial day filter to current day
    const today = new Date();
    const dayName = days[today.getDay()];
    if (dayName === 'Sábado' || dayName === 'Domingo') {
      setDayFilter('Lunes'); // Default to Monday if it's weekend
    } else {
      setDayFilter(dayName);
    }
  }, []);

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
      setAllCourses(coursesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching courses: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredCourses = useMemo(() => {
    if (!dayFilter) return [];
    // Always filter for 'Secundaria' level, then apply other filters
    return allCourses.filter(course => {
      const levelMatch = course.level === 'Secundaria';
      const dayMatch = course.day === dayFilter;
      const lugarMatch = lugarFilter === 'Todos' || course.lugar === lugarFilter;
      const colectivoMatch = colectivoFilter === 'Todos' || course.colectivo === colectivoFilter;
      const movimientoMatch = movimientoFilter === 'Todos' || course.movimiento === movimientoFilter;
      return levelMatch && dayMatch && lugarMatch && colectivoMatch && movimientoMatch;
    });
  }, [allCourses, dayFilter, lugarFilter, colectivoFilter, movimientoFilter]);

  const handleClearFilters = () => {
    const today = new Date();
    const dayName = days[today.getDay()];
     if (dayName === 'Sábado' || dayName === 'Domingo') {
      setDayFilter('Lunes');
    } else {
      setDayFilter(dayName);
    }
    setLugarFilter('Todos');
    setColectivoFilter('Todos');
    setMovimientoFilter('Todos');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader 
        title="Horario de Colectivos - Secundaria"
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
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="w-full">
            <CourseBoard
              title="SECUNDARIA"
              icon={<GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
              courses={filteredCourses}
              isPublicView={true}
            />
          </div>
        )}
      </main>
    </div>
  );
}
