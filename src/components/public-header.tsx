'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Flag, Shield } from 'lucide-react';

export function PublicHeader() {
  const [currentDay, setCurrentDay] = useState('');

  useEffect(() => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayIndex = new Date().getDay();
    setCurrentDay(days[dayIndex]);
  }, []);


  return (
    <header className="flex items-center justify-between p-4 border-b border-border/50">
      <div className="flex items-center gap-3">
        <Flag className="w-8 h-8 text-primary" />
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
          Horario de Colectivos del día {currentDay}
        </h1>
      </div>
      <Button asChild>
        <Link href="/dashboard">
          <Shield className="mr-2 h-4 w-4" />
          Panel de Admin
        </Link>
      </Button>
    </header>
  );
}
