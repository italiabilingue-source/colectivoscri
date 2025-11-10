'use client';
import type { Course } from '@/types';
import { cn } from '@/lib/utils';


export function PublicCourseRow({ course }: { course: Course }) {
  
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center gap-4 xl:gap-6 border-b border-border/50 py-3 px-2 text-sm md:text-base font-normal tracking-wider">
      <span className="text-foreground">{course.courseName}</span>
      <span className="text-foreground/80">{course.time}</span>
      <span className="text-foreground/80">{course.lugar}</span>
      <span
        className={cn("text-foreground/80", {
          "text-green-500 font-semibold": course.colectivo === 'Bili'
        })}
      >
        {course.colectivo}
      </span>
      <span className="text-foreground/80">{course.movimiento}</span>
    </div>
  );
}
