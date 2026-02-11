import type { Timestamp } from 'firebase/firestore';

export type AppUser = {
  uid: string;
  email: string | null;
  name: string | null;
};

export type Claim = {
  id?: string;
  userId: string;
  name: string;
  claimType: 'Mobile' | 'Broadband';
  claimAmount: number;
  returnAmount: number;
  claimLimit: number;
  fileURL: string;
  fileName: string;
  status: 'Submitted' | 'Approved' | 'Rejected';
  createdAt: Timestamp;
};
