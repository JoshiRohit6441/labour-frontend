
import { useEffect } from 'react';
import { useSocket } from '../store/SocketContext';
import { useAppDispatch } from '../store';
import { setActiveJob, clearActiveJob } from '../store';

export const useJobSocket = (jobId: string) => {
  const dispatch = useAppDispatch();
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit('joinJobRoom', jobId);

      socket.on('job:started', (job) => {
        dispatch(setActiveJob(job));
      });

      socket.on('job:completed', () => {
        dispatch(clearActiveJob());
      });

      socket.on('job:cancelled', () => {
        dispatch(clearActiveJob());
      });

      return () => {
        socket.emit('leaveJobRoom', jobId);
        socket.off('job:started');
        socket.off('job:completed');
        socket.off('job:cancelled');
      };
    }
  }, [jobId, dispatch, socket]);
};
