'use client';
import type { Course } from '@/types';
import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';

export function PublicCourseRow({ course }: { course: Course }) {

  const courseNameDisplay = Array.isArray(course.courseName)
    ? course.courseName.join(', ')
    : course.courseName;

  const levelStyles = {
    'Jardín': 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
    'Primaria': 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200',
    'Secundaria': 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200',
  };

  return (
    <div className="group relative border-b border-border/40 hover:bg-muted/30 transition-colors rounded-lg overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-[0.8fr_1.5fr_0.8fr_1fr_1fr_1fr] items-center gap-4 xl:gap-6 py-3 px-3 text-sm font-medium tracking-wide">
        <div className="flex justify-start">
          <Badge className={cn("px-2 py-0.5 text-[10px] font-bold uppercase", levelStyles[course.level])}>
            {course.level}
          </Badge>
        </div>
        
        <span className="text-foreground font-semibold truncate">{courseNameDisplay}</span>
        
        <span className="text-foreground/90 font-bold font-mono">{course.time}</span>
        
        <div className="flex items-center gap-1.5 text-foreground/80">
          {course.movimiento === 'Llegada' ? (
            <ArrowUp className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5 text-orange-500" />
          )}
          <span>{course.movimiento}</span>
        </div>
        
        <span className="text-foreground/70">{course.lugar}</span>
        
        <span
          className={cn("text-foreground/80", {
            "text-green-600 font-bold": course.colectivo === 'Bili'
          })}
        >
          {course.colectivo}
        </span>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col p-4 gap-3">
        <div className="flex items-center justify-between gap-2">
          <Badge className={cn("px-2 py-0.5 text-[10px] font-bold uppercase shrink-0", levelStyles[course.level])}>
            {course.level}
          </Badge>
          <span className="text-sm font-bold text-foreground truncate text-right">
            {courseNameDisplay}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/20 pt-2">
          <div className="flex items-center gap-3">
            <span className="text-foreground font-mono font-bold text-sm">{course.time}</span>
            <div className="flex items-center gap-1 font-medium">
              {course.movimiento === 'Llegada' ? (
                <ArrowUp className="w-3 h-3 text-green-500" />
              ) : (
                <ArrowDown className="w-3 h-3 text-orange-500" />
              )}
              <span>{course.movimiento}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>{course.lugar}</span>
            <span className="text-border/60">•</span>
            <span className={cn({ "text-green-600 font-bold": course.colectivo === 'Bili' })}>
              {course.colectivo}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
