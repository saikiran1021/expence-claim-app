'use server';
/**
 * @fileOverview An AI flow to verify if an uploaded image is a document.
 *
 * - verifyDocument - A function that analyzes an image to see if it's a document.
 * - VerifyDocumentInput - The input type for the verifyDocument function.
 * - VerifyDocumentOutput - The return type for the verifyDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyDocumentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VerifyDocumentInput = z.infer<typeof VerifyDocumentInputSchema>;

const VerifyDocumentOutputSchema = z.object({
  isDocument: z.boolean().describe('Whether or not the image is a document, bill, or receipt.'),
});
export type VerifyDocumentOutput = z.infer<typeof VerifyDocumentOutputSchema>;

export async function verifyDocument(input: VerifyDocumentInput): Promise<VerifyDocumentOutput> {
  return verifyDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyDocumentPrompt',
  input: {schema: VerifyDocumentInputSchema},
  output: {schema: VerifyDocumentOutputSchema},
  prompt: `You are an expert document analyst. Your task is to determine if the provided image is a document, such as a bill, receipt, or invoice. The image should primarily contain text and structured data typical of a document. It should not be a photo of a person, landscape, or object unrelated to a claim.

Based on the image, determine if it qualifies as a valid supporting document.

Photo: {{media url=photoDataUri}}`,
});

const verifyDocumentFlow = ai.defineFlow(
  {
    name: 'verifyDocumentFlow',
    inputSchema: VerifyDocumentInputSchema,
    outputSchema: VerifyDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
