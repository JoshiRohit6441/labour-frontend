
import { createContext, useContext, useState, ReactNode } from 'react';

interface Job {
  id: string;
  title: string;
  status: string;
}

interface JobContextType {
  activeJob: Job | null;
  setActiveJob: (job: Job | null) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  return (
    <JobContext.Provider value={{ activeJob, setActiveJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJob = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
};
