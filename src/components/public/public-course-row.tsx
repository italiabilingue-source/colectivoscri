'use client';

import type { Course } from '@/types';
import { cn } from '@/lib/utils';

export function PublicCourseRow({ course }: { course: Course }) {
  const [grade, section] = (course.courseName || '').split(' ');

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center gap-4 xl:gap-2 border-b border-border/50 py-2 px-2 text-sm md:text-base font-medium tracking-wide">
      
      <div className="flex flex-col leading-tight">
        <div className="text-foreground">{grade || ''}</div>
        {section && <div className="text-foreground">{section}</div>}
      </div>

      <div className="text-foreground/80">{course.time}</div>
      <div className="text-foreground/80">{course.lugar}</div>
      <div 
        className={cn("text-foreground/80", {
          "text-green-600 font-bold": course.colectivo === 'CRI'
        })}
      >
        {course.colectivo}
      </div>
      <div className="flex justify-start items-center">
        <div className="text-foreground/80">{course.movimiento}</div>
      </div>
    </div>
  );
}
