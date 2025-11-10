'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, Flag } from 'lucide-react';
import { CourseForm } from './course-form';

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border/50">
      <div className="flex items-center gap-3">
        <Flag className="w-8 h-8 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Gestor de Cursos (Admin)
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <CourseForm />
        <Button variant="outline" asChild>
          <Link href="/">
            <Eye className="mr-2 h-4 w-4" />
            Ver Vista Pública
          </Link>
        </Button>
      </div>
    </header>
  );
}
