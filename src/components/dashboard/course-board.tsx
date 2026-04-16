'use client';
import type { Course } from '@/types';
import { CourseRow } from './course-row';
import { PublicCourseRow } from '@/components/public/public-course-row';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CourseBoardProps = {
  title: string;
  icon: React.ReactNode;
  courses: Course[];
  isPublicView?: boolean;
};

export function CourseBoard({ title, icon, courses, isPublicView = false }: CourseBoardProps) {
  return (
    <Card className="bg-card/50 border-border/60 flex-1 min-w-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl text-primary font-bold tracking-widest">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="hidden md:grid grid-cols-[0.8fr_1.5fr_0.8fr_1fr_1fr_1fr] items-center gap-4 xl:gap-6 border-b-2 border-primary/50 pb-2 px-2 text-sm md:text-base text-muted-foreground font-bold tracking-widest uppercase">
            <span>Nivel</span>
            <span>Curso/Grado</span>
            <span>Hora</span>
            <span>Movimiento</span>
            <span>Lugar</span>
            <span>Colectivo</span>
        </div>
        <div className="mt-2 space-y-2">
          {courses.length > 0 ? (
            courses.map(course => 
              isPublicView ? (
                <PublicCourseRow key={course.id} course={course} />
              ) : (
                <CourseRow key={course.id} course={course} />
              )
            )
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
