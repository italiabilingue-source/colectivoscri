'use client';

import type { Student } from '@/types';
import { Switch } from '@/components/ui/switch';
import { toggleStudentAttendance, updateStudentName } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { EditableName } from './editable-name';

type StudentAttendanceRowProps = {
  student: Student;
  tripId: string;
  currentDate: string; // YYYY-MM-DD
  attendance: { va: boolean; vuelve: boolean };
};

export function StudentAttendanceRow({
  student,
  tripId,
  currentDate,
  attendance,
}: StudentAttendanceRowProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleAttendanceChange = (status: 'va' | 'vuelve', present: boolean) => {
    startTransition(async () => {
      try {
        const result = await toggleStudentAttendance({
          studentId: student.id,
          courseId: student.courseId,
          tripId,
          date: currentDate,
          status,
          present,
        });

        if (result?.success === false) {
          toast({
            title: 'Error',
            description: result.error || 'No se pudo actualizar la asistencia.',
            variant: 'destructive',
          });
        }
      } catch (e) {
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
          id={`va-${tripId}-${student.id}`}
          checked={attendance.va}
          onCheckedChange={(value) => handleAttendanceChange('va', value)}
          disabled={isPending}
          aria-label={`Asistencia de ida para ${student.name}`}
        />
      </div>

      <div className="flex justify-center items-center">
        <Switch
          id={`vuelve-${tripId}-${student.id}`}
          checked={attendance.vuelve}
          onCheckedChange={(value) => handleAttendanceChange('vuelve', value)}
          disabled={isPending}
          aria-label={`Asistencia de vuelta para ${student.name}`}
        />
      </div>
    </div>
  );
}
