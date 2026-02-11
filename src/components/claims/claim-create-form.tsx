'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { verifyDocument } from '@/ai/flows/verify-document-flow';
import { useToast } from '@/hooks/use-toast';

import { CLAIM_LIMITS, CLAIM_TYPES, RETURN_PERCENTAGE } from '@/lib/constants';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Loader2, UploadCloud, CheckCircle2, XCircle } from 'lucide-react';

const formSchema = z.object({
  claimType: z.enum([CLAIM_TYPES.MOBILE, CLAIM_TYPES.BROADBAND], {
    required_error: 'You need to select a claim type.',
  }),
  claimAmount: z.coerce
    .number()
    .positive({ message: 'Claim amount must be positive.' })
    .max(10000, { message: 'Amount seems too high.' }),
  file: z.instanceof(File, { message: 'A supporting document is required.' })
    .refine((file) => file && file.size > 0, 'A supporting document is required.'),
}).superRefine((data, ctx) => {
    if (data.claimType && data.claimAmount) {
        const limit = CLAIM_LIMITS[data.claimType];
        if (data.claimAmount > limit) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["claimAmount"],
                message: `Amount cannot exceed $${limit} for ${data.claimType} claims.`,
            });
        }
    }
});


export function ClaimCreateForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rejected, setRejected] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      claimType: undefined,
      claimAmount: '',
      file: undefined
    }
  });

  const claimType = form.watch('claimType');
  const claimAmount = form.watch('claimAmount');

  const { maxAmount, returnAmount } = useMemo(() => {
    const max = claimType ? CLAIM_LIMITS[claimType] : 0;
    const parsedAmount = typeof claimAmount === 'number' ? claimAmount : parseFloat(String(claimAmount));
    const isOverLimit = parsedAmount > max;
    
    const calculatedReturn = !isOverLimit && parsedAmount > 0 ? parsedAmount * RETURN_PERCENTAGE : 0;

    return { maxAmount: max, returnAmount: calculatedReturn };
  }, [claimType, claimAmount]);

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setRejected(false);
    setSubmitted(false);

    try {
      const photoDataUri = await fileToDataUri(values.file);
      const result = await verifyDocument({ photoDataUri });

      if (result.isDocument) {
        setSubmitted(true);
      } else {
        setRejected(true);
        toast({
          variant: "destructive",
          title: "Claim Rejected",
          description: "The uploaded file does not appear to be a valid document. Please upload a clear image of a bill or receipt.",
        });
      }
    } catch (error) {
      console.error("Verification failed", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "There was a problem verifying your document. Please try again.",
      });
    }

    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h3 className="mt-4 text-2xl font-bold">Claim Approved!</h3>
        <p className="mt-2 text-muted-foreground">Your payment has been processed successfully.</p>
        <Button onClick={() => router.push('/dashboard')} className="mt-6">
          Go to Dashboard
        </Button>
      </div>
    )
  }

  if (rejected) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <XCircle className="h-16 w-16 text-destructive" />
        <h3 className="mt-4 text-2xl font-bold">Claim Rejected</h3>
        <p className="mt-2 text-muted-foreground">The uploaded file does not appear to be a valid document. Please upload a clear image of your bill or receipt.</p>
        <Button onClick={() => {
            setRejected(false);
            form.reset();
        }} className="mt-6" variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="claimType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Claim Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a claim type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={CLAIM_TYPES.MOBILE}>Mobile Claims</SelectItem>
                  <SelectItem value={CLAIM_TYPES.BROADBAND}>Broadband Claims</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={cn("space-y-8", !claimType && "hidden")}>
            <FormField
              control={form.control}
              name="claimAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Claim Amount</FormLabel>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="file"
              render={({ field: { ref, name, onBlur } }) => (
                  <FormItem>
                    <FormLabel>Supporting Document</FormLabel>
                    <FormControl>
                       <label htmlFor="file-upload" className="relative cursor-pointer rounded-md border-2 border-dashed border-muted-foreground/30 bg-background font-medium text-primary hover:border-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex flex-col items-center justify-center p-6 space-y-2">
                          <UploadCloud className="h-10 w-10 text-muted-foreground/50"/>
                          <span className="text-sm text-center">
                            {form.watch('file')?.name || 'Click to upload a file'}
                          </span>
                          <Input
                            id="file-upload"
                            name={name}
                            type="file"
                            className="sr-only"
                            ref={ref}
                            onBlur={onBlur}
                            onChange={(e) => {
                              form.setValue('file', e.target.files?.[0]);
                              form.trigger('file');
                            }}
                          />
                        </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
            />

            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Calculated Return Amount</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${returnAmount.toFixed(2)}
                  </p>
                </div>
                 <p className="text-sm text-muted-foreground mt-1">This is 83% of your valid claim amount, up to the limit of ${maxAmount}.</p>
              </CardContent>
            </Card>
        </div>

        <Button type="submit" className="w-full" disabled={loading || !form.formState.isValid}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Claim
        </Button>
      </form>
    </Form>
  );
}
