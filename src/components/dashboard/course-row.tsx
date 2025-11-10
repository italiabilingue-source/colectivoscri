'use client';

import { useState, useEffect } from 'react';
import { Course } from '@/types';
import { SplitFlapDisplay } from './split-flap-char';
import { Button } from '@/components/ui/button';
import { CourseForm } from './course-form';
import { deleteCourse } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { stylizeStatusMessage } from '@/ai/flows/stylize-status-messages';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function CourseRow({ course }: { course: Course }) {
  const { toast } = useToast();
  const [stylizedStatus, setStylizedStatus] = useState(course.movimiento.toUpperCase());
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function getStylizedMessage() {
      try {
        const result = await stylizeStatusMessage({ statusMessage: course.movimiento });
        // Use red for 'Cancelado' and 'Demorado', otherwise use primary color (green)
        const color = (result.stylizedMessage.toLowerCase().includes('cancelado') || result.stylizedMessage.toLowerCase().includes('demorado'))
          ? '#ef4444' // red-500
          : 'hsl(var(--primary))';
        const styledMessage = `<span style='color:${color};'>${result.stylizedMessage}</span>`
        setStylizedStatus(styledMessage);
      } catch (error) {
        console.error("Failed to stylize status message:", error);
        setStylizedStatus(course.movimiento.toUpperCase());
      }
    }
    getStylizedMessage();
  }, [course.movimiento]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCourse(course.id);
      toast({
        title: "Curso Eliminado",
        description: "El curso ha sido eliminado.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el curso.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-center gap-4 xl:gap-6 border-b border-border/50 py-4 px-2 text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium tracking-wider">
      <SplitFlapDisplay text={course.className.toUpperCase()} className="text-foreground" />
      <SplitFlapDisplay text={course.time} className="text-foreground/80"/>
      <SplitFlapDisplay text={course.lugar.substring(0, 3).toUpperCase()} className="text-foreground/80"/>
      <div
        className="font-bold text-base"
        dangerouslySetInnerHTML={{ __html: stylizedStatus.replace(/\\/g, '') }}
      />
      <div className="flex justify-end items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">Acciones</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <CourseForm course={course}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
            </CourseForm>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Eliminar</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente el curso.
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}