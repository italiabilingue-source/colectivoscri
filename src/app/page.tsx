'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Course } from '@/types';
import { CourseBoard } from '@/components/dashboard/course-board';
import { PublicHeader } from '@/components/public-header';
import { BookCopy, School, GraduationCap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'courses'),
      orderBy('time', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const coursesData: Course[] = [];
      querySnapshot.forEach((doc) => {
        coursesData.push({ id: doc.id, ...doc.data() } as Course);
      });
      setCourses(coursesData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching courses: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const jardinCourses = courses.filter(it => it.level === 'Jardín');
  const primariaCourses = courses.filter(it => it.level === 'Primaria');
  const secundariaCourses = courses.filter(it => it.level === 'Secundaria');

  return (
    <div className="flex flex-col h-screen bg-background">
      <PublicHeader />
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        {loading ? (
             <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
             </div>
        ) : (
            <div className="flex flex-col xl:flex-row gap-8 h-full">
                <div className="flex flex-col lg:flex-row gap-8 flex-1">
                    <CourseBoard
                        title="JARDÍN"
                        icon={<BookCopy className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
                        courses={jardinCourses}
                    />
                    <Separator orientation="vertical" className="hidden lg:block bg-border/50" />
                     <CourseBoard
                        title="PRIMARIA"
                        icon={<School className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
                        courses={primariaCourses}
                    />
                </div>
                <Separator orientation="vertical" className="hidden xl:block bg-border/50" />
                 <div className="flex flex-col lg:flex-row gap-8 flex-1">
                    <CourseBoard
                        title="SECUNDARIA"
                        icon={<GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
                        courses={secundariaCourses}
                    />
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
