'use client';

import { useState, useEffect } from 'react';
import { Flag } from 'lucide-react';

export function PublicHeader() {
  const [currentDay, setCurrentDay] = useState('');

  useEffect(() => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayIndex = new Date().getDay();
    setCurrentDay(days[dayIndex]);
  }, []);


  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Flag className="w-8 h-8 text-primary" />
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
          Horario de Colectivos del día {currentDay}
        </h1>
      </div>
    </header>
  );
}
