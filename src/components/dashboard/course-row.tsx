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
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Edit, Trash2 } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

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

  const levelStyles = {
    'Jardín': 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
    'Primaria': 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200',
    'Secundaria': 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200',
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="group relative border-b border-border/40 hover:bg-muted/50 transition-colors rounded-lg overflow-hidden cursor-pointer">
            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-[0.8fr_1.5fr_0.8fr_1fr_1fr_1fr] items-center gap-4 xl:gap-6 py-4 px-3 text-sm font-medium tracking-wide">
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
