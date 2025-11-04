
export interface Job {
  id: string;
  title: string;
  description: string;
  jobType: 'IMMEDIATE' | 'SCHEDULED' | 'BIDDING';
  status: 'PENDING' | 'QUOTED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  city: string;
  state: string;
  address: string;
  latitude: number;
  longitude: number;
  workersNeeded?: number;
  numberOfWorkers: number;
  scheduledStartDate?: string;
  scheduledDate?: string;
  contractorId?: string;
  advancePaid: number;
  quotes?: Quote[];
  requiredSkills?: string[];
}

export interface Quote {
  id: string;
  contractorId: string;
  advanceRequested: boolean;
}
