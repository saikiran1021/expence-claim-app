'use client';

import { HandMetal } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        <HandMetal className="h-6 w-6 text-primary" />
        <span className="text-xl">ClaimWise</span>
      </Link>
      <div className="ml-auto flex items-center gap-4">
        {/* User menu removed */}
      </div>
    </header>
  );
}
