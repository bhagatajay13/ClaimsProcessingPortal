
import type { Claim, ClaimStatus } from '../../types/claims';

const names = [
  'John Smith',
  'David Miller',
  'Sarah Jones',
  'Michael Brown',
  'Emma Wilson',
  'Robert Taylor',
  'Olivia Davis',
  'James Anderson',
];

const claimTypes = [
  'Health',
  'Vehicle',
  'Property',
  'Travel',
];

const locations = [
  'Hyderabad',
  'Mumbai',
  'Bangalore',
  'Chennai',
  'Delhi',
];

const statuses: ClaimStatus[] = [
  'Pending',
  'In Progress',
  'Approved',
  'Rejected',
];

export function generateClaims(count = 20000): Claim[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `CLM-${10000 + index}`,
    claimantName: names[index % names.length],
    policyNumber: `POL-${50000 + index}`,
    claimType: claimTypes[index % claimTypes.length],
    claimAmount: Math.floor(10000 + Math.random() * 90000),
    location: locations[index % locations.length],
    status: statuses[index % statuses.length],
    assignedTo: index % 3 === 0 ? 'Not Assigned' : 'Claims Team',
    documentSize: index % 5 === 0 ? '1 GB' : '25 MB',
  }));
}
