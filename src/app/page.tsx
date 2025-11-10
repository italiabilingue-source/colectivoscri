'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Course } from '@/types';
import { CourseBoard } from '@/components/public/course-board';
import { PublicHeader } from '@/components/public-header';
import { BookCopy, School, GraduationCap } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function HomePage() {
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
    return allCourses.filter(course => {
      const dayMatch = course.day === dayFilter;
      const lugarMatch = lugarFilter === 'Todos' || course.lugar === lugarFilter;
      const colectivoMatch = colectivoFilter === 'Todos' || course.colectivo === colectivoFilter;
      const movimientoMatch = movimientoFilter === 'Todos' || course.movimiento === movimientoFilter;
      return dayMatch && lugarMatch && colectivoMatch && movimientoMatch;
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

  const jardinCourses = filteredCourses.filter(it => it.level === 'Jardín');
  const primariaCourses = filteredCourses.filter(it => it.level === 'Primaria');
  const secundariaCourses = filteredCourses.filter(it => it.level === 'Secundaria');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader 
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
          <div className="flex flex-col xl:flex-row gap-8 w-full">
            <CourseBoard
              title="JARDÍN"
              icon={<BookCopy className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
              courses={jardinCourses}
            />
            <CourseBoard
              title="PRIMARIA"
              icon={<School className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
              courses={primariaCourses}
            />
            <CourseBoard
              title="SECUNDARIA"
              icon={<GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
              courses={secundariaCourses}
            />
          </div>
        )}
      </main>
    </div>
  );
}

// Re-creating public course board to avoid conflicts and for separate logic
function PublicCourseBoard({ title, icon, courses }: { title: string, icon: React.ReactNode, courses: Course[] }) {
  return (
    <Card className="bg-card/50 border-border/60 flex-1 min-w-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl text-primary font-bold tracking-widest">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center gap-4 xl:gap-6 border-b-2 border-primary/50 pb-2 px-2 text-sm md:text-base text-muted-foreground font-bold tracking-widest">
          <span>CURSO/GRADO</span>
          <span>HORA</span>
          <span>LUGAR</span>
          <span>COLECTIVO</span>
          <span className="text-left">MOVIMIENTO</span>
        </div>
        <div className="mt-2 space-y-2">
          {courses.length > 0 ? (
            courses.map(course => <PublicCourseRow key={course.id} course={course} />)
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No hay horarios programados para esta selección.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PublicCourseRow({ course }: { course: Course }) {
  const [grade, section] = (course.courseName || '').split(' ');
  return (
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center gap-4 xl:gap-6 border-b border-border/50 py-4 px-2 text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium tracking-wider cursor-pointer hover:bg-muted/50 rounded-md">
        <div className="flex flex-col leading-none">
          <SplitFlapDisplay text={(grade || '').toUpperCase()} className="text-foreground" />
          {section && <SplitFlapDisplay text={section.toUpperCase()} className="text-foreground" />}
        </div>
        <SplitFlapDisplay text={course.time} className="text-foreground/80"/>
        <SplitFlapDisplay text={(course.lugar || '').toUpperCase()} className="text-foreground/80"/>
        <SplitFlapDisplay 
          text={(course.colectivo || '').toUpperCase()} 
          className={cn("text-foreground/80", {
            "text-green-500": course.colectivo === 'CRI'
          })}
        />
        <div className="flex justify-start items-center">
          <SplitFlapDisplay text={(course.movimiento || '').toUpperCase()} className="text-foreground/80" />
        </div>
      </div>
  );
}

// Re-create dependencies locally for the page
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SplitFlapDisplay } from '@/components/dashboard/split-flap-char';
