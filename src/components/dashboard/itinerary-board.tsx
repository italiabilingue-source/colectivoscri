import type { Itinerary } from '@/types';
import { ItineraryRow } from './itinerary-row';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ItineraryBoardProps = {
  title: string;
  icon: React.ReactNode;
  itineraries: Itinerary[];
};

export function ItineraryBoard({ title, icon, itineraries }: ItineraryBoardProps) {
  return (
    <Card className="bg-card/50 border-border/60 flex-1 min-w-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl text-primary font-bold tracking-widest">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_auto] items-center gap-4 xl:gap-6 border-b-2 border-primary/50 pb-2 px-2 text-sm md:text-base text-muted-foreground font-bold tracking-widest">
            <span>DESTINATION</span>
            <span>TIME</span>
            <span>DAY</span>
            <span>STATUS</span>
            <span className="text-right">ACTIONS</span>
        </div>
        <div className="mt-2 space-y-2">
          {itineraries.length > 0 ? (
            itineraries.map(it => <ItineraryRow key={it.id} itinerary={it} />)
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No shuttles scheduled.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
