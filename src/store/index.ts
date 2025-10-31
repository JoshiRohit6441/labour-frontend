import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

interface NotificationsState {
  unreadCount: number;
}

const initialNotificationsState: NotificationsState = { unreadCount: 0 };

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: initialNotificationsState,
  reducers: {
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
    incrementUnread(state) {
      state.unreadCount += 1;
    },
  },
});

export const { setUnreadCount, incrementUnread } = notificationsSlice.actions;

// Active job slice
interface ActiveJobState {
  job: { id: string; title?: string; jobType?: string; status?: string } | null;
}

const activeJobSlice = createSlice({
  name: 'activeJob',
  initialState: { job: null } as ActiveJobState,
  reducers: {
    setActiveJob(state, action: PayloadAction<ActiveJobState['job']>) {
      state.job = action.payload;
    },
    clearActiveJob(state) {
      state.job = null;
    },
  },
});

export const { setActiveJob, clearActiveJob } = activeJobSlice.actions;

export const store = configureStore({
  reducer: {
    notifications: notificationsSlice.reducer,
    activeJob: activeJobSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


