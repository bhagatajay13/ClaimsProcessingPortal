export type ClaimStatus =
  | 'Pending'
  | 'In Progress'
  | 'Approved'
  | 'Rejected';

export interface Claim {
  id: string;
  claimantName: string;
  policyNumber: string;
  claimType: string;
  claimAmount: number;
  location: string;
  status: ClaimStatus;
  assignedTo: string;
  documentSize: string;
}
