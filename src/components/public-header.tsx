'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn, Flag } from 'lucide-react';

export function PublicHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border/50">
      <div className="flex items-center gap-3">
        <Flag className="w-8 h-8 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          Horario de Cursos
        </h1>
      </div>
      <Button asChild>
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" />
          Admin Login
        </Link>
      </Button>
    </header>
  );
}
