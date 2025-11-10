'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addOrUpdateItinerary } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { Itinerary } from '@/types';
import { generateItineraryNotes } from '@/ai/flows/generate-itinerary-notes';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  id: z.string().optional(),
  origin: z.enum(['School', 'Farm']),
  destination: z.enum(['School', 'Farm']),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:mm'),
  day: z.string().min(1, 'Day is required'),
  status: z.string().min(1, 'Status is required'),
  notes: z.string().optional(),
}).refine(data => data.origin !== data.destination, {
  message: "Origin and destination can't be the same",
  path: ["destination"],
});

type ItineraryFormValues = z.infer<typeof formSchema>;

type ItineraryFormProps = {
  itinerary?: Itinerary;
  children?: React.ReactNode;
};

export function ItineraryForm({ itinerary, children }: ItineraryFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const { toast } = useToast();

  const form = useForm<ItineraryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: itinerary?.id,
      origin: itinerary?.origin ?? 'School',
      destination: itinerary?.destination ?? 'Farm',
      time: itinerary?.time ?? '',
      day: itinerary?.day ?? 'Monday',
      status: itinerary?.status ?? 'On Time',
      notes: itinerary?.notes ?? '',
    },
  });

  async function onSubmit(values: ItineraryFormValues) {
    setIsSubmitting(true);
    try {
      const result = await addOrUpdateItinerary(values);
      if (result?.success) {
        toast({
          title: 'Success',
          description: `Itinerary ${itinerary ? 'updated' : 'created'} successfully.`,
        });
        setOpen(false);
        form.reset();
      } else {
        throw new Error(result?.error || 'An unknown error occurred.');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGenerateNotes = async () => {
    setIsGeneratingNotes(true);
    try {
        const { origin, destination, time, day } = form.getValues();

        if (!origin || !destination || !time || !day) {
            toast({
                title: 'Cannot Generate Notes',
                description: 'Please fill in Origin, Destination, Time, and Day first.',
                variant: 'destructive',
            });
            return;
        }

        const prompt = `A shuttle from ${origin} to ${destination} at ${time} on ${day}.`;
        const result = await generateItineraryNotes({ prompt });
        form.setValue('notes', result.notes, { shouldValidate: true });
        toast({
            title: 'Notes Generated',
            description: 'AI-powered notes have been added.',
        });
    } catch (error) {
        toast({
            title: 'AI Error',
            description: 'Failed to generate notes.',
            variant: 'destructive',
        });
    } finally {
        setIsGeneratingNotes(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Itinerary
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{itinerary ? 'Edit Itinerary' : 'Create New Itinerary'}</DialogTitle>
          <DialogDescription>
            Fill in the details for the shuttle route. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select origin" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="School">School</SelectItem>
                          <SelectItem value="Farm">Farm</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="School">School</SelectItem>
                          <SelectItem value="Farm">Farm</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl><Input placeholder="HH:mm" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Day</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Monday">Monday</SelectItem>
                            <SelectItem value="Tuesday">Tuesday</SelectItem>
                            <SelectItem value="Wednesday">Wednesday</SelectItem>
                            <SelectItem value="Thursday">Thursday</SelectItem>
                            <SelectItem value="Friday">Friday</SelectItem>
                            <SelectItem value="Saturday">Saturday</SelectItem>
                            <SelectItem value="Sunday">Sunday</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="On Time">On Time</SelectItem>
                            <SelectItem value="Delayed">Delayed</SelectItem>
                            <SelectItem value="Departed">Departed</SelectItem>
                            <SelectItem value="Arrived">Arrived</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
             <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Notes (Optional)</FormLabel>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleGenerateNotes}
                            disabled={isGeneratingNotes || isSubmitting}
                        >
                            {isGeneratingNotes ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Generate with AI
                        </Button>
                      </div>
                      <FormControl><Textarea placeholder="Add any relevant notes..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )}
                />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Itinerary
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
