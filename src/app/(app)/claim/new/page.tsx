import { ClaimCreateForm } from '@/components/claims/claim-create-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePlus2 } from 'lucide-react';

export default function NewClaimPage() {
  return (
    <div className="container mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
             <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FilePlus2 className="h-6 w-6 text-primary" />
              </div>
            <div>
              <CardTitle className="text-2xl font-bold">Submit a New Claim</CardTitle>
              <CardDescription>Fill out the form below to submit your expense claim.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ClaimCreateForm />
        </CardContent>
      </Card>
    </div>
  );
}
