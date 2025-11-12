// src/components/secundario/add-students-csv-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addStudentsFromCSV } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
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
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload } from 'lucide-react';

const formSchema = z.object({
  csvText: z.string().min(1, 'La lista de alumnos no puede estar vacía.'),
});

type CSVFormValues = z.infer<typeof formSchema>;

type AddStudentsCSVFormProps = {
  courseId: string;
  courseName: string;
};

export function AddStudentsFromCSVForm({ courseId, courseName }: AddStudentsCSVFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CSVFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      csvText: '',
    },
  });

  async function onSubmit(values: CSVFormValues) {
    setIsSubmitting(true);
    try {
      const result = await addStudentsFromCSV({ ...values, courseId });
      if (result?.success) {
        toast({
          title: 'Éxito',
          description: `${result.count} alumno(s) añadidos a ${courseName} correctamente.`,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Carga Masiva
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Carga Masiva de Alumnos para {courseName}</DialogTitle>
          <DialogDescription>
            Pega la lista de alumnos, uno por línea.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="csvText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lista de Alumnos (un nombre por línea)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Juan Pérez\nMaría García\n..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Alumnos
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
