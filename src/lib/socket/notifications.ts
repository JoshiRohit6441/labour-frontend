import getSocket from './client';
import { AppDispatch } from '@/store';
import { incrementUnread, setUnreadCount } from '@/store';
import { authApi } from '@/lib/api/auth';
import { contractorNotificationsApi } from '@/lib/api/contractor';
import { userNotificationsApi } from '@/lib/api/user';
import { toast } from 'sonner';

export const initNotificationsSocket = async (dispatch: AppDispatch) => {
  const user = authApi.getCurrentUser();
  if (!user) return;

  // hydrate unread
  try {
    const res = user.role === 'CONTRACTOR'
      ? await contractorNotificationsApi.unreadCount()
      : await userNotificationsApi.unreadCount();
    dispatch(setUnreadCount((res.data as any)?.count || 0));
  } catch {}

  const socket = getSocket();
  if (!socket.connected) socket.connect();

  socket.emit('join_notifications', { userId: user.id, role: user.role });

  socket.on('notification', (payload: any) => {
    dispatch(incrementUnread());

    try {
      // Play siren-like sound using Web Audio API (no external assets)
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(440, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
        g.gain.setValueAtTime(0.001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
        o.connect(g).connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 1.2);
      }
    } catch {}

    // Show popup with See Job action
    const data = payload?.data || {};
    const title = payload?.title || 'Notification';
    const message = payload?.message || '';
    toast(title, {
      description: message,
      action: data?.cta === 'SEE_JOB' && data?.jobId ? {
        label: 'See Job',
        onClick: () => {
          const jobId = data.jobId;
          if (user.role === 'CONTRACTOR') {
            window.location.assign(`/contractor/jobs?jobId=${jobId}`);
          } else {
            window.location.assign(`/user/jobs/${jobId}`);
          }
        }
      } : undefined,
      duration: 6000
    });
  });

  socket.on('new_job_notification', (payload: any) => {
    const jobId = payload?.jobId;
    if (!jobId) return;
    toast('New job near you', {
      description: 'A new job is available near you!',
      action: {
        label: 'View Job',
        onClick: () => {
          if (user.role === 'CONTRACTOR') {
            window.location.assign(`/contractor/jobs?jobId=${jobId}`);
          } else {
            window.location.assign(`/user/jobs/${jobId}`);
          }
        }
      },
      duration: 6000
    });
  });
};


