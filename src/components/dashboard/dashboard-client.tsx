'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db } from '@/lib/firebase';
import type { Itinerary } from '@/types';
import { ItineraryBoard } from './itinerary-board';
import { DashboardHeader } from './dashboard-header';
import { SchoolIcon } from '../icons/school-icon';
import { FarmIcon } from '../icons/farm-icon';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

export default function DashboardClient({ user }: { user: User }) {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const q = query(
      collection(db, 'itineraries'),
      where('userId', '==', user.uid),
      orderBy('time', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const itineriesData: Itinerary[] = [];
      querySnapshot.forEach((doc) => {
        itineriesData.push({ id: doc.id, ...doc.data() } as Itinerary);
      });
      setItineraries(itineriesData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching itineraries: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const schoolBound = itineraries.filter(it => it.destination === 'School');
  const farmBound = itineraries.filter(it => it.destination === 'Farm');

  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader />
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        {loading ? (
             <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
             </div>
        ) : (
            <div className="flex flex-col lg:flex-row gap-8 h-full">
            <ItineraryBoard
                title="TO SCHOOL"
                icon={<SchoolIcon className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
                itineraries={schoolBound}
            />
            <Separator orientation="vertical" className="hidden lg:block bg-border/50" />
            <ItineraryBoard
                title="TO FARM"
                icon={<FarmIcon className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
                itineraries={farmBound}
            />
            </div>
        )}
      </main>
    </div>
  );
}
