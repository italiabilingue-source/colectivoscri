// This is a server-side file.
'use server';

/**
 * @fileOverview A Genkit flow that stylizes status messages to match the visual style of an airport display.
 *
 * - `stylizeStatusMessage` - A function that stylizes the input status message using a generative AI model.
 * - `StylizeStatusMessageInput` - The input type for the `stylizeStatusMessage` function.
 * - `StylizeStatusMessageOutput` - The return type for the `stylizeStatusMessage` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StylizeStatusMessageInputSchema = z.object({
  statusMessage: z
    .string()
    .describe('The status message to stylize (e.g., On Time, Delayed).'),
});

export type StylizeStatusMessageInput = z.infer<typeof StylizeStatusMessageInputSchema>;

const StylizeStatusMessageOutputSchema = z.object({
  stylizedMessage: z
    .string()
    .describe(
      'The stylized status message, formatted to resemble an airport display (e.g., **ON TIME**, <span style=\'color:#7DF9FF;\'>DELAYED</span>)'
    ),
});

export type StylizeStatusMessageOutput = z.infer<typeof StylizeStatusMessageOutputSchema>;

export async function stylizeStatusMessage(
  input: StylizeStatusMessageInput
): Promise<StylizeStatusMessageOutput> {
  return stylizeStatusMessageFlow(input);
}

const stylizeStatusMessagePrompt = ai.definePrompt({
  name: 'stylizeStatusMessagePrompt',
  input: {schema: StylizeStatusMessageInputSchema},
  output: {schema: StylizeStatusMessageOutputSchema},
  prompt: `You are an AI assistant specialized in generating stylized status messages that resemble airport display boards. Given the input status message, transform it to match the aesthetic of an airport display, using elements like bold text, specific colors (Electric Blue #7DF9FF), and other formatting to enhance the visual representation.

Input Status Message: {{{statusMessage}}}

Output Stylized Message:`,
});

const stylizeStatusMessageFlow = ai.defineFlow(
  {
    name: 'stylizeStatusMessageFlow',
    inputSchema: StylizeStatusMessageInputSchema,
    outputSchema: StylizeStatusMessageOutputSchema,
  },
  async input => {
    const {output} = await stylizeStatusMessagePrompt(input);
    return output!;
  }
);
