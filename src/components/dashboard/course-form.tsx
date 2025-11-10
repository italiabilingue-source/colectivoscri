'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addOrUpdateCourse } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { Course } from '@/types';
import { generateItineraryNotes } from '@/ai/flows/generate-itinerary-notes';

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
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  id: z.string().optional(),
  level: z.enum(['Jardín', 'Primaria', 'Secundaria']),
  className: z.string().min(1, 'La clase es requerida').max(2, 'Máximo 2 caracteres'),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido. Use HH:mm'),
  day: z.string().min(1, 'El día es requerido'),
  status: z.string().min(1, 'El estado es requerido'),
  notes: z.string().optional(),
});

type CourseFormValues = z.infer<typeof formSchema>;

type CourseFormProps = {
  course?: Course;
  children?: React.ReactNode;
};

export function CourseForm({ course, children }: CourseFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const { toast } = useToast();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: course?.id,
      level: course?.level ?? 'Primaria',
      className: course?.className ?? '',
      time: course?.time ?? '',
      day: course?.day ?? 'Lunes',
      status: course?.status ?? 'Programado',
      notes: course?.notes ?? '',
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
        setOpen(false);
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

  const handleGenerateNotes = async () => {
    setIsGeneratingNotes(true);
    try {
        const { level, className, time, day } = form.getValues();

        if (!level || !className || !time || !day) {
            toast({
                title: 'No se pueden generar notas',
                description: 'Por favor, complete Nivel, Clase, Hora y Día primero.',
                variant: 'destructive',
            });
            return;
        }

        const prompt = `Un curso de ${level}, clase ${className} a las ${time} el ${day}.`;
        const result = await generateItineraryNotes({ prompt });
        form.setValue('notes', result.notes, { shouldValidate: true });
        toast({
            title: 'Notas Generadas',
            description: 'Se han añadido notas generadas por IA.',
        });
    } catch (error) {
        toast({
            title: 'Error de IA',
            description: 'No se pudieron generar las notas.',
            variant: 'destructive',
        });
    } finally {
        setIsGeneratingNotes(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                name="day"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Día</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger><SelectValue placeholder="Seleccione el día" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Lunes">Lunes</SelectItem>
                            <SelectItem value="Martes">Martes</SelectItem>
                            <SelectItem value="Miércoles">Miércoles</SelectItem>
                            <SelectItem value="Jueves">Jueves</SelectItem>
                            <SelectItem value="Viernes">Viernes</SelectItem>
                            <SelectItem value="Sábado">Sábado</SelectItem>
                            <SelectItem value="Domingo">Domingo</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger><SelectValue placeholder="Seleccione el estado" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Programado">Programado</SelectItem>
                            <SelectItem value="Activo">Activo</SelectItem>
                            <SelectItem value="Finalizado">Finalizado</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
             <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Notas (Opcional)</FormLabel>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleGenerateNotes}
                            disabled={isGeneratingNotes || isSubmitting}
                        >
                            {isGeneratingNotes ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Generar con IA
                        </Button>
                      </div>
                      <FormControl><Textarea placeholder="Añada notas relevantes..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )}
                />
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
}
