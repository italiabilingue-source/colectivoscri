import type { Course } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SplitFlapDisplay } from '@/components/dashboard/split-flap-char';

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
        <div className="grid grid-cols-[1fr_1fr_1fr] items-center gap-4 xl:gap-6 border-b-2 border-primary/50 pb-2 px-2 text-sm md:text-base text-muted-foreground font-bold tracking-widest">
            <span>CLASE</span>
            <span>HORA</span>
            <span>LUGAR</span>
        </div>
        <div className="mt-2 space-y-2">
          {courses.length > 0 ? (
            courses.map(course => (
              <div key={course.id} className="grid grid-cols-[1fr_1fr_1fr] items-center gap-4 xl:gap-6 border-b border-border/50 py-4 px-2 text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium tracking-wider">
                <SplitFlapDisplay text={course.className.toUpperCase()} className="text-foreground" />
                <SplitFlapDisplay text={course.time} className="text-foreground/80"/>
                <SplitFlapDisplay text={course.lugar.substring(0,3).toUpperCase()} className="text-foreground/80"/>
              </div>
            ))
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
