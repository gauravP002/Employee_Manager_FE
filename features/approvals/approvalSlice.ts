
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../tasks/taskTypes';

interface ApprovalState {
  pendingTasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: ApprovalState = {
  pendingTasks: [],
  loading: false,
  error: null,
};

const approvalSlice = createSlice({
  name: 'approvals',
  initialState,
  reducers: {
    fetchPendingApprovalsRequest: (state) => {
      state.loading = true;
    },
    fetchPendingApprovalsSuccess: (state, action: PayloadAction<Task[]>) => {
      state.loading = false;
      state.pendingTasks = action.payload;
    },
    approveTaskRequest: (state, _action: PayloadAction<{ taskId: string; comment: string }>) => {
      state.loading = true;
    },
    rejectTaskRequest: (state, _action: PayloadAction<{ taskId: string; comment: string }>) => {
      state.loading = true;
    },
    approvalComplete: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.pendingTasks = state.pendingTasks.filter(t => t.id !== action.payload);
    },
    approvalFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    }
  },
});

export const approvalActions = approvalSlice.actions;
export default approvalSlice.reducer;
