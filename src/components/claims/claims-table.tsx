'use client';

import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Claim } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Smartphone, Wifi } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export function ClaimsTable() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'claims'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const userClaims: Claim[] = [];
        querySnapshot.forEach((doc) => {
          userClaims.push({ id: doc.id, ...doc.data() } as Claim);
        });
        setClaims(userClaims);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching claims:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getStatusBadge = (status: Claim['status']) => {
    switch (status) {
      case 'Submitted':
        return <Badge variant="secondary">Submitted</Badge>;
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Approved</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getClaimTypeIcon = (type: Claim['claimType']) => {
    switch (type) {
      case 'Mobile':
        return <Smartphone className="mr-2 h-4 w-4 text-muted-foreground" />;
      case 'Broadband':
        return <Wifi className="mr-2 h-4 w-4 text-muted-foreground" />;
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Claims</CardTitle>
      </CardHeader>
      <CardContent>
        {claims.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold">No Claims Found</h3>
            <p className="text-muted-foreground">Get started by submitting your first expense claim.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Claim Amount</TableHead>
                  <TableHead className="text-right">Return</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Document</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium flex items-center">
                      {getClaimTypeIcon(claim.claimType)}
                      {claim.claimType}
                    </TableCell>
                    <TableCell className="text-right">
                      ${claim.claimAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-green-600 dark:text-green-400 font-medium">
                      ${claim.returnAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(claim.status)}</TableCell>
                    <TableCell>
                      {claim.createdAt ? format(claim.createdAt.toDate(), 'MMM dd, yyyy') : null}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={claim.fileURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View File
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
