'use client';

import type { Course } from '@/types';
import { SplitFlapDisplay } from '@/components/dashboard/split-flap-char';

export function CourseRow({ course }: { course: Course }) {
  
  const [grade, section] = (course.courseName || '').split(' ');

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr] items-center gap-4 xl:gap-6 border-b border-border/50 py-4 px-2 text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium tracking-wider">
      
      <div className="flex flex-col leading-none">
        <SplitFlapDisplay text={(grade || '').toUpperCase()} className="text-foreground" />
        {section && <SplitFlapDisplay text={section.toUpperCase()} className="text-foreground" />}
      </div>

      <SplitFlapDisplay text={course.time} className="text-foreground/80"/>
      <SplitFlapDisplay text={(course.lugar || '').toUpperCase()} className="text-foreground/80"/>
      <div className="flex justify-start items-center">
        <SplitFlapDisplay text={(course.movimiento || '').toUpperCase()} className="text-foreground/80" />
      </div>
    </div>
  );
}
