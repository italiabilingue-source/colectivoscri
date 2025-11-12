// src/components/secundario/student-list-item.tsx
'use client';

import { useState } from 'react';
import type { Student } from '@/types';
import { deleteStudent, updateStudentName } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { EditableName } from './editable-name';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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

type StudentListItemProps = {
  student: Student;
};

export function StudentListItem({ student }: StudentListItemProps) {
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteStudent = async () => {
    setIsDeleting(true);
    const result = await deleteStudent(student.id);
     if (result.success) {
      toast({ title: 'Éxito', description: 'Alumno eliminado correctamente.' });
    } else {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
      setIsDeleting(false);
    }
    setIsAlertOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-[1fr_auto] items-center p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
        <EditableName
          id={student.id}
          initialName={student.name}
          onUpdate={updateStudentName}
          className="font-medium"
        />
        <div className="flex justify-center items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsAlertOpen(true)}>
                <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
        </div>
      </div>

       <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar a {student.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStudent}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar Alumno'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}