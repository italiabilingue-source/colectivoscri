'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addOrUpdateCourse } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { Course } from '@/types';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';

const formSchema = z.object({
  id: z.string().optional(),
  level: z.enum(['Jardín', 'Primaria', 'Secundaria']),
  className: z.string().min(1, 'La clase es requerida').max(2, 'Máximo 2 caracteres'),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido. Use HH:mm'),
  lugar: z.enum(['Llegada', 'Salida']),
});

type CourseFormValues = z.infer<typeof formSchema>;

type CourseFormProps = {
  course?: Course;
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
};

export function CourseForm({ course, children, onOpenChange }: CourseFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: course?.id,
      level: course?.level ?? 'Primaria',
      className: course?.className ?? '',
      time: course?.time ?? '',
      lugar: course?.lugar ?? 'Llegada',
    },
  });

  async function onSubmit(values: CourseFormValues) {
    setIsSubmitting(true);
    try {
      const result = await addOrUpdateCourse(values);
      if (result?.success) {
        toast({
          title: 'Éxito',
          description: `Curso ${course ? 'actualizado' : 'creado'} correctamente.`,
        });
        handleOpenChange(false);
        form.reset();
      } else {
        throw new Error(result?.error || 'Ocurrió un error desconocido.');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children ?? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Curso
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{course ? 'Editar Curso' : 'Crear Nuevo Curso'}</DialogTitle>
          <DialogDescription>
            Rellene los detalles del curso. Haga clic en guardar cuando haya terminado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nivel</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Seleccione el nivel" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <Jardín>Jardín</Jardín>
                          <SelectItem value="Primaria">Primaria</SelectItem>
                          <SelectItem value="Secundaria">Secundaria</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="className"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Clase</FormLabel>
                        <FormControl><Input placeholder="Ej: A, B..." {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl><Input placeholder="HH:mm" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="lugar"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Lugar</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger><SelectValue placeholder="Seleccione el lugar" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Llegada">Llegada</SelectItem>
                            <SelectItem value="Salida">Salida</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Curso
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
