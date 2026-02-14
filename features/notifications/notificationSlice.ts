
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppNotification, NotificationState } from './notificationTypes';

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<AppNotification[]>) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find(n => n.id === action.payload);
      if (item && !item.isRead) {
        item.isRead = true;
        state.unreadCount--;
      }
    },
    startPolling: (state) => {},
    stopPolling: (state) => {},
  },
});

export const notificationActions = notificationSlice.actions;
export default notificationSlice.reducer;
