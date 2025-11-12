// src/components/secundario/editable-name.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type EditableNameProps = {
  id: string;
  initialName: string;
  onUpdate: (data: { id: string; name: string }) => Promise<{ success: boolean; error?: string } | void>;
  className?: string;
  inputClassName?: string;
};

export function EditableName({ id, initialName, onUpdate, className, inputClassName }: EditableNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (name.trim() === initialName) {
      setIsEditing(false);
      return;
    }
    if (name.trim() === '') {
        toast({ title: "Error", description: "El nombre no puede estar vacío.", variant: "destructive" });
        setName(initialName);
        setIsEditing(false);
        return;
    }
    
    setIsSaving(true);
    try {
      const result = await onUpdate({ id, name: name.trim() });
      if (result && !result.success) {
        throw new Error(result.error);
      }
      toast({ title: "Éxito", description: "Nombre actualizado correctamente." });
    } catch (error) {
      toast({
        title: 'Error al actualizar',
        description: (error as Error).message,
        variant: 'destructive',
      });
      setName(initialName); // Revert on error
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setName(initialName);
      setIsEditing(false);
    }
  };

  return (
    <div className={cn("flex items-center", className)}>
      {isEditing ? (
        <div className="flex items-center gap-2 w-full">
            <Input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                disabled={isSaving}
                className={cn("h-8 text-base", inputClassName)}
            />
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className="cursor-pointer hover:bg-muted p-1 rounded-md"
        >
          {name}
        </span>
      )}
    </div>
  );
}
