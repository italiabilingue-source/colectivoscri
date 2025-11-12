'use client';

import { useState } from 'react';
import { Course } from '@/types';
import { CourseForm } from './course-form';
import { deleteCourse } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
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
import { Edit, Trash2 } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from '@/lib/utils';

export function CourseRow({ course }: { course: Course }) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCourse(course.id);
      toast({
        title: "Horario Eliminado",
        description: "El horario ha sido eliminado.",
      });
      setIsAlertOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el horario.",
        variant: "destructive",
      });
    } finally {
        setIsDeleting(false);
    }
  };

  const courseNameDisplay = Array.isArray(course.courseName)
    ? course.courseName.join(', ')
    : course.courseName;

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center gap-4 xl:gap-6 border-b border-border/50 py-4 px-2 text-sm md:text-base font-normal tracking-wider cursor-pointer hover:bg-muted/50 rounded-md">
            <span className="text-foreground truncate">{courseNameDisplay}</span>
            <span className="text-foreground/80">{course.time}</span>
            <span className="text-foreground/80">{course.lugar}</span>
            <span
              className={cn("text-foreground/80", {
                "text-green-500 font-semibold": course.colectivo === 'Bili'
              })}
            >
              {course.colectivo}
            </span>
            <span className="text-foreground/80">{course.movimiento}</span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={() => setIsFormOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Editar</span>
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => setIsAlertOpen(true)} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Eliminar</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <CourseForm course={course} open={isFormOpen} onOpenChange={setIsFormOpen}>
        <div />
      </CourseForm>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el horario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
