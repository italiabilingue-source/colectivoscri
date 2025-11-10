'use client';

import { Flag, FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type PublicHeaderProps = {
  dayFilter: string;
  lugarFilter: string;
  colectivoFilter: string;
  movimientoFilter: string;
  onDayChange: (value: string) => void;
  onLugarChange: (value: string) => void;
  onColectivoChange: (value: string) => void;
  onMovimientoChange: (value: string) => void;
  onClearFilters: () => void;
};

export function PublicHeader({
  dayFilter,
  lugarFilter,
  colectivoFilter,
  movimientoFilter,
  onDayChange,
  onLugarChange,
  onColectivoChange,
  onMovimientoChange,
  onClearFilters
}: PublicHeaderProps) {

  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-border/50 gap-4">
      <div className="flex items-center gap-3 self-start">
        <Flag className="w-8 h-8 text-primary" />
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight whitespace-nowrap">
          Horario de Colectivos
        </h1>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Select value={dayFilter} onValueChange={onDayChange}>
              <SelectTrigger className="w-full sm:w-auto flex-1">
                <SelectValue placeholder="Día" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lunes">Lunes</SelectItem>
                <SelectItem value="Martes">Martes</SelectItem>
                <SelectItem value="Miércoles">Miércoles</SelectItem>
                <SelectItem value="Jueves">Jueves</SelectItem>
                <SelectItem value="Viernes">Viernes</SelectItem>
              </SelectContent>
            </Select>

            <Select value={lugarFilter} onValueChange={onLugarChange}>
              <SelectTrigger className="w-full sm:w-auto flex-1">
                <SelectValue placeholder="Lugar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos Lugares</SelectItem>
                <SelectItem value="Chacra">Chacra</SelectItem>
                <SelectItem value="Escuela">Escuela</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={colectivoFilter} onValueChange={onColectivoChange}>
              <SelectTrigger className="w-full sm:w-auto flex-1">
                <SelectValue placeholder="Colectivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Cachi">Cachi</SelectItem>
                <SelectItem value="Bili">Bili</SelectItem>
              </SelectContent>
            </Select>

            <Select value={movimientoFilter} onValueChange={onMovimientoChange}>
              <SelectTrigger className="w-full sm:w-auto flex-1">
                <SelectValue placeholder="Movimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos Movimientos</SelectItem>
                <SelectItem value="Llegada">Llegada</SelectItem>
                <SelectItem value="Salida">Salida</SelectItem>
              </SelectContent>_
            </Select>
             <Button variant="ghost" onClick={onClearFilters} className="px-3">
                <FilterX className="h-5 w-5" />
                <span className="sr-only">Limpiar filtros</span>
             </Button>
        </div>
      </div>
    </header>
  );
}
