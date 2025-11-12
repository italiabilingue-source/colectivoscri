// src/components/secundario/student-attendance-row.tsx
'use client';

import { useState } from 'react';
import type { Student } from '@/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { updateStudentAttendance, updateStudentName } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { EditableName } from './editable-name';

type StudentAttendanceRowProps = {
  student: Student;
};

export function StudentAttendanceRow({ student }: StudentAttendanceRowProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Optimistic UI states
  const [va, setVa] = useState(student.va);
  const [vuelve, setVuelve] = useState(student.vuelve);

  const handleAttendanceChange = (field: 'va' | 'vuelve', value: boolean) => {
    // Optimistic update
    if (field === 'va') setVa(value);
    if (field === 'vuelve') setVuelve(value);

    startTransition(async () => {
      try {
        const result = await updateStudentAttendance({ studentId: student.id, field, value });
        if (result?.success === false) {
           // Revert optimistic update on error
            if (field === 'va') setVa(!value);
            if (field === 'vuelve') setVuelve(!value);
            toast({
                title: 'Error',
                description: result.error || 'No se pudo actualizar la asistencia.',
                variant: 'destructive',
            });
        }
      } catch (e) {
         // Revert optimistic update on error
        if (field === 'va') setVa(!value);
        if (field === 'vuelve') setVuelve(!value);
        toast({
            title: 'Error',
            description: 'Ocurrió un error de conexión.',
            variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-[1fr_100px_100px] items-center p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
      <EditableName
        id={student.id}
        initialName={student.name}
        onUpdate={updateStudentName}
        className="font-medium"
      />
      
      <div className="flex justify-center items-center">
        <Switch
          id={`va-${student.id}`}
          checked={va}
          onCheckedChange={(value) => handleAttendanceChange('va', value)}
          disabled={isPending}
          aria-label={`Asistencia de ida para ${student.name}`}
        />
      </div>

      <div className="flex justify-center items-center">
        <Switch
          id={`vuelve-${student.id}`}
          checked={vuelve}
          onCheckedChange={(value) => handleAttendanceChange('vuelve', value)}
          disabled={isPending}
          aria-label={`Asistencia de vuelta para ${student.name}`}
        />
      </div>
    </div>
  );
}
