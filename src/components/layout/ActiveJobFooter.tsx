import { useAppSelector } from '@/store';
import { Link } from 'react-router-dom';

const ActiveJobFooter = () => {
  const job = useAppSelector((s) => s.activeJob.job);
  if (!job) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shadow-lg">
      <div className="truncate">
        <div className="font-medium truncate">Ongoing job: {job.title || job.id}</div>
        <div className="text-sm opacity-90">{job.jobType} • {job.status}</div>
      </div>
      <Link className="underline font-medium" to={`/user/jobs/${job.id}`}>View Details</Link>
    </div>
  );
};

export default ActiveJobFooter;


