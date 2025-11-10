'use client';

import { Course } from '@/types';
import { SplitFlapDisplay } from '@/components/dashboard/split-flap-char';
import { cn } from '@/lib/utils';

export function PublicCourseRow({ course }: { course: Course }) {
  const [grade, section] = (course.courseName || '').split(' ');
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center gap-4 xl:gap-6 border-b border-border/50 py-4 px-2 text-base md:text-lg lg:text-xl xl:text-2xl font-medium tracking-wider">
      
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
