
import { take, call, put, delay, fork, cancel } from 'redux-saga/effects';
import { notificationActions } from './notificationSlice';
import { AppNotification } from './notificationTypes';

function* pollNotifications(): Generator<any, any, any> {
  while (true) {
    try {
      // Simulation of API fetch
      const mockNotifications: AppNotification[] = [
        { id: '1', userId: '1', message: 'Task "Expense Report" was approved.', isRead: false, createdAt: new Date().toISOString() },
        { id: '2', userId: '1', message: 'New approval request assigned to you.', isRead: true, createdAt: new Date().toISOString() },
      ];
      yield put(notificationActions.setNotifications(mockNotifications));
      yield delay(30000); // Poll every 30 seconds
    } catch (e) {
      console.error('Polling failed', e);
      yield delay(5000); // Retry later
    }
  }
}

export function* notificationSaga() {
  while (true) {
    yield take(notificationActions.startPolling.type);
    // Fork the task to run in background
    const pollingTask = yield fork(pollNotifications);
    
    // Stop when logout or explicit stop action
    yield take([notificationActions.stopPolling.type, 'auth/logoutSuccess']);
    yield cancel(pollingTask);
  }
}
