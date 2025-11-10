'use client';

import { useState, useEffect } from 'react';
import { Itinerary } from '@/types';
import { SplitFlapDisplay } from './split-flap-char';
import { Button } from '@/components/ui/button';
import { ItineraryForm } from './itinerary-form';
import { deleteItinerary } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { stylizeStatusMessage } from '@/ai/flows/stylize-status-messages';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, MoreVertical, VenetianMask } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function ItineraryRow({ itinerary }: { itinerary: Itinerary }) {
  const { toast } = useToast();
  const [stylizedStatus, setStylizedStatus] = useState(itinerary.status.toUpperCase());
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function getStylizedMessage() {
      try {
        const result = await stylizeStatusMessage({ statusMessage: itinerary.status });
        setStylizedStatus(result.stylizedMessage);
      } catch (error) {
        console.error("Failed to stylize status message:", error);
        setStylizedStatus(itinerary.status.toUpperCase());
      }
    }
    getStylizedMessage();
  }, [itinerary.status]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteItinerary(itinerary.id);
      toast({
        title: "Itinerary Deleted",
        description: "The shuttle itinerary has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete itinerary.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_auto] items-center gap-4 xl:gap-6 border-b border-border/50 py-4 px-2 text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium tracking-wider">
      <SplitFlapDisplay text={itinerary.destination.toUpperCase()} className="text-primary" />
      <SplitFlapDisplay text={itinerary.time} />
      <SplitFlapDisplay text={itinerary.day.substring(0, 3).toUpperCase()} />
      <div
        className="text-primary font-bold"
        dangerouslySetInnerHTML={{ __html: stylizedStatus.replace(/\\/g, '') }}
      />
      <div className="flex justify-end items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <ItineraryForm itinerary={itinerary}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </ItineraryForm>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the shuttle itinerary.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
