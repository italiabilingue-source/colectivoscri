'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Course } from '@/types';
import { CourseBoard } from '@/components/public/course-board';
import { PublicHeader } from '@/components/public-header';
import { BookCopy, School, GraduationCap } from 'lucide-react';
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
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {loading ? (
             <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
             </div>
        ) : (
            <div className="flex flex-col xl:flex-row gap-8 w-full">
                <CourseBoard
                    title="JARDÍN"
                    icon={<BookCopy className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
                    courses={jardinCourses}
                />
                 <CourseBoard
                    title="PRIMARIA"
                    icon={<School className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
                    courses={primariaCourses}
                />
                <CourseBoard
                    title="SECUNDARIA"
                    icon={<GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
                    courses={secundariaCourses}
                />
            </div>
        )}
      </main>
    </div>
  );
}
