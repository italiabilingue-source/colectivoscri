'use client';

import { signOutAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { LogOut, Plane } from 'lucide-react';
import { ItineraryForm } from './itinerary-form';

export function DashboardHeader() {
  const handleSignOut = async () => {
    await signOutAction();
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-border/50">
      <div className="flex items-center gap-3">
        <Plane className="w-8 h-8 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
          School Shuttle Tracker
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <ItineraryForm />
        <Button variant="outline" size="icon" onClick={handleSignOut} aria-label="Sign out">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
