import type { Course } from '@/types';
import { CourseRow } from './course-row';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CourseBoardProps = {
  title: string;
  icon: React.ReactNode;
  courses: Course[];
};

export function CourseBoard({ title, icon, courses }: CourseBoardProps) {
  return (
    <Card className="bg-card/50 border-border/60 flex-1 min-w-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl text-primary font-bold tracking-widest">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_auto] items-center gap-4 xl:gap-6 border-b-2 border-primary/50 pb-2 px-2 text-sm md:text-base text-muted-foreground font-bold tracking-widest">
            <span>CLASE</span>
            <span>HORA</span>
            <span>DÍA</span>
            <span>ESTADO</span>
            <span className="text-right">ACCIONES</span>
        </div>
        <div className="mt-2 space-y-2">
          {courses.length > 0 ? (
            courses.map(course => <CourseRow key={course.id} course={course} />)
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No hay cursos programados.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
