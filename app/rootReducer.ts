
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import taskReducer from '../features/tasks/taskSlice';
import approvalReducer from '../features/approvals/approvalSlice';
import notificationReducer from '../features/notifications/notificationSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  tasks: taskReducer,
  approvals: approvalReducer,
  notifications: notificationReducer,
});

export default rootReducer;
