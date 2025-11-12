// src/components/secundario/secondary-course-admin.tsx
'use client';

import type { SecondaryCourse } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AddStudentForm } from './add-student-form';
import { StudentAttendanceRow } from './student-attendance-row';

type SecondaryCourseAdminProps = {
  course: SecondaryCourse;
};

export function SecondaryCourseAdmin({ course }: SecondaryCourseAdminProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{course.name}</CardTitle>
            <CardDescription>
              {course.students?.length ?? 0} alumno(s) en este curso.
            </CardDescription>
          </div>
          <AddStudentForm courseId={course.id} courseName={course.name} />
        </div>
      </CardHeader>
      <CardContent>
         <div className="border rounded-md">
            <div className="grid grid-cols-[1fr_100px_100px] items-center p-2 bg-muted/50 font-bold">
                <span>Nombre del Alumno</span>
                <span className="text-center">Va</span>
                <span className="text-center">Vuelve</span>
            </div>
            <div className='space-y-1'>
            {course.students && course.students.length > 0 ? (
                course.students.map(student => (
                    <StudentAttendanceRow key={student.id} student={student} />
                ))
            ) : (
                <p className="p-4 text-center text-sm text-muted-foreground">
                    No hay alumnos en este curso.
                </p>
            )}
            </div>
         </div>
      </CardContent>
    </Card>
  );
}
