// src/components/secundario/secondary-course-admin.tsx
'use client';

import { useState } from 'react';
import type { SecondaryCourse } from '@/types';
import { deleteSecondaryCourse, updateCourseName } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AddStudentForm } from './add-student-form';
import { AddStudentsFromCSVForm } from './add-students-csv-form';
import { EditableName } from './editable-name';
import { StudentListItem } from './student-list-item';
import { Trash2 } from 'lucide-react';

type SecondaryCourseAdminProps = {
  course: SecondaryCourse;
};

export function SecondaryCourseAdmin({ course }: SecondaryCourseAdminProps) {
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteCourse = async () => {
    setIsDeleting(true);
    const result = await deleteSecondaryCourse(course.id);
    if (result.success) {
      toast({ title: 'Éxito', description: 'Curso y alumnos eliminados correctamente.' });
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
      setIsDeleting(false);
    }
    setIsAlertOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                  <EditableName
                      id={course.id}
                      initialName={course.name}
                      onUpdate={updateCourseName}
                      className="text-2xl font-bold"
                      inputClassName="text-2xl font-bold h-10"
                  />
                   <Button variant="ghost" size="icon" onClick={() => setIsAlertOpen(true)}>
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
              </CardTitle>
              <CardDescription>
                {course.students?.length ?? 0} alumno(s) en este curso.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <AddStudentsFromCSVForm courseId={course.id} courseName={course.name} />
              <AddStudentForm courseId={course.id} courseName={course.name} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
           <div className="border rounded-md">
              <div className="grid grid-cols-[1fr_auto] items-center p-2 bg-muted/50 font-bold">
                  <span>Nombre del Alumno</span>
                  <span className="text-center">Acciones</span>
              </div>
              <div className='space-y-1'>
              {course.students && course.students.length > 0 ? (
                  course.students.map(student => (
                      <StudentListItem key={student.id} student={student} />
                  ))
              ) : (
                  <p className="p-4 text-center text-sm text-muted-foreground">
                      No hay alumnos en este curso. Añade alumnos individualmente o con carga masiva.
                  </p>
              )}
              </div>
           </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar el curso "{course.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminarán permanentemente el curso y todos los alumnos que contiene.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar Curso'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}