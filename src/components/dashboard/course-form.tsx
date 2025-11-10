'use client';

import { useState, useEffect } from 'react';
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
  courseName: z.string().min(1, 'El curso/grado es requerido'),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido. Use HH:mm'),
  day: z.enum(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']),
  lugar: z.enum(['Chacra', 'Escuela']),
  colectivo: z.enum(['Cachi', 'Bili']),
  movimiento: z.enum(['Llegada', 'Salida']),
});

type CourseFormValues = z.infer<typeof formSchema>;

type CourseFormProps = {
  course?: Course;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function CourseForm({ course, children, open: controlledOpen, onOpenChange }: CourseFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  
  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
        onOpenChange?.(newOpen);
    } else {
        setInternalOpen(newOpen);
    }
  };

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: course ? {
        ...course
    } : {
      level: 'Primaria',
      courseName: '',
      time: '',
      day: 'Lunes',
      lugar: 'Escuela',
      colectivo: 'Cachi',
      movimiento: 'Llegada',
    },
  });

  useEffect(() => {
    if (course) {
        form.reset(course);
    } else {
        form.reset({
            level: 'Primaria',
            courseName: '',
            time: '',
            day: 'Lunes',
            lugar: 'Escuela',
            colectivo: 'Cachi',
            movimiento: 'Llegada',
        });
    }
  }, [course, form]);


  async function onSubmit(values: CourseFormValues) {
    setIsSubmitting(true);
    try {
      const result = await addOrUpdateCourse(values);
      if (result?.success) {
        toast({
          title: 'Éxito',
          description: `Horario ${course ? 'actualizado' : 'creado'} correctamente.`,
        });
        handleOpenChange(false);
        if (!course) {
            form.reset();
        }
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
            Nuevo Horario
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{course ? 'Editar Horario' : 'Crear Nuevo Horario'}</DialogTitle>
          <DialogDescription>
            Rellene los detalles del horario. Haga clic en guardar cuando haya terminado.
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Seleccione el nivel" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Jardín">Jardín</SelectItem>
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
                    name="courseName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Curso/Grado</FormLabel>
                        <FormControl><Input placeholder="Ej: 1A, Sala de 5..." {...field} /></FormControl>
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
                  name="day"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Día</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Seleccione el día" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Lunes">Lunes</SelectItem>
                          <SelectItem value="Martes">Martes</SelectItem>
                          <SelectItem value="Miércoles">Miércoles</SelectItem>
                          <SelectItem value="Jueves">Jueves</SelectItem>
                          <SelectItem value="Viernes">Viernes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="lugar"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Lugar</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                          <SelectTrigger><SelectValue placeholder="Lugar" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                              <SelectItem value="Chacra">Chacra</SelectItem>
                              <SelectItem value="Escuela">Escuela</SelectItem>
                          </SelectContent>
                      </Select>
                      <FormMessage />
                      </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="colectivo"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Colectivo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                          <SelectTrigger><SelectValue placeholder="Colectivo" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                              <SelectItem value="Cachi">Cachi</SelectItem>
                              <SelectItem value="Bili">Bili</SelectItem>
                          </SelectContent>
                      </Select>
                      <FormMessage />
                      </FormItem>
                  )}
                />
                <FormField
                control={form.control}
                name="movimiento"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Movimiento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger><SelectValue placeholder="Movimiento" /></SelectTrigger>
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
                Guardar Horario
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
