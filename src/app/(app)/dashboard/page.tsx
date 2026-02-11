'use client';

import { ClaimsTable } from '@/components/claims/claims-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome!</h1>
          <p className="text-muted-foreground">Here are the recent expense claims.</p>
        </div>
        <Button asChild size="lg">
          <Link href="/claim/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            New Claim
          </Link>
        </Button>
      </div>
      <div className="mt-8">
        <ClaimsTable />
      </div>
    </div>
  );
}
