import type { Course } from '@/types';

type CourseBoardProps = {
  title: string;
  icon: React.ReactNode;
  courses: Course[];
};

export function CourseBoard({ title, icon, courses }: CourseBoardProps) {
  return (
    <div className="border border-border/30 flex-1 min-w-0 p-4 rounded-lg shadow-sm bg-white">
      <h2 className="flex items-center gap-3 text-2xl md:text-3xl text-primary font-bold tracking-widest mb-4">
        {icon}
        {title}
      </h2>
      <div>
        <div className="grid grid-cols-4 items-center gap-4 border-b-2 border-primary/50 pb-2 px-2 text-sm text-muted-foreground font-bold tracking-widest">
          <span>CURSO/GRADO</span>
          <span>HORA</span>
          <span>LUGAR</span>
          <span>MOVIMIENTO</span>
        </div>
        <div className="mt-4 space-y-3 px-2">
          {courses.length > 0 ? (
            courses.map(course => (
              <div key={course.id} className="grid grid-cols-4 items-center gap-4 text-base md:text-lg">
                <span>{course.courseName}</span>
                <span>{course.time}</span>
                <span>{course.lugar}</span>
                <span>{course.lugar === 'Llegada' ? 'LLEGANDO' : 'SALIENDO'}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No hay horarios programados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
