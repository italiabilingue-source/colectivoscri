'use client';

import { useState, useEffect } from 'react';
import { Course } from '@/types';
import { SplitFlapDisplay } from '@/components/dashboard/split-flap-char';
import { stylizeStatusMessage } from '@/ai/flows/stylize-status-messages';


export function CourseRow({ course }: { course: Course }) {
  const [stylizedStatus, setStylizedStatus] = useState(course.status.toUpperCase());
  
  useEffect(() => {
    async function getStylizedMessage() {
      try {
        const result = await stylizeStatusMessage({ statusMessage: course.status });
        setStylizedStatus(result.stylizedMessage);
      } catch (error) {
        console.error("Failed to stylize status message:", error);
        setStylizedStatus(course.status.toUpperCase());
      }
    }
    getStylizedMessage();
  }, [course.status]);


  return (
    <div className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr] items-center gap-4 xl:gap-6 border-b border-border/50 py-4 px-2 text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium tracking-wider">
      <SplitFlapDisplay text={course.className.toUpperCase()} className="text-primary" />
      <SplitFlapDisplay text={course.time} />
      <SplitFlapDisplay text={course.day.substring(0, 3).toUpperCase()} />
      <div
        className="text-primary font-bold"
        dangerouslySetInnerHTML={{ __html: stylizedStatus.replace(/\\/g, '') }}
      />
    </div>
  );
}
