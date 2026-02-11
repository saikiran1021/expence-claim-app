import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Signup Disabled</CardTitle>
        <CardDescription>
          User authentication is not required for this application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
